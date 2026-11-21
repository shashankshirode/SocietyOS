import type { Absent } from '../../../../../../shared/types/absence.types';
import type {
  DocumentVaultViolation,
  TransitionResult,
  VaultClock,
} from '../types/primitives';
import { violation } from '../types/primitives';
import type {
  ExpiryLifecycleState,
  RetentionLifecycleState,
} from '../types/document.types';
import type {
  ErasureRequest,
  LegalHold,
  RetentionAssessment,
  RetentionBasis,
} from '../types/retention.types';
import { isExpiringWithin, isExpiredAt } from './versionStateMachine';

const EXPIRY_TRANSITIONS: Readonly<
  Record<ExpiryLifecycleState, readonly ExpiryLifecycleState[]>
> = {
  NOT_APPLICABLE: ['NOT_EXPIRED'],
  NOT_EXPIRED: ['EXPIRING_SOON', 'EXPIRED', 'REVOCATION_PENDING'],
  EXPIRING_SOON: ['EXPIRED', 'NOT_EXPIRED', 'REVOCATION_PENDING'],
  EXPIRED: ['REVOCATION_PENDING'],
  REVOCATION_PENDING: ['EXPIRED'],
};

const RETENTION_TRANSITIONS: Readonly<
  Record<RetentionLifecycleState, readonly RetentionLifecycleState[]>
> = {
  ACTIVE: ['UNDER_HOLD', 'RETENTION_DUE', 'ANONYMISATION_DUE', 'ARCHIVED'],
  UNDER_HOLD: ['ACTIVE', 'RETENTION_DUE', 'ANONYMISATION_DUE'],
  RETENTION_DUE: ['UNDER_HOLD', 'ANONYMISED', 'ARCHIVED', 'DISPOSED', 'DISPOSITION_DEFERRED'],
  ANONYMISATION_DUE: ['UNDER_HOLD', 'ANONYMISED', 'DISPOSITION_DEFERRED'],
  ANONYMISED: ['ARCHIVED', 'DISPOSED'],
  ARCHIVED: ['DISPOSED'],
  DISPOSED: [],
  DISPOSITION_DEFERRED: ['UNDER_HOLD', 'RETENTION_DUE', 'ANONYMISATION_DUE', 'ARCHIVED'],
};

export function canTransitionExpiry(
  from: ExpiryLifecycleState,
  to: ExpiryLifecycleState,
): TransitionResult<ExpiryLifecycleState> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  if (!EXPIRY_TRANSITIONS[from].includes(to)) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `expiry.lifecycle.${to}`,
        `Expiry lifecycle cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function canTransitionRetention(
  from: RetentionLifecycleState,
  to: RetentionLifecycleState,
): TransitionResult<RetentionLifecycleState> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  if (!RETENTION_TRANSITIONS[from].includes(to)) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `retention.lifecycle.${to}`,
        `Retention lifecycle cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function resolveExpiryState(
  document: { expiresAt: string | Absent; expiryLifecycle: ExpiryLifecycleState },
  clock: VaultClock,
  warningWindowDays: number,
): ExpiryLifecycleState {
  if (document.expiresAt === undefined) {
    return 'NOT_APPLICABLE';
  }
  if (isExpiredAt(document, clock)) {
    return document.expiryLifecycle === 'REVOCATION_PENDING' ? 'REVOCATION_PENDING' : 'EXPIRED';
  }
  if (isExpiringWithin(document, clock, warningWindowDays)) {
    return 'EXPIRING_SOON';
  }
  return 'NOT_EXPIRED';
}

export function activeHolds(
  holds: readonly LegalHold[],
  documentId: string,
): readonly LegalHold[] {
  return holds.filter((hold) => hold.documentId === documentId && hold.active);
}

