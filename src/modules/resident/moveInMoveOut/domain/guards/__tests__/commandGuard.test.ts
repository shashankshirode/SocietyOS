import {
  commitCommand,
  createInMemoryLedger,
  createInMemoryStore,
  fingerprintCommand,
  guardCommand,
} from '../commandGuard';
import type { CommandEnvelope, IdempotencyLedger } from '../commandGuard';

type Counter = { readonly revision: number; readonly status: string };

const envelope: CommandEnvelope = {
  aggregateType: 'MOVE_OUT_REQUEST',
  aggregateId: 'mov-1',
  commandKind: 'RECORD_CLEARANCE_SNAPSHOT',
  idempotencyKey: 'idem-1',
};

function withEnvelope(overrides: Partial<CommandEnvelope>): CommandEnvelope {
  return { ...envelope, ...overrides };
}

describe('commandGuard', () => {
  it('produces a stable fingerprint for the same envelope', () => {
    expect(fingerprintCommand(envelope)).toBe(fingerprintCommand({ ...envelope }));
    expect(fingerprintCommand(envelope)).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces a different fingerprint when any envelope field differs', () => {
    const base = fingerprintCommand(envelope);
    expect(fingerprintCommand(withEnvelope({ commandKind: 'ARCHIVE' }))).not.toBe(base);
    expect(fingerprintCommand(withEnvelope({ aggregateId: 'mov-2' }))).not.toBe(base);
    expect(fingerprintCommand(withEnvelope({ idempotencyKey: 'idem-2' }))).not.toBe(base);
    expect(fingerprintCommand(withEnvelope({ aggregateType: 'NOC_REQUEST' }))).not.toBe(base);
  });

  it('allows a first time command at the expected revision', () => {
    const decision = guardCommand(
      envelope,
      3,
      createInMemoryLedger(),
      createInMemoryStore<Counter>([['mov-1', { revision: 3, status: 'CLEARANCE_CHECK' }]]),
    );
    expect(decision.proceed).toBe(true);
    if (decision.proceed) {
      expect(decision.state.revision).toBe(3);
    }
  });

  it('rejects a stale expected revision', () => {
    const decision = guardCommand(
      envelope,
      2,
      createInMemoryLedger(),
      createInMemoryStore<Counter>([['mov-1', { revision: 3, status: 'CLEARANCE_CHECK' }]]),
    );
    expect(decision.proceed).toBe(false);
    if (!decision.proceed) {
      expect(decision.rejection).toEqual({ kind: 'STALE_REVISION', actualRevision: 3 });
      expect(decision.violations[0]?.code).toBe('REVISION_MISMATCH');
    }
  });

  it('rejects a command against an unknown aggregate', () => {
    const decision = guardCommand(
      envelope,
      3,
      createInMemoryLedger(),
      createInMemoryStore<Counter>(),
    );
    expect(decision.proceed).toBe(false);
    if (!decision.proceed) {
      expect(decision.rejection.kind).toBe('AGGREGATE_MISSING');
    }
  });

  it('treats a byte identical retry as a replay rather than a second write', () => {
    const ledger = createInMemoryLedger();
    const store = createInMemoryStore<Counter>([['mov-1', { revision: 3, status: 'CLEARANCE_CHECK' }]]);

    const next = { revision: 4, status: 'READY' };
    expect(commitCommand(envelope, next, 'READY', '2026-10-01T00:00:00.000Z', ledger, store)).toBe(true);

    const decision = guardCommand(envelope, 3, ledger, store);
    expect(decision.proceed).toBe(false);
    if (!decision.proceed) {
      expect(decision.rejection.kind).toBe('REPLAY');
      if (decision.rejection.kind === 'REPLAY') {
        expect(decision.rejection.record.committedRevision).toBe(4);
        expect(decision.rejection.record.resultStatus).toBe('READY');
      }
    }
    expect(store.snapshot()).toHaveLength(1);
  });

  it('refuses to reuse an idempotency key for a different command', () => {
    const ledger: IdempotencyLedger = createInMemoryLedger();
    const store = createInMemoryStore<Counter>([['mov-1', { revision: 3, status: 'CLEARANCE_CHECK' }]]);
    commitCommand(
      envelope,
      { revision: 4, status: 'READY' },
      'READY',
      '2026-10-01T00:00:00.000Z',
      ledger,
      store,
    );

    const decision = guardCommand(
      withEnvelope({ commandKind: 'ARCHIVE' }),
      4,
      ledger,
      store,
    );
    expect(decision.proceed).toBe(false);
    if (!decision.proceed) {
      expect(decision.rejection.kind).toBe('KEY_REUSED_FOR_DIFFERENT_COMMAND');
      expect(decision.violations[0]?.code).toBe('IDEMPOTENCY_KEY_CONFLICT');
    }
  });

  it('refuses to reuse an idempotency key across different aggregates', () => {
    const ledger = createInMemoryLedger();
    const store = createInMemoryStore<Counter>([['mov-1', { revision: 1, status: 'REQUESTED' }]]);
    commitCommand(
      envelope,
      { revision: 2, status: 'READY' },
      'READY',
      '2026-10-01T00:00:00.000Z',
      ledger,
      store,
    );

    const decision = guardCommand(
      withEnvelope({ aggregateId: 'mov-2' }),
      1,
      ledger,
      store,
    );
    expect(decision.proceed).toBe(false);
    if (!decision.proceed) {
      expect(decision.rejection.kind).toBe('KEY_REUSED_FOR_DIFFERENT_COMMAND');
    }
  });

  it('fails the commit when another writer advanced the aggregate first', () => {
    const ledger = createInMemoryLedger();
    const store = createInMemoryStore<Counter>([['mov-1', { revision: 3, status: 'CLEARANCE_CHECK' }]]);

    const guard = guardCommand(envelope, 3, ledger, store);
    expect(guard.proceed).toBe(true);

    store.commit('mov-1', { revision: 4, status: 'READY' }, 3);

    const committed = commitCommand(
      envelope,
      { revision: 4, status: 'READY' },
      'READY',
      '2026-10-01T00:00:00.000Z',
      ledger,
      store,
    );
    expect(committed).toBe(false);
    expect(ledger.entries()).toHaveLength(0);
  });

  it('does not record an idempotency entry for a lost race', () => {
    const ledger = createInMemoryLedger();
    const store = createInMemoryStore<Counter>([['mov-1', { revision: 3, status: 'CLEARANCE_CHECK' }]]);
    const result = commitCommand(
      envelope,
      { revision: 4, status: 'READY' },
      'READY',
      '2026-10-01T00:00:00.000Z',
      ledger,
      store,
    );
    expect(result).toBe(true);
    expect(ledger.entries()).toHaveLength(1);
  });

  it('persists a committed record so a restart still recognises a replay', () => {
    const first = createInMemoryLedger();
    const store = createInMemoryStore<Counter>([['mov-1', { revision: 3, status: 'CLEARANCE_CHECK' }]]);
    commitCommand(
      envelope,
      { revision: 4, status: 'READY' },
      'READY',
      '2026-10-01T00:00:00.000Z',
      first,
      store,
    );

    const afterRestart = createInMemoryLedger(first.entries());
    const decision = guardCommand(envelope, 3, afterRestart, store);
    expect(decision.proceed).toBe(false);
    if (!decision.proceed) {
      expect(decision.rejection.kind).toBe('REPLAY');
    }
  });

  it('isolates idempotency keys per aggregate so parallel requests do not collide', () => {
    const ledger = createInMemoryLedger();
    const store = createInMemoryStore<Counter>([
      ['mov-1', { revision: 1, status: 'REQUESTED' }],
      ['mov-2', { revision: 1, status: 'REQUESTED' }],
    ]);

    const first = guardCommand(
      withEnvelope({ aggregateId: 'mov-1' }),
      1,
      ledger,
      store,
    );
    const second = guardCommand(
      withEnvelope({ aggregateId: 'mov-2' }),
      1,
      ledger,
      store,
    );

    expect(first.proceed).toBe(true);
    expect(second.proceed).toBe(true);
  });
});
