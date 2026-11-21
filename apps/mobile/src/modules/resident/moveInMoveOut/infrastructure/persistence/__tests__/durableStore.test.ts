import { createAsyncConcurrencyStore, createAsyncIdempotencyLedger } from '../asyncPersistence';
import {
  RESIDENT_ACTOR,
  SOCIETY_ADMIN_ACTOR,
  TEST_NOW,
  TEST_RELATIONSHIP_ID,
  TEST_RESIDENT_ID,
  TEST_SOCIETY_ID,
  TEST_UNIT_ID,
  makeMoveInCommand,
  makeVerificationChecks,
} from '../../../domain/stateMachines/__tests__/stateMachineFixtures';
import type { MoveInRequestState } from '../../../domain/types/moveIn.types';
import { createMoveInService } from '../../../application/moveInService';
import { parseMoveInState } from '../runtime';

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function createFakeStorage(seed: Record<string, string> = {}): StorageLike {
  const data = new Map<string, string>(Object.entries(seed));

  return {
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => {
      data.set(key, value);
    },
    removeItem: async (key) => {
      data.delete(key);
    },
  };
}

function moveInState(id: string, status: MoveInRequestState['status'], revision: number): MoveInRequestState {
  return {
    moveInRequestId: id,
    requestNumber: 'MIR-1',
    status,
    revision,
    scope: {
      societyId: TEST_SOCIETY_ID,
      unitId: TEST_UNIT_ID,
      residentId: TEST_RESIDENT_ID,
      occupancyRelationshipId: TEST_RELATIONSHIP_ID,
    },
    relationshipType: 'OWNER',
    occupancyStartDate: '2026-11-01',
    requestedOccupancyEndDate: undefined,
    agreementReference: undefined,
    partyCount: 1,
    vehicleCount: 0,
    requiresLiftSlot: false,
    requiresParking: false,
    verificationChecklist: [],
    verificationOutcome: undefined,
    verificationException: undefined,
    appointmentId: undefined,
    approvalReference: undefined,
    execution: undefined,
    cancellation: undefined,
    createdAt: TEST_NOW,
    updatedAt: TEST_NOW,
  };
}

describe('async concurrency store durability', () => {
  it('restores an inserted aggregate after a simulated restart', async () => {
    const storage = createFakeStorage();
    const first = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    first.insert('mi-1', moveInState('mi-1', 'REQUESTED', 0));
    await first.flush();

    const second = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    await second.hydrateAll();

    expect(second.read('mi-1')?.status).toBe('REQUESTED');
    expect(second.read('mi-1')?.revision).toBe(0);
  });

  it('discovers aggregates on hydrateAll without being told their ids', async () => {
    const storage = createFakeStorage();
    const first = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    first.insert('mi-1', moveInState('mi-1', 'REQUESTED', 0));
    first.insert('mi-2', moveInState('mi-2', 'VERIFIED', 1));
    await first.flush();

    const second = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    await second.hydrateAll();

    expect([...second.aggregateIds()].sort()).toEqual(['mi-1', 'mi-2']);
  });

  it('restores the latest committed revision', async () => {
    const storage = createFakeStorage();
    const first = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    first.insert('mi-1', moveInState('mi-1', 'REQUESTED', 0));
    expect(first.commit('mi-1', moveInState('mi-1', 'VERIFIED', 1), 0)).toBe(true);
    await first.flush();

    const second = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    await second.hydrateAll();

    expect(second.read('mi-1')?.status).toBe('VERIFIED');
    expect(second.read('mi-1')?.revision).toBe(1);
  });

  it('keeps a committed aggregate findable through the index', async () => {
    const storage = createFakeStorage();
    const first = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    first.insert('mi-1', moveInState('mi-1', 'REQUESTED', 0));
    first.commit('mi-1', moveInState('mi-1', 'APPROVED', 2), 0);
    await first.flush();

    const second = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    await second.hydrateAll();

    expect(second.aggregateIds()).toContain('mi-1');
  });

  it('refuses to insert the same aggregate id twice', () => {
    const store = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, createFakeStorage());

    expect(store.insert('mi-1', moveInState('mi-1', 'REQUESTED', 0))).toBe(true);
    expect(store.insert('mi-1', moveInState('mi-1', 'REQUESTED', 0))).toBe(false);
  });

  it('refuses to commit from a stale revision', () => {
    const store = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, createFakeStorage());
    store.insert('mi-1', moveInState('mi-1', 'REQUESTED', 0));

    expect(store.commit('mi-1', moveInState('mi-1', 'VERIFIED', 1), 5)).toBe(false);
    expect(store.read('mi-1')?.status).toBe('REQUESTED');
  });

  it('drops a corrupted record instead of crashing on hydrate', async () => {
    const storage = createFakeStorage();
    const first = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    first.insert('mi-1', moveInState('mi-1', 'REQUESTED', 0));
    await first.flush();

    await storage.setItem('societyos.moveInMoveOut.aggregate.mi-1', '{"status":');

    const second = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    await second.hydrateAll();

    expect(second.read('mi-1')).toBeUndefined();
  });

  it('drops a record that no longer parses into the domain shape', async () => {
    const storage = createFakeStorage();
    const first = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    first.insert('mi-1', moveInState('mi-1', 'REQUESTED', 0));
    await first.flush();

    await storage.setItem('societyos.moveInMoveOut.aggregate.mi-1', JSON.stringify({ status: 7 }));

    const second = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    await second.hydrateAll();

    expect(second.read('mi-1')).toBeUndefined();
  });

  it('survives a corrupt aggregate index', async () => {
    const storage = createFakeStorage({ 'societyos.moveInMoveOut.aggregateIndex': 'not-json' });
    const store = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);

    await expect(store.hydrateAll()).resolves.toBeUndefined();
    expect(store.aggregateIds()).toEqual([]);
  });

  it('keeps the idempotency ledger across a restart', async () => {
    const storage = createFakeStorage();
    const ledger = createAsyncIdempotencyLedger(storage);
    ledger.record({
      envelope: {
        aggregateType: 'MOVE_IN_REQUEST',
        aggregateId: 'mi-1',
        commandKind: 'SUBMIT_REQUEST',
        idempotencyKey: 'idem-1',
      },
      fingerprint: 'fp-1',
      committedRevision: 1,
      resultStatus: 'REQUESTED',
      committedAt: TEST_NOW,
    });
    await ledger.flush();

    const restored = createAsyncIdempotencyLedger(storage);
    await restored.hydrate();

    expect(restored.find('idem-1')?.resultStatus).toBe('REQUESTED');
  });
});

