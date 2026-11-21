import type { Absent } from '../../../../../../shared/types/absence.types';
import type {
  ParkingVaultErrorCode,
  ParkingVaultViolation,
  TransitionResult,
} from '../types/primitives';
import { violation } from '../types/primitives';
import type {
  VehicleVerificationStatus,
  VehicleVerificationStatus as VerificationStatus,
  VehicleRecord,
} from '../types/parking';

const VERIFICATION_TRANSITIONS: Readonly<
  Record<VehicleVerificationStatus, readonly VehicleVerificationStatus[]>
> = {
  NOT_REQUIRED: [],
  PENDING: ['PENDING_ADMIN_REVIEW', 'IN_REVIEW', 'REJECTED'],
  PENDING_ADMIN_REVIEW: ['IN_REVIEW', 'REJECTED', 'APPROVED'],
  IN_REVIEW: ['APPROVED', 'REJECTED', 'RESUBMISSION_REQUIRED'],
  APPROVED: ['VERIFIED', 'REVOKED'],
  VERIFIED: ['REVOKED', 'EXPIRED', 'BLOCKED'],
  REJECTED: ['PENDING', 'EXPIRED'],
  RESUBMISSION_REQUIRED: ['PENDING', 'EXPIRED'],
  EXPIRED: ['PENDING'],
  REVOKED: ['PENDING'],
  BLOCKED: ['VERIFIED'],
};

const VEHICLE_STATE_TRANSITIONS: Readonly<
  Record<string, readonly string[]>
> = {
  INACTIVE: ['ACTIVE'],
  ACTIVE: ['INACTIVE', 'REPLACED', 'DEACTIVATED'],
  REPLACED: ['INACTIVE'],
  DEACTIVATED: [],
};

export function canTransitionVerification(
  from: VehicleVerificationStatus,
  to: VehicleVerificationStatus,
): TransitionResult<VehicleVerificationStatus> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  const allowed = VERIFICATION_TRANSITIONS[from]?.includes(to) ?? false;
  if (!allowed) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `verification.status.${to}`,
        `Verification cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function canTransitionVehicleState(
  from: string,
  to: string,
): TransitionResult<string> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  const allowed = VEHICLE_STATE_TRANSITIONS[from]?.includes(to) ?? false;
  if (!allowed) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `vehicle.state.${to}`,
        `Vehicle cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function isVerificationReviewable(state: VehicleVerificationStatus): boolean {
  return state === 'PENDING' || state === 'PENDING_ADMIN_REVIEW' || state === 'IN_REVIEW' || state === 'RESUBMISSION_REQUIRED';
}

export function isVerificationTerminal(state: VehicleVerificationStatus): boolean {
  return state === 'VERIFIED' || state === 'REVOKED' || state === 'BLOCKED' || state === 'EXPIRED';
}

export function isVehicleActive(state: string): boolean {
  return state === 'ACTIVE';
}

export function canVehicleBeReplaced(state: string): boolean {
  return state === 'ACTIVE' || state === 'INACTIVE';
}

export function getVerificationValidNextStates(
  status: VehicleVerificationStatus,
): readonly VehicleVerificationStatus[] {
  return VERIFICATION_TRANSITIONS[status] ?? [];
}

export function isValidVerificationTransition(
  from: VehicleVerificationStatus,
  to: VehicleVerificationStatus,
): boolean {
  return VERIFICATION_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getVehicleValidNextStates(
  status: string,
): readonly string[] {
  return VEHICLE_STATE_TRANSITIONS[status] ?? [];
}

export function isValidVehicleStateTransition(
  from: string,
  to: string,
): boolean {
  return VEHICLE_STATE_TRANSITIONS[from]?.includes(to) ?? false;
}