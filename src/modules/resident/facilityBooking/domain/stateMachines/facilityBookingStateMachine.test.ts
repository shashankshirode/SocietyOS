import {
  canTransition,
  isTerminalState,
  isActiveState,
  isPaymentRequiredState,
  canCancel,
  canReschedule,
  canCheckIn,
  getValidNextStates,
  transition,
  createTransition,
  StateTransition,
  FacilityBookingStatus,
  FacilityBookingAction,
} from './facilityBookingStateMachine';

describe('Facility Booking State Machine', () => {
  describe('canTransition', () => {
    it('allows DRAFT to SLOT_HELD', () => {
      expect(canTransition('DRAFT', 'SLOT_HELD').allowed).toBe(true);
    });

    it('allows DRAFT to CANCELLED_BY_RESIDENT', () => {
      expect(canTransition('DRAFT', 'CANCELLED_BY_RESIDENT').allowed).toBe(true);
    });

    it('allows SLOT_HELD to PAYMENT_PENDING', () => {
      expect(canTransition('SLOT_HELD', 'PAYMENT_PENDING').allowed).toBe(true);
    });

    it('allows SLOT_HELD to CONFIRMED', () => {
      expect(canTransition('SLOT_HELD', 'CONFIRMED').allowed).toBe(true);
    });

    it('allows PAYMENT_PENDING to CONFIRMED', () => {
      expect(canTransition('PAYMENT_PENDING', 'CONFIRMED').allowed).toBe(true);
    });

    it('allows CONFIRMED to CHECKED_IN', () => {
      expect(canTransition('CONFIRMED', 'CHECKED_IN').allowed).toBe(true);
    });

    it('allows CONFIRMED to CANCELLED_BY_RESIDENT', () => {
      expect(canTransition('CONFIRMED', 'CANCELLED_BY_RESIDENT').allowed).toBe(true);
    });

    it('allows CONFIRMED to NO_SHOW', () => {
      expect(canTransition('CONFIRMED', 'NO_SHOW').allowed).toBe(true);
    });

    it('allows CHECKED_IN to IN_USE', () => {
      expect(canTransition('CHECKED_IN', 'IN_USE').allowed).toBe(true);
    });

    it('allows CHECKED_IN to COMPLETED', () => {
      expect(canTransition('CHECKED_IN', 'COMPLETED').allowed).toBe(true);
    });

    it('allows COMPLETED to REFUND_PENDING', () => {
      expect(canTransition('COMPLETED', 'REFUND_PENDING').allowed).toBe(true);
    });

    it('blocks invalid transitions', () => {
      expect(canTransition('CONFIRMED', 'DRAFT').allowed).toBe(false);
      expect(canTransition('COMPLETED', 'CONFIRMED').allowed).toBe(false);
      expect(canTransition('CANCELLED_BY_RESIDENT', 'CONFIRMED').allowed).toBe(false);
      expect(canTransition('NO_SHOW', 'CHECKED_IN').allowed).toBe(false);
    });

    it('allows self-transition', () => {
      expect(canTransition('CONFIRMED', 'CONFIRMED').allowed).toBe(true);
    });
  });

  describe('isTerminalState', () => {
    it('identifies terminal states', () => {
      expect(isTerminalState('COMPLETED')).toBe(true);
      expect(isTerminalState('REFUNDED')).toBe(true);
      expect(isTerminalState('PARTIALLY_REFUNDED')).toBe(true);
      expect(isTerminalState('CANCELLED_BY_RESIDENT')).toBe(true);
      expect(isTerminalState('CANCELLED_BY_SOCIETY')).toBe(true);
      expect(isTerminalState('REJECTED')).toBe(true);
      expect(isTerminalState('EXPIRED')).toBe(true);
      expect(isTerminalState('NO_SHOW')).toBe(true);
    });

    it('identifies non-terminal states', () => {
      expect(isTerminalState('DRAFT')).toBe(false);
      expect(isTerminalState('SLOT_HELD')).toBe(false);
      expect(isTerminalState('PAYMENT_PENDING')).toBe(false);
      expect(isTerminalState('CONFIRMED')).toBe(false);
      expect(isTerminalState('CHECKED_IN')).toBe(false);
    });
  });

  describe('isActiveState', () => {
    it('identifies active states', () => {
      expect(isActiveState('DRAFT')).toBe(true);
      expect(isActiveState('SLOT_HELD')).toBe(true);
      expect(isActiveState('PAYMENT_PENDING')).toBe(true);
      expect(isActiveState('CONFIRMED')).toBe(true);
      expect(isActiveState('WAITLISTED')).toBe(true);
      expect(isActiveState('CHECKED_IN')).toBe(true);
      expect(isActiveState('IN_USE')).toBe(true);
    });

    it('identifies non-active states', () => {
      expect(isActiveState('COMPLETED')).toBe(false);
      expect(isActiveState('CANCELLED_BY_RESIDENT')).toBe(false);
      expect(isActiveState('REJECTED')).toBe(false);
    });
  });

  describe('isPaymentRequiredState', () => {
    it('identifies payment required states', () => {
      expect(isPaymentRequiredState('PAYMENT_PENDING')).toBe(true);
      expect(isPaymentRequiredState('SLOT_HELD')).toBe(true);
    });

    it('identifies non-payment required states', () => {
      expect(isPaymentRequiredState('CONFIRMED')).toBe(false);
      expect(isPaymentRequiredState('DRAFT')).toBe(false);
      expect(isPaymentRequiredState('COMPLETED')).toBe(false);
    });
  });

  describe('canCancel', () => {
    it('allows cancellation for valid states', () => {
      expect(canCancel('DRAFT')).toBe(true);
      expect(canCancel('SLOT_HELD')).toBe(true);
      expect(canCancel('PAYMENT_PENDING')).toBe(true);
      expect(canCancel('CONFIRMED')).toBe(true);
      expect(canCancel('WAITLISTED')).toBe(true);
    });

    it('blocks cancellation for terminal states', () => {
      expect(canCancel('COMPLETED')).toBe(false);
      expect(canCancel('CANCELLED_BY_RESIDENT')).toBe(false);
      expect(canCancel('NO_SHOW')).toBe(false);
      expect(canCancel('EXPIRED')).toBe(false);
    });
  });

  describe('canReschedule', () => {
    it('allows reschedule for CONFIRMED', () => {
      expect(canReschedule('CONFIRMED')).toBe(true);
    });

    it('blocks reschedule for other states', () => {
      expect(canReschedule('DRAFT')).toBe(false);
      expect(canReschedule('PAYMENT_PENDING')).toBe(false);
      expect(canReschedule('WAITLISTED')).toBe(false);
      expect(canReschedule('CHECKED_IN')).toBe(false);
      expect(canReschedule('COMPLETED')).toBe(false);
    });
  });

  describe('canCheckIn', () => {
    it('allows check-in for CONFIRMED', () => {
      expect(canCheckIn('CONFIRMED')).toBe(true);
    });

    it('blocks check-in for other states', () => {
      expect(canCheckIn('DRAFT')).toBe(false);
      expect(canCheckIn('PAYMENT_PENDING')).toBe(false);
      expect(canCheckIn('WAITLISTED')).toBe(false);
      expect(canCheckIn('CHECKED_IN')).toBe(false);
      expect(canCheckIn('COMPLETED')).toBe(false);
    });
  });

  describe('getValidNextStates', () => {
    it('returns valid next states for DRAFT', () => {
      const next = getValidNextStates('DRAFT');
      expect(next).toContain('SLOT_HELD');
      expect(next).toContain('CANCELLED_BY_RESIDENT');
    });

    it('returns valid next states for CONFIRMED', () => {
      const next = getValidNextStates('CONFIRMED');
      expect(next).toContain('WAITLISTED');
      expect(next).toContain('CHECKED_IN');
      expect(next).toContain('CANCELLED_BY_RESIDENT');
      expect(next).toContain('CANCELLED_BY_SOCIETY');
      expect(next).toContain('EXPIRED');
      expect(next).toContain('NO_SHOW');
    });

    it('returns empty for terminal states', () => {
      expect(getValidNextStates('COMPLETED')).toEqual(['REFUND_PENDING']);
      expect(getValidNextStates('CANCELLED_BY_RESIDENT')).toEqual([]);
    });
  });

  describe('transition', () => {
    it('returns correct target for Pay action', () => {
      expect(transition('PAYMENT_PENDING', 'Pay')).toBe('CONFIRMED');
    });

    it('returns correct target for Cancel action', () => {
      expect(transition('CONFIRMED', 'Cancel')).toBe('CANCELLED_BY_RESIDENT');
    });

    it('returns correct target for CheckIn action', () => {
      expect(transition('CONFIRMED', 'CheckIn')).toBe('CHECKED_IN');
    });

    it('returns current state for invalid action', () => {
      expect(transition('CONFIRMED', 'View')).toBe('CONFIRMED');
    });
  });

  describe('createTransition', () => {
    it('creates valid transition record', () => {
      const result = createTransition(
        'CONFIRMED',
        'CHECKED_IN',
        'CheckIn',
        'user-123',
        'Resident checked in',
      );

      expect(result).not.toBeNull();
      expect(result!.from).toBe('CONFIRMED');
      expect(result!.to).toBe('CHECKED_IN');
      expect(result!.action).toBe('CheckIn');
      expect(result!.actorId).toBe('user-123');
      expect(result!.reason).toBe('Resident checked in');
    });

    it('returns null for invalid transition', () => {
      const result = createTransition(
        'CONFIRMED',
        'DRAFT',
        'View',
        'user-123',
      );

      expect(result).toBeNull();
    });
  });
});