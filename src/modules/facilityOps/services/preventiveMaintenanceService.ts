import type {
  MaintenancePlan,
  MaintenanceOccurrence,
  CreateMaintenancePlanInput,
  NextDueCalculationRule,
} from '../../../shared/types/maintenancePlan.types';
import type { MaintenanceFrequency, Asset } from '../../../shared/types/asset.types';
import type { WorkOrder } from '../../../shared/types/workOrder.types';
import type { FacilityOperationsActor } from '../data/facilityOpsActor.types';
import { generateOperationId } from '../../../core/api/idempotency';
import { WorkOrderService } from './workOrderService';

export interface WorkOrderGenerationResult {
  workOrder: WorkOrder;
  occurrence: MaintenanceOccurrence;
  alreadyGenerated: boolean;
}

export class PreventiveMaintenanceService {
  private static instance: PreventiveMaintenanceService;
  private plans: Map<string, MaintenancePlan> = new Map();
  private occurrences: Map<string, MaintenanceOccurrence> = new Map();

  private constructor() {}

  static getInstance(): PreventiveMaintenanceService {
    if (!PreventiveMaintenanceService.instance) {
      PreventiveMaintenanceService.instance = new PreventiveMaintenanceService();
    }
    return PreventiveMaintenanceService.instance;
  }

  generateOccurrenceKey(societyId: string, planId: string, scheduledDate: string): string {
    return `${societyId}:${planId}:${scheduledDate}`;
  }

  calculateNextDueDate(
    frequency: MaintenanceFrequency,
    rule: NextDueCalculationRule,
    baseDateStr: string
  ): string {
    const base = new Date(baseDateStr);

    switch (frequency) {
      case 'DAILY':
        base.setDate(base.getDate() + 1);
        break;
      case 'WEEKLY':
        base.setDate(base.getDate() + 7);
        break;
      case 'MONTHLY':
        base.setMonth(base.getMonth() + 1);
        break;
      case 'QUARTERLY':
        base.setMonth(base.getMonth() + 3);
        break;
      case 'HALF_YEARLY':
        base.setMonth(base.getMonth() + 6);
        break;
      case 'YEARLY':
        base.setFullYear(base.getFullYear() + 1);
        break;
      case 'CUSTOM':
      case 'USAGE_BASED':
      case 'RULE_BASED':
      default:
        base.setMonth(base.getMonth() + 1);
        break;
    }

    return base.toISOString().split('T')[0] ?? baseDateStr;
  }

  createPlan(
    input: CreateMaintenancePlanInput,
    actor: FacilityOperationsActor,
    now = new Date()
  ): MaintenancePlan {
    if (!actor.hasPermission('CREATE_MAINTENANCE_PLAN') && !actor.hasPermission('MANAGE_MAINTENANCE_PLANS')) {
      throw new Error('ACCESS_DENIED: Insufficient permissions to create maintenance plan');
    }

    if (!input.checklist || input.checklist.length === 0) {
      throw new Error('VALIDATION_ERROR: Maintenance plan must have at least one checklist item');
    }

    const planId = input.clientOperationId ?? `plan-${generateOperationId('plan')}`;
    const plan: MaintenancePlan = {
      id: planId,
      planNumber: `PLAN-${actor.societyId.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      assetId: input.assetId,
      assetName: input.assetName,
      title: input.title,
      frequency: input.frequency,
      checklist: [...input.checklist],
      assignedTeam: input.assignedTeam ?? 'Maintenance Team',
      slaHours: input.slaHours,
      requiredEvidence: [...input.requiredEvidence],
      nextDueRule: input.nextDueRule,
      effectiveStartDate: input.effectiveStartDate,
      isActive: true,
      version: 1,
      createdAt: now.toISOString(),
      ...(input.assignedVendorId ? { assignedVendorId: input.assignedVendorId } : {}),
      ...(input.assignedVendorName ? { assignedVendorName: input.assignedVendorName } : {}),
      ...(input.effectiveEndDate ? { effectiveEndDate: input.effectiveEndDate } : {}),
    };

    this.plans.set(plan.id, plan);
    return plan;
  }

  generateOccurrence(planId: string, scheduledDate: string, societyId = 'soc-default'): MaintenanceOccurrence {
    const plan = this.plans.get(planId);
    if (!plan) {
      throw new Error('PLAN_NOT_FOUND');
    }

    const key = this.generateOccurrenceKey(societyId, plan.id, scheduledDate);
    for (const occ of this.occurrences.values()) {
      if (occ.occurrenceKey === key) {
        return occ;
      }
    }

    const occId = `occ-${generateOperationId('occ')}`;
    const occ: MaintenanceOccurrence = {
      id: occId,
      occurrenceKey: key,
      societyId,
      planId: plan.id,
      assetId: plan.assetId,
      scheduledDate,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };

    this.occurrences.set(occ.id, occ);
    return occ;
  }

  createWorkOrderFromOccurrence(occurrenceId: string, actor: FacilityOperationsActor): WorkOrder {
    const occ = this.occurrences.get(occurrenceId);
    if (!occ) {
      throw new Error('OCCURRENCE_NOT_FOUND');
    }

    const workOrderService = WorkOrderService.getInstance();
    if (occ.generatedWorkOrderId) {
      const existingWo = workOrderService.getWorkOrder(occ.generatedWorkOrderId);
      if (existingWo) {
        return existingWo;
      }
    }

    const plan = this.plans.get(occ.planId);
    const wo = workOrderService.createWorkOrder(
      {
        title: `Preventive Maintenance: ${plan?.title ?? 'Scheduled'}`,
        type: 'PREVENTIVE_MAINTENANCE',
        priority: 'MEDIUM',
        assetId: occ.assetId,
        maintenancePlanId: occ.planId,
        maintenanceOccurrenceId: occ.id,
        dueDate: occ.scheduledDate,
        assignedTo: plan?.assignedVendorName ?? 'Maintenance Team',
        ...(plan?.assignedVendorId ? { vendorId: plan.assignedVendorId } : {}),
      },
      actor
    );

    occ.status = 'GENERATED';
    occ.generatedWorkOrderId = wo.id;

    return wo;
  }

  escalateMissedOccurrence(occurrenceId: string): MaintenanceOccurrence {
    const occ = this.occurrences.get(occurrenceId);
    if (!occ) {
      throw new Error('OCCURRENCE_NOT_FOUND');
    }

    occ.status = 'MISSED';
    occ.escalatedAt = new Date().toISOString();
    return occ;
  }

  getPlan(id: string): MaintenancePlan | null {
    return this.plans.get(id) ?? null;
  }

  getOccurrence(id: string): MaintenanceOccurrence | null {
    return this.occurrences.get(id) ?? null;
  }

  clear(): void {
    this.plans.clear();
    this.occurrences.clear();
  }
}

export const preventiveMaintenanceService = PreventiveMaintenanceService.getInstance();
