import type {
  Complaint,
  CreateComplaintPayload,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  ComplaintSubcategory,
  ComplaintVisibility,
  ComplaintComment,
  ComplaintCommentDto,
  ComplaintEvidence,
  ComplaintSlaMetrics,
  ComplaintSearchFilters,
  ComplaintListItem,
  ParentIncident,
  CorrelationCandidate,
  ComplaintAssignment,
  ComplaintHold,
  HoldReason,
  ComplaintEscalation,
  ComplaintResolution,
  ComplaintReopen,
  ComplaintCancellation,
} from '../../../shared/types/complaintPhase6';
import {
  canTransitionComplaintStatus,
  isComplaintStatusResolvable,
} from '../../../shared/types/complaintPhase6';
import { mockStore } from '../../../core/mockStore/mockStore';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { slaEngine } from './slaEngine';
import { assignmentService } from './assignmentService';
import { evidenceService } from './evidenceService';
import { gateIdempotencyService } from '../../guard/services/gateIdempotencyService';

export interface CreateComplaintInput {
  payload: CreateComplaintPayload;
  reporterUserId: string;
  reporterDisplayName: string;
  reporterRole: string;
  unitId?: string;
  unitNumber?: string;
  tower?: string;
  floor?: number;
  societyId: string;
  isPrivate?: boolean;
  idempotencyKey?: string;
}

export interface TransitionResult {
  success: boolean;
  complaint?: Complaint;
  errorCode?: string;
  errorMessage?: string;
}

export interface ResolveComplaintInput {
  complaintId: string;
  resolvedByUserId: string;
  resolvedByDisplayName: string;
  outcome: 'FIXED' | 'WORKAROUND' | 'NO_ACTION_NEEDED' | 'ESCALATED_TO_VENDOR' | 'PARTIAL_FIX' | 'WONT_FIX';
  summary: string;
  evidenceIds: string[];
  requiresConfirmation: boolean;
  confirmationPolicy: 'AUTO_CLOSE_AFTER_PERIOD' | 'REQUIRE_EXPLICIT_CONFIRMATION' | 'SUPERVISOR_REVIEW';
  idempotencyKey?: string;
}

export interface ConfirmResolutionInput {
  complaintId: string;
  confirmedByUserId: string;
  confirmedByDisplayName: string;
  idempotencyKey?: string;
}

export interface ReopenComplaintInput {
  complaintId: string;
  reopenedByUserId: string;
  reopenedByDisplayName: string;
  reason: 'ISSUE_PERSISTS' | 'NEW_ISSUE_SAME_ROOT' | 'INCOMPLETE_FIX' | 'RESIDENT_DISSATISFIED' | 'EVIDENCE_MISSING' | 'OTHER';
  description?: string;
  evidenceIds?: string[];
  slaPolicy: 'RESET' | 'CONTINUE' | 'NEW_SLA' | 'NO_SLA';
  idempotencyKey?: string;
}

export interface CancelComplaintInput {
  complaintId: string;
  cancelledByUserId: string;
  cancelledByDisplayName: string;
  reason: 'RESOLVED_SELF' | 'WRONG_CATEGORY' | 'DUPLICATE' | 'NO_LONGER_NEEDED' | 'PRIVACY_CONCERN' | 'OTHER';
  description?: string;
  idempotencyKey?: string;
}

export interface AddCommentInput {
  complaintId: string;
  authorUserId: string;
  authorDisplayName: string;
  authorRole: string;
  content: string;
  visibility: 'PUBLIC' | 'TECHNICIAN_ONLY' | 'ADMIN_ONLY' | 'RESIDENT_ONLY';
  isSystemGenerated?: boolean;
}

export interface UpdateVisibilityInput {
  complaintId: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED' | 'UNIT_ONLY';
  updatedByUserId: string;
}

export class ComplaintService {
  private static instance: ComplaintService;

  static getInstance(): ComplaintService {
    if (!ComplaintService.instance) {
      ComplaintService.instance = new ComplaintService();
    }
    return ComplaintService.instance;
  }

  async createComplaint(input: CreateComplaintInput): Promise<{ success: boolean; complaint?: Complaint; errorCode?: string; errorMessage?: string }> {
    const key = input.idempotencyKey || createIdempotencyKey(`complaint-create-${input.payload.category}-${input.reporterUserId}-${Date.now()}`);

    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, input.societyId);
    if (idempotencyResult.exists) {
      const payload = idempotencyResult.record?.responsePayload as { complaint?: Complaint } | undefined;
      const existingComplaint = payload?.complaint ||
        mockStore.getState().complaints.find(c => c.id === idempotencyResult.record?.entityId);
      return { success: true, complaint: existingComplaint };
    }

    const slaPolicies = mockStore.getState().slaPolicies || [];
    const slaPolicy = slaPolicies.find(p =>
      p.societyId === input.societyId &&
      p.isActive &&
      (!p.categoryId || p.categoryId === input.payload.category)
    );

