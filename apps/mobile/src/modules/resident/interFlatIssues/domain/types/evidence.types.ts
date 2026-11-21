import type { Absent } from '../../../../../shared/types/absence.types';

export type EvidenceKind =
  | 'PHOTO'
  | 'VIDEO'
  | 'AUDIO_NOTE'
  | 'DOCUMENT'
  | 'INSPECTION_PHOTO'
  | 'DAMAGE_ESTIMATE'
  | 'INSPECTION_REPORT'
  | 'OTHER';

export type EvidenceVisibility =
  | 'PARTIES_ONLY'
  | 'COMMITTEE_AND_MEDIATOR'
  | 'MEDIATOR_ONLY'
  | 'INSPECTOR_ONLY';

export type EvidenceLifecycle = 'PENDING_VAULT' | 'STAGED' | 'VERIFIED' | 'REJECTED' | 'WITHDRAWN';

export type EvidenceRecord = {
  readonly id: string;
  readonly caseId: string;
  readonly societyId: string;
  readonly kind: EvidenceKind;
  readonly caption: string;
  readonly submittedByUserId: string;
  readonly submittedByPartyId: string;
  readonly submittedAt: string;
  readonly vaultDocumentId: string | Absent;
  readonly vaultVersionId: string | Absent;
  readonly vaultChecksum: string | Absent;
  readonly visibility: EvidenceVisibility;
  readonly lifecycle: EvidenceLifecycle;
  readonly affectedUnitIds: readonly string[];
  readonly rejectionReason: string | Absent;
  readonly withdrawnAt: string | Absent;
};

export type EvidenceSubmission = {
  readonly kind: EvidenceKind;
  readonly caption: string;
  readonly visibility: EvidenceVisibility;
  readonly affectedUnitIds: readonly string[];
  readonly vaultDocumentId: string | Absent;
  readonly vaultVersionId: string | Absent;
};

export type EvidenceVaultVerification = {
  readonly available: boolean;
  readonly documentVerified: boolean;
  readonly checksumPresent: boolean;
  readonly subjectAllowed: boolean;
  readonly detail: string;
};

export type EvidenceVaultPort = {
  readonly vaultName: string;
  readonly verify: (input: {
    readonly societyId: string;
    readonly caseId: string;
    readonly requestingUserId: string;
    readonly documentId: string;
    readonly versionId: string;
  }) => EvidenceVaultVerification;
};

export const VAULT_UNAVAILABLE: EvidenceVaultVerification = {
  available: false,
  documentVerified: false,
  checksumPresent: false,
  subjectAllowed: false,
  detail: 'Document Vault is not available to the dispute domain in this build.',
};

export function isEvidenceRetrievable(evidence: EvidenceRecord): boolean {
  return (
    evidence.lifecycle === 'VERIFIED' &&
    evidence.vaultDocumentId !== undefined &&
    evidence.withdrawnAt === undefined
  );
}

export function visibleEvidenceFor(
  evidence: readonly EvidenceRecord[],
  visibility: readonly EvidenceVisibility[],
): readonly EvidenceRecord[] {
  return evidence.filter(
    (item) =>
      item.lifecycle === 'VERIFIED' &&
      item.withdrawnAt === undefined &&
      visibility.includes(item.visibility),
  );
}
