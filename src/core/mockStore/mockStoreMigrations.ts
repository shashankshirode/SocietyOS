import type { MockStoreState } from './mockStore.types';
import { safeLog } from '../logging/safeLog';

export const CURRENT_SCHEMA_VERSION = 5;

export interface PersistedMockStoreEnvelope {
  version: number;
  persistedAtIso: string;
  state: Partial<MockStoreState>;
}

export type MigrationStep = (state: Record<string, unknown>) => Record<string, unknown>;

export const migrations: Record<number, MigrationStep> = {
  // Migration from v1 to v2: Ensure visitor exitTracking structure
  1: (state) => {
    const visitors = Array.isArray(state['visitors']) ? state['visitors'] : [];
    const migratedVisitors = visitors.map((v: Record<string, unknown>) => ({
      ...v,
      visitorCategory: v['visitorCategory'] ?? v['type'] ?? 'GUEST',
      exitTracking: v['exitTracking'] ?? {
        exitStatus: v['status'] === 'CHECKED_IN' ? 'inside' : 'notEntered',
        alertStatus: 'notRequired',
      },
    }));
    return { ...state, visitors: migratedVisitors };
  },

  // Migration from v2 to v3: Ensure advanceBalances and payments array on bills
  2: (state) => {
    const bills = Array.isArray(state['bills']) ? state['bills'] : [];
    const migratedBills = bills.map((b: Record<string, unknown>) => ({
      ...b,
      payments: Array.isArray(b['payments']) ? b['payments'] : [],
    }));
    const advanceBalances = (state['advanceBalances'] && typeof state['advanceBalances'] === 'object')
      ? state['advanceBalances']
      : {};
    return { ...state, bills: migratedBills, advanceBalances };
  },

  // Migration from v3 to v4: Ensure flatNumber, unitId, and dataScopeKey on complaints
  3: (state) => {
    const complaints = Array.isArray(state['complaints']) ? state['complaints'] : [];
    const migratedComplaints = complaints.map((c: Record<string, unknown>) => ({
      ...c,
      flatNumber: c['flatNumber'] ?? 'B-804',
      unitId: c['unitId'] ?? 'unit-b804',
      updates: Array.isArray(c['updates']) ? c['updates'] : [],
    }));
    return { ...state, complaints: migratedComplaints };
  },

  // Migration from v4 to v5: Canonical envelope and timeline normalization
  4: (state) => {
    const facilityBookings = Array.isArray(state['facilityBookings']) ? state['facilityBookings'] : [];
    const migratedBookings = facilityBookings.map((b: Record<string, unknown>) => ({
      ...b,
      timeline: Array.isArray(b['timeline']) ? b['timeline'] : [],
    }));
    return { ...state, facilityBookings: migratedBookings };
  },
};

/**
 * Migrates a raw persisted store object from its stored version up to CURRENT_SCHEMA_VERSION.
 */
export function migratePersistedState(
  rawEnvelope: unknown,
  fallbackState: MockStoreState
): { migratedState: MockStoreState; version: number; migrated: boolean } {
  if (!rawEnvelope || typeof rawEnvelope !== 'object' || Array.isArray(rawEnvelope)) {
    return { migratedState: fallbackState, version: CURRENT_SCHEMA_VERSION, migrated: false };
  }

  const envelope = rawEnvelope as Record<string, unknown>;
  const storedVersion = typeof envelope['version'] === 'number' ? envelope['version'] : 1;
  let currentState = (envelope['state'] && typeof envelope['state'] === 'object' && !Array.isArray(envelope['state']))
    ? (envelope['state'] as Record<string, unknown>)
    : {};

  let version = storedVersion;
  let migrated = false;

  while (version < CURRENT_SCHEMA_VERSION) {
    const migration = migrations[version];
    if (migration) {
      try {
        currentState = migration(currentState);
        migrated = true;
      } catch (err) {
        safeLog.warn(`[MockStoreMigration] Failed migrating state from v${version} to v${version + 1}`, {
          error: String(err),
        });
        break;
      }
    }
    version++;
  }

  // Merge safely on top of initial state so any missing fields are populated
  const finalState: MockStoreState = {
    ...fallbackState,
    ...(currentState as Partial<MockStoreState>),
    visitors: Array.isArray(currentState['visitors']) ? (currentState['visitors'] as MockStoreState['visitors']) : fallbackState.visitors,
    complaints: Array.isArray(currentState['complaints']) ? (currentState['complaints'] as MockStoreState['complaints']) : fallbackState.complaints,
    bills: Array.isArray(currentState['bills']) ? (currentState['bills'] as MockStoreState['bills']) : fallbackState.bills,
    facilityBookings: Array.isArray(currentState['facilityBookings']) ? (currentState['facilityBookings'] as MockStoreState['facilityBookings']) : fallbackState.facilityBookings,
    ledgerEntries: Array.isArray(currentState['ledgerEntries']) ? (currentState['ledgerEntries'] as MockStoreState['ledgerEntries']) : fallbackState.ledgerEntries,
    advanceBalances: (currentState['advanceBalances'] && typeof currentState['advanceBalances'] === 'object') ? (currentState['advanceBalances'] as MockStoreState['advanceBalances']) : fallbackState.advanceBalances,
  };

  return {
    migratedState: finalState,
    version: CURRENT_SCHEMA_VERSION,
    migrated,
  };
}

/**
 * Safely parses raw stored string with corrupted data quarantine.
 */
export function safeParsePersistedMockStore(
  rawJson: string,
  fallbackState: MockStoreState
): { state: MockStoreState; corrupted: boolean; error?: string } {
  try {
    const parsed = JSON.parse(rawJson);
    const { migratedState } = migratePersistedState(parsed, fallbackState);
    return { state: migratedState, corrupted: false };
  } catch (parseError) {
    const message = parseError instanceof Error ? parseError.message : 'Unknown JSON parse error';
    safeLog.error('[MockStorePersistence] Corrupted persisted state detected. Quarantining.', {
      error: message,
    });
    return {
      state: fallbackState,
      corrupted: true,
      error: message,
    };
  }
}
