import {
  migratePersistedState,
  safeParsePersistedMockStore,
  CURRENT_SCHEMA_VERSION,
} from '../mockStoreMigrations';
import type { MockStoreState } from '../mockStore.types';

const mockFallbackState: MockStoreState = {
  visitors: [],
  complaints: [],
  notices: [],
  bills: [],
  documents: [],
  nocs: [],
  nocRequests: [],
  staff: [],
  residents: [],
  adminResidents: [],
  residentsNew: [],
  societyHierarchy: {
    id: 'society-root',
    name: 'Fallback Society',
    type: 'SOCIETY',
    level: 'SOCIETY',
    code: 'FS',
    children: [],
  },
  societyUnits: [],
  chatThreads: [],
  interFlatIssues: [],
  facilityBookings: [],
  vehicles: [],
  gateLogs: [],
  ledgerEntries: [],
  advanceBalances: {},
};

describe('MockStore Schema Migrations & Corrupted State Quarantine', () => {
  it('migrates v1 state to CURRENT_SCHEMA_VERSION with visitor exitTracking populated', () => {
    const rawV1Envelope = {
      version: 1,
      state: {
        visitors: [
          {
            id: 'vis-1',
            name: 'Old Visitor',
            phone: '+919999999999',
            type: 'GUEST',
            status: 'CHECKED_IN',
          },
        ],
      },
    };

    const { migratedState, version, migrated } = migratePersistedState(rawV1Envelope, mockFallbackState);

    expect(version).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated).toBe(true);
    expect(migratedState.visitors.length).toBe(1);
    expect(migratedState.visitors[0]?.exitTracking?.exitStatus).toBe('inside');
    expect(migratedState.visitors[0]?.visitorCategory).toBe('GUEST');
  });

  it('migrates v3 state by ensuring flatNumber, unitId, and updates array on complaints', () => {
    const rawV3Envelope = {
      version: 3,
      state: {
        complaints: [
          {
            id: 'comp-1',
            title: 'Water Leak',
          },
        ],
      },
    };

    const { migratedState, version, migrated } = migratePersistedState(rawV3Envelope, mockFallbackState);

    expect(version).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated).toBe(true);
    expect(migratedState.complaints[0]?.flatNumber).toBe('B-804');
    expect(migratedState.complaints[0]?.unitId).toBe('unit-b804');
    expect(migratedState.complaints[0]?.updates).toEqual([]);
  });

  it('handles corrupted JSON string without throwing and marks corrupted true', () => {
    const corruptedJson = '{"version": 4, "state": { "visitors": [MALFORMED JSON';

    const result = safeParsePersistedMockStore(corruptedJson, mockFallbackState);

    expect(result.corrupted).toBe(true);
    expect(result.error).toBeDefined();
    // Returns clean fallback state so application never crashes
    expect(result.state).toEqual(mockFallbackState);
  });

  it('safely handles non-object or null raw envelopes', () => {
    const { migratedState, version, migrated } = migratePersistedState(null, mockFallbackState);

    expect(version).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated).toBe(false);
    expect(migratedState).toEqual(mockFallbackState);
  });
});
