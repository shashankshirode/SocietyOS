import { unifiedVisitorStateMachine } from '../services/unifiedVisitorStateMachine';
import type { VisitorStatus, VisitorPassStatus, VisitorApprovalStatus, VisitorEscalationStatus } from '../../../../shared/types/visitorPhase5';

describe('Unified Visitor State Machine', () => {
  describe('Visitor Status Transitions', () => {
    it('should allow valid transitions', () => {
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('DRAFT', 'EXPECTED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('EXPECTED', 'APPROVED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('APPROVED', 'PRESENTED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('PRESENTED', 'CHECKED_IN')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('CHECKED_IN', 'CHECKED_OUT')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('CHECKED_OUT', 'COMPLETED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('EXPECTED', 'CANCELLED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('APPROVED', 'REVOKED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('EXPECTED', 'EXPIRED')).toBe(true);
    });

    it('should reject invalid transitions', () => {
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('DRAFT', 'CHECKED_IN')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('EXPECTED', 'COMPLETED')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('APPROVED', 'CHECKED_OUT')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('CHECKED_IN', 'APPROVED')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('CHECKED_OUT', 'CHECKED_IN')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('COMPLETED', 'CHECKED_IN')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('REVOKED', 'APPROVED')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('EXPIRED', 'CHECKED_IN')).toBe(false);
    });

    it('should handle terminal states correctly', () => {
      expect(unifiedVisitorStateMachine.isVisitorStatusFinal('COMPLETED')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorStatusFinal('CANCELLED')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorStatusFinal('REVOKED')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorStatusFinal('EXPIRED')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorStatusFinal('REJECTED')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorStatusFinal('APPROVED')).toBe(false);
      expect(unifiedVisitorStateMachine.isVisitorStatusFinal('CHECKED_IN')).toBe(false);
    });

    it('should correctly identify currently inside visitors', () => {
      expect(unifiedVisitorStateMachine.isVisitorCurrentlyInside('CHECKED_IN')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorCurrentlyInside('PRESENTED')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorCurrentlyInside('ESCALATED')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorCurrentlyInside('APPROVED')).toBe(false);
      expect(unifiedVisitorStateMachine.isVisitorCurrentlyInside('EXPECTED')).toBe(false);
      expect(unifiedVisitorStateMachine.isVisitorCurrentlyInside('CHECKED_OUT')).toBe(false);
      expect(unifiedVisitorStateMachine.isVisitorCurrentlyInside('COMPLETED')).toBe(false);
    });

    it('should correctly identify active passes', () => {
      expect(unifiedVisitorStateMachine.isVisitorPassActive('EXPECTED')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorPassActive('WAITING_APPROVAL')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorPassActive('APPROVED')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorPassActive('PRESENTED')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorPassActive('CHECKED_IN')).toBe(true);
      expect(unifiedVisitorStateMachine.isVisitorPassActive('COMPLETED')).toBe(false);
      expect(unifiedVisitorStateMachine.isVisitorPassActive('EXPIRED')).toBe(false);
      expect(unifiedVisitorStateMachine.isVisitorPassActive('REVOKED')).toBe(false);
      expect(unifiedVisitorStateMachine.isVisitorPassActive('CANCELLED')).toBe(false);
    });
  });

  describe('Visitor Pass Status Transitions', () => {
    it('should mirror visitor status transitions', () => {
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('DRAFT', 'EXPECTED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('EXPECTED', 'APPROVED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('APPROVED', 'PRESENTED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('PRESENTED', 'CHECKED_IN')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('CHECKED_IN', 'CHECKED_OUT')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('CHECKED_OUT', 'COMPLETED')).toBe(true);
    });

    it('should reject same invalid transitions as visitor status', () => {
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('DRAFT', 'CHECKED_IN')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('EXPECTED', 'COMPLETED')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('CHECKED_IN', 'APPROVED')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('COMPLETED', 'CHECKED_IN')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorPassStatus('REVOKED', 'APPROVED')).toBe(false);
    });
  });

  describe('Visitor Approval Status Transitions', () => {
    it('should allow valid approval transitions', () => {
      expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('PENDING', 'APPROVED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('PENDING', 'DENIED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('PENDING', 'ESCALATED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('PENDING', 'EXPIRED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('PENDING', 'CANCELLED')).toBe(true);
    });

    it('should reject invalid approval transitions', () => {
      expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('APPROVED', 'DENIED')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('DENIED', 'APPROVED')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('EXPIRED', 'APPROVED')).toBe(false);
    });
  });

  describe('Visitor Escalation Status Transitions', () => {
    it('should allow valid escalation transitions', () => {
      expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('NOT_ESCALATED', 'ESCALATED_TO_SECURITY')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('NOT_ESCALATED', 'ESCALATED_TO_SUPERVISOR')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('NOT_ESCALATED', 'ESCALATED_TO_COMMITTEE')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('ESCALATED_TO_SECURITY', 'RESOLVED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('ESCALATED_TO_SUPERVISOR', 'RESOLVED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('ESCALATED_TO_COMMITTEE', 'RESOLVED')).toBe(true);
    });

    it('should reject invalid escalation transitions', () => {
      expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('RESOLVED', 'ESCALATED_TO_SECURITY')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('ESCALATED_TO_SECURITY', 'ESCALATED_TO_SUPERVISOR')).toBe(false);
    });
  });

  describe('Visitor Invitation Status Transitions', () => {
    it('should allow valid invitation transitions', () => {
      expect(unifiedVisitorStateMachine.canTransitionVisitorInvitationStatus('DRAFT', 'SENT')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorInvitationStatus('SENT', 'ACCEPTED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorInvitationStatus('SENT', 'EXPIRED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorInvitationStatus('SENT', 'REVOKED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorInvitationStatus('ACCEPTED', 'USED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorInvitationStatus('ACCEPTED', 'EXPIRED')).toBe(true);
      expect(unifiedVisitorStateMachine.canTransitionVisitorInvitationStatus('ACCEPTED', 'REVOKED')).toBe(true);
    });

    it('should reject invalid invitation transitions', () => {
      expect(unifiedVisitorStateMachine.canTransitionVisitorInvitationStatus('USED', 'ACCEPTED')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorInvitationStatus('EXPIRED', 'ACCEPTED')).toBe(false);
      expect(unifiedVisitorStateMachine.canTransitionVisitorInvitationStatus('REVOKED', 'SENT')).toBe(false);
    });
  });

  describe('Status Tones', () => {
    it('should return correct tones for each status', () => {
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('CHECKED_IN')).toBe('success');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('COMPLETED')).toBe('success');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('WAITING_APPROVAL')).toBe('warning');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('PRESENTED')).toBe('warning');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('EXPIRED')).toBe('warning');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('REJECTED')).toBe('danger');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('DENIED')).toBe('danger');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('ESCALATED')).toBe('danger');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('EXPECTED')).toBe('info');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('APPROVED')).toBe('info');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('CANCELLED')).toBe('muted');
      expect(unifiedVisitorStateMachine.getVisitorStatusTone('REVOKED')).toBe('muted');
    });
  });
});

