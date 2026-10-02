import type {
  VisitorStatus,
  VisitorPassStatus,
  VisitorInvitationStatus,
  VisitorApprovalStatus,
  VisitorEscalationStatus,
} from '../../../shared/types/visitorPhase8.types';
import { auditService, createAuditEntry } from '../../../core/audit';

export const VISITOR_STATUS_TRANSITIONS: Record<VisitorStatus, VisitorStatus[]> = {
  DRAFT: ['EXPECTED', 'CANCELLED'],
  EXPECTED: ['WAITING_APPROVAL', 'APPROVED', 'CANCELLED', 'EXPIRED'],
  WAITING_APPROVAL: ['APPROVED', 'DENIED', 'ESCALATED', 'EXPIRED', 'CANCELLED'],
  APPROVED: ['PRESENTED', 'CHECKED_IN', 'CANCELLED', 'EXPIRED', 'REVOKED'],
  PRESENTED: ['CHECKED_IN', 'DENIED', 'ESCALATED'],
  CHECKED_IN: ['CHECKED_OUT', 'COMPLETED', 'ESCALATED', 'EMERGENCY_BYPASS'],
  CHECKED_OUT: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: ['DRAFT', 'CANCELLED'],
  EXPIRED: ['DRAFT', 'CANCELLED'],
  CANCELLED: ['DRAFT'],
  DENIED: ['DRAFT', 'ESCALATED'],
  ESCALATED: ['APPROVED', 'DENIED', 'EMERGENCY_BYPASS'],
  EMERGENCY_BYPASS: ['CHECKED_IN', 'COMPLETED'],
  REVOKED: [],
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
  REJECTED: ['DRAFT', 'CANCELLED'],
  EXPIRED: ['DRAFT', 'CANCELLED'],
  CANCELLED: ['DRAFT'],
  DENIED: ['DRAFT', 'ESCALATED'],
  ESCALATED: ['APPROVED', 'DENIED', 'EMERGENCY_BYPASS'],
  EMERGENCY_BYPASS: ['CHECKED_IN', 'COMPLETED'],
  REVOKED: [],
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

export type StateTransitionContext = {
  visitorId: string;
  societyId: string;
  actorUserId: string;
  actorType: 'RESIDENT' | 'GUARD' | 'SECURITY_SUPERVISOR' | 'SYSTEM' | 'SOCIETY_ADMIN';
  reason?: string;
  metadata?: Record<string, unknown>;
};

export class VisitorStateMachine {
  private static instance: VisitorStateMachine;
  
  static getInstance(): VisitorStateMachine {
    if (!VisitorStateMachine.instance) {
      VisitorStateMachine.instance = new VisitorStateMachine();
    }
    return VisitorStateMachine.instance;
  }

  canTransitionVisitorStatus(from: VisitorStatus, to: VisitorStatus): boolean {
    return VISITOR_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  canTransitionVisitorPassStatus(from: VisitorPassStatus, to: VisitorPassStatus): boolean {
    return VISITOR_PASS_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  canTransitionVisitorInvitationStatus(from: VisitorInvitationStatus, to: VisitorInvitationStatus): boolean {
    return VISITOR_INVITATION_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  canTransitionVisitorApprovalStatus(from: VisitorApprovalStatus, to: VisitorApprovalStatus): boolean {
    return VISITOR_APPROVAL_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  canTransitionVisitorEscalationStatus(from: VisitorEscalationStatus, to: VisitorEscalationStatus): boolean {
    return VISITOR_ESCALATION_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  validateTransition<T>(
    currentStatus: T,
    newStatus: T,
    transitions: Record<T, T[]>,
    entityType: string
  ): { valid: boolean; error?: string } {
    if (!transitions[currentStatus]?.includes(newStatus)) {
      return {
        valid: false,
        error: `Invalid ${entityType} transition from ${currentStatus} to ${newStatus}`,
      };
    }
    return { valid: true };
  }

  logTransition(
    context: StateTransitionContext,
    entityType: 'VISITOR' | 'VISITOR_PASS' | 'VISITOR_INVITATION' | 'VISITOR_APPROVAL' | 'VISITOR_ESCALATION',
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
                   entityType === 'VISITOR_INVITATION' ? 'VisitorInvitation' :
                   entityType === 'VISITOR_APPROVAL' ? 'VisitorApprovalRequest' : 'VisitorEscalation',
      entityId: context.visitorId,
      previousState: { status: fromStatus },
      newState: { status: toStatus },
      idempotencyKey: `${entityType.toLowerCase()}_${context.visitorId}_${fromStatus}_${toStatus}_${Date.now()}`,
      source: context.actorType === 'GUARD' ? 'GATE_DEVICE' : 'MOBILE',
      outcome: 'SUCCESS',
      reason: context.reason,
      metadata: context.metadata,
    });
  }

  isVisitorStatusFinal(status: VisitorStatus): boolean {
    return ['COMPLETED', 'CANCELLED', 'REJECTED', 'EXPIRED', 'REVOKED'].includes(status);
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
}

export const visitorStateMachine = VisitorStateMachine.getInstance();