describe('move in service over durable persistence', () => {
  it('does not reapply a command after a restart because the ledger survived', async () => {
    const storage = createFakeStorage();
    const store = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    const ledger = createAsyncIdempotencyLedger(storage);

    const first = createMoveInService({ ledger, store });
    const command = makeMoveInCommand({
      kind: 'RECORD_VERIFICATION_PASSED',
      actor: SOCIETY_ADMIN_ACTOR,
      idempotencyKey: 'verify-once',
      expectedRevision: 0,
      verificationChecks: makeVerificationChecks(),
    });

    const before = moveInState('mi-1', 'REQUESTED', 0);
    store.insert('mi-1', before);
    const firstOutcome = first.dispatch(command, before);
    await ledger.flush();
    await store.flush();

    expect(firstOutcome.ok).toBe(true);

    const restoredStore = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    const restoredLedger = createAsyncIdempotencyLedger(storage);
    await restoredStore.hydrateAll();
    await restoredLedger.hydrate();

    const second = createMoveInService({ ledger: restoredLedger, store: restoredStore });
    const replay = second.dispatch(command, restoredStore.read('mi-1') ?? before);

    expect(replay.ok).toBe(false);
  });

  it('rejects creation for a resident who reuses an idempotency key after a restart', async () => {
    const storage = createFakeStorage();
    const store = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    const ledger = createAsyncIdempotencyLedger(storage);

    const service = createMoveInService({ ledger, store });
    const input = {
      moveInRequestId: 'mi-durable',
      requestNumber: 'MIR-2',
      scope: {
        societyId: TEST_SOCIETY_ID,
        unitId: TEST_UNIT_ID,
        residentId: TEST_RESIDENT_ID,
        occupancyRelationshipId: TEST_RELATIONSHIP_ID,
      },
      relationshipType: 'OWNER',
      occupancyStartDate: '2026-11-01',
      partyCount: 1,
      vehicleCount: 0,
      requiresLiftSlot: false,
      requiresParking: false,
      createdAt: TEST_NOW,
    };
    const command = makeMoveInCommand({
      kind: 'SUBMIT_REQUEST',
      actor: RESIDENT_ACTOR,
      idempotencyKey: 'create-once',
      expectedRevision: 0,
    });

    expect(service.create(command, input).ok).toBe(true);
    await ledger.flush();
    await store.flush();

    const restoredStore = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState, storage);
    const restoredLedger = createAsyncIdempotencyLedger(storage);
    await restoredStore.hydrateAll();
    await restoredLedger.hydrate();

    const restored = createMoveInService({ ledger: restoredLedger, store: restoredStore });
    const replay = restored.create(command, input);

    expect(replay.ok).toBe(false);
    expect(restoredStore.read('mi-durable')?.status).toBe('REQUESTED');
  });
});
