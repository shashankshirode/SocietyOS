import type { Absent } from '../../../../../../shared/types/absence.types';
import type {
  DocumentCategoryGroup,
  DocumentOwningEntityType,
  IntegrityAlgorithm,
  IntegrityRecord,
  MalwareScanRecord,
} from './document.types';
import type { Revision, TraceContext, VaultScope } from './primitives';

export type UploadSessionState =
  | 'INITIATED'
  | 'UPLOADING'
  | 'INTERRUPTED'
  | 'BYTES_COMPLETE'
  | 'QUARANTINED'
  | 'SCANNING'
  | 'COMMITTED'
  | 'FAILED'
  | 'ABANDONED'
  | 'EXPIRED';

export type UploadSession = {
  readonly id: string;
  readonly scope: VaultScope;
  readonly categoryGroup: DocumentCategoryGroup;
  readonly categoryCode: string;
  readonly title: string;
  readonly documentId: string | Absent;
  readonly targetVersionNumber: number;
  readonly state: UploadSessionState;
  readonly declaredFileName: string;
  readonly declaredMimeType: string;
  readonly declaredByteSize: number;
  readonly bytesReceived: number;
  readonly resumeToken: string;
  readonly integrityAlgorithm: IntegrityAlgorithm;
  readonly expectedChecksum: string | Absent;
  readonly computedIntegrity: IntegrityRecord | Absent;
  readonly objectDigestRef: string | Absent;
  readonly malwareScan: MalwareScanRecord;
  readonly failureCode: string | Absent;
  readonly failureDetail: string | Absent;
  readonly initiatedBy: string;
  readonly initiatedAt: string;
  readonly expiresAt: string;
  readonly committedAt: string | Absent;
  readonly committedVersionId: string | Absent;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type UploadIntent = {
  readonly scope: VaultScope;
  readonly entityType: DocumentOwningEntityType;
  readonly entityId: string;
  readonly categoryGroup: DocumentCategoryGroup;
  readonly categoryCode: string;
  readonly title: string;
  readonly declaredFileName: string;
  readonly declaredMimeType: string;
  readonly declaredByteSize: number;
  readonly integrityAlgorithm: IntegrityAlgorithm;
  readonly expectedChecksum: string | Absent;
  readonly changeReason: string;
  readonly documentId: string | Absent;
};

export type UploadScanSource =
  | { readonly kind: 'SCANNER_CALLBACK'; readonly scannerId: string }
  | { readonly kind: 'ACTOR'; readonly actorUserId: string; readonly societyId: string };

export type UploadProgress = {
  readonly bytesReceived: number;
  readonly declaredByteSize: number;
  readonly fractionComplete: number;
};

export type ResumeDirective =
  | { readonly resumable: true; readonly resumeToken: string; readonly nextByteOffset: number }
  | { readonly resumable: false; readonly reason: string };
