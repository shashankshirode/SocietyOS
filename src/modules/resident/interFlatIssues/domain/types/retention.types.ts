import type { Absent } from '../../../../../shared/types/absence.types';

export type RetentionLifecycle = 'ACTIVE' | 'HOLD' | 'REVIEW_DUE' | 'DISPOSE_READY' | 'DISPOSED';

export type DisputeRetentionPolicy = {
  readonly policyId: string;
  readonly version: string;
  readonly caseClosureRetentionMonths: number;
  readonly unresolvedRetentionMonths: number;
  readonly evidenceVaultRetentionMonths: number;
  readonly legalHoldBlocksDisposal: boolean;
};

export type DisputeRetentionRecord = {
  readonly caseId: string;
  readonly societyId: string;
  readonly policyRef: string;
  readonly lifecycle: RetentionLifecycle;
  readonly legalHoldActive: boolean;
  readonly closureDate: string | Absent;
  readonly lastAccessAt: string | Absent;
  readonly reviewDueAt: string | Absent;
  readonly disposeAfterAt: string | Absent;
  readonly disposedAt: string | Absent;
};

export function isDisposalBlocked(record: DisputeRetentionRecord): boolean {
  return record.legalHoldActive;
}

export function shouldReview(record: DisputeRetentionRecord, now: Date): boolean {
  if (record.reviewDueAt === undefined) {
    return false;
  }
  return Date.parse(record.reviewDueAt) <= now.getTime();
}

export function disposeReady(record: DisputeRetentionRecord, now: Date): boolean {
  if (isDisposalBlocked(record)) {
    return false;
  }
  if (record.disposeAfterAt === undefined) {
    return false;
  }
  return Date.parse(record.disposeAfterAt) <= now.getTime();
}
