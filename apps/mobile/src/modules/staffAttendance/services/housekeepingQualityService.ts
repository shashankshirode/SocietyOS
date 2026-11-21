import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import { assertSocietyContext, canInspectHousekeeping } from '../data/staffAttendanceActor';
import { generateOperationId } from '../../../core/api/idempotency';

export interface HousekeepingChecklistItem {
  id: string;
  label: string;
  weight: number;
}

export interface HousekeepingChecklistVersion {
  id: string;
  version: string;
  areaType: 'LOBBY' | 'LIFT' | 'STAIRCASE' | 'CLUBHOUSE' | 'WASHROOM' | 'GARBAGE_AREA';
  items: HousekeepingChecklistItem[];
  minimumPassingScore: number;
}

export interface HousekeepingInspectionRecord {
  id: string;
  societyId: string;
  checklistVersionId: string;
  areaName: string;
  workerStaffId: string;
  workerStaffName: string;
  inspectorUserId: string;
  inspectorName: string;
  scorePercentage: number;
  passed: boolean;
  findings: string[];
  correctiveActionId?: string;
  inspectedAt: string;
}

export interface CorrectiveActionTask {
  id: string;
  inspectionId: string;
  societyId: string;
  areaName: string;
  assignedStaffId: string;
  taskDescription: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RE_INSPECTED' | 'RESOLVED';
  slaHours: number;
  dueAt: string;
  createdAt: string;
}

export class HousekeepingQualityService {
  private checklists = new Map<string, HousekeepingChecklistVersion>();
  private inspections = new Map<string, HousekeepingInspectionRecord>();
  private correctiveActions = new Map<string, CorrectiveActionTask>();
  private auditLogs: { action: string; entityId: string; actorId: string; timestamp: string; details?: string }[] = [];

  constructor() {
    this.seedDefaultChecklists();
  }

  private seedDefaultChecklists(): void {
    const defaultLobby: HousekeepingChecklistVersion = {
      id: 'chk-lobby-v1',
      version: '1.0.0',
      areaType: 'LOBBY',
      minimumPassingScore: 80,
      items: [
        { id: 'item-1', label: 'Floor swept and mopped', weight: 30 },
        { id: 'item-2', label: 'Glass panels cleaned', weight: 20 },
        { id: 'item-3', label: 'Dustbins cleared and sanitized', weight: 25 },
        { id: 'item-4', label: 'Seating furniture wiped', weight: 25 },
      ],
    };
    this.checklists.set(defaultLobby.id, defaultLobby);
  }

  public registerChecklistVersion(
    actor: StaffOperationsActor,
    societyId: string,
    checklist: HousekeepingChecklistVersion
  ): void {
    assertSocietyContext(actor, societyId);
    this.checklists.set(checklist.id, checklist);
  }

  public conductInspection(
    actor: StaffOperationsActor,
    societyId: string,
    params: {
      checklistVersionId: string;
      areaName: string;
      workerStaffId: string;
      workerStaffName: string;
      itemResults: { itemId: string; passed: boolean }[];
      findings: string[];
    }
  ): { inspection: HousekeepingInspectionRecord; correctiveAction?: CorrectiveActionTask } {
    assertSocietyContext(actor, societyId);
    if (!canInspectHousekeeping(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to conduct housekeeping inspections');
    }

    const checklist = this.checklists.get(params.checklistVersionId);
    if (!checklist) {
      throw new Error('CHECKLIST_NOT_FOUND: Checklist version not found');
    }

    let earnedScore = 0;
    let totalScore = 0;

    for (const item of checklist.items) {
      totalScore += item.weight;
      const res = params.itemResults.find(r => r.itemId === item.id);
      if (res && res.passed) {
        earnedScore += item.weight;
      }
    }

    const scorePercentage = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;
    const passed = scorePercentage >= checklist.minimumPassingScore;
    const inspectionId = `hki-${generateOperationId('hki')}`;
    const nowIso = new Date().toISOString();

    let correctiveAction: CorrectiveActionTask | undefined;
    if (!passed) {
      const correctiveActionId = `cat-${generateOperationId('cat')}`;
      const dueAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
      correctiveAction = {
        id: correctiveActionId,
        inspectionId,
        societyId,
        areaName: params.areaName,
        assignedStaffId: params.workerStaffId,
        taskDescription: `Inspection failed (${scorePercentage}% vs min ${checklist.minimumPassingScore}%). Re-cleaning required: ${params.findings.join('; ')}`,
        status: 'PENDING',
        slaHours: 4,
        dueAt,
        createdAt: nowIso,
      };
      this.correctiveActions.set(correctiveActionId, correctiveAction);
    }

    const inspection: HousekeepingInspectionRecord = {
      id: inspectionId,
      societyId,
      checklistVersionId: params.checklistVersionId,
      areaName: params.areaName,
      workerStaffId: params.workerStaffId,
      workerStaffName: params.workerStaffName,
      inspectorUserId: actor.userId,
      inspectorName: actor.displayName ?? actor.userId,
      scorePercentage,
      passed,
      findings: params.findings,
      ...(correctiveAction ? { correctiveActionId: correctiveAction.id } : {}),
      inspectedAt: nowIso,
    };

    this.inspections.set(inspectionId, inspection);

    this.auditLogs.push({
      action: 'HOUSEKEEPING_INSPECTION_COMPLETED',
      entityId: inspectionId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Inspection for ${params.areaName}: score ${scorePercentage}% (${passed ? 'PASSED' : 'FAILED'})`,
    });

    return {
      inspection,
      ...(correctiveAction ? { correctiveAction } : {}),
    };
  }

  public getInspection(id: string): HousekeepingInspectionRecord | undefined {
    return this.inspections.get(id);
  }

  public getCorrectiveAction(id: string): CorrectiveActionTask | undefined {
    return this.correctiveActions.get(id);
  }

  public getAuditLogs() {
    return [...this.auditLogs];
  }
}
