import type { Absent } from '../../../../shared/types/absence.types';
import { canonicalPreimageSha256, requiredPart } from '../domain/crypto/canonicalJson';
import type { MoveInRequestState, MoveInStatus } from '../domain/types/moveIn.types';
import type { MoveOutRequestState, MoveOutStatus } from '../domain/types/moveOut.types';
import type { NocRequestState, NocStatus } from '../domain/types/noc.types';
import {
  MOVE_IN_STATUSES,
  MOVE_OUT_STATUSES,
  NOC_STATUSES,
  narrowFromList,
  type MoveInRequestDto,
  type MoveOutRequestDto,
  type NocRequestDto,
} from './moveLifecycle.dto';

type NullableText = string | null | Absent;

function text(value: NullableText): string | Absent;
function text(value: NullableText, fallback: string): string;
function text(value: NullableText, fallback?: string): string | Absent {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return fallback;
}

function count(value: number | Absent, fallback: number): number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : fallback;
}

function flag(value: boolean | Absent, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

export function mapMoveInDto(dto: MoveInRequestDto): MoveInRequestState {
  return {
    moveInRequestId: dto.id,
    requestNumber: text(dto.requestNumber, dto.id),
    status: narrowFromList<MoveInStatus>(MOVE_IN_STATUSES, dto.status, 'REQUESTED'),
    revision: count(dto.revision, 0),
    scope: {
      societyId: text(dto.societyId, 'unknown-society'),
      unitId: text(dto.unitId, 'unknown-unit'),
      residentId: text(dto.residentId, 'unknown-resident'),
      occupancyRelationshipId: text(dto.occupancyRelationshipId, 'unknown-relationship'),
    },
    relationshipType: text(dto.relationshipType, 'UNKNOWN'),
    occupancyStartDate: text(dto.occupancyStartDate, '1970-01-01'),
    requestedOccupancyEndDate: text(dto.requestedOccupancyEndDate),
    agreementReference: text(dto.agreementReference),
    partyCount: count(dto.partyCount, 1),
    vehicleCount: count(dto.vehicleCount, 0),
    requiresLiftSlot: flag(dto.requiresLiftSlot, false),
    requiresParking: flag(dto.requiresParking, false),
    verificationChecklist: [],
    verificationException: undefined,
    verificationOutcome: dto.verificationOutcome === 'PASSED' ? 'PASSED' : dto.verificationOutcome === 'FAILED' ? 'FAILED' : undefined,
    appointmentId: text(dto.appointmentId),
    approvalReference: text(dto.approvalReference),
    execution: undefined,
    cancellation: undefined,
    createdAt: text(dto.createdAt, '1970-01-01T00:00:00.000Z'),
    updatedAt: text(dto.updatedAt, '1970-01-01T00:00:00.000Z'),
  };
}

export function mapMoveOutDto(dto: MoveOutRequestDto): MoveOutRequestState {
  const signatureDocumentId = text(dto.signatureDocumentId);
  const archiveReference = text(dto.archiveReference);
  const occupancyEndDate = text(dto.occupancyEndDate);

  return {
    moveOutRequestId: dto.id,
    requestNumber: text(dto.requestNumber, dto.id),
    status: narrowFromList<MoveOutStatus>(MOVE_OUT_STATUSES, dto.status, 'REQUESTED'),
    revision: count(dto.revision, 0),
    scope: {
      societyId: text(dto.societyId, 'unknown-society'),
      unitId: text(dto.unitId, 'unknown-unit'),
      residentId: text(dto.residentId, 'unknown-resident'),
      occupancyRelationshipId: text(dto.occupancyRelationshipId, 'unknown-relationship'),
    },
    movingPersonType: text(dto.movingPersonType, 'UNKNOWN'),
    requestedExitDate: text(dto.requestedExitDate, '1970-01-01'),
    declaredReasonKey: text(dto.declaredReasonKey, 'reason.unspecified'),
    declaredReasonDetail: text(dto.declaredReasonDetail, ''),
    contactReference: text(dto.contactReference, 'unknown'),
    vehicleEntryRequired: flag(dto.vehicleEntryRequired, false),
    liftSlotRequired: flag(dto.liftSlotRequired, false),
    moverCount: count(dto.moverCount, 1),
    clearanceSnapshotId: text(dto.clearanceSnapshotId),
    settlementSnapshotId: text(dto.settlementSnapshotId),
    approvalReference: text(dto.approvalReference),
    signature:
      signatureDocumentId === undefined
        ? undefined
        : {
            signedAt: text(dto.updatedAt, '1970-01-01T00:00:00.000Z'),
            signedByActorId: text(dto.signatureSignedByActorId, 'unknown-actor'),
            signatureMethod: text(dto.signatureMethod, 'DIGITAL'),
            documentId: signatureDocumentId,
            documentChecksum: text(dto.signatureDocumentChecksum, ''),
            templateVersion: text(dto.templateVersion, 'unknown-template'),
          },
    nocCertificateId: text(dto.nocCertificateId),
    accessRevocation:
      dto.residenceAccessStatusAfter === undefined
        ? undefined
        : {
            revokedAt: text(dto.updatedAt, '1970-01-01T00:00:00.000Z'),
            revokedByActorId: text(dto.accessRevokedByActorId, 'unknown-actor'),
            credentialCount: count(dto.credentialCount, 0),
            parkingAllocationReleased: flag(dto.parkingAllocationReleased, false),
            gateIntegrationReference: text(dto.gateIntegrationReference, 'unknown'),
            residenceAccessStatusBefore: text(dto.residenceAccessStatusBefore, 'ACTIVE'),
            residenceAccessStatusAfter: text(dto.residenceAccessStatusAfter, 'REVOKED'),
            failureReference: text(dto.failureReference),
          },
    occupancyClosure:
      occupancyEndDate === undefined
        ? undefined
        : {
            closedAt: text(dto.updatedAt, '1970-01-01T00:00:00.000Z'),
            closedByActorId: text(dto.occupancyClosedByActorId, 'unknown-actor'),
            relationshipId: text(dto.occupancyRelationshipId, 'unknown-relationship'),
            occupancyEndDate,
            finalMeterReadingReference: text(dto.finalMeterReadingReference),
          },
    archiveRecord:
      archiveReference === undefined
        ? undefined
        : {
            archivedAt: text(dto.updatedAt, '1970-01-01T00:00:00.000Z'),
            archivedByActorId: text(dto.archivedByActorId, 'unknown-actor'),
            retentionPolicyKey: text(dto.retentionPolicyKey, 'policy.unspecified'),
            archiveReference,
            containsPersonalData: flag(dto.containsPersonalData, true),
          },
    cancellation: undefined,
    createdAt: text(dto.createdAt, '1970-01-01T00:00:00.000Z'),
    updatedAt: text(dto.updatedAt, '1970-01-01T00:00:00.000Z'),
  };
}

export function mapNocRequestDto(dto: NocRequestDto): NocRequestState {
  return {
    nocRequestId: dto.id,
    requestNumber: text(dto.requestNumber, dto.id),
    kind: 'MOVE_OUT_NOC',
    status: narrowFromList<NocStatus>(NOC_STATUSES, dto.status, 'REQUESTED'),
    revision: count(dto.revision, 0),
    scope: {
      societyId: 'unknown-society',
      unitId: 'unknown-unit',
      residentId: 'unknown-resident',
      occupancyRelationshipId: 'unknown-relationship',
    },
    linkedMoveOutRequestId: text(dto.linkedMoveOutRequestId, 'unknown-request'),
    linkedClearanceSnapshotId: text(dto.linkedClearanceSnapshotId),
    linkedSettlementId: text(dto.linkedSettlementId),
    requestedByActorId: 'unknown-actor',
    requiredByDate: text(dto.requiredByDate, '1970-01-01'),
    purposeKey: 'purpose.unspecified',
    purposeDetail: '',
    approval: undefined,
    signature: undefined,
    certificateId: undefined,
    revocation: undefined,
    archive: undefined,
    cancellation: undefined,
    createdAt: text(dto.createdAt, '1970-01-01T00:00:00.000Z'),
    updatedAt: text(dto.updatedAt, '1970-01-01T00:00:00.000Z'),
  };
}

export function stateChecksumForMoveIn(state: MoveInRequestState): string {
  return canonicalPreimageSha256('sos.moveIn.state.v1', [
    requiredPart('requestId', state.moveInRequestId),
    requiredPart('status', state.status),
    requiredPart('revision', String(state.revision)),
  ]);
}

export function stateChecksumForMoveOut(state: MoveOutRequestState): string {
  return canonicalPreimageSha256('sos.moveOut.state.v1', [
    requiredPart('requestId', state.moveOutRequestId),
    requiredPart('status', state.status),
    requiredPart('revision', String(state.revision)),
  ]);
}