export function assessRetention(
  input: {
    documentId: string;
    retainUntil: string | Absent;
    policyId: string;
    policyVersion: number;
    holds: readonly LegalHold[];
    erasureRequest: ErasureRequest | Absent;
    evaluatedAt: Date;
  },
): RetentionAssessment {
  const holds = activeHolds(input.holds, input.documentId);
  const holdIds = holds.map((hold) => hold.id);
  const blockedByHold = holdIds.length > 0;

  if (input.erasureRequest !== undefined) {
    return {
      policyId: input.policyId,
      policyVersion: input.policyVersion,
      retainUntil: input.retainUntil ?? input.evaluatedAt.toISOString(),
      evaluatedAt: input.evaluatedAt.toISOString(),
      dueNow: !blockedByHold,
      basis: 'ERASURE_REQUEST',
      holds: holdIds,
      blockedByHold,
      disposition: blockedByHold ? 'RETAIN' : 'ANONYMISE',
    };
  }

  if (input.retainUntil === undefined) {
    return {
      policyId: input.policyId,
      policyVersion: input.policyVersion,
      retainUntil: input.evaluatedAt.toISOString(),
      evaluatedAt: input.evaluatedAt.toISOString(),
      dueNow: false,
      basis: 'POLICY',
      holds: holdIds,
      blockedByHold,
      disposition: 'RETAIN',
    };
  }

  const retainUntil = Date.parse(input.retainUntil);
  if (Number.isNaN(retainUntil)) {
    return {
      policyId: input.policyId,
      policyVersion: input.policyVersion,
      retainUntil: input.evaluatedAt.toISOString(),
      evaluatedAt: input.evaluatedAt.toISOString(),
      dueNow: false,
      basis: 'POLICY',
      holds: holdIds,
      blockedByHold,
      disposition: 'RETAIN',
    };
  }

  const dueNow = retainUntil <= input.evaluatedAt.getTime();
  const basis: RetentionBasis = blockedByHold ? 'LEGAL_HOLD' : 'POLICY';

  return {
    policyId: input.policyId,
    policyVersion: input.policyVersion,
    retainUntil: input.retainUntil,
    evaluatedAt: input.evaluatedAt.toISOString(),
    dueNow: dueNow && !blockedByHold,
    basis,
    holds: holdIds,
    blockedByHold,
    disposition: blockedByHold ? 'RETAIN' : dueNow ? 'PURGE' : 'RETAIN',
  };
}

export function retentionGate(
  assessment: RetentionAssessment,
  requestedDisposition: 'ARCHIVE' | 'ANONYMISE' | 'PURGE',
): DocumentVaultViolation | Absent {
  if (assessment.blockedByHold) {
    return violation(
      'RETENTION_HOLD_ACTIVE',
      'retention.legalHold',
      `Legal hold is active: ${assessment.holds.join(', ')}.`,
    );
  }
  if (!assessment.dueNow) {
    return violation(
      'RETENTION_NOT_DUE',
      'retention.retainUntil',
      `Retention is not due until ${assessment.retainUntil}.`,
    );
  }
  if (requestedDisposition === 'PURGE' && assessment.disposition === 'ANONYMISE') {
    return violation(
      'RETENTION_ERASURE_DEFERRAL',
      'retention.disposition',
      'Personal fields must be anonymised rather than purged under this policy.',
    );
  }
  if (requestedDisposition === 'ANONYMISE' && assessment.disposition === 'PURGE') {
    return undefined;
  }
  return undefined;
}

export function erasureDeferral(
  assessment: RetentionAssessment,
): DocumentVaultViolation | Absent {
  if (assessment.blockedByHold) {
    return violation(
      'RETENTION_ERASURE_DEFERRAL',
      'retention.erasure',
      'Erasure is deferred because a legal hold or audit requirement applies.',
    );
  }
  return undefined;
}

export function applyDisposition(
  current: RetentionLifecycleState,
  assessment: RetentionAssessment,
): RetentionLifecycleState {
  if (assessment.blockedByHold) {
    return 'UNDER_HOLD';
  }
  if (current === 'ANONYMISED' || current === 'ARCHIVED' || current === 'DISPOSED') {
    return current;
  }
  switch (assessment.disposition) {
    case 'ARCHIVE':
      return 'ARCHIVED';
    case 'ANONYMISE':
      return 'ANONYMISED';
    case 'PURGE':
      return 'DISPOSED';
    case 'RETAIN':
      return 'ACTIVE';
  }
}

export function isTerminalRetention(state: RetentionLifecycleState): boolean {
  return state === 'DISPOSED';
}