    if (!slaPolicy) {
      return { success: false, errorCode: 'SLA_POLICY_NOT_FOUND', errorMessage: 'No active SLA policy found for this category' };
    }

    const slaDeadlines = await slaEngine.calculateSlaDeadlines(
      { createdAt: new Date().toISOString() } as any,
      slaPolicy,
      new Date().toISOString()
    );

    const now = new Date().toISOString();
    const ticketNumber = this.generateTicketNumber(input.societyId);

    const complaint: Complaint = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ticketNumber,
      title: input.payload.title.trim(),
      description: input.payload.description.trim(),
      category: input.payload.category,
      subcategory: input.payload.subcategory,
      priority: input.payload.priority,
      status: 'CREATED',
      visibility: input.isPrivate ? 'PRIVATE' : 'PUBLIC',
      source: 'RESIDENT_APP',
      unitId: input.unitId,
      unitNumber: input.unitNumber,
      tower: input.tower,
      floor: input.floor,
      location: input.payload.location?.trim(),
      reportedByUserId: input.reporterUserId,
      reportedByDisplayName: input.reporterDisplayName,
      reportedByRole: input.reporterRole,
      isPrivate: input.isPrivate,
      isSensitive: false,
      slaPolicyId: slaPolicy.id,
      slaPolicyVersion: slaPolicy.version,
      slaResponseDeadline: slaDeadlines.responseDeadline,
      slaResolutionDeadline: slaDeadlines.resolutionDeadline,
      slaAcknowledgementDeadline: slaDeadlines.acknowledgementDeadline,
      slaIsPaused: false,
      slaPausePolicy: undefined,
      slaPausedAt: undefined,
      slaPauseReason: undefined,
      slaPauseStartedBy: undefined,
      escalationPolicyId: slaPolicy.escalationPolicyId,
      escalationLevel: 'TECHNICIAN',
      assignedToUserId: undefined,
      assignedToDisplayName: undefined,
      assignedAt: undefined,
      acknowledgedAt: undefined,
      workStartedAt: undefined,
      holdReason: undefined,
      holdStartedAt: undefined,
      holdExpectedResumeAt: undefined,
      holdNotes: undefined,
      resolvedAt: undefined,
      resolvedBy: undefined,
      resolutionOutcome: undefined,
      resolutionSummary: undefined,
      resolutionEvidenceIds: [],
      confirmationPolicy: undefined,
      confirmationRequestedAt: undefined,
      confirmedAt: undefined,
      confirmedBy: undefined,
      closedAt: undefined,
      closedBy: undefined,
      reopenedAt: undefined,
      reopenedBy: undefined,
      reopenReason: undefined,
      reopenSlaPolicy: undefined,
      cancelledAt: undefined,
      cancelledBy: undefined,
      cancellationReason: undefined,
      duplicateOfId: undefined,
      parentIncidentId: undefined,
      isParentIncident: false,
      childComplaintIds: [],
      correlationConfidence: undefined,
      correlationRuleId: undefined,
      evidenceIds: [],
      comments: [],
      statusHistory: [],
      createdAt: now,
      updatedAt: now,
      metadata: {},
      dataVersion: 1,
      societyId: input.societyId,
    };

    mockStore.getState().complaints = [...(mockStore.getState().complaints || []), complaint];
    mockStore.notify();

    await gateIdempotencyService.completeIdempotency(key, input.societyId, complaint.id, { complaint });

    await createAuditEntry({
      actorUserId: input.reporterUserId,
      actorType: 'RESIDENT',
      societyId: input.societyId,
      action: 'COMPLAINT_CREATED',
      entityType: 'Complaint',
      entityId: complaint.id,
      newState: { status: 'CREATED', category: input.payload.category, priority: input.payload.priority },
      idempotencyKey: key,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, complaint };
  }

  async transitionStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    changedByUserId: string,
    changedByDisplayName: string,
    changedByRole: string,
    reason?: string,
    automated: boolean = false,
    metadata?: Record<string, unknown>,
    idempotencyKey?: string
  ): Promise<TransitionResult> {
    const key = idempotencyKey || createIdempotencyKey(`transition-${complaintId}-${newStatus}-${Date.now()}`);

    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) {
      return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };
    }

    const complaint = complaints[index];
    const currentStatus = complaint.status;

    if (!canTransitionComplaintStatus(currentStatus, newStatus)) {
      return { success: false, errorCode: 'INVALID_TRANSITION', errorMessage: `Cannot transition from ${currentStatus} to ${newStatus}` };
    }

    const now = new Date().toISOString();
    const updated = { ...complaint, status: newStatus, updatedAt: now, dataVersion: complaint.dataVersion + 1 };

    if (newStatus === 'ACKNOWLEDGED') updated.acknowledgedAt = now;
    if (newStatus === 'IN_PROGRESS') updated.workStartedAt = now;
    if (newStatus === 'RESOLVED') updated.resolvedAt = now;
    if (newStatus === 'CONFIRMED') updated.confirmedAt = now;
    if (newStatus === 'CLOSED') updated.closedAt = now;
    if (newStatus === 'REOPENED') updated.reopenedAt = now;
    if (newStatus === 'ESCALATED') updated.escalatedAt = now;
    if (newStatus === 'CANCELLED') updated.cancelledAt = now;

    mockStore.updateComplaint(complaintId, updated);
    mockStore.notify();

    const historyEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      complaintId,
      fromStatus: currentStatus,
      toStatus: newStatus,
      changedByUserId,
      changedByDisplayName,
      changedByRole,
      reason,
      automated,
      metadata,
      createdAt: now,
      societyId: complaint.societyId,
    };

    mockStore.getState().complaintStatusHistory = [...(mockStore.getState().complaintStatusHistory || []), historyEntry];

    await createAuditEntry({
      actorUserId: changedByUserId,
      actorType: changedByRole === 'RESIDENT' ? 'RESIDENT' : changedByRole === 'TECHNICIAN' ? 'TECHNICIAN' : 'ADMIN',
      societyId: complaint.societyId,
      action: `COMPLAINT_STATUS_${newStatus}`,
      entityType: 'Complaint',
      entityId: complaintId,
      previousState: { status: currentStatus },
      newState: { status: newStatus },
      idempotencyKey: createIdempotencyKey(`status-${complaintId}-${newStatus}`),
      source: changedByRole === 'TECHNICIAN' ? 'GATE_DEVICE' : 'MOBILE',
      outcome: 'SUCCESS',
      reason,
      metadata: { automated },
    });

    if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
      await this.checkAndUpdateParentIncident(complaint.id);
    }

    return { success: true, complaint: mockStore.getState().complaints?.find(c => c.id === complaintId) };
  }

  async classifyComplaint(input: {
    complaintId: string;
    category: ComplaintCategory;
    subcategory?: ComplaintSubcategory;
    priority?: ComplaintPriority;
    classifiedByUserId: string;
    classifiedByDisplayName: string;
    classifiedByRole?: string;
    reason?: string;
    societyId?: string;
    idempotencyKey?: string;
  }): Promise<TransitionResult> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === input.complaintId);
    if (index === -1) {
      return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };
    }

    const complaint = complaints[index];
    if (input.societyId && complaint.societyId !== input.societyId) {
      return { success: false, errorCode: 'FORBIDDEN_SOCIETY_MISMATCH', errorMessage: 'Cross-society operation denied' };
    }

    const prevCategory = complaint.category;
    const prevPriority = complaint.priority;
    const now = new Date().toISOString();
    const isReclassification = complaint.status !== 'CREATED' && prevCategory !== input.category;
    const priority = input.priority || complaint.priority;

    let updatedDeadlines = {
      responseDeadline: complaint.slaResponseDeadline,
      resolutionDeadline: complaint.slaResolutionDeadline,
      acknowledgementDeadline: complaint.slaAcknowledgementDeadline,
    };

    const slaPolicies = mockStore.getState().slaPolicies || [];
    const slaPolicy = slaPolicies.find(p =>
      p.societyId === complaint.societyId &&
      p.isActive &&
      (!p.categoryId || p.categoryId === input.category)
    );

    if (slaPolicy) {
      const recalculated = await slaEngine.calculateSlaDeadlines(
        { createdAt: complaint.createdAt, priority } as any,
        slaPolicy,
        now
      );
      updatedDeadlines = recalculated;
    }

    const updated: Complaint = {
      ...complaint,
      category: input.category,
      subcategory: input.subcategory || complaint.subcategory,
      priority,
      status: 'CLASSIFIED',
      slaResponseDeadline: updatedDeadlines.responseDeadline,
      slaResolutionDeadline: updatedDeadlines.resolutionDeadline,
      slaAcknowledgementDeadline: updatedDeadlines.acknowledgementDeadline,
      slaPolicyId: slaPolicy?.id || complaint.slaPolicyId,
      slaPolicyVersion: slaPolicy?.version || complaint.slaPolicyVersion,
      updatedAt: now,
      dataVersion: complaint.dataVersion + 1,
    };

    mockStore.updateComplaint(complaint.id, updated);
    mockStore.notify();

    await createAuditEntry({
      actorUserId: input.classifiedByUserId,
      actorType: 'ADMIN',
      societyId: complaint.societyId,
      action: isReclassification ? 'COMPLAINT_RECLASSIFIED' : 'COMPLAINT_CLASSIFIED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: { category: prevCategory, priority: prevPriority },
      newState: { category: input.category, priority, status: 'CLASSIFIED' },
      reason: input.reason,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, complaint: updated };
  }

  async startComplaintWork(input: {
    complaintId: string;
    actorUserId: string;
    actorDisplayName: string;
    actorRole?: string;
    workNote?: string;
    societyId?: string;
  }): Promise<TransitionResult> {
    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === input.complaintId);
    if (!complaint) return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };

    if (input.societyId && complaint.societyId !== input.societyId) {
      return { success: false, errorCode: 'FORBIDDEN_SOCIETY_MISMATCH', errorMessage: 'Cross-society operation denied' };
    }

    if (complaint.status !== 'ACKNOWLEDGED' && complaint.status !== 'ASSIGNED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: `Cannot start work from status ${complaint.status}` };
    }

    const now = new Date().toISOString();
    return this.transitionStatus(
      input.complaintId,
      'IN_PROGRESS',
      input.actorUserId,
      input.actorDisplayName,
      input.actorRole || 'TECHNICIAN',
      input.workNote || 'Technician started work',
      false,
      { workStartedAt: now }
    );
  }

  async placeComplaintOnHold(input: {
    complaintId: string;
    holdReason: HoldReason;
    actorUserId: string;
    actorDisplayName: string;
    actorRole: string;
    notes?: string;
    expectedResumeAt?: string;
    societyId?: string;
    idempotencyKey?: string;
  }): Promise<TransitionResult> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === input.complaintId);
    if (index === -1) {
      return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };
    }

    const complaint = complaints[index];
    if (input.societyId && complaint.societyId !== input.societyId) {
      return { success: false, errorCode: 'FORBIDDEN_SOCIETY_MISMATCH', errorMessage: 'Cross-society operation denied' };
    }

    if (complaint.status !== 'IN_PROGRESS' && complaint.status !== 'ACKNOWLEDGED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: `Cannot place hold on complaint in status: ${complaint.status}` };
    }

    const now = new Date().toISOString();
    const pausePolicy = slaEngine.getSlaPausePolicyForHoldReason(input.holdReason);
    let paused = false;

    if (pausePolicy !== 'NO_PAUSE') {
      const pauseResult = await slaEngine.pauseSlaForHoldReason(complaint, input.holdReason, input.actorUserId);
      paused = pauseResult.paused;
    }

    const holdRecord: ComplaintHold = {
      id: `hold_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      complaintId: complaint.id,
      reason: input.holdReason,
      notes: input.notes,
      expectedResumeAt: input.expectedResumeAt,
      holdStartedAt: now,
      holdStartedByUserId: input.actorUserId,
      holdStartedByDisplayName: input.actorDisplayName,
      pausePolicy,
      createdAt: now,
      updatedAt: now,
    };

    mockStore.getState().complaintHolds = [...(mockStore.getState().complaintHolds || []), holdRecord];

    const updated: Complaint = {
      ...complaint,
      status: 'HOLD',
      holdReason: input.holdReason,
      holdStartedAt: now,
      holdExpectedResumeAt: input.expectedResumeAt,
      holdNotes: input.notes,
      slaIsPaused: paused,
      slaPausedAt: paused ? now : undefined,
      slaPauseReason: paused ? input.holdReason : undefined,
      slaPausePolicy: pausePolicy,
      updatedAt: now,
      dataVersion: complaint.dataVersion + 1,
    };

    mockStore.updateComplaint(complaint.id, updated);
    mockStore.notify();

    await createAuditEntry({
      actorUserId: input.actorUserId,
      actorType: input.actorRole === 'TECHNICIAN' ? 'TECHNICIAN' : 'ADMIN',
      societyId: complaint.societyId,
      action: 'COMPLAINT_HOLD_STARTED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: { status: complaint.status },
      newState: { status: 'HOLD', holdReason: input.holdReason, slaIsPaused: paused },
      reason: input.notes || input.holdReason,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, complaint: updated };
  }

  async placeComplaintOnWait(input: {
    complaintId: string;
    waitReason: string;
    actorUserId: string;
    actorDisplayName: string;
    actorRole: string;
    notes?: string;
    societyId?: string;
    idempotencyKey?: string;
  }): Promise<TransitionResult> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === input.complaintId);
    if (index === -1) {
      return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };
    }

    const complaint = complaints[index];
    if (input.societyId && complaint.societyId !== input.societyId) {
      return { success: false, errorCode: 'FORBIDDEN_SOCIETY_MISMATCH', errorMessage: 'Cross-society operation denied' };
    }

    if (complaint.status !== 'IN_PROGRESS' && complaint.status !== 'ACKNOWLEDGED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: `Cannot place on wait from status: ${complaint.status}` };
    }

    const now = new Date().toISOString();
    const updated: Complaint = {
      ...complaint,
      status: 'WAITING',
      updatedAt: now,
      dataVersion: complaint.dataVersion + 1,
    };

    mockStore.updateComplaint(complaint.id, updated);
    mockStore.notify();

    await createAuditEntry({
      actorUserId: input.actorUserId,
      actorType: input.actorRole === 'TECHNICIAN' ? 'TECHNICIAN' : 'ADMIN',
      societyId: complaint.societyId,
      action: 'COMPLAINT_WAIT_STARTED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: { status: complaint.status },
      newState: { status: 'WAITING', reason: input.waitReason },
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, complaint: updated };
  }

  async resumeComplaint(input: {
    complaintId: string;
    actorUserId: string;
    actorDisplayName: string;
    actorRole: string;
    resumeNotes?: string;
    societyId?: string;
    idempotencyKey?: string;
  }): Promise<TransitionResult> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === input.complaintId);
    if (index === -1) {
      return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };
    }

    const complaint = complaints[index];
    if (input.societyId && complaint.societyId !== input.societyId) {
      return { success: false, errorCode: 'FORBIDDEN_SOCIETY_MISMATCH', errorMessage: 'Cross-society operation denied' };
    }

    if (complaint.status !== 'HOLD' && complaint.status !== 'WAITING') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: `Can only resume from HOLD or WAITING, current status: ${complaint.status}` };
    }

    const now = new Date().toISOString();

    if (complaint.slaIsPaused) {
      await slaEngine.resumeSla(complaint);
    }

    const updated: Complaint = {
      ...complaint,
      status: 'IN_PROGRESS',
      slaIsPaused: false,
      slaPausedAt: undefined,
      slaPauseReason: undefined,
      holdReason: undefined,
      holdStartedAt: undefined,
      holdExpectedResumeAt: undefined,
      holdNotes: undefined,
      updatedAt: now,
      dataVersion: complaint.dataVersion + 1,
    };

    mockStore.updateComplaint(complaint.id, updated);
    mockStore.notify();

    await createAuditEntry({
      actorUserId: input.actorUserId,
      actorType: input.actorRole === 'TECHNICIAN' ? 'TECHNICIAN' : 'ADMIN',
      societyId: complaint.societyId,
      action: 'COMPLAINT_RESUMED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: { status: complaint.status },
      newState: { status: 'IN_PROGRESS' },
      reason: input.resumeNotes,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, complaint: updated };
  }

  async closeComplaint(input: {
    complaintId: string;
    closedByUserId: string;
    closedByDisplayName: string;
    closedByRole?: string;
    closeReason?: string;
    societyId?: string;
    idempotencyKey?: string;
  }): Promise<TransitionResult> {
    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === input.complaintId);
    if (!complaint) return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };

    if (input.societyId && complaint.societyId !== input.societyId) {
      return { success: false, errorCode: 'FORBIDDEN_SOCIETY_MISMATCH', errorMessage: 'Cross-society operation denied' };
    }

    if (complaint.status !== 'RESOLVED' && complaint.status !== 'CONFIRMED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: `Cannot close complaint in status ${complaint.status}. Must be RESOLVED or CONFIRMED.` };
    }

    return this.transitionStatus(
      input.complaintId,
      'CLOSED',
      input.closedByUserId,
      input.closedByDisplayName,
      input.closedByRole || 'ADMIN',
      input.closeReason || 'Closed after resolution review',
      false,
      {}
    );
  }

  async submitFeedback(input: {
    complaintId: string;
    residentUserId: string;
    rating: number;
    comment?: string;
    societyId?: string;
    idempotencyKey?: string;
  }): Promise<{ success: boolean; errorCode?: string; errorMessage?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === input.complaintId);
    if (!complaint) return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };

    if (input.societyId && complaint.societyId !== input.societyId) {
      return { success: false, errorCode: 'FORBIDDEN_SOCIETY_MISMATCH', errorMessage: 'Cross-society operation denied' };
    }

    if (complaint.reportedByUserId !== input.residentUserId) {
      return { success: false, errorCode: 'UNAUTHORIZED', errorMessage: 'Only the complaint reporter can submit feedback' };
    }

    if (!['RESOLVED', 'CONFIRMED', 'CLOSED'].includes(complaint.status)) {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: 'Feedback can only be submitted for resolved or closed complaints' };
    }

    if (input.rating < 1 || input.rating > 5) {
      return { success: false, errorCode: 'INVALID_RATING', errorMessage: 'Rating must be between 1 and 5' };
    }

    const feedbacks = mockStore.getState().complaintFeedback || [];
    const existing = feedbacks.find(f => f.complaintId === input.complaintId);
    if (existing) {
      return { success: false, errorCode: 'ALREADY_SUBMITTED', errorMessage: 'Feedback has already been submitted for this complaint' };
    }

    const now = new Date().toISOString();
    const feedbackRecord = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      complaintId: input.complaintId,
      submittedByUserId: input.residentUserId,
      rating: input.rating,
      comment: input.comment,
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    mockStore.getState().complaintFeedback = [...feedbacks, feedbackRecord];
    mockStore.notify();

    await createAuditEntry({
      actorUserId: input.residentUserId,
      actorType: 'RESIDENT',
      societyId: complaint.societyId,
      action: 'FEEDBACK_SUBMITTED',
      entityType: 'Complaint',
      entityId: complaint.id,
      newState: { rating: input.rating },
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true };
  }

  async resolveComplaint(input: ResolveComplaintInput): Promise<TransitionResult> {
    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === input.complaintId);
    if (!complaint) return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };

    if (!isComplaintStatusResolvable(complaint.status)) {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: 'Complaint cannot be resolved in current status' };
    }

    if (input.requiresConfirmation && (!input.evidenceIds || input.evidenceIds.length === 0)) {
      return { success: false, errorCode: 'RESOLUTION_EVIDENCE_REQUIRED', errorMessage: 'Resolution evidence is required' };
    }

    const now = new Date().toISOString();
    const resolutionId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const resolution = {
      id: resolutionId,
      complaintId: input.complaintId,
      resolvedByUserId: input.resolvedByUserId,
      resolvedByDisplayName: input.resolvedByDisplayName,
      resolvedAt: new Date().toISOString(),
      outcome: input.outcome,
      summary: input.summary,
      evidenceIds: input.evidenceIds,
      requiresConfirmation: input.requiresConfirmation,
      confirmationPolicy: input.confirmationPolicy,
      metadata: {},
    };

    mockStore.getState().complaintResolutions = [...(mockStore.getState().complaintResolutions || []), resolution];

    const transitionResult = await this.transitionStatus(
      input.complaintId,
      'RESOLVED',
      input.resolvedByUserId,
      input.resolvedByDisplayName,
      'TECHNICIAN',
      `Resolved: ${input.outcome} - ${input.summary}`,
      false,
      { resolutionId },
    );

    if (transitionResult.success) {
      if (input.requiresConfirmation) {
        const updatedComplaint = mockStore.getState().complaints?.find(c => c.id === input.complaintId);
        if (updatedComplaint) {
          updatedComplaint.confirmationPolicy = input.confirmationPolicy;
          updatedComplaint.confirmationRequestedAt = new Date().toISOString();
          updatedComplaint.updatedAt = new Date().toISOString();
        }
      } else if (input.confirmationPolicy === 'AUTO_CLOSE_AFTER_PERIOD') {
        setTimeout(() => {
          this.confirmResolution({ complaintId: input.complaintId, confirmedByUserId: 'SYSTEM', confirmedByDisplayName: 'System Auto-Close' });
        }, 24 * 60 * 60 * 1000);
      }
    }

    return transitionResult;
  }

  async confirmResolution(input: ConfirmResolutionInput): Promise<TransitionResult> {
    return this.transitionStatus(
      input.complaintId,
      'CONFIRMED',
      input.confirmedByUserId,
      input.confirmedByDisplayName,
      'RESIDENT',
      'Resolution confirmed by resident',
      false,
      {},
    );
  }

  async reopenComplaint(input: ReopenComplaintInput): Promise<TransitionResult> {
    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === input.complaintId);
    if (!complaint) return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };

    if (complaint.status !== 'CLOSED' && complaint.status !== 'CONFIRMED' && complaint.status !== 'RESOLVED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: 'Can only reopen RESOLVED, CONFIRMED, or CLOSED complaints' };
    }

    const now = new Date().toISOString();
    let newStatus: ComplaintStatus = 'REOPENED';
    if (['RESET', 'NEW_SLA'].includes(input.slaPolicy)) {
      newStatus = 'CREATED';
    }

    const reopenId = `reopen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const reopenRecord = {
      id: `reopen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      complaintId: input.complaintId,
      reopenedByUserId: input.reopenedByUserId,
      reopenedByDisplayName: input.reopenedByDisplayName,
      reopenedAt: now,
      reason: input.reason,
      description: input.description,
      evidenceIds: input.evidenceIds,
      slaPolicy: input.slaPolicy,
      previousResolutionId: complaint.resolvedAt ? `res_${complaint.resolvedAt}` : undefined,
      metadata: {},
    };

    mockStore.getState().complaintReopens = [...(mockStore.getState().complaintReopens || []), reopenRecord];

    const updated = {
      ...complaint,
      status: newStatus,
      reopenedAt: now,
      reopenedBy: input.reopenedByUserId,
      reopenedByDisplayName: input.reopenedByDisplayName,
      reopenReason: input.reason,
      reopenSlaPolicy: input.slaPolicy,
      updatedAt: now,
      dataVersion: 1,
      status: newStatus,
    };

    if (['RESET', 'NEW_SLA'].includes(input.slaPolicy)) {
      updated.assignedToUserId = undefined;
      updated.assignedToDisplayName = undefined;
      updated.assignedAt = undefined;
      updated.acknowledgedAt = undefined;
      updated.workStartedAt = undefined;
      updated.resolvedAt = undefined;
      updated.resolvedBy = undefined;
      updated.resolutionOutcome = undefined;
      updated.resolutionSummary = undefined;
      updated.resolutionEvidenceIds = undefined;
      updated.confirmationPolicy = undefined;
      updated.confirmationRequestedAt = undefined;
      updated.confirmedAt = undefined;
      updated.confirmedBy = undefined;
      updated.closedAt = undefined;
      updated.closedBy = undefined;
    }

    mockStore.updateComplaint(input.complaintId, updated);
    mockStore.notify();

    await createAuditEntry({
      actorUserId: input.reopenedByUserId,
      actorType: 'RESIDENT',
      societyId: complaint.societyId,
      action: 'COMPLAINT_REOPENED',
      entityType: 'Complaint',
      entityId: input.complaintId,
      previousState: { status: complaint.status },
      newState: { status: newStatus, reason: input.reason, slaPolicy: input.slaPolicy },
      idempotencyKey: createIdempotencyKey(`reopen-${input.complaintId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, complaint: mockStore.getState().complaints?.find(c => c.id === input.complaintId) };
  }

  async cancelComplaint(input: CancelComplaintInput): Promise<TransitionResult> {
    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === input.complaintId);
    if (!complaint) return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };

    if (!['CREATED', 'CLASSIFIED', 'PENDING_ASSIGNMENT'].includes(complaint.status)) {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: `Cannot cancel complaint in status: ${complaint.status}` };
    }

    const now = new Date().toISOString();
    const cancellationId = `cancel_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const cancellationRecord = {
      id: cancellationId,
      complaintId: input.complaintId,
      cancelledByUserId: input.cancelledByUserId,
      cancelledByDisplayName: input.cancelledByDisplayName,
      cancelledAt: now,
      reason: input.reason,
      description: input.description,
      metadata: {},
    };

    mockStore.getState().complaintCancellations = [...(mockStore.getState().complaintCancellations || []), cancellationRecord];

    const transitionResult = await this.transitionStatus(
      input.complaintId,
      'CANCELLED',
      input.cancelledByUserId,
      input.cancelledByDisplayName,
      'RESIDENT',
      input.description || input.reason,
    );

    return transitionResult;
  }

  async addComment(input: AddCommentInput): Promise<{ success: boolean; comment?: ComplaintComment; errorCode?: string; errorMessage?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === input.complaintId);
    if (!complaint) return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };

    const comment: ComplaintComment = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      complaintId: input.complaintId,
      authorUserId: input.authorUserId,
      authorDisplayName: input.authorDisplayName,
      authorRole: input.authorRole,
      content: input.content,
      visibility: input.visibility,
      isSystemGenerated: input.isSystemGenerated || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.getState().complaintComments = [...(mockStore.getState().complaintComments || []), comment];
    mockStore.notify();

    await createAuditEntry({
      actorUserId: input.authorUserId,
      actorType: input.authorRole === 'TECHNICIAN' ? 'TECHNICIAN' : 'RESIDENT',
      societyId: '',
      action: 'COMMENT_ADDED',
      entityType: 'ComplaintComment',
      entityId: comment.id,
      newState: { complaintId: input.complaintId, visibility: input.visibility },
      idempotencyKey: createIdempotencyKey(`comment-${input.complaintId}-${Date.now()}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, comment };
  }

  async updateVisibility(input: UpdateVisibilityInput): Promise<TransitionResult> {
    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === input.complaintId);
    if (!complaint) return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };

    if (complaint.visibility === input.visibility) {
      return { success: true, complaint };
    }

    const updated = { ...complaint, visibility: input.visibility, updatedAt: new Date().toISOString() };
    mockStore.updateComplaint(input.complaintId, updated);
    mockStore.notify();

    await createAuditEntry({
      actorUserId: input.updatedByUserId,
      actorType: 'ADMIN',
      societyId: complaint.societyId,
      action: 'COMPLAINT_VISIBILITY_CHANGED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: { visibility: complaint.visibility },
      newState: { visibility: input.visibility },
      idempotencyKey: createIdempotencyKey(`visibility-${input.complaintId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, complaint: updated };
  }

  async addEvidence(complaintId: string, input: { type: 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'AUDIO' | 'OTHER'; fileName: string; fileSize: number; mimeType: string; uploadedByUserId: string; uploadedByDisplayName: string; description?: string; isResolutionEvidence: boolean; documentId: string }): Promise<{ success: boolean; evidence?: any; errorCode?: string; errorMessage?: string }> {
    const idempotencyKey = createIdempotencyKey(`evidence-${complaintId}-${input.documentId}`);
    return evidenceService.uploadEvidence({ complaintId, ...input, idempotencyKey });
  }

  async deleteEvidence(evidenceId: string, deletedByUserId: string, deletedByDisplayName: string) {
    return evidenceService.deleteEvidence(evidenceId, deletedByUserId, deletedByDisplayName);
  }

  async getComplaint(complaintId: string, viewer?: { userId?: string; role?: string; societyId?: string }): Promise<Complaint | null> {
    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint) return null;

    if (viewer?.societyId && complaint.societyId !== viewer.societyId) {
      return null;
    }

    if (complaint.visibility === 'PRIVATE' || complaint.isPrivate) {
      const isReporter = viewer?.userId === complaint.reportedByUserId;
      const isAdmin = viewer?.role?.includes('ADMIN') || viewer?.role === 'SUPER_ADMIN' || viewer?.role === 'SOCIETY_ADMIN' || viewer?.role === 'FACILITY_MANAGER';
      const isAssignedTech = viewer?.userId === complaint.assignedToUserId;
      if (!isReporter && !isAdmin && !isAssignedTech && viewer?.userId) {
        return null;
      }
    }

    return complaint;
  }

  async getComplaintComments(complaintId: string, viewerRole?: string): Promise<ComplaintComment[]> {
    const all = mockStore.getState().complaintComments?.filter(c => c.complaintId === complaintId) || [];
    const isResident = viewerRole ? viewerRole.startsWith('RESIDENT') : false;
    if (isResident) {
      return all.filter(c => c.visibility === 'PUBLIC' || c.visibility === 'RESIDENT_ONLY');
    }
    return all;
  }

  async getComplaintEvidence(complaintId: string): Promise<any[]> {
    return mockStore.getState().complaintEvidence?.filter(e => e.complaintId === complaintId) || [];
  }

  async getComplaintStatusHistory(complaintId: string): Promise<any[]> {
    return mockStore.getState().complaintStatusHistory?.filter(h => h.complaintId === complaintId) || [];
  }

  async getDashboardMetrics(societyId: string): Promise<any> {
    const complaints = mockStore.getState().complaints?.filter(c => c.societyId === societyId) || [];

    const byCategory: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byAssignee: Record<string, number> = {};

    let totalOpen = 0;
    let totalAssigned = 0;
    let totalInProgress = 0;
    let totalWaiting = 0;
    let totalHold = 0;
    let totalResolved = 0;
    let totalClosed = 0;
    let totalReopened = 0;
    let slaOnTime = 0;
    let slaAtRisk = 0;
    let slaBreached = 0;
    let escalationCount = 0;

    for (const c of complaints) {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
      byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      if (c.assignedToDisplayName) {
        byAssignee[c.assignedToDisplayName] = (byAssignee[c.assignedToDisplayName] || 0) + 1;
      }

      switch (c.status) {
        case 'CREATED':
        case 'CLASSIFIED':
        case 'PENDING_ASSIGNMENT':
          totalOpen++;
          break;
        case 'ASSIGNED':
        case 'ACKNOWLEDGED':
          totalAssigned++;
          break;
        case 'IN_PROGRESS':
          totalInProgress++;
          break;
        case 'WAITING':
          totalWaiting++;
          break;
        case 'HOLD':
          totalHold++;
          break;
        case 'RESOLVED':
        case 'CONFIRMED':
          totalResolved++;
          break;
        case 'CLOSED':
          totalClosed++;
          break;
        case 'REOPENED':
          totalReopened++;
          break;
        case 'ESCALATED':
          break;
      }
    }

    return {
      totalOpen,
      totalAssigned,
      totalInProgress,
      totalWaiting,
      totalHold,
      totalResolved,
      totalClosed,
      totalReopened,
      slaOnTime: 0,
      slaAtRisk: 0,
      slaBreached: 0,
      avgFirstResponseHours: 0,
      avgAcknowledgementHours: 0,
      avgResolutionHours: 0,
      reopenRate: totalClosed > 0 ? (totalReopened / totalClosed) * 100 : 0,
      avgHoldDurationHours: 0,
      escalationCount: 0,
      byCategory,
      byPriority,
      byStatus,
      byAssignee,
    };
  }

  async getComplaintSlaMetrics(complaintId: string): Promise<ComplaintSlaMetrics | null> {
    return slaEngine.calculateSlaMetrics(complaintId);
  }

  private async checkAndUpdateParentIncident(complaintId: string): Promise<void> {
    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint || !complaint.parentIncidentId) return;

    const parentIncidents = mockStore.getState().parentIncidents || [];
    const parent = parentIncidents.find(p => p.id === complaint.parentIncidentId);
    if (!parent) return;

    const children = mockStore.getState().complaints?.filter(c => c.parentIncidentId === parent.id) || [];
    const allResolved = children.every(c => ['RESOLVED', 'CONFIRMED', 'CLOSED'].includes(c.status));

    if (allResolved) {
      parent.status = 'RESOLVED';
      parent.resolvedAt = new Date().toISOString();
      parent.updatedAt = new Date().toISOString();
      mockStore.notify();
    }
  }

  private generateTicketNumber(societyId: string): string {
    const year = new Date().getFullYear();
    const seq = Math.floor(100000 + Math.random() * 900000);
    return `CMP-${year}-${seq}`;
  }
}

export const complaintService = ComplaintService.getInstance();