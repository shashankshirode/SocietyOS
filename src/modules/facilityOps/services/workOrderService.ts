import type {
  WorkOrder,
  CreateWorkOrderInput,
  WorkOrderStatus,
  WorkOrderHoldReason,
  WorkOrderPartUsage,
  ServiceHistoryItem,
  WorkOrderTimelineItem,
} from '../../../shared/types/workOrder.types';
import type { FacilityOperationsActor } from '../data/facilityOpsActor.types';
import { generateOperationId } from '../../../core/api/idempotency';

export class WorkOrderService {
  private static instance: WorkOrderService;
  private workOrders: Map<string, WorkOrder> = new Map();
  private serviceHistory: Map<string, ServiceHistoryItem[]> = new Map();

  private constructor() {}

  static getInstance(): WorkOrderService {
    if (!WorkOrderService.instance) {
      WorkOrderService.instance = new WorkOrderService();
    }
    return WorkOrderService.instance;
  }

  createWorkOrder(
    input: {
      title: string;
      type: WorkOrder['type'];
      priority: WorkOrder['priority'];
      assetId?: string;
      vendorId?: string;
      source?: WorkOrder['source'];
      sourceId?: string;
      maintenancePlanId?: string;
      maintenanceOccurrenceId?: string;
      dueDate?: string;
      assignedTo?: string;
      description?: string;
      clientOperationId?: string;
    },
    actor: FacilityOperationsActor,
    now = new Date()
  ): WorkOrder {
    if (!actor.hasPermission('CREATE_WORK_ORDER') && !actor.hasPermission('MANAGE_WORK_ORDERS')) {
      throw new Error('ACCESS_DENIED: Insufficient permissions to create work order');
    }

    const workOrderId = input.clientOperationId ?? `wo-${generateOperationId('wo')}`;
    const workOrderNumber = `WO-${actor.societyId.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const source = input.source ?? 'MANUAL';

    const timelineItem: WorkOrderTimelineItem = {
      id: `tl-${workOrderId}-init`,
      event: 'CREATED',
      title: 'Work Order Created',
      note: `Created by ${actor.name} via ${source}`,
      actorId: actor.userId,
      actorName: actor.name,
      createdAt: now.toISOString(),
    };

    const workOrder: WorkOrder = {
      id: workOrderId,
      workOrderNumber,
      title: input.title,
      type: input.type,
      priority: input.priority,
      status: input.vendorId ? 'ASSIGNED' : 'OPEN',
      dueDate: input.dueDate ?? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
      assignedTo: input.assignedTo ?? (input.vendorId ? `Vendor ${input.vendorId}` : 'Unassigned'),
      slaStatus: 'ON_TRACK',
      source,
      description: input.description ?? input.title,
      createdAt: now.toISOString(),
      verificationStatus: 'PENDING',
      timeline: [timelineItem],
      ...(input.assetId ? { linkedAssetId: input.assetId } : {}),
      ...(input.vendorId ? { vendorId: input.vendorId, assignedVendorId: input.vendorId } : {}),
      ...(input.maintenancePlanId ? { maintenancePlanId: input.maintenancePlanId } : {}),
      ...(input.maintenanceOccurrenceId ? { maintenanceOccurrenceId: input.maintenanceOccurrenceId } : {}),
      ...(source === 'COMPLAINT' && input.sourceId ? { linkedComplaintId: input.sourceId } : {}),
      ...(source === 'EMERGENCY' && input.sourceId ? { linkedEmergencyIncidentId: input.sourceId } : {}),
    };

    this.workOrders.set(workOrder.id, workOrder);
    return workOrder;
  }

  assignWorkOrder(
    workOrderId: string,
    assignment: { assignedVendorId?: string; assignedTo?: string },
    actor: FacilityOperationsActor,
    now = new Date()
  ): WorkOrder {
    const wo = this.workOrders.get(workOrderId);
    if (!wo) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    if (assignment.assignedVendorId) {
      wo.vendorId = assignment.assignedVendorId;
      wo.assignedVendorId = assignment.assignedVendorId;
    }
    if (assignment.assignedTo) {
      wo.assignedTo = assignment.assignedTo;
    }
    wo.status = 'ASSIGNED';
    wo.timeline.push({
      id: `tl-${generateOperationId('tl')}`,
      event: 'ASSIGNED',
      eventType: 'ASSIGNED',
      title: 'Work Order Assigned',
      note: `Assigned to ${wo.assignedTo} by ${actor.name}`,
      actorId: actor.userId,
      actorName: actor.name,
      createdAt: now.toISOString(),
    });

    return wo;
  }

  startWorkOrder(workOrderId: string, actor: FacilityOperationsActor, now = new Date()): WorkOrder {
    const wo = this.workOrders.get(workOrderId);
    if (!wo) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    wo.status = 'IN_PROGRESS';
    wo.startedAt = now.toISOString();
    wo.timeline.push({
      id: `tl-${generateOperationId('tl')}`,
      event: 'STARTED',
      title: 'Work Started',
      note: `Service commenced by ${actor.name}`,
      actorId: actor.userId,
      actorName: actor.name,
      createdAt: now.toISOString(),
    });

    return wo;
  }

  pauseForPartsShortage(
    workOrderId: string,
    reason: string,
    itemId: string,
    actor: FacilityOperationsActor,
    now = new Date()
  ): WorkOrder {
    const wo = this.workOrders.get(workOrderId);
    if (!wo) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    wo.status = 'ON_HOLD';
    wo.holdReason = 'PARTS_SHORTAGE';
    wo.timeline.push({
      id: `tl-${generateOperationId('tl')}`,
      event: 'PART_SHORTAGE',
      title: 'Paused - Parts Shortage',
      note: `${reason} (Item: ${itemId})`,
      actorId: actor.userId,
      actorName: actor.name,
      createdAt: now.toISOString(),
    });

    return wo;
  }

  recordVendorNoShow(
    workOrderId: string,
    reason: string,
    actor: FacilityOperationsActor,
    now = new Date()
  ): WorkOrder {
    const wo = this.workOrders.get(workOrderId);
    if (!wo) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    wo.timeline.push({
      id: `tl-${generateOperationId('tl')}`,
      event: 'VENDOR_NO_SHOW',
      title: 'Vendor No-Show Recorded',
      note: reason,
      actorId: actor.userId,
      actorName: actor.name,
      createdAt: now.toISOString(),
    });

    return wo;
  }

  submitCompletion(
    input: {
      workOrderId: string;
      technicianNotes?: string;
      evidenceDocumentIds?: string[];
      serviceReportDocumentId?: string;
      partsUsed?: WorkOrderPartUsage[];
      costAmount?: number;
      costCurrency?: string;
    },
    actor: FacilityOperationsActor,
    now = new Date()
  ): WorkOrder {
    const wo = this.workOrders.get(input.workOrderId);
    if (!wo) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    wo.status = 'COMPLETION_SUBMITTED';
    wo.completedAt = now.toISOString();
    if (input.evidenceDocumentIds) {
      wo.evidenceDocumentIds = [...input.evidenceDocumentIds];
    }
    if (input.serviceReportDocumentId) {
      wo.serviceReportDocumentId = input.serviceReportDocumentId;
    }
    if (input.partsUsed) {
      wo.partsUsed = [...input.partsUsed];
    }
    if (input.costAmount !== undefined) {
      wo.costAmount = input.costAmount;
    }
    if (input.costCurrency) {
      wo.costCurrency = input.costCurrency;
    }

    wo.timeline.push({
      id: `tl-${generateOperationId('tl')}`,
      event: 'COMPLETION_SUBMITTED',
      title: 'Completion Submitted',
      note: input.technicianNotes ?? 'Work completed, awaiting verification',
      actorId: actor.userId,
      actorName: actor.name,
      createdAt: now.toISOString(),
    });

    return wo;
  }

  verifyWorkOrder(
    input: {
      workOrderId: string;
      action: 'ACCEPT' | 'REWORK';
      verificationNotes?: string;
    },
    actor: FacilityOperationsActor,
    now = new Date()
  ): WorkOrder {
    const wo = this.workOrders.get(input.workOrderId);
    if (!wo) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    if (wo.status !== 'COMPLETION_SUBMITTED' && wo.status !== 'COMPLETED') {
      throw new Error(`INVALID_WORK_ORDER_STATE: Cannot verify work order in status ${wo.status}`);
    }

    if (input.action === 'ACCEPT') {
      wo.status = 'VERIFIED';
      wo.verificationStatus = 'VERIFIED';
      if (input.verificationNotes) {
        wo.verificationNotes = input.verificationNotes;
      }
      wo.verifiedAt = now.toISOString();

      wo.timeline.push({
        id: `tl-${generateOperationId('tl')}`,
        event: 'VERIFIED',
        title: 'Work Verified and Accepted',
        note: input.verificationNotes ?? 'Passed verification inspection',
        actorId: actor.userId,
        actorName: actor.name,
        createdAt: now.toISOString(),
      });

      if (wo.linkedAssetId) {
        const historyItem: ServiceHistoryItem = {
          id: `sh-${generateOperationId('sh')}`,
          assetId: wo.linkedAssetId,
          assetName: wo.linkedAssetName ?? `Asset ${wo.linkedAssetId}`,
          serviceDate: now.toISOString().split('T')[0] ?? '',
          workOrderNumber: wo.workOrderNumber,
          serviceType: wo.type,
          status: 'VERIFIED',
          costAmount: wo.costAmount ?? 0,
          costCurrency: wo.costCurrency ?? 'INR',
          technician: actor.name,
          findings: input.verificationNotes ?? 'Normal service completed',
          nextAction: 'None',
          ...(wo.serviceReportDocumentId ? { serviceReportDocumentId: wo.serviceReportDocumentId } : {}),
        };
        const list = this.serviceHistory.get(wo.linkedAssetId) ?? [];
        list.push(historyItem);
        this.serviceHistory.set(wo.linkedAssetId, list);
      }
    } else {
      wo.status = 'IN_PROGRESS';
      wo.verificationStatus = 'REWORK_REQUIRED';
      if (input.verificationNotes) {
        wo.reworkReason = input.verificationNotes;
      }

      wo.timeline.push({
        id: `tl-${generateOperationId('tl')}`,
        event: 'REWORK_REQUIRED',
        title: 'Verification Failed - Rework Required',
        note: input.verificationNotes ?? 'Rework required before acceptance',
        actorId: actor.userId,
        actorName: actor.name,
        createdAt: now.toISOString(),
      });
    }

    return wo;
  }

  completeWorkOrder(workOrderId: string, actor: FacilityOperationsActor): WorkOrder {
    const wo = this.workOrders.get(workOrderId);
    if (!wo) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    if (wo.status !== 'IN_PROGRESS' && wo.status !== 'ON_HOLD') {
      throw new Error(`INVALID_WORK_ORDER_STATE: Cannot transition from ${wo.status} to COMPLETED`);
    }

    wo.status = 'COMPLETED';
    wo.completedAt = new Date().toISOString();
    return wo;
  }

  closeWorkOrder(workOrderId: string, notes: string | undefined, actor: FacilityOperationsActor, now = new Date()): WorkOrder {
    const wo = this.workOrders.get(workOrderId);
    if (!wo) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    wo.status = 'CLOSED';
    wo.closedAt = now.toISOString();

    wo.timeline.push({
      id: `tl-${generateOperationId('tl')}`,
      event: 'CLOSED',
      title: 'Work Order Closed',
      note: notes ?? 'Formally closed after verification',
      actorId: actor.userId,
      actorName: actor.name,
      createdAt: now.toISOString(),
    });

    return wo;
  }

  reopenWorkOrder(workOrderId: string, reason: string, actor: FacilityOperationsActor, now = new Date()): WorkOrder {
    const wo = this.workOrders.get(workOrderId);
    if (!wo) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    wo.status = 'OPEN';

    wo.timeline.push({
      id: `tl-${generateOperationId('tl')}`,
      event: 'REOPENED',
      title: 'Work Order Reopened',
      note: reason,
      actorId: actor.userId,
      actorName: actor.name,
      createdAt: now.toISOString(),
    });

    return wo;
  }

  getWorkOrder(id: string): WorkOrder | null {
    return this.workOrders.get(id) ?? null;
  }

  getWorkOrders(): WorkOrder[] {
    return Array.from(this.workOrders.values());
  }

  getServiceHistoryForAsset(assetId: string): ServiceHistoryItem[] {
    return this.serviceHistory.get(assetId) ?? [];
  }

  clear(): void {
    this.workOrders.clear();
    this.serviceHistory.clear();
  }
}

export const workOrderService = WorkOrderService.getInstance();
