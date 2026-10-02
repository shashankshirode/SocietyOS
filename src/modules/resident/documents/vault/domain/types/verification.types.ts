import type { Absent } from '../../../../../../shared/types/absence.types';
import type { Revision, TraceContext, VaultScope } from './primitives';

export type VerificationCaseState =
  | 'OPEN'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'RESUBMISSION_REQUIRED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'CLOSED';

export type ChecklistItemState =
  | 'PENDING'
  | 'COMPLETED'
  | 'NOT_APPLICABLE'
  | 'FAILED';

export type VerificationChecklistItem = {
  readonly id: string;
  readonly label: string;
  readonly required: boolean;
  readonly state: ChecklistItemState;
  readonly completedBy: string | Absent;
  readonly completedAt: string | Absent;
  readonly note: string | Absent;
};

export type VerificationChecklistTemplate = {
  readonly templateId: string;
  readonly version: number;
  readonly categoryCode: string;
  readonly items: readonly VerificationChecklistItem[];
  readonly effectiveFrom: string;
  readonly effectiveTo: string | Absent;
};

export type VerificationChecklist = {
  readonly templateId: string;
  readonly templateVersion: number;
  readonly items: readonly VerificationChecklistItem[];
};

export type VerificationDecision =
  | 'APPROVE'
  | 'REJECT'
  | 'REQUEST_RESUBMISSION'
  | 'RESUBMIT'
  | 'EXPIRE'
  | 'REVOKE';

export type VerificationDecisionRecord = {
  readonly decision: VerificationDecision;
  readonly decidedBy: string;
  readonly decidedAt: string;
  readonly reason: string | Absent;
  readonly checklistSnapshot: VerificationChecklist;
  readonly reviewedVersionId: string;
  readonly reviewedVersionNumber: number;
};

export type ResubmissionWindow = {
  readonly requestedAt: string;
  readonly deadline: string;
  readonly attempt: number;
  readonly exhausted: boolean;
};

export type VerificationCase = {
  readonly id: string;
  readonly scope: VaultScope;
  readonly documentId: string;
  readonly versionId: string;
  readonly versionNumber: number;
  readonly state: VerificationCaseState;
  readonly checklist: VerificationChecklist;
  readonly submittedBy: string;
  readonly submittedAt: string;
  readonly assignedReviewerId: string | Absent;
  readonly decisions: readonly VerificationDecisionRecord[];
  readonly resubmission: ResubmissionWindow | Absent;
  readonly closesAt: string | Absent;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type SignatureMethod =
  | 'ADMIN_DIGITAL'
  | 'E_SIGN_PROVIDER'
  | 'DSC_PROVIDER'
  | 'AADHAAR_ESIGN'
  | 'WET_INK_OFFLINE';

export type SignatureProviderState =
  | 'NOT_CONFIGURED'
  | 'READY'
  | 'SUBMITTED'
  | 'ACKNOWLEDGED'
  | 'FAILED'
  | 'UNAVAILABLE';

export type SignatureSigner = {
  readonly signerId: string;
  readonly signerRole: string;
  readonly signedAt: string;
  readonly method: SignatureMethod;
  readonly providerReference: string | Absent;
  readonly certificateThumbprint: string | Absent;
  readonly signedPayloadDigest: string;
  readonly algorithm: string;
  readonly attestedAt: string | Absent;
};

export type SignatureEnvelopeState =
  | 'PENDING'
  | 'PARTIALLY_SIGNED'
  | 'SIGNED'
  | 'FAILED'
  | 'REVOKED';

export type SignatureEnvelope = {
  readonly id: string;
  readonly scope: VaultScope;
  readonly documentId: string;
  readonly versionId: string;
  readonly verificationCaseId: string;
  readonly method: SignatureMethod;
  readonly state: SignatureEnvelopeState;
  readonly provider: SignatureProviderState;
  readonly payloadDigest: string;
  readonly digestAlgorithm: 'SHA-256' | 'SHA-512';
  readonly signers: readonly SignatureSigner[];
  readonly failureDetail: string | Absent;
  readonly createdAt: string;
  readonly sealedAt: string | Absent;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type SignedIssuance = {
  readonly issuanceId: string;
  readonly documentId: string;
  readonly versionId: string;
  readonly envelopeId: string;
  readonly payloadDigest: string;
  readonly digestAlgorithm: 'SHA-256' | 'SHA-512';
  readonly sealedAt: string;
  readonly verificationCode: string;
};