describe('Security Invariants', () => {
  it('should prevent REVOKED pass from being used for entry', () => {
    expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('REVOKED', 'CHECKED_IN')).toBe(false);
    expect(unifiedVisitorStateMachine.isVisitorPassActive('REVOKED')).toBe(false);
  });

  it('should prevent EXPIRED pass from being used for entry', () => {
    expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('EXPIRED', 'CHECKED_IN')).toBe(false);
    expect(unifiedVisitorStateMachine.isVisitorPassActive('EXPIRED')).toBe(false);
  });

  it('should prevent CANCELLED pass from being used for entry', () => {
    expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('CANCELLED', 'CHECKED_IN')).toBe(false);
    expect(unifiedVisitorStateMachine.isVisitorPassActive('CANCELLED')).toBe(false);
  });

  it('should prevent COMPLETED pass from being reused for entry', () => {
    expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('COMPLETED', 'CHECKED_IN')).toBe(false);
    expect(unifiedVisitorStateMachine.isVisitorPassActive('COMPLETED')).toBe(false);
  });

  it('should not allow CHECKED_OUT to transition back to CHECKED_IN', () => {
    expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('CHECKED_OUT', 'CHECKED_IN')).toBe(false);
  });

  it('should not allow terminal states to transition', () => {
    expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('COMPLETED', 'APPROVED')).toBe(false);
    expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('REVOKED', 'APPROVED')).toBe(false);
    expect(unifiedVisitorStateMachine.canTransitionVisitorStatus('CANCELLED', 'APPROVED')).toBe(false);
  });
});

describe('Walk-in Approval Security', () => {
  it('should only allow PENDING requests to be approved or denied', () => {
    expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('PENDING', 'APPROVED')).toBe(true);
    expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('PENDING', 'DENIED')).toBe(true);
    expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('PENDING', 'ESCALATED')).toBe(true);
  });

  it('should not allow changing terminal approval states', () => {
    expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('APPROVED', 'DENIED')).toBe(false);
    expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('DENIED', 'APPROVED')).toBe(false);
    expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('EXPIRED', 'APPROVED')).toBe(false);
    expect(unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus('CANCELLED', 'APPROVED')).toBe(false);
  });

  it('should allow escalation transitions', () => {
    expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('NOT_ESCALATED', 'ESCALATED_TO_SECURITY')).toBe(true);
    expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('NOT_ESCALATED', 'ESCALATED_TO_SUPERVISOR')).toBe(true);
    expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('ESCALATED_TO_SECURITY', 'RESOLVED')).toBe(true);
  });

  it('should not allow resolved escalation to be re-escalated', () => {
    expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('RESOLVED', 'ESCALATED_TO_SECURITY')).toBe(false);
    expect(unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus('ESCALATED_TO_SECURITY', 'ESCALATED_TO_SUPERVISOR')).toBe(false);
  });
});