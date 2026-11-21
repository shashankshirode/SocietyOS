import type { Absent } from '../../../../../shared/types/absence.types';
import type { Money } from './money';
import type { LifecycleActor, LifecycleScope } from './primitives';

export type NocKind = 'MOVE_OUT_NOC' | 'TENANT_NOC' | 'NO_DUES_CERTIFICATE' | 'PARKING_RELEASE';

export type NocStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SIGNED'
  | 'ISSUED'
  | 'REVOKED'
  | 'ARCHIVED'
  | 'CANCELLED';

export type NocCommandKind =
  | 'SUBMIT_REQUEST'
  | 'BEGIN_REVIEW'
  | 'GRANT_APPROVAL'
  | 'REJECT'
  | 'RECORD_SIGNATURE'
  | 'RECORD_ISSUANCE'
  | 'RECORD_REVOCATION'
  | 'ARCHIVE'
  | 'CANCEL';

export type NocRequestState = {
  readonly nocRequestId: string;
  readonly requestNumber: string;
  readonly kind: NocKind;
  readonly status: NocStatus;
  readonly revision: number;
  readonly scope: LifecycleScope;
  readonly linkedMoveOutRequestId: string | Absent;
  readonly linkedClearanceSnapshotId: string | Absent;
  readonly linkedSettlementId: string | Absent;
  readonly requestedByActorId: string;
  readonly requiredByDate: string;
  readonly purposeKey: string;
  readonly purposeDetail: string;
  readonly approval: NocApproval | Absent;
  readonly signature: NocSignature | Absent;
  readonly certificateId: string | Absent;
  readonly revocation: NocRevocation | Absent;
  readonly archive: NocArchive | Absent;
  readonly cancellation: NocCancellation | Absent;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type NocApproval = {
  readonly approvedAt: string;
  readonly approvedByActorId: string;
  readonly approvalReference: string;
  readonly committeeReference: string | Absent;
};

export type NocSignature = {
  readonly signedAt: string;
  readonly signedByActorId: string;
  readonly signatureMethod: string;
  readonly documentId: string;
  readonly documentChecksum: string;
};

export type NocRevocation = {
  readonly revokedAt: string;
  readonly revokedByActorId: string;
  readonly reasonKey: string;
  readonly reasonDetail: string;
  readonly accessAlreadyRevoked: boolean;
};

export type NocArchive = {
  readonly archivedAt: string;
  readonly archivedByActorId: string;
  readonly retentionPolicyKey: string;
  readonly archiveReference: string;
};

export type NocCancellation = {
  readonly cancelledAt: string;
  readonly cancelledByActorId: string;
  readonly reasonKey: string;
  readonly reasonDetail: string;
};

export type NocCommand = {
  readonly kind: NocCommandKind;
  readonly actor: LifecycleActor;
  readonly idempotencyKey: string;
  readonly expectedRevision: number;
  readonly occurredAt: string;
  readonly approvalReference: string | Absent;
  readonly committeeReference: string | Absent;
  readonly rejectionReasonKey: string | Absent;
  readonly rejectionReasonDetail: string | Absent;
  readonly signatureDocumentId: string | Absent;
  readonly signatureDocumentChecksum: string | Absent;
  readonly signatureMethod: string | Absent;
  readonly certificateId: string | Absent;
  readonly revocationReasonKey: string | Absent;
  readonly revocationReasonDetail: string | Absent;
  readonly accessAlreadyRevoked: boolean;
  readonly retentionPolicyKey: string | Absent;
  readonly archiveReference: string | Absent;
  readonly cancellationReasonKey: string | Absent;
  readonly cancellationReasonDetail: string | Absent;
};

export type CertificateTemplateVersion = {
  readonly templateId: string;
  readonly version: string;
  readonly locale: string;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | Absent;
  readonly bodyChecksum: string;
};

export type NocCertificateContent = {
  readonly certificateId: string;
  readonly certificateNumber: string;
  readonly kind: NocKind;
  readonly templateId: string;
  readonly templateVersion: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly societyDisplayName: string;
  readonly unitDisplayLabel: string;
  readonly residentDisplayName: string;
  readonly issueDate: string;
  readonly validUntil: string | Absent;
  readonly clearanceSnapshotId: string | Absent;
  readonly settlementId: string | Absent;
  readonly settlementOutcomeKey: string | Absent;
  readonly netSettlementAmount: Money | Absent;
  readonly issuingAuthorityRole: string;
  readonly signatoryDisplayName: string;
  readonly disclaimerKey: string;
};

export type NocCertificate = {
  readonly certificateId: string;
  readonly certificateNumber: string;
  readonly status: 'ISSUED' | 'REVOKED';
  readonly content: NocCertificateContent;
  readonly verificationCode: string;
  readonly contentChecksum: string;
  readonly issuedAt: string;
  readonly issuedByActorId: string;
  readonly revokedAt: string | Absent;
  readonly revokedByActorId: string | Absent;
  readonly linkedNocRequestId: string;
  readonly linkedMoveOutRequestId: string | Absent;
};

export type NocQrPayload = {
  readonly certificateNumber: string;
  readonly verificationCode: string;
  readonly contentChecksum: string;
  readonly issuerId: string;
  readonly schemaVersion: string;
};

export type NocVerificationOutcome =
  | {
      readonly verdict: 'VALID';
      readonly certificate: NocCertificate;
      readonly content: NocCertificateContent;
      readonly checkedAt: string;
    }
  | {
      readonly verdict: 'REVOKED';
      readonly certificateId: string;
      readonly certificateNumber: string;
      readonly revokedAt: string;
      readonly checkedAt: string;
    }
  | {
      readonly verdict: 'NOT_FOUND';
      readonly certificateNumber: string;
      readonly checkedAt: string;
    }
  | {
      readonly verdict: 'CHECKSUM_MISMATCH';
      readonly certificateNumber: string;
      readonly expectedChecksum: string;
      readonly actualChecksum: string;
      readonly checkedAt: string;
    }
  | {
      readonly verdict: 'TAMPERED';
      readonly certificateNumber: string;
      readonly checkedAt: string;
    }
  | {
      readonly verdict: 'UNPARSEABLE';
      readonly reasonKey: string;
      readonly checkedAt: string;
    };

export const NOC_QR_SCHEMA_VERSION = 'sos.noc.qr.v1';
export const NOC_QR_ISSUER_ID = 'society-os';

export const NOC_TERMINAL_STATUSES: readonly NocStatus[] = ['REVOKED', 'ARCHIVED', 'CANCELLED'];
