import type { JsonValue } from '../../../../../../core/api/api.types';
import type { Absent } from '../../../../../../shared/types/absence.types';
import type { IdempotencyRecord } from '../../../domain/guards/commandGuard';
import {
  createAsyncConcurrencyStore,
  createAsyncIdempotencyLedger,
  parseIdempotencyRecord,
} from '../asyncPersistence';

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function createFakeStorage(seed: Record<string, string> = {}): StorageLike & {
  readonly dump: () => Record<string, string>;
  readonly writes: () => number;
} {
  const data = new Map<string, string>(Object.entries(seed));
  let writeCount = 0;

  return {
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => {
      writeCount += 1;
      data.set(key, value);
    },
    removeItem: async (key) => {
      data.delete(key);
    },
    dump: () => Object.fromEntries(data),
    writes: () => writeCount,
  };
}

function record(overrides: Partial<IdempotencyRecord> = {}): IdempotencyRecord {
  return {
    envelope: {
      aggregateType: 'MOVE_OUT_REQUEST',
      aggregateId: 'mo-1',
      commandKind: 'GRANT_APPROVAL',
      idempotencyKey: 'idem-1',
    },
    fingerprint: 'fingerprint-1',
    committedRevision: 4,
    resultStatus: 'APPROVED',
    committedAt: '2026-10-01T10:00:00.000Z',
    ...overrides,
  };
}

describe('parseIdempotencyRecord', () => {
  it('round trips a well formed record', () => {
    expect(parseIdempotencyRecord(JSON.parse(JSON.stringify(record())) as JsonValue)).toEqual(record());
  });

  it('rejects a non object payload', () => {
    expect(parseIdempotencyRecord('nope' as JsonValue)).toBeUndefined();
    expect(parseIdempotencyRecord(null)).toBeUndefined();
    expect(parseIdempotencyRecord([1, 2] as JsonValue)).toBeUndefined();
  });

  it('rejects an unknown aggregate type instead of trusting it', () => {
    const raw = JSON.parse(JSON.stringify(record())) as JsonValue;
    const envelope = (raw as { envelope: { aggregateType: string } }).envelope;
    envelope.aggregateType = 'SOMETHING_ELSE';
    expect(parseIdempotencyRecord(raw)).toBeUndefined();
  });

  it('rejects a record missing the fingerprint or revision', () => {
    const raw = JSON.parse(JSON.stringify(record())) as Record<string, JsonValue>;
    delete raw.fingerprint;
    expect(parseIdempotencyRecord(raw)).toBeUndefined();
  });

  it('rejects a non numeric committed revision', () => {
    const raw = JSON.parse(JSON.stringify(record())) as Record<string, JsonValue>;
    raw.committedRevision = 'four';
    expect(parseIdempotencyRecord(raw)).toBeUndefined();
  });
});

describe('createAsyncIdempotencyLedger', () => {
  it('finds nothing before hydration', () => {
    const ledger = createAsyncIdempotencyLedger(createFakeStorage());
    expect(ledger.find('idem-1')).toBeUndefined();
  });

  it('restores previously recorded commands after a restart', async () => {
    const storage = createFakeStorage();
    const first = createAsyncIdempotencyLedger(storage);
    first.record(record());
    await first.flush();

    const second = createAsyncIdempotencyLedger(storage);
    await second.hydrate();

    expect(second.find('idem-1')).toEqual(record());
  });

  it('survives a corrupted store by discarding it rather than crashing', async () => {
    const storage = createFakeStorage({ 'societyos.moveInMoveOut.idempotencyLedger': '{not json' });
    const ledger = createAsyncIdempotencyLedger(storage);
    await ledger.hydrate();
    expect(ledger.size()).toBe(0);
    expect(storage.dump()['societyos.moveInMoveOut.idempotencyLedger']).toBeUndefined();
  });

  it('skips individually malformed entries but keeps the valid ones', async () => {
    const storage = createFakeStorage({
      'societyos.moveInMoveOut.idempotencyLedger': JSON.stringify([{ junk: true }, record()]),
    });
    const ledger = createAsyncIdempotencyLedger(storage);
    await ledger.hydrate();
    expect(ledger.size()).toBe(1);
    expect(ledger.find('idem-1')).toEqual(record());
  });

  it('hydrates only once so a later write is not clobbered', async () => {
    const storage = createFakeStorage();
    const ledger = createAsyncIdempotencyLedger(storage);
    await ledger.hydrate();
    ledger.record(record());
    await ledger.hydrate();
    expect(ledger.size()).toBe(1);
  });

  it('overwrites a repeated key so the newest commit wins', async () => {
    const ledger = createAsyncIdempotencyLedger(createFakeStorage());
    ledger.record(record());
    ledger.record(record({ committedRevision: 9, resultStatus: 'SIGNED' }));
    expect(ledger.find('idem-1')?.committedRevision).toBe(9);
  });

  it('clears both the cache and the persisted store', async () => {
    const storage = createFakeStorage();
    const ledger = createAsyncIdempotencyLedger(storage);
    ledger.record(record());
    await ledger.flush();
    await ledger.clear();
    expect(ledger.size()).toBe(0);
    expect(storage.dump()['societyos.moveInMoveOut.idempotencyLedger']).toBeUndefined();
  });
});

