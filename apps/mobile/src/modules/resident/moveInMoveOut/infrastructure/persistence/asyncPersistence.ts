import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JsonValue } from '../../../../../core/api/api.types';
import type { Absent } from '../../../../../shared/types/absence.types';
import type {
  CommandEnvelope,
  ConcurrencyStore,
  IdempotencyLedger,
  IdempotencyRecord,
} from '../../domain/guards/commandGuard';

const LEDGER_STORAGE_KEY = 'societyos.moveInMoveOut.idempotencyLedger';
const STORE_STORAGE_PREFIX = 'societyos.moveInMoveOut.aggregate.';
const STORE_INDEX_KEY = 'societyos.moveInMoveOut.aggregateIndex';

const AGGREGATE_TYPES: readonly CommandEnvelope['aggregateType'][] = [
  'MOVE_IN_REQUEST',
  'MOVE_OUT_REQUEST',
  'NOC_REQUEST',
];

function isAggregateType(value: JsonValue | Absent): value is CommandEnvelope['aggregateType'] {
  return typeof value === 'string' && AGGREGATE_TYPES.some((type) => type === value);
}

function readValue(source: Record<string, JsonValue>, key: string): JsonValue | Absent {
  return Object.prototype.hasOwnProperty.call(source, key) ? source[key] : undefined;
}

