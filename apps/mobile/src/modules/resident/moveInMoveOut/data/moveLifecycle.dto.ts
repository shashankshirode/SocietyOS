import type { JsonValue } from '../../../../core/api/api.types';
import type { Absent } from '../../../../shared/types/absence.types';
import type { MoveInStatus } from '../domain/types/moveIn.types';
import type { MoveOutStatus } from '../domain/types/moveOut.types';
import type { NocStatus } from '../domain/types/noc.types';

export type MoveInRequestDto = {
  readonly id: string;
  readonly requestNumber?: string;
  readonly status?: string;
  readonly societyId?: string;
  readonly unitId?: string;
  readonly residentId?: string;
  readonly occupancyRelationshipId?: string;
  readonly relationshipType?: string;
  readonly occupancyStartDate?: string;
  readonly requestedOccupancyEndDate?: string | null;
  readonly agreementReference?: string | null;
  readonly partyCount?: number;
  readonly vehicleCount?: number;
  readonly requiresLiftSlot?: boolean;
  readonly requiresParking?: boolean;
  readonly revision?: number;
  readonly verificationOutcome?: string | null;
  readonly appointmentId?: string | null;
  readonly approvalReference?: string | null;
  readonly createdAt?: string;
  readonly updatedAt?: string;
};

export type MoveInVerificationCheckDto = {
  readonly checkKey?: string;
  readonly result?: string;
  readonly detailKey?: string;
  readonly evaluatedAt?: string | null;
  readonly evaluatedByActorId?: string | null;
  readonly evidenceRefs?: readonly string[];
};

export type MoveOutRequestDto = {
  readonly id: string;
  readonly requestNumber?: string;
  readonly status?: string;
  readonly societyId?: string;
  readonly unitId?: string;
  readonly residentId?: string;
  readonly occupancyRelationshipId?: string;
  readonly clearanceSnapshotId?: string | null;
  readonly settlementSnapshotId?: string | null;
  readonly approvalReference?: string | null;
  readonly signatureDocumentId?: string | null;
  readonly signatureDocumentChecksum?: string | null;
  readonly signatureSignedByActorId?: string | null;
  readonly signatureMethod?: string | null;
  readonly templateVersion?: string | null;
  readonly movingPersonType?: string;
  readonly requestedExitDate?: string;
  readonly declaredReasonKey?: string;
  readonly declaredReasonDetail?: string;
  readonly contactReference?: string;
  readonly vehicleEntryRequired?: boolean;
  readonly liftSlotRequired?: boolean;
  readonly moverCount?: number;
  readonly accessRevokedByActorId?: string | null;
  readonly occupancyEndDate?: string | null;
  readonly occupancyClosedByActorId?: string | null;
  readonly finalMeterReadingReference?: string | null;
  readonly archivedByActorId?: string | null;
  readonly failureReference?: string | null;
  readonly nocCertificateId?: string | null;
  readonly residenceAccessStatusBefore?: string | null;
  readonly residenceAccessStatusAfter?: string | null;
  readonly gateIntegrationReference?: string | null;
  readonly credentialCount?: number;
  readonly parkingAllocationReleased?: boolean;
  readonly archiveReference?: string | null;
  readonly retentionPolicyKey?: string | null;
  readonly containsPersonalData?: boolean;
  readonly revision?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
};

export type NocRequestDto = {
  readonly id: string;
  readonly requestNumber?: string;
  readonly kind?: string;
  readonly status?: string;
  readonly linkedMoveOutRequestId?: string | null;
  readonly linkedClearanceSnapshotId?: string | null;
  readonly linkedSettlementId?: string | null;
  readonly requiredByDate?: string;
  readonly revision?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
};

export type CreateMoveInRequestBody = {
  readonly societyId: string;
  readonly unitId: string;
  readonly residentId: string;
  readonly occupancyRelationshipId: string;
  readonly relationshipType: string;
  readonly occupancyStartDate: string;
  readonly partyCount: number;
  readonly vehicleCount: number;
  readonly requiresLiftSlot: boolean;
  readonly requiresParking: boolean;
  readonly idempotencyKey: string;
};

export type CreateMoveOutRequestBody = {
  readonly societyId: string;
  readonly unitId: string;
  readonly residentId: string;
  readonly occupancyRelationshipId: string;
  readonly requestedMoveOutDate: string;
  readonly reasonKey: string;
  readonly reasonDetail: string;
  readonly vehicleEntryRequired: boolean;
  readonly liftSlotRequired: boolean;
  readonly idempotencyKey: string;
};

export type MoveOutClearanceChecklistDto = {
  readonly requestId: string;
  readonly items?: readonly {
    readonly requirementId?: string;
    readonly satisfied?: boolean;
    readonly outstandingAmountMinor?: number | null;
    readonly currency?: string | null;
    readonly detailKey?: string;
  }[];
  readonly checksum?: string;
};

export const MOVE_IN_STATUSES: readonly MoveInStatus[] = [
  'REQUESTED',
  'VERIFIED',
  'SCHEDULED',
  'APPROVED',
  'IN_PROGRESS',
  'EXCEPTION',
  'COMPLETED',
  'CANCELLED',
];

export const MOVE_OUT_STATUSES: readonly MoveOutStatus[] = [
  'REQUESTED',
  'CLEARANCE_CHECK',
  'EXCEPTION',
  'READY',
  'APPROVED',
  'REJECTED',
  'SIGNED',
  'ISSUED',
  'ACCESS_REVOKED',
  'OCCUPANCY_CLOSED',
  'ARCHIVED',
  'CANCELLED',
];

export const NOC_STATUSES: readonly NocStatus[] = [
  'REQUESTED',
  'UNDER_REVIEW',
  'APPROVED',
  'SIGNED',
  'ISSUED',
  'REVOKED',
  'REJECTED',
  'ARCHIVED',
  'CANCELLED',
];

export function narrowFromList<T extends string>(candidates: readonly T[], value: JsonValue | Absent, fallback: T): T {
  if (typeof value !== 'string') {
    return fallback;
  }
  return candidates.find((candidate) => candidate === value) ?? fallback;
}