type RevisionedState = { readonly revision: number; readonly status: string };

function parseState(raw: JsonValue): RevisionedState | Absent {
  if (raw === null || Array.isArray(raw) || typeof raw !== 'object') {
    return undefined;
  }
  const value = raw as Record<string, JsonValue>;
  return typeof value.revision === 'number' && typeof value.status === 'string'
    ? { revision: value.revision, status: value.status }
    : undefined;
}

describe('createAsyncConcurrencyStore', () => {
  it('rehydrates an aggregate from storage', async () => {
    const storage = createFakeStorage({
      'societyos.moveInMoveOut.aggregate.mo-1': JSON.stringify({ revision: 3, status: 'READY' }),
    });
    const store = createAsyncConcurrencyStore<RevisionedState>(parseState, storage);
    await store.hydrate(['mo-1']);
    expect(store.read('mo-1')).toEqual({ revision: 3, status: 'READY' });
  });

  it('discards an aggregate whose persisted shape is invalid', async () => {
    const storage = createFakeStorage({
      'societyos.moveInMoveOut.aggregate.mo-1': JSON.stringify({ status: 12 }),
    });
    const store = createAsyncConcurrencyStore<RevisionedState>(parseState, storage);
    await store.hydrate(['mo-1']);
    expect(store.read('mo-1')).toBeUndefined();
  });

  it('enforces compare and swap so a stale write cannot land', async () => {
    const store = createAsyncConcurrencyStore<RevisionedState>(parseState, createFakeStorage());
    store.insert('mo-1', { revision: 1, status: 'REQUESTED' });
    expect(store.commit('mo-1', { revision: 2, status: 'CLEARANCE_CHECK' }, 1)).toBe(true);
    expect(store.commit('mo-1', { revision: 2, status: 'READY' }, 1)).toBe(false);
    expect(store.read('mo-1')?.status).toBe('CLEARANCE_CHECK');
  });

  it('refuses to create an aggregate that does not exist', () => {
    const store = createAsyncConcurrencyStore<RevisionedState>(parseState, createFakeStorage());
    expect(store.commit('mo-9', { revision: 1, status: 'REQUESTED' }, 0)).toBe(false);
  });

  it('refuses to insert an aggregate that already exists', () => {
    const store = createAsyncConcurrencyStore<RevisionedState>(parseState, createFakeStorage());
    expect(store.insert('mo-1', { revision: 1, status: 'REQUESTED' })).toBe(true);
    expect(store.insert('mo-1', { revision: 1, status: 'CANCELLED' })).toBe(false);
    expect(store.read('mo-1')?.status).toBe('REQUESTED');
  });

  it('persists a committed aggregate so it survives a restart', async () => {
    const storage = createFakeStorage();
    const first = createAsyncConcurrencyStore<RevisionedState>(parseState, storage);
    first.insert('mo-1', { revision: 1, status: 'REQUESTED' });
    await first.flush();

    const second = createAsyncConcurrencyStore<RevisionedState>(parseState, storage);
    await second.hydrate(['mo-1']);
    expect(second.read('mo-1')).toEqual({ revision: 1, status: 'REQUESTED' });
  });
});
