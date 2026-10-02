import type { Absent } from '../../../../../../shared/types/absence.types';
import type {
  ParkingVaultErrorCode,
  ParkingVaultViolation,
  TransitionResult,
} from '../types/primitives';
import { violation } from '../types/primitives';
import type {
  ParkingViolationType,
  ParkingViolationStatus,
} from '../types/parking';


const VIOLATION_TRANSITIONS: Readonly<
  Record<ParkingViolationStatus, readonly ParkingViolationStatus[]>
> = {
  RECORDED: ['WARNING_ISSUED', 'PENALTY_PENDING', 'DISPUTED', 'CLOSED', 'WAIVED'],
  WARNING_ISSUED: ['PENALTY_PENDING', 'DISPUTED', 'CLOSED', 'WAIVED'],
  PENALTY_PENDING: ['PENALTY_PAID', 'DISPUTED', 'CLOSED', 'WAIVED'],
  PENALTY_PAID: ['CLOSED', 'DISPUTED', 'OVERTURNED'],
  DISPUTED: ['CLOSED', 'OVERTURNED', 'PENALTY_PENDING', 'WARNING_ISSUED'],
  WAIVED: ['CLOSED', 'OVERTURNED'],
  CLOSED: ['OVERTURNED'],
  OVERTURNED: ['CLOSED'],
};

const INCIDENT_TRANSITIONS: Readonly<
  Record<string, readonly string[]>
> = {
  REPORTED: ['SECURITY_NOTIFIED', 'OWNER_NOTIFIED', 'IN_PROGRESS', 'REJECTED', 'CLOSED'],
  SECURITY_NOTIFIED: ['OWNER_NOTIFIED', 'IN_PROGRESS', 'REJECTED', 'CLOSED'],
  OWNER_NOTIFIED: ['IN_PROGRESS', 'REJECTED', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'REJECTED', 'ESCALATED', 'CLOSED'],
  RESOLVED: ['CLOSED'],
  REJECTED: ['CLOSED'],
  CLOSED: [],
  ESCALATED: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
};

export function canTransitionViolation(
  from: ParkingViolationStatus,
  to: ParkingViolationStatus,
): { allowed: boolean; from: ParkingViolationStatus; to: ParkingViolationStatus; violation?: { code: string; field: string; blocking: boolean; detail?: string } } {
  if (from === to) {
    return { allowed: true, from, to };
  }
  const allowed = VIOLATION_TRANSITIONS[from]?.includes(to) ?? false;
  if (!allowed) {
    return {
      allowed: false,
      from,
      to,
      violation: {
        code: 'ILLEGAL_TRANSITION' as const,
        field: `violation.status.${to}`,
        blocking: true,
        detail: `Violation cannot move from ${from} to ${to}.`,
      },
    };
  }
  return { allowed: true, from, to };
}

export function canTransitionIncident(
  from: string,
  to: string,
): { allowed: boolean; from: string; to: string; violation?: { code: string; field: string; blocking: boolean; detail?: string } } {
  if (from === to) {
    return { allowed: true, from, to };
  }
  const allowed = INCIDENT_TRANSITIONS[from]?.includes(to) ?? false;
  if (!allowed) {
    return {
      allowed: false,
      from,
      to,
      violation: {
        code: 'ILLEGAL_TRANSITION' as const,
        field: `incident.status.${to}`,
        blocking: true,
        detail: `Incident cannot move from ${from} to ${to}.`,
      },
    };
  }
  return { allowed: true, from, to };
}

export function isViolationTerminal(status: ParkingViolationStatus): boolean {
  return status === 'CLOSED' || status === 'OVERTURNED';
}

export function isIncidentTerminal(status: string): boolean {
  return status === 'CLOSED' || status === 'REJECTED';
}

export function canApplyPenalty(status: ParkingViolationStatus): boolean {
  return status === 'PENALTY_PENDING' || status === 'WARNING_ISSUED' || status === 'RECORDED';
}

export function canOverturnViolation(status: ParkingViolationStatus): boolean {
  return status === 'PENALTY_PAID' || status === 'WARNING_ISSUED' || status === 'RECORDED' || status === 'DISPUTED';
}

export function isRepeatOffenceApplicable(status: ParkingViolationStatus): boolean {
  return status === 'RECORDED' || status === 'WARNING_ISSUED' || status === 'PENALTY_PENDING' || status === 'PENALTY_PAID' || status === 'DISPUTED';
}

export function getViolationValidNextStates(
  status: ParkingViolationStatus,
): readonly ParkingViolationStatus[] {
  return VIOLATION_TRANSITIONS[status] ?? [];
}

export function getIncidentValidNextStates(
  status: string,
): readonly string[] {
  return INCIDENT_TRANSITIONS[status] ?? [];
}

export function isValidViolationTransition(
  from: ParkingViolationStatus,
  to: ParkingViolationStatus,
): boolean {
  return VIOLATION_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isValidIncidentTransition(
  from: string,
  to: string,
): boolean {
  return INCIDENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isViolationConfirmed(status: ParkingViolationStatus): boolean {
  return status === 'WARNING_ISSUED' || status === 'PENALTY_PENDING' || status === 'PENALTY_PAID' || status === 'DISPUTED' || status === 'WAIVED' || status === 'CLOSED';
}

export function isIncidentConfirmed(status: string): boolean {
  return status === 'OWNER_NOTIFIED' || status === 'IN_PROGRESS' || status === 'RESOLVED' || status === 'ESCALATED';
}