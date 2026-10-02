import type { Absent } from '../../../../../../shared/types/absence.types';
import type {
  ParkingVaultErrorCode,
  ParkingVaultViolation,
  TransitionResult,
} from '../types/primitives';
import { violation } from '../types/primitives';
import type {
  AllocationStatus,
  AllocationType,
} from '../types/parking';


const ALLOCATION_TRANSITIONS: Readonly<
  Record<AllocationStatus, readonly AllocationStatus[]>
> = {
  AVAILABLE: ['REQUESTED'],
  REQUESTED: ['PENDING_APPROVAL', 'CANCELLED'],
  PENDING_APPROVAL: ['ALLOCATED', 'REJECTED', 'CANCELLED'],
  ALLOCATED: ['TEMPORARY_ACTIVE', 'TRANSFERRED', 'ENDED', 'SUPERSEDED', 'REVOKED'],
  TEMPORARY_ACTIVE: ['ENDED', 'EXPIRED', 'REVOKED'],
  TRANSFERRED: ['ENDED'],
  ENDED: ['AVAILABLE'],
  SUPERSEDED: ['AVAILABLE'],
  EXPIRED: ['AVAILABLE'],
  REVOKED: ['AVAILABLE'],
};

const TEMPORARY_TRANSITIONS: Readonly<
  Record<AllocationStatus, readonly AllocationStatus[]>
> = {
  AVAILABLE: ['REQUESTED'],
  REQUESTED: ['PENDING_APPROVAL', 'CANCELLED'],
  PENDING_APPROVAL: ['TEMPORARY_ACTIVE', 'REJECTED', 'CANCELLED'],
  TEMPORARY_ACTIVE: ['ENDED', 'EXPIRED', 'REVOKED'],
  ENDED: ['AVAILABLE'],
  EXPIRED: ['AVAILABLE'],
  REVOKED: ['AVAILABLE'],
  CANCELLED: ['AVAILABLE'],
};

export function canTransitionAllocation(
  from: AllocationStatus,
  to: AllocationStatus,
): TransitionResult<AllocationStatus> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  const allowed = ALLOCATION_TRANSITIONS[from]?.includes(to) ?? false;
  if (!allowed) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `allocation.status.${to}`,
        `Allocation cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function canTransitionTemporary(
  from: AllocationStatus,
  to: AllocationStatus,
): TransitionResult<AllocationStatus> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  const allowed = TEMPORARY_TRANSITIONS[from]?.includes(to) ?? false;
  if (!allowed) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `allocation.status.${to}`,
        `Temporary allocation cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function isAllocationActive(status: AllocationStatus): boolean {
  return status === 'ALLOCATED' || status === 'TEMPORARY_ACTIVE';
}

export function isAllocationTerminal(status: AllocationStatus): boolean {
  return status === 'ENDED' || status === 'SUPERSEDED' || status === 'EXPIRED' || status === 'REVOKED';
}

export function isAllocationAvailable(status: AllocationStatus): boolean {
  return status === 'AVAILABLE';
}

export function getValidNextStates(
  status: AllocationStatus,
  isTemporary: boolean = false,
): readonly AllocationStatus[] {
  const transitions = isTemporary ? TEMPORARY_TRANSITIONS : ALLOCATION_TRANSITIONS;
  return transitions[status] ?? [];
}

export function isValidTransition(
  from: AllocationStatus,
  to: AllocationStatus,
  isTemporary: boolean = false,
): boolean {
  const transitions = isTemporary ? TEMPORARY_TRANSITIONS : ALLOCATION_TRANSITIONS;
  return transitions[from]?.includes(to) ?? false;
}

export function getAllocationTypeFromStatus(
  status: AllocationStatus,
): AllocationType {
  if (status === 'TEMPORARY_ACTIVE') return 'TEMPORARY';
  if (status === 'ALLOCATED' || status === 'SUPERSEDED' || status === 'ENDED') return 'PERMANENT';
  return 'TEMPORARY';
}