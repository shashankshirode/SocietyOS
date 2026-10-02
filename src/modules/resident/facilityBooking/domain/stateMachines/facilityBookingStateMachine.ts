import type { Absent } from '../../../../../shared/types/absence.types';
import type {
  FacilityBookingStatus,
  FacilityBookingAction,
} from '../../models/facilityBooking.enums';
export { FacilityBookingStatus, FacilityBookingAction } from '../../models/facilityBooking.enums';


const TRANSITIONS: Readonly<Record<FacilityBookingStatus, readonly FacilityBookingStatus[]>> = {
  DRAFT: ['SLOT_HELD', 'CANCELLED_BY_RESIDENT'],
  SLOT_HELD: ['PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED_BY_RESIDENT', 'EXPIRED'],
  PAYMENT_PENDING: ['CONFIRMED', 'CANCELLED_BY_RESIDENT', 'EXPIRED', 'FAILED'],
  CONFIRMED: ['WAITLISTED', 'CHECKED_IN', 'CANCELLED_BY_RESIDENT', 'CANCELLED_BY_SOCIETY', 'RESCHEDULED', 'EXPIRED', 'NO_SHOW'],
  WAITLISTED: ['CONFIRMED', 'CANCELLED_BY_RESIDENT', 'EXPIRED'],
  CHECKED_IN: ['IN_USE', 'NO_SHOW', 'COMPLETED'],
  IN_USE: ['COMPLETED', 'NO_SHOW'],
  COMPLETED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED', 'PARTIALLY_REFUNDED'],
  REFUNDED: [],
  PARTIALLY_REFUNDED: [],
  CANCELLED_BY_RESIDENT: [],
  CANCELLED_BY_SOCIETY: [],
  REJECTED: [],
  EXPIRED: [],
  NO_SHOW: ['REFUND_PENDING'],
  FAILED: ['PAYMENT_PENDING', 'CANCELLED_BY_RESIDENT'],
  RESCHEDULED: ['CONFIRMED', 'CANCELLED_BY_RESIDENT'],
  PARTIALLY_REFUNDED: [],
};

const ACTION_TO_TRANSITION: Readonly<Record<FacilityBookingAction, readonly FacilityBookingStatus[]>> = {
  Continue: ['DRAFT', 'SLOT_HELD'],
  View: [],
  Pay: ['CONFIRMED'],
  Reschedule: ['CONFIRMED'],
  Cancel: ['CANCELLED_BY_RESIDENT', 'CANCELLED_BY_SOCIETY'],
  CheckIn: ['CHECKED_IN'],
  ViewQr: [],
  JoinWaitlist: ['WAITLISTED'],
  LeaveWaitlist: ['WAITLISTED'],
  BookAgain: ['DRAFT'],
  AddToCalendar: [],
};

export function canTransition(
  from: FacilityBookingStatus,
  to: FacilityBookingStatus,
): { allowed: boolean; reason?: string } {
  if (from === to) {
    return { allowed: true };
  }
  const allowed = TRANSITIONS[from]?.includes(to) ?? false;
  if (!allowed) {
    return { allowed: false, reason: `Invalid transition from ${from} to ${to}` };
  }
  return { allowed: true };
}

export function isTerminalState(status: FacilityBookingStatus): boolean {
  const terminalStates: FacilityBookingStatus[] = [
    'COMPLETED',
    'REFUNDED',
    'PARTIALLY_REFUNDED',
    'CANCELLED_BY_RESIDENT',
    'CANCELLED_BY_SOCIETY',
    'REJECTED',
    'EXPIRED',
    'NO_SHOW',
  ];
  return terminalStates.includes(status);
}

export function isActiveState(status: FacilityBookingStatus): boolean {
  const activeStates: FacilityBookingStatus[] = [
    'DRAFT',
    'SLOT_HELD',
    'PAYMENT_PENDING',
    'CONFIRMED',
    'WAITLISTED',
    'CHECKED_IN',
    'IN_USE',
  ];
  return activeStates.includes(status);
}

export function isPaymentRequiredState(status: FacilityBookingStatus): boolean {
  return status === 'PAYMENT_PENDING' || status === 'SLOT_HELD';
}

export function canCancel(status: FacilityBookingStatus): boolean {
  return ['DRAFT', 'SLOT_HELD', 'PAYMENT_PENDING', 'CONFIRMED', 'WAITLISTED'].includes(status);
}

export function canReschedule(status: FacilityBookingStatus): boolean {
  return status === 'CONFIRMED';
}

export function canCheckIn(status: FacilityBookingStatus): boolean {
  return status === 'CONFIRMED';
}

export function getValidNextStates(status: FacilityBookingStatus): readonly FacilityBookingStatus[] {
  return TRANSITIONS[status] ?? [];
}

export function transition(
  currentStatus: FacilityBookingStatus,
  action: FacilityBookingAction,
): FacilityBookingStatus {
  const allowedTargets = ACTION_TO_TRANSITION[action] ?? [];
  const validTransitions = TRANSITIONS[currentStatus] ?? [];
  const intersection = validTransitions.filter((s) => allowedTargets.includes(s));
  if (intersection.length > 0) {
    return intersection[0];
  }
  return currentStatus;
}

export interface StateTransition {
  from: FacilityBookingStatus;
  to: FacilityBookingStatus;
  action: FacilityBookingAction;
  timestamp: string;
  actorId: string;
  reason?: string;
}

export function createTransition(
  from: FacilityBookingStatus,
  to: FacilityBookingStatus,
  action: FacilityBookingAction,
  actorId: string,
  reason?: string,
): StateTransition | null {
  const result = canTransition(from, to);
  if (!result.allowed) {
    return null;
  }
  return {
    from,
    to,
    action,
    timestamp: new Date().toISOString(),
    actorId,
    reason,
  };
}