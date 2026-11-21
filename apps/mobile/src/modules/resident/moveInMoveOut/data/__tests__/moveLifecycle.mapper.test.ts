import {
  mapMoveInDto,
  mapMoveOutDto,
  mapNocRequestDto,
  stateChecksumForMoveIn,
  stateChecksumForMoveOut,
} from '../moveLifecycle.mapper';
import {
  MOVE_IN_STATUSES,
  MOVE_OUT_STATUSES,
  NOC_STATUSES,
  narrowFromList,
} from '../moveLifecycle.dto';

describe('moveLifecycle mappers', () => {
  it('maps a fully populated move in dto', () => {
    const state = mapMoveInDto({
      id: 'mi-1',
      requestNumber: 'MIR-0001',
      status: 'SCHEDULED',
      societyId: 'soc-1',
      unitId: 'unit-1',
      residentId: 'res-1',
      occupancyRelationshipId: 'rel-1',
      relationshipType: 'OWNER',
      occupancyStartDate: '2026-11-01',
      partyCount: 3,
      vehicleCount: 1,
      requiresLiftSlot: true,
      requiresParking: true,
      revision: 4,
      verificationOutcome: 'PASSED',
      appointmentId: 'appt-1',
      createdAt: '2026-10-01T09:00:00.000Z',
      updatedAt: '2026-10-02T09:00:00.000Z',
    });

    expect(state.status).toBe('SCHEDULED');
    expect(state.revision).toBe(4);
    expect(state.scope.societyId).toBe('soc-1');
    expect(state.requiresLiftSlot).toBe(true);
    expect(state.appointmentId).toBe('appt-1');
  });

  it('falls back safely on an unknown move in status rather than trusting the wire', () => {
    const state = mapMoveInDto({ id: 'mi-1', status: 'TOTALLY_MADE_UP' });
    expect(state.status).toBe('REQUESTED');
    expect(state.requestNumber).toBe('mi-1');
  });

  it('never produces a negative or fractional count from the wire', () => {
    const state = mapMoveInDto({ id: 'mi-1', partyCount: -4, vehicleCount: 1.5 });
    expect(state.partyCount).toBe(1);
    expect(state.vehicleCount).toBe(0);
  });

  it('maps a fully populated move out dto including signature', () => {
    const state = mapMoveOutDto({
      id: 'mo-1',
      status: 'SIGNED',
      societyId: 'soc-1',
      unitId: 'unit-1',
      residentId: 'res-1',
      occupancyRelationshipId: 'rel-1',
      clearanceSnapshotId: 'snap-1',
      settlementSnapshotId: 'settle-1',
      signatureDocumentId: 'doc-1',
      signatureDocumentChecksum: 'chk-1',
      signatureSignedByActorId: 'actor-1',
      signatureMethod: 'DIGITAL',
      templateVersion: 'tpl-1',
      revision: 6,
    });

    expect(state.status).toBe('SIGNED');
    expect(state.signature?.documentChecksum).toBe('chk-1');
    expect(state.signature?.signedByActorId).toBe('actor-1');
    expect(state.settlementSnapshotId).toBe('settle-1');
  });

  it('leaves the signature absent when the dto has no signature document', () => {
    const state = mapMoveOutDto({ id: 'mo-1', status: 'APPROVED', signatureDocumentId: null });
    expect(state.signature).toBeUndefined();
  });

  it('maps access revocation and archive only when the dto carries them', () => {
    const bare = mapMoveOutDto({ id: 'mo-1', status: 'ISSUED' });
    expect(bare.accessRevocation).toBeUndefined();
    expect(bare.archiveRecord).toBeUndefined();

    const full = mapMoveOutDto({
      id: 'mo-1',
      status: 'ARCHIVED',
      residenceAccessStatusBefore: 'ACTIVE',
      residenceAccessStatusAfter: 'REVOKED',
      credentialCount: 3,
      archiveReference: 'archive/mo-1',
      retentionPolicyKey: 'policy.7y',
      containsPersonalData: true,
      occupancyEndDate: '2026-10-31',
    });
    expect(full.accessRevocation?.credentialCount).toBe(3);
    expect(full.archiveRecord?.archiveReference).toBe('archive/mo-1');
    expect(full.occupancyClosure?.occupancyEndDate).toBe('2026-10-31');
  });

  it('defaults containsPersonalData to true so records are never assumed clean', () => {
    const state = mapMoveOutDto({ id: 'mo-1', archiveReference: 'archive/mo-1' });
    expect(state.archiveRecord?.containsPersonalData).toBe(true);
  });

  it('maps a noc request dto', () => {
    const state = mapNocRequestDto({
      id: 'noc-1',
      requestNumber: 'NOC-1',
      status: 'ISSUED',
      linkedMoveOutRequestId: 'mo-1',
      revision: 3,
    });
    expect(state.status).toBe('ISSUED');
    expect(state.linkedMoveOutRequestId).toBe('mo-1');
    expect(state.kind).toBe('MOVE_OUT_NOC');
  });

  it('narrows unknown enum values to the declared fallback', () => {
    expect(narrowFromList(MOVE_IN_STATUSES, 'APPROVED', 'REQUESTED')).toBe('APPROVED');
    expect(narrowFromList(MOVE_IN_STATUSES, 'NOPE', 'REQUESTED')).toBe('REQUESTED');
    expect(narrowFromList(MOVE_IN_STATUSES, undefined, 'REQUESTED')).toBe('REQUESTED');
    expect(narrowFromList(MOVE_OUT_STATUSES, 'OCCUPANCY_CLOSED', 'REQUESTED')).toBe('OCCUPANCY_CLOSED');
    expect(narrowFromList(NOC_STATUSES, 'NOPE', 'REQUESTED')).toBe('REQUESTED');
  });

  it('produces a stable checksum that changes with status or revision', () => {
    const base = mapMoveInDto({ id: 'mi-1', status: 'VERIFIED', revision: 1 });
    const same = mapMoveInDto({ id: 'mi-1', status: 'VERIFIED', revision: 1 });
    const other = mapMoveInDto({ id: 'mi-1', status: 'SCHEDULED', revision: 1 });

    expect(stateChecksumForMoveIn(base)).toBe(stateChecksumForMoveIn(same));
    expect(stateChecksumForMoveIn(base)).not.toBe(stateChecksumForMoveIn(other));
  });

  it('namespaces the move in and move out checksums differently', () => {
    const moveIn = mapMoveInDto({ id: 'x', status: 'VERIFIED', revision: 1 });
    const moveOut = mapMoveOutDto({ id: 'x', status: 'APPROVED', revision: 1 });
    expect(stateChecksumForMoveIn(moveIn)).not.toBe(stateChecksumForMoveOut(moveOut));
  });
});
