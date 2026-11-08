import type {
  Complaint,
  ComplaintAssignment,
  AssignmentRule,
  EscalationLevel,
  EscalationReason,
} from '../../../shared/types/complaintPhase6';
import type { Absent } from '../../../shared/types/absence.types';
import { mockStore } from '../../../core/mockStore/mockStore';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { createAuditEntry } from '../../../core/audit';
import { gateIdempotencyService } from '../../guard/services/gateIdempotencyService';

export interface AssignmentResult {
  success: boolean;
  assignment?: ComplaintAssignment | Absent;
  errorCode?: string | Absent;
  errorMessage?: string | Absent;
}

export interface AcknowledgmentResult {
  success: boolean;
  acknowledgedAt?: string | Absent;
  errorCode?: string | Absent;
  errorMessage?: string | Absent;
}

export interface ReassignmentResult {
  success: boolean;
  previousAssignment?: ComplaintAssignment | Absent;
  newAssignment?: ComplaintAssignment | Absent;
  errorCode?: string | Absent;
  errorMessage?: string | Absent;
}

export interface EligibleAssignee {
  userId: string;
  displayName: string;
  role: string;
  skills: string[];
  currentWorkload: number;
  maxWorkload: number;
  isAvailable: boolean;
  shiftEndsAt?: string | Absent;
}

export class AssignmentService {
  private static instance: AssignmentService;

  static getInstance(): AssignmentService {
    if (!AssignmentService.instance) {
      AssignmentService.instance = new AssignmentService();
    }
    return AssignmentService.instance;
  }

  async assignComplaint(
    complaint: Complaint,
    assigneeUserId: string,
    assignedByUserId: string,
    assignedByDisplayName: string,
    ruleUsed?: AssignmentRule,
    idempotencyKey?: string
  ): Promise<AssignmentResult> {
    const key = idempotencyKey || createIdempotencyKey(`assign-${complaint.id}-${assigneeUserId}`);
    const societyId = complaint.societyId || '';

    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, societyId);
    if (idempotencyResult.exists) {
      return {
        success: true,
        assignment: idempotencyResult.record?.responsePayload?.assignment as ComplaintAssignment | undefined,
      };
    }

    const targetComplaint = mockStore.getState().complaints.find(c => c.id === complaint.id) || complaint;

    const assignee = await this.validateAssigneeEligibility(assigneeUserId, targetComplaint);
    if (!assignee.valid) {
      return { success: false, errorCode: assignee.errorCode, errorMessage: assignee.errorMessage };
    }

    if (targetComplaint.status !== 'PENDING_ASSIGNMENT' && targetComplaint.status !== 'CLASSIFIED' && targetComplaint.status !== 'ASSIGNED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: `Cannot assign complaint in status ${targetComplaint.status}` };
    }

