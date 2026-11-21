import type { Absent } from '../../../../../../shared/types/absence.types';
import type { Revision, TraceContext, VaultScope } from './primitives';

export type LegalHold = {
  readonly id: string;
  readonly scope: VaultScope;
  readonly documentId: string;
  readonly reason: string;
  readonly placedBy: string;
  readonly placedAt: string;
  readonly releasedAt: string | Absent;
  readonly releasedBy: string | Absent;
  readonly active: boolean;
};

export type RetentionBasis = 'POLICY' | 'LEGAL_HOLD' | 'ERASURE_REQUEST' | 'AUDIT_REQUIREMENT';

export type ErasureRequest = {
  readonly id: string;
  readonly scope: VaultScope;
  readonly subjectUserId: string;
  readonly requestedAt: string;
  readonly requestedBy: string;
  readonly eligibleFields: readonly string[];
  readonly state: 'RECEIVED' | 'EVALUATED' | 'PARTIAL' | 'DEFERRED' | 'COMPLETED';
  readonly deferralReason: string | Absent;
  readonly completedAt: string | Absent;
};

export type RetentionAssessment = {
  readonly policyId: string;
  readonly policyVersion: number;
  readonly retainUntil: string;
  readonly evaluatedAt: string;
  readonly dueNow: boolean;
  readonly basis: RetentionBasis;
  readonly holds: readonly string[];
  readonly blockedByHold: boolean;
  readonly disposition: 'ARCHIVE' | 'ANONYMISE' | 'PURGE' | 'RETAIN';
};

export type DispositionOutcome =
  | { readonly applied: true; readonly nextState: string; readonly objectDeleted: boolean; readonly detail: string }
  | { readonly applied: false; readonly reason: string; readonly detail: string };

export type RetentionJobOutcome = {
  readonly documentId: string;
  readonly assessment: RetentionAssessment;
  readonly outcome: DispositionOutcome;
  readonly idempotencyKey: string;
  readonly processedAt: string;
};

export type TraceableRetentionRecord = {
  readonly id: string;
  readonly scope: VaultScope;
  readonly documentId: string;
  readonly state: string;
  readonly assessment: RetentionAssessment;
  readonly revision: Revision;
  readonly trace: TraceContext;
};
