import type { Absent } from '../../../../../shared/types/absence.types';
import { canonicalPreimageSha256, requiredPart } from '../crypto/canonicalJson';
import type { DomainViolation } from '../types/primitives';

export type CommandEnvelope = {
  readonly aggregateType:
    | 'MOVE_IN_REQUEST'
    | 'MOVE_OUT_REQUEST'
    | 'NOC_REQUEST'
    | 'FINAL_SETTLEMENT'
    | 'CLEARANCE_SNAPSHOT';
  readonly aggregateId: string;
  readonly commandKind: string;
  readonly idempotencyKey: string;
};

export type CommandFingerprint = {
  readonly envelope: CommandEnvelope;
  readonly fingerprint: string;
};

export type IdempotencyRecord = {
  readonly envelope: CommandEnvelope;
  readonly fingerprint: string;
  readonly committedRevision: number;
  readonly resultStatus: string;
  readonly committedAt: string;
};

export type IdempotencyLedger = {
  readonly find: (idempotencyKey: string) => IdempotencyRecord | Absent;
  readonly record: (entry: IdempotencyRecord) => void;
};

export type ConcurrencyStore<TState> = {
  readonly read: (aggregateId: string) => TState | Absent;
  readonly commit: (aggregateId: string, state: TState, expectedRevision: number) => boolean;
};

export type GuardRejection =
  | { readonly kind: 'REPLAY'; readonly record: IdempotencyRecord }
  | { readonly kind: 'KEY_REUSED_FOR_DIFFERENT_COMMAND'; readonly stored: IdempotencyRecord }
  | { readonly kind: 'STALE_REVISION'; readonly actualRevision: number }
  | { readonly kind: 'AGGREGATE_MISSING' }
  | { readonly kind: 'CONCURRENT_WRITE'; readonly actualRevision: number };

export type GuardDecision<TState> =
  | { readonly proceed: true; readonly state: TState }
  | { readonly proceed: false; readonly rejection: GuardRejection; readonly violations: readonly DomainViolation[] };

export function fingerprintCommand(envelope: CommandEnvelope): string {
  return canonicalPreimageSha256('sos.command.v1', [
    requiredPart('aggregateType', envelope.aggregateType),
    requiredPart('aggregateId', envelope.aggregateId),
    requiredPart('commandKind', envelope.commandKind),
    requiredPart('idempotencyKey', envelope.idempotencyKey),
  ]);
}

function rejection(code: DomainViolation['code'], field: string): readonly DomainViolation[] {
  return [{ code, field, blocking: true }];
}

export function guardCommand<TState extends { readonly revision: number }>(
  envelope: CommandEnvelope,
  expectedRevision: number,
  ledger: IdempotencyLedger,
  store: ConcurrencyStore<TState>,
): GuardDecision<TState> {
  const fingerprint = fingerprintCommand(envelope);
  const prior = ledger.find(envelope.idempotencyKey);

  if (prior !== undefined) {
    if (prior.envelope.aggregateId !== envelope.aggregateId) {
      return {
        proceed: false,
        rejection: { kind: 'KEY_REUSED_FOR_DIFFERENT_COMMAND', stored: prior },
        violations: rejection('IDEMPOTENCY_KEY_CONFLICT', 'command.idempotencyKey'),
      };
    }

    if (prior.fingerprint !== fingerprint) {
      return {
        proceed: false,
        rejection: { kind: 'KEY_REUSED_FOR_DIFFERENT_COMMAND', stored: prior },
        violations: rejection('IDEMPOTENCY_KEY_CONFLICT', 'command.idempotencyKey'),
      };
    }

    return {
      proceed: false,
      rejection: { kind: 'REPLAY', record: prior },
      violations: rejection('IDEMPOTENCY_KEY_REPLAY', 'command.idempotencyKey'),
    };
  }

  const state = store.read(envelope.aggregateId);

  if (state === undefined) {
    return {
      proceed: false,
      rejection: { kind: 'AGGREGATE_MISSING' },
      violations: rejection(
        'AGGREGATE_NOT_FOUND',
        `aggregate.${envelope.aggregateType}.${envelope.aggregateId}`,
      ),
    };
  }

  if (state.revision !== expectedRevision) {
    return {
      proceed: false,
      rejection: { kind: 'STALE_REVISION', actualRevision: state.revision },
      violations: rejection('REVISION_MISMATCH', 'command.expectedRevision'),
    };
  }

  return { proceed: true, state };
}

export function commitCommand<TState extends { readonly revision: number }>(
  envelope: CommandEnvelope,
  nextState: TState,
  resultStatus: string,
  committedAt: string,
  ledger: IdempotencyLedger,
  store: ConcurrencyStore<TState>,
): boolean {
  const committed = store.commit(envelope.aggregateId, nextState, nextState.revision - 1);

  if (!committed) {
    return false;
  }

  ledger.record({
    envelope,
    fingerprint: fingerprintCommand(envelope),
    committedRevision: nextState.revision,
    resultStatus,
    committedAt,
  });

  return true;
}

export function createInMemoryLedger(
  seed: readonly IdempotencyRecord[] = [],
): IdempotencyLedger & { readonly entries: () => readonly IdempotencyRecord[] } {
  const records = new Map<string, IdempotencyRecord>();

  for (const entry of seed) {
    records.set(entry.envelope.idempotencyKey, entry);
  }

  return {
    find: (idempotencyKey: string) => records.get(idempotencyKey),
    record: (entry: IdempotencyRecord) => {
      records.set(entry.envelope.idempotencyKey, entry);
    },
    entries: () => [...records.values()],
  };
}

export function createInMemoryStore<TState extends { readonly revision: number }>(
  seed: readonly (readonly [string, TState])[] = [],
): ConcurrencyStore<TState> & {
  readonly insert: (aggregateId: string, state: TState) => boolean;
  readonly snapshot: () => readonly (readonly [string, TState])[];
} {
  const states = new Map<string, TState>();

  for (const [aggregateId, state] of seed) {
    states.set(aggregateId, state);
  }

  return {
    read: (aggregateId: string) => states.get(aggregateId),
    insert: (aggregateId: string, state: TState) => {
      if (states.has(aggregateId)) {
        return false;
      }
      states.set(aggregateId, state);
      return true;
    },
    commit: (aggregateId: string, state: TState, expectedRevision: number) => {
      const current = states.get(aggregateId);

      if (current === undefined || current.revision !== expectedRevision) {
        return false;
      }

      states.set(aggregateId, state);
      return true;
    },
    snapshot: () => [...states.entries()],
  };
}