    const assignedToDisplayName = assignee.assignee?.displayName || 'Technician';
    const now = new Date().toISOString();
    const assignment: ComplaintAssignment = {
      id: `assign_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      complaintId: targetComplaint.id,
      assignedToUserId: assigneeUserId,
      assignedToDisplayName,
      assignedByUserId,
      assignedByDisplayName,
      assignedAt: now,
      ruleUsed: ruleUsed || 'MANUAL',
      metadata: {},
      ...(targetComplaint.societyId ? { societyId: targetComplaint.societyId } : {}),
    };

    mockStore.updateComplaint(targetComplaint.id, {
      status: 'ASSIGNED',
      assignedToUserId: assigneeUserId,
      assignedToDisplayName,
      assignedAt: now,
      escalationLevel: 'TECHNICIAN',
      updatedAt: now,
    });

    mockStore.getState().complaintAssignments?.push(assignment);
    mockStore.notify();

    await gateIdempotencyService.completeIdempotency(key, targetComplaint.societyId || '', assignment.id, { assignment: assignment as any });

    await createAuditEntry({
      actorUserId: assignedByUserId,
      actorType: 'ADMIN',
      societyId: targetComplaint.societyId || '',
      action: 'COMPLAINT_ASSIGNED',
      entityType: 'ComplaintAssignment',
      entityId: assignment.id,
      newState: { complaintId: targetComplaint.id, assigneeUserId, assigneeDisplayName: assignedToDisplayName },
      idempotencyKey: key,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, assignment };
  }

  async acknowledgeAssignment(
    complaint: Complaint,
    technicianUserId: string,
    technicianDisplayName: string,
    idempotencyKey?: string
  ): Promise<AcknowledgmentResult> {
    const targetComplaint = mockStore.getState().complaints.find(c => c.id === complaint.id) || complaint;
    const key = idempotencyKey || createIdempotencyKey(`acknowledge-${targetComplaint.id}-${technicianUserId}`);
    const societyId = targetComplaint.societyId || '';

    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, societyId);
    if (idempotencyResult.exists) {
      return {
        success: true,
        acknowledgedAt: idempotencyResult.record?.responsePayload?.acknowledgedAt as string | undefined,
      };
    }

    if (targetComplaint.status !== 'ASSIGNED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: 'Can only acknowledge ASSIGNED complaints' };
    }

    if (targetComplaint.assignedToUserId !== technicianUserId) {
      return { success: false, errorCode: 'NOT_ASSIGNED', errorMessage: 'Complaint not assigned to this technician' };
    }

    const now = new Date().toISOString();

    const assignments = mockStore.getState().complaintAssignments || [];
    const assignmentIndex = assignments.findIndex(a => a.complaintId === complaint.id && a.assignedToUserId === technicianUserId);

    if (assignmentIndex !== -1 && assignments[assignmentIndex]) {
      assignments[assignmentIndex] = {
        ...assignments[assignmentIndex],
        acknowledgedAt: now,
      };
    }

    mockStore.updateComplaint(complaint.id, {
      status: 'ACKNOWLEDGED',
      acknowledgedAt: now,
      updatedAt: now,
    });

    await gateIdempotencyService.completeIdempotency(key, societyId, 'acknowledged', { acknowledgedAt: now });

    await createAuditEntry({
      actorUserId: technicianUserId,
      actorType: 'TECHNICIAN',
      societyId,
      action: 'COMPLAINT_ACKNOWLEDGED',
      entityType: 'Complaint',
      entityId: complaint.id,
      newState: { status: 'ACKNOWLEDGED', acknowledgedAt: now },
      idempotencyKey: key,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, acknowledgedAt: now };
  }

  async startWork(
    complaint: Complaint,
    technicianUserId: string,
    workNote?: string,
    idempotencyKey?: string
  ): Promise<{ success: boolean; workStartedAt?: string | Absent; errorCode?: string | Absent; errorMessage?: string | Absent }> {
    const targetComplaint = mockStore.getState().complaints.find(c => c.id === complaint.id) || complaint;
    const key = idempotencyKey || createIdempotencyKey(`start-work-${targetComplaint.id}-${technicianUserId}`);

    if (targetComplaint.status !== 'ACKNOWLEDGED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: 'Can only start work on ACKNOWLEDGED complaints' };
    }

    if (targetComplaint.assignedToUserId !== technicianUserId) {
      return { success: false, errorCode: 'NOT_ASSIGNED', errorMessage: 'Complaint not assigned to this technician' };
    }

    const now = new Date().toISOString();

    mockStore.updateComplaint(targetComplaint.id, {
      status: 'IN_PROGRESS',
      workStartedAt: now,
      updatedAt: now,
    });

    await createAuditEntry({
      actorUserId: technicianUserId,
      actorType: 'TECHNICIAN',
      societyId: targetComplaint.societyId || '',
      action: 'COMPLAINT_WORK_STARTED',
      entityType: 'Complaint',
      entityId: targetComplaint.id,
      previousState: { status: 'ACKNOWLEDGED' },
      newState: { status: 'IN_PROGRESS', workStartedAt: now, ...(workNote ? { note: workNote } : {}) },
      idempotencyKey: key,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, workStartedAt: now };
  }

  async reassignComplaint(
    complaint: Complaint,
    newAssigneeUserId: string,
    reassignedByUserId: string,
    reassignedByDisplayName: string,
    reason: string,
    idempotencyKey?: string
  ): Promise<ReassignmentResult> {
    const targetComplaint = mockStore.getState().complaints.find(c => c.id === complaint.id) || complaint;
    const key = idempotencyKey || createIdempotencyKey(`reassign-${targetComplaint.id}-${newAssigneeUserId}`);

    if (targetComplaint.status === 'CLOSED' || targetComplaint.status === 'CANCELLED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: 'Cannot reassign closed or cancelled complaint' };
    }

    const newAssignee = await this.validateAssigneeEligibility(newAssigneeUserId, targetComplaint);
    if (!newAssignee.valid) {
      return { success: false, errorCode: newAssignee.errorCode, errorMessage: newAssignee.errorMessage };
    }

    const previousAssigneeUserId = targetComplaint.assignedToUserId;
    const previousAssigneeDisplayName = targetComplaint.assignedToDisplayName;

    const now = new Date().toISOString();
    const newAssigneeDisplayName = newAssignee.assignee?.displayName || 'Technician';

    mockStore.updateComplaint(targetComplaint.id, {
      assignedToUserId: newAssigneeUserId,
      assignedToDisplayName: newAssigneeDisplayName,
      assignedAt: now,
      updatedAt: now,
    });

    const assignments = mockStore.getState().complaintAssignments || [];
    const previousAssignmentIndex = assignments.findIndex(a => a.complaintId === complaint.id && a.assignedToUserId === previousAssigneeUserId);

    let previousAssignment: ComplaintAssignment | undefined;

    if (previousAssignmentIndex !== -1 && assignments[previousAssignmentIndex]) {
      previousAssignment = {
        ...assignments[previousAssignmentIndex],
        rejectedAt: now,
        rejectionReason: 'Reassigned',
      };
      assignments[previousAssignmentIndex] = previousAssignment;
    }

    const newAssignment: ComplaintAssignment = {
      id: `assign_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      complaintId: complaint.id,
      assignedToUserId: newAssigneeUserId,
      assignedToDisplayName: newAssigneeDisplayName,
      assignedByUserId: reassignedByUserId,
      assignedByDisplayName: reassignedByDisplayName,
      assignedAt: now,
      ruleUsed: 'MANUAL',
      metadata: { reassignmentReason: reason, ...(previousAssigneeUserId ? { previousAssigneeUserId } : {}) },
      ...(complaint.societyId ? { societyId: complaint.societyId } : {}),
    };

