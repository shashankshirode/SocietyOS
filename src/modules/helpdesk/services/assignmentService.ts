import type {
  Complaint,
  ComplaintAssignment,
  AssignmentRule,
  EscalationLevel,
  EscalationReason,
  ComplaintStatus,
} from '../../../shared/types/complaintPhase6';
import { mockStore } from '../../../core/mockStore/mockStore';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { gateIdempotencyService } from '../../guard/services/gateIdempotencyService';

export interface AssignmentResult {
  success: boolean;
  assignment?: ComplaintAssignment;
  errorCode?: string;
  errorMessage?: string;
}

export interface AcknowledgmentResult {
  success: boolean;
  acknowledgedAt?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface ReassignmentResult {
  success: boolean;
  previousAssignment?: ComplaintAssignment;
  newAssignment?: ComplaintAssignment;
  errorCode?: string;
  errorMessage?: string;
}

export interface EligibleAssignee {
  userId: string;
  displayName: string;
  role: string;
  skills: string[];
  currentWorkload: number;
  maxWorkload: number;
  isAvailable: boolean;
  shiftEndsAt?: string;
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

    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, complaint.societyId);
    if (idempotencyResult.exists) {
      return { success: true, assignment: idempotencyResult.record?.assignment };
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
      assignedAt: new Date().toISOString(),
      acknowledgedAt: undefined,
      rejectedAt: undefined,
      rejectionReason: undefined,
      ruleUsed,
      metadata: {},
      societyId: targetComplaint.societyId,
      createdAt: now,
      updatedAt: now,
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

    await gateIdempotencyService.completeIdempotency(key, targetComplaint.societyId, assignment.id, { assignment });

    await createAuditEntry({
      actorUserId: assignedByUserId,
      actorType: 'ADMIN',
      societyId: targetComplaint.societyId,
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

    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, targetComplaint.societyId);
    if (idempotencyResult.exists) {
      return { success: true, acknowledgedAt: idempotencyResult.record?.acknowledgedAt };
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

    if (assignmentIndex !== -1) {
      assignments[assignmentIndex] = {
        ...assignments[assignmentIndex],
        acknowledgedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    mockStore.updateComplaint(complaint.id, {
      status: 'ACKNOWLEDGED',
      acknowledgedAt: new Date().toISOString(),
      updatedAt: now,
    });

    await gateIdempotencyService.completeIdempotency(key, complaint.societyId, 'acknowledged', { acknowledgedAt: now });

    await createAuditEntry({
      actorUserId: technicianUserId,
      actorType: 'TECHNICIAN',
      societyId: complaint.societyId,
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
  ): Promise<{ success: boolean; workStartedAt?: string; errorCode?: string; errorMessage?: string }> {
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
      societyId: targetComplaint.societyId,
      action: 'COMPLAINT_WORK_STARTED',
      entityType: 'Complaint',
      entityId: targetComplaint.id,
      previousState: { status: 'ACKNOWLEDGED' },
      newState: { status: 'IN_PROGRESS', workStartedAt: now, note: workNote },
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
      assignedAt: new Date().toISOString(),
      acknowledgedAt: undefined,
      updatedAt: now,
    });

    const assignments = mockStore.getState().complaintAssignments || [];
    const previousAssignmentIndex = assignments.findIndex(a => a.complaintId === complaint.id && a.assignedToUserId === previousAssigneeUserId);

    let previousAssignment: ComplaintAssignment | undefined;

    if (previousAssignmentIndex !== -1) {
      previousAssignment = { ...assignments[previousAssignmentIndex], rejectedAt: new Date().toISOString(), rejectionReason: 'Reassigned', isActive: false };
      assignments[previousAssignmentIndex] = previousAssignment;
    }

    const newAssignment: ComplaintAssignment = {
      id: `assign_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      complaintId: complaint.id,
      assignedToUserId: newAssigneeUserId,
      assignedToDisplayName: newAssigneeDisplayName,
      assignedByUserId: reassignedByUserId,
      assignedByDisplayName,
      assignedAt: new Date().toISOString(),
      acknowledgedAt: undefined,
      rejectedAt: undefined,
      rejectionReason: undefined,
      ruleUsed: 'MANUAL',
      metadata: { reassignmentReason: reason, previousAssigneeUserId },
      societyId: complaint.societyId,
      createdAt: now,
      updatedAt: now,
    };

    mockStore.getState().complaintAssignments = [...(assignments || []), newAssignment];
    mockStore.notify();

    await createAuditEntry({
      actorUserId: reassignedByUserId,
      actorType: 'ADMIN',
      societyId: complaint.societyId,
      action: 'COMPLAINT_REASSIGNED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: { assignedToUserId: previousAssigneeUserId, assignedToDisplayName: previousAssigneeDisplayName },
      newState: { assignedToUserId: newAssigneeUserId, assignedToDisplayName: newAssignee.displayName, reason },
      idempotencyKey: key,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, previousAssignment, newAssignment };
  }

  async escalateComplaint(
    complaint: Complaint,
    toLevel: EscalationLevel,
    escalatedByUserId: string,
    escalatedByDisplayName: string,
    reason: EscalationReason,
    idempotencyKey?: string
  ): Promise<{ success: boolean; errorCode?: string; errorMessage?: string }> {
    const key = idempotencyKey || createIdempotencyKey(`escalate-${complaint.id}-${toLevel}`);

    const escalationLevels: EscalationLevel[] = ['TECHNICIAN', 'SUPERVISOR', 'HELPDESK_ADMIN', 'FACILITY_ADMIN', 'SOCIETY_ADMIN'];
    const currentIndex = escalationLevels.indexOf(complaint.escalationLevel);
    const targetIndex = escalationLevels.indexOf(toLevel);

    if (targetIndex <= currentIndex) {
      return { success: false, errorCode: 'INVALID_ESCALATION', errorMessage: 'Target escalation level must be higher than current' };
    }

    const now = new Date().toISOString();

    mockStore.updateComplaint(complaint.id, {
      status: 'ESCALATED',
      escalationLevel: toLevel,
      escalatedAt: new Date().toISOString(),
      escalatedBy: 'current-user',
      escalationReason: 'SLA_BREACH',
      updatedAt: now,
    });

    await createAuditEntry({
      actorUserId: 'SYSTEM',
      actorType: 'SYSTEM',
      societyId: complaint.societyId,
      action: 'COMPLAINT_ESCALATED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: { escalationLevel: complaint.escalationLevel },
      newState: { escalationLevel: toLevel, reason: 'SLA_BREACH' },
      idempotencyKey: key,
      source: 'SYSTEM',
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

    let selectedAssignee: EligibleAssignee;

    switch (rule) {
      case 'ROUND_ROBIN':
        selectedAssignee = eligibleAssignees[Math.floor(Math.random() * eligibleAssignees.length)];
        break;
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
        selectedAssignee = eligibleAssignees.find(a => a.skills.includes('LOCAL')) || eligibleAssignees[0];
        break;
      case 'CATEGORY_BASED':
        selectedAssignee = eligibleAssignees.find(a => a.skills.includes('CATEGORY')) || eligibleAssignees[0];
        break;
      default:
        selectedAssignee = eligibleAssignees[0];
    }

    return this.assignComplaint(complaint, selectedAssignee.userId, 'SYSTEM_AUTO', 'System Auto-Assignment', 'CATEGORY_BASED');
  }

  async validateAssigneeEligibility(userId: string, complaint: Complaint): Promise<{ valid: boolean; errorCode?: string; errorMessage?: string; assignee?: EligibleAssignee }> {
    const staff = mockStore.getState().staff || [];
    const staffMember = staff.find(s => s.id === userId);

    if (!staffMember) {
      return { valid: false, errorCode: 'ASSIGNEE_NOT_FOUND', errorMessage: 'Assignee not found' };
    }

    if (staffMember.status !== 'ACTIVE') {
      return { valid: false, errorCode: 'ASSIGNEE_INACTIVE', errorMessage: 'Assignee is not active' };
    }

    if (staffMember.societyId !== complaint.societyId) {
      return { valid: false, errorCode: 'CROSS_SOCIETY', errorMessage: 'Assignee belongs to different society' };
    }

    const technicianRoles = ['TECHNICIAN', 'FACILITY_MANAGER', 'SUPERVISOR', 'VENDOR_USER'];
    if (!technicianRoles.includes(staffMember.role)) {
      return { valid: false, errorCode: 'INVALID_ROLE', errorMessage: 'User is not a valid technician/assignee role' };
    }

    return {
      valid: true,
      assignee: {
        userId: staffMember.id,
        displayName: staffMember.name,
        role: staffMember.role,
        skills: staffMember.skills || [],
        currentWorkload: staffMember.currentWorkload || 0,
        maxWorkload: staffMember.maxWorkload || 10,
        isAvailable: (staffMember.currentWorkload || 0) < (staffMember.maxWorkload || 10),
        shiftEndsAt: staffMember.shiftEndsAt,
      },
    };
  }

  async getEligibleAssignees(complaint: Complaint): Promise<EligibleAssignee[]> {
    const staff = mockStore.getState().staff || [];
    const technicians = staff.filter(s =>
      s.societyId === complaint.societyId &&
      s.status === 'ACTIVE' &&
      ['TECHNICIAN', 'FACILITY_MANAGER', 'SUPERVISOR', 'VENDOR_USER'].includes(s.role)
    );

    return technicians.map(t => ({
      userId: t.id,
      displayName: t.name,
      role: t.role,
      skills: t.skills || [],
      currentWorkload: t.currentWorkload || 0,
      maxWorkload: t.maxWorkload || 10,
      isAvailable: (t.currentWorkload || 0) < (t.maxWorkload || 10),
      shiftEndsAt: t.shiftEndsAt,
    })).filter(a => a.isAvailable);
  }
}

export const assignmentService = AssignmentService.getInstance();