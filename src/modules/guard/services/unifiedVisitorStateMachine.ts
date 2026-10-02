import type {
  VisitorStatus,
  VisitorPassStatus,
  VisitorApprovalStatus,
  VisitorEscalationStatus,
  VisitorInvitationStatus,
  EntrySource,
  ApprovalSource,
  VisitorCategory,
  VisitorPass,
  VisitorApprovalRequest,
  GateEntry,
  GateExit,
  VisitorInvitation,
  Gate,
  WatchlistEntry,
} from '../../../shared/types/visitorPhase5';
import { auditService, createAuditEntry } from '../../../core/audit';
import { createIdempotencyKey } from '../../../core/api/idempotency';

export interface StateTransitionContext {
  readonly visitorId?: string;
  readonly passId?: string;
  readonly requestId?: string;
  readonly societyId: string;
  readonly unitId?: string;
  readonly gateId?: string;
  readonly actorUserId: string;
  readonly actorType: 'RESIDENT' | 'GUARD' | 'SECURITY_SUPERVISOR' | 'SYSTEM' | 'SOCIETY_ADMIN' | 'SYSTEM_POLICY';
  readonly reason?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface TransitionResult<T> {
  readonly valid: boolean;
  readonly error?: string;
  readonly newStatus?: T;
  readonly dataVersion?: number;
}

export class UnifiedVisitorStateMachine {
  private static instance: UnifiedVisitorStateMachine;

  static getInstance(): UnifiedVisitorStateMachine {
    if (!UnifiedVisitorStateMachine.instance) {
      UnifiedVisitorStateMachine.instance = new UnifiedVisitorStateMachine();
    }
    return UnifiedVisitorStateMachine.instance;
  }

  private constructor() {}