    mockStore.getState().complaintAssignments = [...(assignments || []), newAssignment];
    mockStore.notify();

    await createAuditEntry({
      actorUserId: reassignedByUserId,
      actorType: 'ADMIN',
      societyId: complaint.societyId || '',
      action: 'COMPLAINT_REASSIGNED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: {
        ...(previousAssigneeUserId ? { assignedToUserId: previousAssigneeUserId } : {}),
        ...(previousAssigneeDisplayName ? { assignedToDisplayName: previousAssigneeDisplayName } : {}),
      },
      newState: { assignedToUserId: newAssigneeUserId, assignedToDisplayName: newAssigneeDisplayName, reason },
      idempotencyKey: key,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return {
      success: true,
      ...(previousAssignment ? { previousAssignment } : {}),
      newAssignment,
    };
  }

  async escalateComplaint(
    complaint: Complaint,
    toLevel: EscalationLevel,
    escalatedByUserId: string,
    escalatedByDisplayName: string,
    reason: EscalationReason,
    idempotencyKey?: string
  ): Promise<{ success: boolean; errorCode?: string | Absent; errorMessage?: string | Absent }> {
    const key = idempotencyKey || createIdempotencyKey(`escalate-${complaint.id}-${toLevel}`);

    const escalationLevels: EscalationLevel[] = ['TECHNICIAN', 'SUPERVISOR', 'HELPDESK_ADMIN', 'FACILITY_ADMIN', 'SOCIETY_ADMIN'];
    const currentIndex = complaint.escalationLevel ? escalationLevels.indexOf(complaint.escalationLevel) : -1;
    const targetIndex = escalationLevels.indexOf(toLevel);

    if (targetIndex <= currentIndex) {
      return { success: false, errorCode: 'INVALID_ESCALATION', errorMessage: 'Target escalation level must be higher than current' };
    }

    const now = new Date().toISOString();

    mockStore.updateComplaint(complaint.id, {
      status: 'ESCALATED',
      escalationLevel: toLevel,
      escalatedAt: now,
      escalatedBy: escalatedByUserId || 'current-user',
      escalationReason: reason || 'SLA_BREACH',
      updatedAt: now,
    });

    await createAuditEntry({
      actorUserId: escalatedByUserId || 'SYSTEM',
      actorType: 'SYSTEM',
      societyId: complaint.societyId || '',
      action: 'COMPLAINT_ESCALATED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: { escalationLevel: complaint.escalationLevel },
      newState: { escalationLevel: toLevel, reason: reason || 'SLA_BREACH' },
      idempotencyKey: key,
      source: 'SYSTEM_JOB',
      outcome: 'SUCCESS',
    });

    return { success: true };
  }

