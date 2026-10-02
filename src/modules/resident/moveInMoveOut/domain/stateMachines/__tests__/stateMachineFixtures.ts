import type { Absent } from '../../../../../../shared/types/absence.types';
import type { LifecycleActor, LifecycleActorType } from '../../types/primitives';
import type {
  MoveInCommand,
  MoveInRequestState,
  MoveInVerificationCheck,
} from '../../types/moveIn.types';
import type { MoveOutCommand, MoveOutRequestState } from '../../types/moveOut.types';

export const TEST_NOW = '2026-09-26T10:00:00.000Z';
export const TEST_SOCIETY_ID = 'soc-1';
export const TEST_UNIT_ID = 'unit-1';
export const TEST_RESIDENT_ID = 'res-1';
export const TEST_RELATIONSHIP_ID = 'rel-1';

export function makeActor(
  actorType: LifecycleActorType,
  overrides: {
    actorId?: string;
    societyId?: string;
    unitId?: string | Absent;
    onBehalfOfResidentId?: string | Absent;
  } = {},
): LifecycleActor {
  return {
    actorId: overrides.actorId ?? `actor-${actorType}`,
    actorType,
    displayName: `Actor ${actorType}`,
    societyId: overrides.societyId ?? TEST_SOCIETY_ID,
    unitId: overrides.unitId === undefined ? TEST_UNIT_ID : overrides.unitId,
    onBehalfOfResidentId:
      overrides.onBehalfOfResidentId === undefined
        ? TEST_RESIDENT_ID
        : overrides.onBehalfOfResidentId,
  };
}

export const SYSTEM_ACTOR = makeActor('SYSTEM', { unitId: undefined });
export const SOCIETY_ADMIN_ACTOR = makeActor('SOCIETY_ADMIN', { unitId: undefined });
export const SECRETARY_ACTOR = makeActor('SOCIETY_SECRETARY', { unitId: undefined });
export const TREASURER_ACTOR = makeActor('TREASURER', { unitId: undefined });
export const FACILITY_ACTOR = makeActor('FACILITY_MANAGER', { unitId: undefined });
export const SECURITY_ACTOR = makeActor('SECURITY', { unitId: undefined });
export const RESIDENT_ACTOR = makeActor('RESIDENT');
export const OTHER_RESIDENT_ACTOR = makeActor('FAMILY_MEMBER', {
  unitId: 'unit-2',
  onBehalfOfResidentId: 'res-2',
});

export function makeVerificationChecks(
  overrides: Partial<Record<string, MoveInVerificationCheck['result']>> = {},
): readonly MoveInVerificationCheck[] {
  const keys: readonly MoveInVerificationCheck['checkKey'][] = [
    'IDENTITY_PROOF',
    'OWNERSHIP_OR_TENANCY_PROOF',
    'POLICE_VERIFICATION',
    'AGREEMENT_REGISTERED',
    'DUPLICATE_OCCUPANCY_CHECK',
    'DUES_CLEARANCE_CHECK',
    'NO_BLOCKING_COMPLAINT',
  ];
  return keys.map((checkKey) => ({
    checkKey,
    result: overrides[checkKey] ?? 'PASS',
    detailKey: `detail.${checkKey}`,
    evaluatedAt: undefined,
    evaluatedByActorId: undefined,
    evidenceRefs: [`evidence-${checkKey}`],
  }));
}