  canTransitionVisitorStatus(from: VisitorStatus, to: VisitorStatus): boolean {
    return VISITOR_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  canTransitionVisitorPassStatus(from: VisitorPassStatus, to: VisitorPassStatus): boolean {
    return VISITOR_PASS_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  canTransitionVisitorApprovalStatus(from: VisitorApprovalStatus, to: VisitorApprovalStatus): boolean {
    return VISITOR_APPROVAL_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  canTransitionVisitorEscalationStatus(from: VisitorEscalationStatus, to: VisitorEscalationStatus): boolean {
    return VISITOR_ESCALATION_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  canTransitionVisitorInvitationStatus(from: VisitorInvitationStatus, to: VisitorInvitationStatus): boolean {
    return VISITOR_INVITATION_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  validateTransition<T>(
    currentStatus: T,
    newStatus: T,
    transitions: Record<T, T[]>,
    entityType: string
  ): TransitionResult<T> {
    if (!transitions[currentStatus]?.includes(newStatus)) {
      return {
        valid: false,
        error: `Invalid ${entityType} transition from ${currentStatus} to ${newStatus}`,
      };
    }
    return { valid: true, newStatus };
  }

  transitionVisitorStatus(
    currentStatus: VisitorStatus,
    newStatus: VisitorStatus,
    context: StateTransitionContext
  ): TransitionResult<VisitorStatus> {
    const result = this.validateTransition(currentStatus, newStatus, VISITOR_STATUS_TRANSITIONS, 'Visitor');
    if (result.valid) {
      this.logTransition(context, 'VISITOR', currentStatus, newStatus, `VISITOR_${newStatus}`);
    }
    return result;
  }

  transitionVisitorPassStatus(
    currentStatus: VisitorPassStatus,
    newStatus: VisitorPassStatus,
    context: StateTransitionContext
  ): TransitionResult<VisitorPassStatus> {
    const result = this.validateTransition(currentStatus, newStatus, VISITOR_PASS_STATUS_TRANSITIONS, 'VisitorPass');
    if (result.valid) {
      this.logTransition(context, 'VISITOR_PASS', currentStatus, newStatus, `PASS_${newStatus}`);
    }
    return result;
  }

  transitionVisitorApprovalStatus(
    currentStatus: VisitorApprovalStatus,
    newStatus: VisitorApprovalStatus,
    context: StateTransitionContext
  ): TransitionResult<VisitorApprovalStatus> {
    const result = this.validateTransition(currentStatus, newStatus, VISITOR_APPROVAL_STATUS_TRANSITIONS, 'VisitorApproval');
    if (result.valid) {
      this.logTransition(context, 'VISITOR_APPROVAL', currentStatus, newStatus, `APPROVAL_${newStatus}`);
    }
    return result;
  }

  transitionVisitorEscalationStatus(
    currentStatus: VisitorEscalationStatus,
    newStatus: VisitorEscalationStatus,
    context: StateTransitionContext
  ): TransitionResult<VisitorEscalationStatus> {
    const result = this.validateTransition(currentStatus, newStatus, VISITOR_ESCALATION_STATUS_TRANSITIONS, 'VisitorEscalation');
    if (result.valid) {
      this.logTransition(context, 'VISITOR_ESCALATION', currentStatus, newStatus, `ESCALATION_${newStatus}`);
    }
    return result;
  }

  transitionVisitorInvitationStatus(
    currentStatus: VisitorInvitationStatus,
    newStatus: VisitorInvitationStatus,
    context: StateTransitionContext
  ): TransitionResult<VisitorInvitationStatus> {
    const result = this.validateTransition(currentStatus, newStatus, VISITOR_INVITATION_STATUS_TRANSITIONS, 'VisitorInvitation');
    if (result.valid) {
      this.logTransition(context, 'VISITOR_INVITATION', currentStatus, newStatus, `INVITATION_${newStatus}`);
    }
    return result;
  }

  isVisitorStatusFinal(status: VisitorStatus): boolean {
    return ['COMPLETED', 'CANCELLED', 'REVOKED', 'EXPIRED', 'REJECTED'].includes(status);
  }

  isVisitorPassStatusFinal(status: VisitorPassStatus): boolean {
    return ['COMPLETED', 'CANCELLED', 'REVOKED', 'EXPIRED', 'REJECTED'].includes(status);
  }

  isVisitorCurrentlyInside(status: VisitorStatus): boolean {
    return ['CHECKED_IN', 'PRESENTED', 'ESCALATED'].includes(status);
  }

  isVisitorPassActive(status: VisitorPassStatus): boolean {
    return ['EXPECTED', 'WAITING_APPROVAL', 'APPROVED', 'PRESENTED', 'CHECKED_IN'].includes(status);
  }

  getVisitorStatusTone(status: VisitorStatus): 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'muted' {
    switch (status) {
      case 'CHECKED_IN':
      case 'COMPLETED':
        return 'success';
      case 'WAITING_APPROVAL':
      case 'PRESENTED':
      case 'EXPIRED':
        return 'warning';
      case 'REJECTED':
      case 'DENIED':
      case 'ESCALATED':
        return 'danger';
      case 'EXPECTED':
      case 'APPROVED':
        return 'info';
      case 'CANCELLED':
      case 'REVOKED':
        return 'muted';
      default:
        return 'neutral';
    }
  }

  getValidTransitions(status: VisitorStatus): VisitorStatus[] {
    return VISITOR_STATUS_TRANSITIONS[status] ?? [];
  }

  logTransition(
    context: StateTransitionContext,
    entityType: 'VISITOR' | 'VISITOR_PASS' | 'VISITOR_APPROVAL' | 'VISITOR_ESCALATION' | 'VISITOR_INVITATION',
    fromStatus: string,
    toStatus: string,
    action: string
  ): void {
    createAuditEntry({
      actorUserId: context.actorUserId,
      actorType: context.actorType,
      societyId: context.societyId,
      action,
      entityType: entityType === 'VISITOR' ? 'Visitor' :
                   entityType === 'VISITOR_PASS' ? 'VisitorPass' :
                   entityType === 'VISITOR_APPROVAL' ? 'VisitorApprovalRequest' :
                   entityType === 'VISITOR_ESCALATION' ? 'VisitorEscalation' : 'VisitorInvitation',
      entityId: context.visitorId ?? context.passId ?? context.requestId ?? 'unknown',
      previousState: { status: fromStatus },
      newState: { status: toStatus },
      idempotencyKey: `${entityType.toLowerCase()}_${context.visitorId ?? context.passId ?? context.requestId}_${fromStatus}_${toStatus}_${Date.now()}`,
      source: context.actorType === 'GUARD' ? 'GATE_DEVICE' : 'MOBILE',
      outcome: 'SUCCESS',
      reason: context.reason,
      metadata: context.metadata,
    });
  }
}

export const VISITOR_STATUS_TRANSITIONS: Record<VisitorStatus, VisitorStatus[]> = {
  DRAFT: ['EXPECTED', 'CANCELLED'],
  EXPECTED: ['WAITING_APPROVAL', 'APPROVED', 'CANCELLED', 'EXPIRED'],
  WAITING_APPROVAL: ['APPROVED', 'DENIED', 'ESCALATED', 'EXPIRED', 'CANCELLED'],
  APPROVED: ['PRESENTED', 'CHECKED_IN', 'CANCELLED', 'EXPIRED', 'REVOKED'],
  PRESENTED: ['CHECKED_IN', 'DENIED', 'ESCALATED'],
  CHECKED_IN: ['CHECKED_OUT', 'COMPLETED', 'ESCALATED', 'EMERGENCY_BYPASS'],
  CHECKED_OUT: ['COMPLETED'],
  COMPLETED: [],
  REVOKED: [],
  EXPIRED: ['DRAFT', 'CANCELLED'],
  CANCELLED: ['DRAFT'],
  REJECTED: ['DRAFT', 'CANCELLED'],
  DENIED: ['DRAFT', 'ESCALATED'],
  ESCALATED: ['APPROVED', 'DENIED', 'EMERGENCY_BYPASS'],
  EMERGENCY_BYPASS: ['CHECKED_IN', 'COMPLETED'],
};

export const VISITOR_PASS_STATUS_TRANSITIONS: Record<VisitorPassStatus, VisitorPassStatus[]> = {
  DRAFT: ['EXPECTED', 'CANCELLED'],
  EXPECTED: ['WAITING_APPROVAL', 'APPROVED', 'CANCELLED', 'EXPIRED'],
  WAITING_APPROVAL: ['APPROVED', 'DENIED', 'ESCALATED', 'EXPIRED', 'CANCELLED'],
  APPROVED: ['PRESENTED', 'CHECKED_IN', 'CANCELLED', 'EXPIRED', 'REVOKED'],
  PRESENTED: ['CHECKED_IN', 'DENIED', 'ESCALATED'],
  CHECKED_IN: ['CHECKED_OUT', 'COMPLETED', 'ESCALATED', 'EMERGENCY_BYPASS'],
  CHECKED_OUT: ['COMPLETED'],
  COMPLETED: [],
  REVOKED: [],
  EXPIRED: ['DRAFT', 'CANCELLED'],
  CANCELLED: ['DRAFT'],
  REJECTED: ['DRAFT', 'CANCELLED'],
  DENIED: ['DRAFT', 'ESCALATED'],
  ESCALATED: ['APPROVED', 'DENIED', 'EMERGENCY_BYPASS'],
  EMERGENCY_BYPASS: ['CHECKED_IN', 'COMPLETED'],
};

export const VISITOR_INVITATION_STATUS_TRANSITIONS: Record<VisitorInvitationStatus, VisitorInvitationStatus[]> = {
  DRAFT: ['SENT', 'CANCELLED'],
  SENT: ['ACCEPTED', 'EXPIRED', 'REVOKED'],
  ACCEPTED: ['USED', 'EXPIRED', 'REVOKED'],
  EXPIRED: [],
  REVOKED: [],
  USED: [],
};

export const VISITOR_APPROVAL_STATUS_TRANSITIONS: Record<VisitorApprovalStatus, VisitorApprovalStatus[]> = {
  PENDING: ['APPROVED', 'DENIED', 'ESCALATED', 'EXPIRED', 'CANCELLED'],
  APPROVED: [],
  DENIED: [],
  ESCALATED: ['APPROVED', 'DENIED'],
  EXPIRED: [],
  CANCELLED: [],
};

export const VISITOR_ESCALATION_STATUS_TRANSITIONS: Record<VisitorEscalationStatus, VisitorEscalationStatus[]> = {
  NOT_ESCALATED: ['ESCALATED_TO_SECURITY', 'ESCALATED_TO_SUPERVISOR', 'ESCALATED_TO_COMMITTEE'],
  ESCALATED_TO_SECURITY: ['RESOLVED'],
  ESCALATED_TO_SUPERVISOR: ['RESOLVED'],
  ESCALATED_TO_COMMITTEE: ['RESOLVED'],
  RESOLVED: [],
};

export const unifiedVisitorStateMachine = UnifiedVisitorStateMachine.getInstance();