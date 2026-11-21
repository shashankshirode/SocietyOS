import type { Absent } from '../../../../../../shared/types/absence.types';
import type { Revision, TraceContext, VaultScope } from './primitives';

export type DocumentCategoryGroup =
  | 'SOCIETY'
  | 'OWNER'
  | 'TENANT'
  | 'MOVE_IN'
  | 'MOVE_OUT'
  | 'STAFF_VENDOR'
  | 'COMPLIANCE';

export type DocumentOwningEntityType =
  | 'USER'
  | 'RESIDENT'
  | 'OWNER'
  | 'TENANT'
  | 'UNIT'
  | 'HOUSEHOLD'
  | 'SOCIETY'
  | 'MOVE_IN_REQUEST'
  | 'MOVE_OUT_REQUEST'
  | 'NOC'
  | 'VEHICLE'
  | 'PARKING'
  | 'VENDOR'
  | 'STAFF'
  | 'ASSET'
  | 'COMPLIANCE_RECORD';

export type DocumentSensitivity =
  | 'PUBLIC'
  | 'INTERNAL'
  | 'RESIDENT'
  | 'CONFIDENTIAL'
  | 'SENSITIVE'
  | 'HIGHLY_SENSITIVE'
  | 'RESTRICTED';

export type StorageLifecycleState =
  | 'NO_OBJECT'
  | 'UPLOAD_IN_PROGRESS'
  | 'QUARANTINED'
  | 'SCANNING'
  | 'AVAILABLE'
  | 'CORRUPT'
  | 'PURGED'
  | 'LEGAL_HOLD';

export type VerificationLifecycleState =
  | 'NOT_REQUIRED'
  | 'NOT_SUBMITTED'
  | 'PENDING_REVIEW'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'RESUBMISSION_REQUIRED'
  | 'EXPIRED'
  | 'REVOKED';

export type SignatureLifecycleState =
  | 'NOT_REQUIRED'
  | 'NOT_REQUESTED'
  | 'PENDING'
  | 'PARTIALLY_SIGNED'
  | 'SIGNED'
  | 'FAILED'
  | 'REVOKED';

export type VersionLifecycleState =
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export type ExpiryLifecycleState =
  | 'NOT_APPLICABLE'
  | 'NOT_EXPIRED'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'REVOCATION_PENDING';

export type RetentionLifecycleState =
  | 'ACTIVE'
  | 'UNDER_HOLD'
  | 'RETENTION_DUE'
  | 'ANONYMISATION_DUE'
  | 'ANONYMISED'
  | 'ARCHIVED'
  | 'DISPOSED'
  | 'DISPOSITION_DEFERRED';

export type IntegrityAlgorithm = 'SHA-256' | 'SHA-512';

export type IntegrityRecord = {
  readonly algorithm: IntegrityAlgorithm;
  readonly checksum: string;
  readonly computedAt: string;
  readonly verifiedAt: string | Absent;
  readonly bytesHashed: number;
};

export type MalwareScanRecord = {
  readonly scannerId: string;
  readonly status: 'PENDING' | 'CLEAN' | 'INFECTED' | 'UNAVAILABLE';
  readonly signatureVersion: string | Absent;
  readonly scannedAt: string | Absent;
  readonly detail: string | Absent;
};

export type DocumentVersionRecord = {
  readonly id: string;
  readonly documentId: string;
  readonly versionNumber: number;
  readonly fileName: string;
  readonly declaredMimeType: string;
  readonly observedMimeType: string;
  readonly byteSize: number;
  readonly storageLifecycle: StorageLifecycleState;
  readonly versionLifecycle: VersionLifecycleState;
  readonly integrity: IntegrityRecord;
  readonly malwareScan: MalwareScanRecord;
  readonly quarantineReason: string | Absent;
  readonly uploadedBy: string;
  readonly uploadedAt: string;
  readonly effectiveFrom: string;
  readonly changeReason: string;
  readonly supersededAt: string | Absent;
  readonly supersededByVersionId: string | Absent;
  readonly objectDigestRef: string;
};

export type DocumentVisibility =
  | 'OWN_ENTITY_ONLY'
  | 'HOUSEHOLD'
  | 'CURRENT_OCCUPANT'
  | 'SOCIETY_COMMITTEE'
  | 'SOCIETY_STAFF'
  | 'AUDITOR_ONLY';

export type DocumentRetentionPolicyRef = {
  readonly policyId: string;
  readonly policyVersion: number;
  readonly effectiveFrom: string;
  readonly retainUntil: string;
  readonly disposition: 'ARCHIVE' | 'ANONYMISE' | 'PURGE';
};

export type DocumentRecord = {
  readonly id: string;
  readonly title: string;
  readonly categoryGroup: DocumentCategoryGroup;
  readonly categoryCode: string;
  readonly scope: VaultScope;
  readonly visibility: DocumentVisibility;
  readonly sensitivity: DocumentSensitivity;
  readonly ownerUserId: string;
  readonly storageLifecycle: StorageLifecycleState;
  readonly verificationLifecycle: VerificationLifecycleState;
  readonly signatureLifecycle: SignatureLifecycleState;
  readonly expiryLifecycle: ExpiryLifecycleState;
  readonly retentionLifecycle: RetentionLifecycleState;
  readonly currentVersionId: string;
  readonly currentVersionNumber: number;
  readonly versionCount: number;
  readonly activeVerificationCaseId: string | Absent;
  readonly signatureEnvelopeId: string | Absent;
  readonly issuedAt: string | Absent;
  readonly expiresAt: string | Absent;
  readonly retentionPolicy: DocumentRetentionPolicyRef | Absent;
  readonly legalHoldIds: readonly string[];
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt: string;
  readonly revision: Revision;
  readonly trace: TraceContext;
  readonly metadata?: { readonly [key: string]: string | undefined };
};

export type DocumentCatalogueEntry = {
  readonly documentId: string;
  readonly scope: VaultScope;
  readonly title: string;
  readonly categoryGroup: DocumentCategoryGroup;
  readonly categoryCode: string;
  readonly visibility: DocumentVisibility;
  readonly sensitivity: DocumentSensitivity;
  readonly currentVersionNumber: number;
  readonly storageLifecycle: StorageLifecycleState;
  readonly verificationLifecycle: VerificationLifecycleState;
  readonly signatureLifecycle: SignatureLifecycleState;
  readonly expiryLifecycle: ExpiryLifecycleState;
  readonly retentionLifecycle: RetentionLifecycleState;
  readonly issuedAt: string | Absent;
  readonly expiresAt: string | Absent;
  readonly revision: number;
};
