import type { Absent } from '../../../../../shared/types/absence.types';
import type { Money } from './money';
import type { LifecycleActor, LifecycleScope } from './primitives';

export type MoveOutStatus =
  | 'REQUESTED'
  | 'CLEARANCE_CHECK'
  | 'EXCEPTION'
  | 'READY'
  | 'APPROVED'
  | 'REJECTED'
  | 'SIGNED'
  | 'ISSUED'
  | 'ACCESS_REVOKED'
  | 'OCCUPANCY_CLOSED'
  | 'ARCHIVED'
  | 'CANCELLED';

export type MoveOutActorRole =
  | 'RESIDENT_OR_REPRESENTATIVE'
  | 'TREASURER'
  | 'FACILITY_MANAGER'
  | 'SOCIETY_SECRETARY'
  | 'SOCIETY_CHAIRPERSON'
  | 'SECURITY'
  | 'SOCIETY_ADMIN'
  | 'SYSTEM'
  | 'AUDITOR';

export type MoveOutCommandKind =
  | 'SUBMIT_REQUEST'
  | 'BEGIN_CLEARANCE_CHECK'
  | 'RECORD_CLEARANCE_SNAPSHOT'
  | 'RECORD_CLEARANCE_EXCEPTION'
  | 'GRANT_APPROVAL'
  | 'REJECT_APPROVAL'
  | 'RECORD_SIGNATURE'
  | 'RECORD_ISSUANCE'
  | 'RECORD_ACCESS_REVOCATION'
  | 'RECORD_OCCUPANCY_CLOSURE'
  | 'ARCHIVE'
  | 'CANCEL';

export type MoveOutRequestState = {
  readonly moveOutRequestId: string;
  readonly requestNumber: string;
  readonly status: MoveOutStatus;
  readonly revision: number;
  readonly scope: LifecycleScope;
  readonly movingPersonType: string;
  readonly requestedExitDate: string;
  readonly declaredReasonKey: string;
  readonly declaredReasonDetail: string;
  readonly contactReference: string;
  readonly vehicleEntryRequired: boolean;
  readonly liftSlotRequired: boolean;
  readonly moverCount: number;
  readonly clearanceSnapshotId: string | Absent;
  readonly settlementSnapshotId: string | Absent;
  readonly approvalReference: string | Absent;
  readonly signature: MoveOutSignature | Absent;
  readonly nocCertificateId: string | Absent;
  readonly accessRevocation: AccessRevocationRecord | Absent;
  readonly occupancyClosure: OccupancyClosureRecord | Absent;
  readonly archiveRecord: ArchiveRecord | Absent;
  readonly cancellation: MoveOutCancellation | Absent;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type MoveOutSignature = {
  readonly signedAt: string;
  readonly signedByActorId: string;
  readonly signatureMethod: string;
  readonly documentId: string;
  readonly documentChecksum: string;
  readonly templateVersion: string;
};

export type AccessRevocationRecord = {
  readonly revokedAt: string;
  readonly revokedByActorId: string;
  readonly credentialCount: number;
  readonly parkingAllocationReleased: boolean;
  readonly gateIntegrationReference: string;
  readonly residenceAccessStatusBefore: string;
  readonly residenceAccessStatusAfter: string;
  readonly failureReference: string | Absent;
};

export type OccupancyClosureRecord = {
  readonly closedAt: string;
  readonly closedByActorId: string;
  readonly relationshipId: string;
  readonly occupancyEndDate: string;
  readonly finalMeterReadingReference: string | Absent;
};

export type ArchiveRecord = {
  readonly archivedAt: string;
  readonly archivedByActorId: string;
  readonly retentionPolicyKey: string;
  readonly archiveReference: string;
  readonly containsPersonalData: boolean;
};

export type MoveOutCancellation = {
  readonly cancelledAt: string;
  readonly cancelledByActorId: string;
  readonly reasonKey: string;
  readonly reasonDetail: string;
};

export type MoveOutCommand = {
  readonly kind: MoveOutCommandKind;
  readonly actor: LifecycleActor;
  readonly idempotencyKey: string;
  readonly expectedRevision: number;
  readonly occurredAt: string;
  readonly clearanceSnapshotId: string | Absent;
  readonly settlementSnapshotId: string | Absent;
  readonly approvalReference: string | Absent;
  readonly rejectionReasonKey: string | Absent;
  readonly rejectionReasonDetail: string | Absent;
  readonly signatureDocumentId: string | Absent;
  readonly signatureDocumentChecksum: string | Absent;
  readonly signatureMethod: string | Absent;
  readonly templateVersion: string | Absent;
  readonly nocCertificateId: string | Absent;
  readonly credentialCount: number;
  readonly parkingAllocationReleased: boolean;
  readonly gateIntegrationReference: string | Absent;
  readonly residenceAccessStatusBefore: string | Absent;
  readonly residenceAccessStatusAfter: string | Absent;
  readonly failureReference: string | Absent;
  readonly occupancyEndDate: string | Absent;
  readonly finalMeterReadingReference: string | Absent;
  readonly retentionPolicyKey: string | Absent;
  readonly archiveReference: string | Absent;
  readonly containsPersonalData: boolean;
  readonly cancellationReasonKey: string | Absent;
  readonly cancellationReasonDetail: string | Absent;
  readonly recoveredAmount: Money | Absent;
};

export const MOVE_OUT_TERMINAL_STATUSES: readonly MoveOutStatus[] = ['ARCHIVED', 'CANCELLED'];