  async autoAssignByRule(
    complaint: Complaint,
    rule: AssignmentRule,
    idempotencyKey?: string
  ): Promise<AssignmentResult> {
    const eligibleAssignees = await this.getEligibleAssignees(complaint);
    if (eligibleAssignees.length === 0) {
      return { success: false, errorCode: 'NO_ELIGIBLE_ASSIGNEE', errorMessage: 'No eligible assignee found for auto-assignment' };
    }

    let selectedAssignee: EligibleAssignee = eligibleAssignees[0]!;

    switch (rule) {
      case 'ROUND_ROBIN': {
        const picked = eligibleAssignees[Math.floor(Math.random() * eligibleAssignees.length)];
        if (picked) selectedAssignee = picked;
        break;
      }
      case 'SKILL_BASED':
        selectedAssignee = eligibleAssignees.reduce((best, current) =>
          current.skills.length > best.skills.length ? current : best
        );
        break;
      case 'WORKLOAD_BASED':
        selectedAssignee = eligibleAssignees.reduce((best, current) =>
          current.currentWorkload < best.currentWorkload ? current : best
        );
        break;
      case 'LOCATION_BASED':
        selectedAssignee = eligibleAssignees.find(a => a.skills.includes('LOCAL')) || eligibleAssignees[0]!;
        break;
      case 'CATEGORY_BASED':
        selectedAssignee = eligibleAssignees.find(a => a.skills.includes('CATEGORY')) || eligibleAssignees[0]!;
        break;
      default:
        selectedAssignee = eligibleAssignees[0]!;
    }

    return this.assignComplaint(
      complaint,
      selectedAssignee.userId,
      'SYSTEM_AUTO',
      'System Auto-Assignment',
      'CATEGORY_BASED',
      idempotencyKey
    );
  }

  async validateAssigneeEligibility(userId: string, complaint: Complaint): Promise<{ valid: boolean; errorCode?: string | Absent; errorMessage?: string | Absent; assignee?: EligibleAssignee | Absent }> {
    const staff = mockStore.getState().staff || [];
    const staffMember = staff.find(s => s.id === userId);

    if (!staffMember) {
      return { valid: false, errorCode: 'ASSIGNEE_NOT_FOUND', errorMessage: 'Assignee not found' };
    }

    if (staffMember.status !== 'ACTIVE' && (staffMember as any).isActive !== true) {
      return { valid: false, errorCode: 'ASSIGNEE_INACTIVE', errorMessage: 'Assignee is not active' };
    }

    if (complaint.societyId && staffMember.societyId && staffMember.societyId !== complaint.societyId) {
      return { valid: false, errorCode: 'CROSS_SOCIETY', errorMessage: 'Assignee belongs to different society' };
    }

    const technicianRoles = ['TECHNICIAN', 'FACILITY_MANAGER', 'SUPERVISOR', 'VENDOR_USER'];
    const role = (staffMember as any).role || staffMember.designation || 'TECHNICIAN';
    if (!technicianRoles.includes(role)) {
      return { valid: false, errorCode: 'INVALID_ROLE', errorMessage: 'User is not a valid technician/assignee role' };
    }

    return {
      valid: true,
      assignee: {
        userId: staffMember.id,
        displayName: staffMember.name,
        role,
        skills: (staffMember as any).skills || [],
        currentWorkload: (staffMember as any).currentWorkload || 0,
        maxWorkload: (staffMember as any).maxWorkload || 10,
        isAvailable: ((staffMember as any).currentWorkload || 0) < ((staffMember as any).maxWorkload || 10),
        ...((staffMember as any).shiftEndsAt ? { shiftEndsAt: (staffMember as any).shiftEndsAt } : {}),
      },
    };
  }

  async getEligibleAssignees(complaint: Complaint): Promise<EligibleAssignee[]> {
    const staff = mockStore.getState().staff || [];
    const technicians = staff.filter(s =>
      (!complaint.societyId || s.societyId === complaint.societyId) &&
      (s.status === 'ACTIVE' || (s as any).isActive === true) &&
      ['TECHNICIAN', 'FACILITY_MANAGER', 'SUPERVISOR', 'VENDOR_USER'].includes((s as any).role || s.designation)
    );

    return technicians.map(t => ({
      userId: t.id,
      displayName: t.name,
      role: (t as any).role || t.designation || 'TECHNICIAN',
      skills: (t as any).skills || [],
      currentWorkload: (t as any).currentWorkload || 0,
      maxWorkload: (t as any).maxWorkload || 10,
      isAvailable: ((t as any).currentWorkload || 0) < ((t as any).maxWorkload || 10),
      ...((t as any).shiftEndsAt ? { shiftEndsAt: (t as any).shiftEndsAt } : {}),
    })).filter(a => a.isAvailable);
  }
}

export const assignmentService = AssignmentService.getInstance();
