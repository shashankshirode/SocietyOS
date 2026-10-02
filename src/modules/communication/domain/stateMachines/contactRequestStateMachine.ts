import type {
  CommunicationViolation,
  ContactRequestStatus,
  TransitionResult,
} from '../types';
import { violation } from '../types';

const CONTACT_REQUEST_TRANSITIONS: Readonly<
  Record<ContactRequestStatus, readonly ContactRequestStatus[]>
> = {
  DRAFT: ['REQUESTED', 'CANCELLED'],
  REQUESTED: ['PENDING_CONSENT', 'CANCELLED', 'EXPIRED', 'BLOCKED', 'REPORTED'],
  PENDING_CONSENT: ['ACCEPTED', 'REJECTED', 'EXPIRED', 'BLOCKED', 'REPORTED'],
  ACCEPTED: ['CLOSED', 'BLOCKED', 'REPORTED'],
  REJECTED: ['CLOSED'],
  CANCELLED: [],
  EXPIRED: ['CLOSED'],
  BLOCKED: ['CLOSED'],
  REPORTED: ['CLOSED', 'BLOCKED'],
  CLOSED: [],
};

export function canTransitionContactRequest(
  from: ContactRequestStatus,
  to: ContactRequestStatus,
): TransitionResult<ContactRequestStatus> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  const allowed = CONTACT_REQUEST_TRANSITIONS[from].includes(to);
  if (!allowed) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `contactRequest.status.${to}`,
        `Contact request cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function getContactRequestNextStates(
  status: ContactRequestStatus,
): readonly ContactRequestStatus[] {
  return CONTACT_REQUEST_TRANSITIONS[status];
}

export function isContactRequestTerminal(
  status: ContactRequestStatus,
): boolean {
  return (
    status === 'REJECTED' ||
    status === 'CANCELLED' ||
    status === 'CLOSED'
  );
}

export function isContactRequestOpen(status: ContactRequestStatus): boolean {
  return (
    status === 'REQUESTED' || status === 'PENDING_CONSENT'
  );
}

export function isContactRequestExpired(
  status: ContactRequestStatus,
  expiresAtIso: string,
  nowMs: number,
): boolean {
  if (isContactRequestTerminal(status)) {
    return false;
  }
  const expiresAtMs = Date.parse(expiresAtIso);
  if (Number.isNaN(expiresAtMs)) {
    return false;
  }
  return nowMs >= expiresAtMs;
}

export function contactRequestExpiryViolations(
  status: ContactRequestStatus,
  expiresAtIso: string,
  nowMs: number,
): readonly CommunicationViolation[] {
  if (!isContactRequestExpired(status, expiresAtIso, nowMs)) {
    return [];
  }
  return [
    violation(
      'PRECONDITION_FAILED',
      'contactRequest.expiresAtIso',
      'The contact request has expired and can no longer be accepted.',
    ),
  ];
}