function readString(source: Record<string, JsonValue>, key: string): string | Absent {
  const value = source[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readFiniteNumber(source: Record<string, JsonValue>, key: string): number | Absent {
  const value = source[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function asRecord(value: JsonValue): Record<string, JsonValue> | Absent {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    return undefined;
  }
  return value as Record<string, JsonValue>;
}

export function parseIdempotencyRecord(raw: JsonValue): IdempotencyRecord | Absent {
  const top = asRecord(raw);

  if (top === undefined) {
    return undefined;
  }

  const envelopeValue = readValue(top, 'envelope');
  const envelopeRaw = envelopeValue === undefined ? undefined : asRecord(envelopeValue);

  if (envelopeRaw === undefined) {
    return undefined;
  }

  const aggregateType = readValue(envelopeRaw, 'aggregateType');

  if (!isAggregateType(aggregateType)) {
    return undefined;
  }

  const aggregateId = readString(envelopeRaw, 'aggregateId');
  const commandKind = readString(envelopeRaw, 'commandKind');
  const idempotencyKey = readString(envelopeRaw, 'idempotencyKey');
  const fingerprint = readString(top, 'fingerprint');
  const committedRevision = readFiniteNumber(top, 'committedRevision');
  const resultStatus = readString(top, 'resultStatus');
  const committedAt = readString(top, 'committedAt');

  if (
    aggregateId === undefined ||
    commandKind === undefined ||
    idempotencyKey === undefined ||
    fingerprint === undefined ||
    committedRevision === undefined ||
    resultStatus === undefined ||
    committedAt === undefined
  ) {
    return undefined;
  }

  return {
    envelope: { aggregateType, aggregateId, commandKind, idempotencyKey },
    fingerprint,
    committedRevision,
    resultStatus,
    committedAt,
  };
}

function serializeIdempotencyRecord(entry: IdempotencyRecord): JsonValue {
  return {
    envelope: {
      aggregateType: entry.envelope.aggregateType,
      aggregateId: entry.envelope.aggregateId,
      commandKind: entry.envelope.commandKind,
      idempotencyKey: entry.envelope.idempotencyKey,
    },
    fingerprint: entry.fingerprint,
    committedRevision: entry.committedRevision,
    resultStatus: entry.resultStatus,
    committedAt: entry.committedAt,
  };
}

export type AsyncIdempotencyLedger = IdempotencyLedger & {
  readonly hydrate: () => Promise<void>;
  readonly flush: () => Promise<void>;
  readonly size: () => number;
  readonly clear: () => Promise<void>;
};

export function createAsyncIdempotencyLedger(
  storage: Pick<typeof AsyncStorage, 'getItem' | 'setItem' | 'removeItem'> = AsyncStorage,
): AsyncIdempotencyLedger {
  const records = new Map<string, IdempotencyRecord>();
  let pendingWrite: Promise<void> = Promise.resolve();
  let hydrated = false;

  const persist = (): void => {
    const snapshot = JSON.stringify([...records.values()].map(serializeIdempotencyRecord));
    pendingWrite = pendingWrite.then(() => storage.setItem(LEDGER_STORAGE_KEY, snapshot));
  };

  return {
    find: (idempotencyKey) => records.get(idempotencyKey),
    record: (entry) => {
      records.set(entry.envelope.idempotencyKey, entry);
      persist();
    },
    hydrate: async () => {
      if (hydrated) {
        return;
      }
      hydrated = true;
      const raw = await storage.getItem(LEDGER_STORAGE_KEY);

      if (raw === null) {
        return;
      }

      let parsed: JsonValue;

      try {
        parsed = JSON.parse(raw) as JsonValue;
      } catch {
        await storage.removeItem(LEDGER_STORAGE_KEY);
        return;
      }

      if (!Array.isArray(parsed)) {
        await storage.removeItem(LEDGER_STORAGE_KEY);
        return;
      }

      for (const item of parsed) {
        const record = parseIdempotencyRecord(item);
        if (record !== undefined) {
          records.set(record.envelope.idempotencyKey, record);
        }
      }
    },
    flush: () => pendingWrite,
    size: () => records.size,
    clear: async () => {
      records.clear();
      await storage.removeItem(LEDGER_STORAGE_KEY);
    },
  };
}

export type AsyncConcurrencyStore<TState> = ConcurrencyStore<TState> & {
  readonly insert: (aggregateId: string, state: TState) => boolean;
  readonly hydrate: (aggregateIds: readonly string[]) => Promise<void>;
  readonly hydrateAll: () => Promise<void>;
  readonly flush: () => Promise<void>;
  readonly aggregateIds: () => readonly string[];
};

export function createAsyncConcurrencyStore<TState extends { readonly revision: number }>(
  parse: (raw: JsonValue) => TState | Absent,
  storage: Pick<typeof AsyncStorage, 'getItem' | 'setItem' | 'removeItem'> = AsyncStorage,
): AsyncConcurrencyStore<TState> {
  const states = new Map<string, TState>();
  const knownIds = new Set<string>();
  let pendingWrite: Promise<void> = Promise.resolve();

  const persist = (aggregateId: string, state: TState): void => {
    const key = `${STORE_STORAGE_PREFIX}${aggregateId}`;
    const snapshot = JSON.stringify(state);
    pendingWrite = pendingWrite.then(() => storage.setItem(key, snapshot));
  };

  const persistIndex = (): void => {
    const snapshot = JSON.stringify([...knownIds].sort());
    pendingWrite = pendingWrite.then(() => storage.setItem(STORE_INDEX_KEY, snapshot));
  };

  const readIndex = async (): Promise<readonly string[]> => {
    const raw = await storage.getItem(STORE_INDEX_KEY);

    if (raw === null) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as JsonValue;

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((entry): entry is string => typeof entry === 'string');
    } catch {
      return [];
    }
  };

  const forget = (aggregateId: string): void => {
    states.delete(aggregateId);
    knownIds.delete(aggregateId);
    pendingWrite = pendingWrite.then(() => storage.removeItem(`${STORE_STORAGE_PREFIX}${aggregateId}`));
    persistIndex();
  };

  return {
    read: (aggregateId) => states.get(aggregateId),
    insert: (aggregateId, state) => {
      if (states.has(aggregateId)) {
        return false;
      }
      states.set(aggregateId, state);
      knownIds.add(aggregateId);
      persist(aggregateId, state);
      persistIndex();
      return true;
    },
    commit: (aggregateId, state, expectedRevision) => {
      const current = states.get(aggregateId);

      if (current === undefined || current.revision !== expectedRevision) {
        return false;
      }

      states.set(aggregateId, state);
      knownIds.add(aggregateId);
      persist(aggregateId, state);
      persistIndex();
      return true;
    },
    hydrate: async (aggregateIds) => {
      for (const aggregateId of aggregateIds) {
        const raw = await storage.getItem(`${STORE_STORAGE_PREFIX}${aggregateId}`);

        if (raw === null) {
          states.delete(aggregateId);
          knownIds.delete(aggregateId);
          persistIndex();
          continue;
        }

        try {
          const restored = parse(JSON.parse(raw) as JsonValue);

          if (restored === undefined) {
            forget(aggregateId);
            continue;
          }

          states.set(aggregateId, restored);
          knownIds.add(aggregateId);
        } catch {
          forget(aggregateId);
        }
      }
      persistIndex();
    },
    hydrateAll: async () => {
      for (const aggregateId of await readIndex()) {
        const raw = await storage.getItem(`${STORE_STORAGE_PREFIX}${aggregateId}`);

        if (raw === null) {
          states.delete(aggregateId);
          knownIds.delete(aggregateId);
          continue;
        }

        try {
          const restored = parse(JSON.parse(raw) as JsonValue);

          if (restored === undefined) {
            forget(aggregateId);
            continue;
          }

          states.set(aggregateId, restored);
        } catch {
          forget(aggregateId);
        }
      }
      persistIndex();
    },
    flush: () => pendingWrite,
    aggregateIds: () => [...states.keys()],
  };
}