export function makeMoveInState(
  status: MoveInRequestState['status'],
  revision = 3,
): MoveInRequestState {
  return {
    moveInRequestId: 'mi-1',
    requestNumber: 'MIR-0001',
    status,
    revision,
    scope: {
      societyId: TEST_SOCIETY_ID,
      unitId: TEST_UNIT_ID,
      residentId: TEST_RESIDENT_ID,
      occupancyRelationshipId: TEST_RELATIONSHIP_ID,
    },
    relationshipType: 'TENANT',
    occupancyStartDate: '2026-10-01',
    requestedOccupancyEndDate: undefined,
    agreementReference: 'agreement-1',
    partyCount: 2,
    vehicleCount: 1,
    requiresLiftSlot: true,
    requiresParking: true,
    verificationChecklist: [],
    verificationException: undefined,
    verificationOutcome: undefined,
    appointmentId: undefined,
    approvalReference: undefined,
    execution: undefined,
    cancellation: undefined,
    createdAt: '2026-09-20T08:00:00.000Z',
    updatedAt: '2026-09-20T08:00:00.000Z',
  };
}

export function makeMoveInCommand(
  overrides: Partial<MoveInCommand> = {},
): MoveInCommand {
  return {
    kind: 'SUBMIT_REQUEST',
    actor: SYSTEM_ACTOR,
    idempotencyKey: 'idem-1',
    expectedRevision: 3,
    occurredAt: TEST_NOW,
    verificationChecks: [],
    verificationFailureReasonKey: undefined,
    verificationExceptionApprovalReference: undefined,
    verificationFailureReasonDetail: undefined,
    appointmentId: undefined,
    approvalReference: undefined,
    possessionsMovedCount: 0,
    keyHandedOverAt: undefined,
    meterReadingReference: undefined,
    accessActivationReference: undefined,
    cancellationReasonKey: undefined,
    cancellationReasonDetail: undefined,
    ...overrides,
  };
}

export function makeMoveOutState(
  status: MoveOutRequestState['status'],
  revision = 5,
): MoveOutRequestState {
  return {
    moveOutRequestId: 'mo-1',
    requestNumber: 'MOR-0001',
    status,
    revision,
    scope: {
      societyId: TEST_SOCIETY_ID,
      unitId: TEST_UNIT_ID,
      residentId: TEST_RESIDENT_ID,
      occupancyRelationshipId: TEST_RELATIONSHIP_ID,
    },
    movingPersonType: 'TENANT',
    requestedExitDate: '2026-10-31',
    declaredReasonKey: 'reason.relocation',
    declaredReasonDetail: 'Relocating for work',
    contactReference: 'contact-1',
    vehicleEntryRequired: true,
    liftSlotRequired: true,
    moverCount: 2,
    clearanceSnapshotId: undefined,
    settlementSnapshotId: undefined,
    approvalReference: undefined,
    signature: undefined,
    nocCertificateId: undefined,
    accessRevocation: undefined,
    occupancyClosure: undefined,
    archiveRecord: undefined,
    cancellation: undefined,
    createdAt: '2026-09-20T08:00:00.000Z',
    updatedAt: '2026-09-20T08:00:00.000Z',
  };
}

export function makeMoveOutCommand(
  overrides: Partial<MoveOutCommand> = {},
): MoveOutCommand {
  return {
    kind: 'SUBMIT_REQUEST',
    actor: SYSTEM_ACTOR,
    idempotencyKey: 'idem-1',
    expectedRevision: 5,
    occurredAt: TEST_NOW,
    clearanceSnapshotId: undefined,
    settlementSnapshotId: undefined,
    approvalReference: undefined,
    rejectionReasonKey: undefined,
    rejectionReasonDetail: undefined,
    signatureDocumentId: undefined,
    signatureDocumentChecksum: undefined,
    signatureMethod: undefined,
    templateVersion: undefined,
    nocCertificateId: undefined,
    credentialCount: 2,
    parkingAllocationReleased: true,
    gateIntegrationReference: undefined,
    residenceAccessStatusBefore: undefined,
    residenceAccessStatusAfter: undefined,
    failureReference: undefined,
    occupancyEndDate: undefined,
    finalMeterReadingReference: undefined,
    retentionPolicyKey: undefined,
    archiveReference: undefined,
    containsPersonalData: true,
    cancellationReasonKey: undefined,
    cancellationReasonDetail: undefined,
    recoveredAmount: undefined,
    ...overrides,
  };
}
