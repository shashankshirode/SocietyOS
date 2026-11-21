import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { mockStore } from '../../../core/mockStore/mockStore';
import { slaEngine } from './slaEngine';
import type {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  EscalationLevel,
  AssignmentRule,
  ComplaintAssignment,
  ComplaintEscalation,
  EscalationReason,
  StaffMember,
  HoldReason,
  ComplaintHold,
  ResolutionOutcome,
  ConfirmationPolicy,
  ComplaintResolution,
} from '../../../shared/types/complaintPhase10.types';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export class AssignmentEngine {
  private static instance: AssignmentEngine;

  static getInstance(): AssignmentEngine {
    if (!AssignmentEngine.instance) {
      AssignmentEngine.instance = new AssignmentEngine();
    }
    return AssignmentEngine.instance;
  }

  async getAvailableTechnicians(category?: string, societyId?: string): Promise<StaffMember[]> {
    const staff = mockStore.getState().staff || [];
    return staff.filter(s =>
      s.isActive &&
      s.role === 'TECHNICIAN' &&
      (!societyId || s.societyId === societyId) &&
      (!category || s.skills?.includes(category) || s.categories?.includes(category))
    );
  }

  async getTechnicianWorkload(userId: string): Promise<{ assignedCount: number; inProgressCount: number }> {
    const complaints = mockStore.getState().complaints || [];
    const assigned = complaints.filter(c => c.assignedToUserId === userId && ['ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'WAITING', 'HOLD'].includes(c.status));
    const inProgress = assigned.filter(c => c.status === 'IN_PROGRESS');
    return { assignedCount: assigned.length, inProgressCount: inProgress.length };
  }

  async autoAssignComplaint(
    complaintId: string,
    rule: AssignmentRule,
    assignedBy: string,
    societyId: string
  ): Promise<{ success: boolean; assignmentId?: string; error?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return { success: false, error: 'Complaint not found' };

    const complaint = complaints[index];
    if (!complaint) return { success: false, error: 'Complaint not found' };
    if (complaint.assignedToUserId) return { success: false, error: 'Already assigned' };

    const technicians = await this.getAvailableTechnicians(complaint.category, societyId);
    if (technicians.length === 0) return { success: false, error: 'No available technicians' };

    let selectedTechnician: StaffMember | null = null;

    switch (rule) {
      case 'ROUND_ROBIN': {
        const assignments = mockStore.getState().complaintAssignments?.filter(a => a.assignedByUserId === 'SYSTEM_AUTO') || [];
        const lastAssigned = assignments[assignments.length - 1];
        const lastTechIndex = technicians.findIndex(t => t.id === lastAssigned?.assignedToUserId);
        selectedTechnician = technicians[(lastTechIndex + 1) % technicians.length] ?? null;
        break;
      }
      case 'WORKLOAD_BASED': {
        let minWorkload = Infinity;
        for (const tech of technicians) {
          const workload = await this.getTechnicianWorkload(tech.id);
          if (workload.assignedCount < minWorkload) {
            minWorkload = workload.assignedCount;
            selectedTechnician = tech;
          }
        }
        break;
      }
      case 'SKILL_BASED': {
        selectedTechnician = technicians.find(t => t.skills?.includes(complaint.category) || t.categories?.includes(complaint.category)) ?? technicians[0] ?? null;
        break;
      }
      case 'LOCATION_BASED': {
        selectedTechnician = technicians.find(t => t.assignedTower === complaint.tower) ?? technicians[0] ?? null;
        break;
      }
      case 'CATEGORY_BASED': {
        selectedTechnician = technicians.find(t => t.primaryCategory === complaint.category) ?? technicians[0] ?? null;
        break;
      }
      default:
        selectedTechnician = technicians[0] ?? null;
    }

    if (!selectedTechnician) return { success: false, error: 'No technician selected' };

    return this.assignComplaint(complaintId, selectedTechnician.id, selectedTechnician.name, assignedBy, rule, societyId);
  }

  async assignComplaint(
    complaintId: string,
    assigneeUserId: string,
    assigneeDisplayName: string,
    assignedBy: string,
    ruleUsed?: AssignmentRule,
    societyId?: string
  ): Promise<{ success: boolean; assignmentId?: string; error?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return { success: false, error: 'Complaint not found' };

    const complaint = complaints[index];
    if (!complaint) return { success: false, error: 'Complaint not found' };
    if (!['CREATED', 'CLASSIFIED', 'PENDING_ASSIGNMENT', 'ESCALATED'].includes(complaint.status)) {
      return { success: false, error: `Cannot assign complaint in status: ${complaint.status}` };
    }

    const now = new Date().toISOString();
    const assignmentId = generateId('assign');

    const assignment: ComplaintAssignment = {
      id: assignmentId,
      complaintId,
      assignedToUserId: assigneeUserId,
      assignedToDisplayName: assigneeDisplayName,
      assignedByUserId: assignedBy,
      assignedByDisplayName: assignedBy,
      assignedAt: now,
      ruleUsed: ruleUsed || 'MANUAL',
      metadata: {},
      ...(societyId || complaint.societyId ? { societyId: societyId || complaint.societyId } : {}),
    };

    mockStore.getState().complaintAssignments?.push(assignment);

    const updatedComplaint = {
      ...complaint,
      status: 'ASSIGNED' as const,
      assignedToUserId: assigneeUserId,
      assignedToDisplayName: assigneeDisplayName,
      assignedAt: now,
      escalationLevel: 'TECHNICIAN' as const,
      updatedAt: now,
    };

    mockStore.updateComplaint(complaintId, updatedComplaint);

    createAuditEntry({
      actorUserId: assignedBy,
      actorType: 'ADMIN',
      societyId: societyId || complaint.societyId || '',
      action: 'COMPLAINT_ASSIGNED',
      entityType: 'COMPLAINT',
      entityId: complaintId,
      previousState: { status: complaint.status, assignedToUserId: complaint.assignedToUserId },
      newState: { status: 'ASSIGNED', assignedToUserId: assigneeUserId, ruleUsed: ruleUsed || 'MANUAL' },
      idempotencyKey: createIdempotencyKey(`assign_${complaintId}_${assigneeUserId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, assignmentId };
  }

  async acknowledgeAssignment(
    complaintId: string,
    technicianUserId: string,
    technicianDisplayName: string,
    societyId: string
  ): Promise<{ success: boolean; error?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return { success: false, error: 'Complaint not found' };

    const complaint = complaints[index];
    if (!complaint) return { success: false, error: 'Complaint not found' };
    if (complaint.assignedToUserId !== technicianUserId) return { success: false, error: 'Not assigned to this technician' };
    if (complaint.status !== 'ASSIGNED') return { success: false, error: `Cannot acknowledge in status: ${complaint.status}` };

    const now = new Date().toISOString();

    const assignments = mockStore.getState().complaintAssignments || [];
    const assignmentIndex = assignments.findLastIndex(a => a.complaintId === complaintId && a.assignedToUserId === technicianUserId);
    if (assignmentIndex !== -1 && assignments[assignmentIndex]) {
      assignments[assignmentIndex] = {
        ...assignments[assignmentIndex],
        acknowledgedAt: now,
      };
    }

    const updated = {
      ...complaint,
      status: 'ACKNOWLEDGED' as const,
      acknowledgedAt: now,
      updatedAt: now,
    };

    mockStore.updateComplaint(complaintId, updated);

    createAuditEntry({
      actorUserId: technicianUserId,
      actorType: 'TECHNICIAN',
      societyId,
      action: 'COMPLAINT_ACKNOWLEDGED',
      entityType: 'COMPLAINT',
      entityId: complaintId,
      previousState: { status: 'ASSIGNED' },
      newState: { status: 'ACKNOWLEDGED', acknowledgedAt: now },
      idempotencyKey: createIdempotencyKey(`acknowledge_${complaintId}_${technicianUserId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true };
  }

  async rejectAssignment(
    complaintId: string,
    technicianUserId: string,
    reason: string,
    societyId: string
  ): Promise<{ success: boolean; error?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return { success: false, error: 'Complaint not found' };

    const complaint = complaints[index];
    if (!complaint) return { success: false, error: 'Complaint not found' };
    if (complaint.assignedToUserId !== technicianUserId) return { success: false, error: 'Not assigned to this technician' };
    if (complaint.status !== 'ASSIGNED') return { success: false, error: `Cannot reject in status: ${complaint.status}` };

    const now = new Date().toISOString();

    const assignments = mockStore.getState().complaintAssignments || [];
    const assignmentIndex = assignments.findLastIndex(a => a.complaintId === complaintId && a.assignedToUserId === technicianUserId);
    if (assignmentIndex !== -1 && assignments[assignmentIndex]) {
      assignments[assignmentIndex] = {
        ...assignments[assignmentIndex],
        rejectedAt: now,
        rejectionReason: reason,
      };
    }

    const updated = {
      ...complaint,
      status: 'PENDING_ASSIGNMENT' as const,
      updatedAt: now,
    };

    mockStore.updateComplaint(complaintId, updated);

    createAuditEntry({
      actorUserId: technicianUserId,
      actorType: 'TECHNICIAN',
      societyId,
      action: 'COMPLAINT_ASSIGNMENT_REJECTED',
      entityType: 'COMPLAINT',
      entityId: complaintId,
      previousState: { status: 'ASSIGNED', assignedToUserId: technicianUserId },
      newState: { status: 'PENDING_ASSIGNMENT', rejectionReason: reason },
      idempotencyKey: createIdempotencyKey(`reject_${complaintId}_${technicianUserId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true };
  }

  async reassignComplaint(
    complaintId: string,
    newAssigneeUserId: string,
    newAssigneeDisplayName: string,
    reassignedBy: string,
    reason: string,
    societyId: string
  ): Promise<{ success: boolean; error?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return { success: false, error: 'Complaint not found' };

    const complaint = complaints[index];
    if (!complaint) return { success: false, error: 'Complaint not found' };
    if (!['ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'WAITING', 'HOLD', 'ESCALATED'].includes(complaint.status)) {
      return { success: false, error: `Cannot reassign in status: ${complaint.status}` };
    }

    const oldAssigneeId = complaint.assignedToUserId;
    const oldAssigneeName = complaint.assignedToDisplayName;

    const now = new Date().toISOString();
    const assignmentId = generateId('assign');

    const assignment: ComplaintAssignment = {
      id: assignmentId,
      complaintId,
      assignedToUserId: newAssigneeUserId,
      assignedToDisplayName: newAssigneeDisplayName,
      assignedByUserId: reassignedBy,
      assignedByDisplayName: reassignedBy,
      assignedAt: now,
      ruleUsed: 'MANUAL',
      metadata: { reassignmentReason: reason, ...(oldAssigneeId ? { previousAssigneeId: oldAssigneeId } : {}) },
      ...(societyId || complaint.societyId ? { societyId: societyId || complaint.societyId } : {}),
    };

    mockStore.getState().complaintAssignments?.push(assignment);

    const updatedComplaint = {
      ...complaint,
      status: 'ASSIGNED' as const,
      assignedToUserId: newAssigneeUserId,
      assignedToDisplayName: newAssigneeDisplayName,
      assignedAt: now,
      updatedAt: now,
    };

    mockStore.updateComplaint(complaintId, updatedComplaint);

    createAuditEntry({
      actorUserId: reassignedBy,
      actorType: 'ADMIN',
      societyId,
      action: 'COMPLAINT_REASSIGNED',
      entityType: 'COMPLAINT',
      entityId: complaintId,
      previousState: { assignedToUserId: oldAssigneeId, assignedToDisplayName: oldAssigneeName, status: complaint.status },
      newState: { assignedToUserId: newAssigneeUserId, assignedToDisplayName: newAssigneeDisplayName, status: 'ASSIGNED', reassignmentReason: reason },
      idempotencyKey: createIdempotencyKey(`reassign_${complaintId}_${newAssigneeUserId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true };
  }

  async startWork(
    complaintId: string,
    technicianUserId: string,
    societyId: string
  ): Promise<{ success: boolean; error?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return { success: false, error: 'Complaint not found' };

    const complaint = complaints[index];
    if (!complaint) return { success: false, error: 'Complaint not found' };
    if (complaint.assignedToUserId !== technicianUserId) return { success: false, error: 'Not assigned to this technician' };
    if (complaint.status !== 'ACKNOWLEDGED') return { success: false, error: `Cannot start work in status: ${complaint.status}` };

    const now = new Date().toISOString();
    const updated = {
      ...complaint,
      status: 'IN_PROGRESS' as const,
      workStartedAt: now,
      updatedAt: now,
    };

    mockStore.updateComplaint(complaintId, updated);

    createAuditEntry({
      actorUserId: technicianUserId,
      actorType: 'TECHNICIAN',
      societyId,
      action: 'COMPLAINT_WORK_STARTED',
      entityType: 'COMPLAINT',
      entityId: complaintId,
      previousState: { status: 'ACKNOWLEDGED' },
      newState: { status: 'IN_PROGRESS', workStartedAt: now },
      idempotencyKey: createIdempotencyKey(`work_start_${complaintId}_${technicianUserId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true };
  }

  async putOnHold(
    complaintId: string,
    technicianUserId: string,
    reason: string,
    expectedResumeAt?: string,
    notes?: string,
    societyId?: string
  ): Promise<{ success: boolean; error?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return { success: false, error: 'Complaint not found' };

    const complaint = complaints[index];
    if (!complaint) return { success: false, error: 'Complaint not found' };
    if (complaint.status !== 'IN_PROGRESS' && complaint.status !== 'WAITING') {
      return { success: false, error: `Cannot put on hold in status: ${complaint.status}` };
    }

    const hold: ComplaintHold = {
      id: generateId('hold'),
      complaintId,
      reason: reason as HoldReason,
      startedByUserId: technicianUserId,
      startedByDisplayName: 'Technician',
      startedAt: new Date().toISOString(),
      dependencyDetails: {},
      isActive: true,
      ...(expectedResumeAt ? { expectedResumeAt, holdExpectedResumeAt: expectedResumeAt } : {}),
      ...(notes ? { notes, holdNotes: notes } : {}),
      ...(societyId || complaint.societyId ? { societyId: societyId || complaint.societyId } : {}),
    };

    mockStore.getState().complaintHolds?.push(hold);

    const now = new Date().toISOString();
    const updated = {
      ...complaint,
      status: 'HOLD' as const,
      holdReason: reason as HoldReason,
      holdStartedAt: now,
      ...(expectedResumeAt ? { holdExpectedResumeAt: expectedResumeAt } : {}),
      ...(notes ? { holdNotes: notes } : {}),
      updatedAt: now,
    };

    mockStore.updateComplaint(complaintId, updated);

    createAuditEntry({
      actorUserId: technicianUserId,
      actorType: 'TECHNICIAN',
      societyId: societyId || complaint.societyId || '',
      action: 'COMPLAINT_ON_HOLD',
      entityType: 'COMPLAINT',
      entityId: complaintId,
      previousState: { status: complaint.status },
      newState: { status: 'HOLD', holdReason: reason, ruleUsed: 'HOLD' },
      idempotencyKey: createIdempotencyKey(`hold_${complaintId}_${technicianUserId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true };
  }

  async resumeFromHold(
    complaintId: string,
    technicianUserId: string,
    societyId: string
  ): Promise<{ success: boolean; error?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return { success: false, error: 'Complaint not found' };

    const complaint = complaints[index];
    if (!complaint) return { success: false, error: 'Complaint not found' };
    if (complaint.status !== 'HOLD') return { success: false, error: 'Complaint not on hold' };

    const now = new Date().toISOString();
    const holds = mockStore.getState().complaintHolds || [];
    const holdIndex = holds.findLastIndex(h => h.complaintId === complaintId && h.isActive);
    if (holdIndex !== -1 && holds[holdIndex]) {
      holds[holdIndex] = {
        ...holds[holdIndex],
        isActive: false,
        resumedAt: now,
        resumedByUserId: technicianUserId,
        resumedByDisplayName: 'Technician',
      };
    }

    const updated = {
      ...complaint,
      status: 'IN_PROGRESS' as const,
      updatedAt: now,
    };

    mockStore.updateComplaint(complaintId, updated);

    createAuditEntry({
      actorUserId: technicianUserId,
      actorType: 'TECHNICIAN',
      societyId,
      action: 'COMPLAINT_RESUMED',
      entityType: 'COMPLAINT',
      entityId: complaintId,
      previousState: { status: 'HOLD' },
      newState: { status: 'IN_PROGRESS', resumedAt: now },
      idempotencyKey: createIdempotencyKey(`resume_${complaintId}_${technicianUserId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true };
  }

  async submitResolution(
    complaintId: string,
    technicianUserId: string,
    outcome: 'FIXED' | 'WORKAROUND' | 'NO_ACTION_NEEDED' | 'ESCALATED_TO_VENDOR' | 'PARTIAL_FIX' | 'WONT_FIX',
    summary: string,
    evidenceIds: string[],
    requiresConfirmation: boolean,
    confirmationPolicy: 'AUTO_CLOSE_AFTER_PERIOD' | 'REQUIRE_EXPLICIT_CONFIRMATION' | 'SUPERVISOR_REVIEW',
    societyId: string
  ): Promise<{ success: boolean; error?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return { success: false, error: 'Complaint not found' };

    const complaint = complaints[index];
    if (!complaint) return { success: false, error: 'Complaint not found' };
    if (complaint.assignedToUserId !== technicianUserId) return { success: false, error: 'Not assigned to this technician' };
    if (!['IN_PROGRESS', 'WAITING', 'HOLD'].includes(complaint.status)) {
      return { success: false, error: `Cannot resolve in status: ${complaint.status}` };
    }

    if (requiresConfirmation && evidenceIds.length === 0) {
      return { success: false, error: 'Resolution evidence required' };
    }

    const now = new Date().toISOString();
    const resolution: ComplaintResolution = {
      id: generateId('res'),
      complaintId,
      resolvedByUserId: technicianUserId,
      resolvedByDisplayName: 'Technician',
      resolvedAt: now,
      outcome: outcome as ResolutionOutcome,
      summary,
      evidenceIds,
      requiresConfirmation,
      confirmationPolicy: confirmationPolicy as ConfirmationPolicy,
      metadata: {},
      ...(societyId || complaint.societyId ? { societyId: societyId || complaint.societyId } : {}),
    };

    mockStore.getState().complaintResolutions?.push(resolution);

    const newStatus = requiresConfirmation ? ('RESOLVED' as const) : ('CLOSED' as const);
    const updated = {
      ...complaint,
      status: newStatus,
      resolvedAt: now,
      resolvedBy: technicianUserId,
      resolutionOutcome: outcome as ResolutionOutcome,
      resolutionSummary: summary,
      resolutionEvidenceIds: evidenceIds,
      confirmationPolicy: confirmationPolicy as ConfirmationPolicy,
      ...(requiresConfirmation ? { confirmationRequestedAt: now } : {}),
      updatedAt: now,
    };

    mockStore.updateComplaint(complaintId, updated);

    createAuditEntry({
      actorUserId: technicianUserId,
      actorType: 'TECHNICIAN',
      societyId,
      action: 'COMPLAINT_RESOLVED',
      entityType: 'COMPLAINT',
      entityId: complaintId,
      previousState: { status: complaint.status },
      newState: { status: newStatus, outcome, summary },
      idempotencyKey: createIdempotencyKey(`resolve_${complaintId}_${technicianUserId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true };
  }
}

export const assignmentEngine = AssignmentEngine.getInstance();