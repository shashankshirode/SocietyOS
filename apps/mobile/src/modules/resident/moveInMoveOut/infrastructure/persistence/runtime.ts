import { createAsyncConcurrencyStore, createAsyncIdempotencyLedger } from './asyncPersistence';
import { createMoveInService, type MoveInService } from '../../application/moveInService';
import { createMoveOutService, type MoveOutService } from '../../application/moveOutService';
import { createNocService, type NocService } from '../../application/nocService';
import { createSettlementService, type SettlementService } from '../../application/settlementService';
import { createClearanceService, type ClearanceService } from '../../application/clearanceService';
import { createAccessService, type AccessService } from '../../application/accessService';
import type { MoveInRequestState } from '../../domain/types/moveIn.types';
import type { MoveOutRequestState } from '../../domain/types/moveOut.types';
import type { NocRequestState } from '../../domain/types/noc.types';
import type { SettlementStageState } from '../../domain/stateMachines/settlementStageMachine';
import type { Absent } from '../../../../../shared/types/absence.types';
import type { JsonObject, JsonValue } from '../../../../../core/api/api.types';

type FlushedStore = {
  readonly hydrateAll: () => Promise<void>;
  readonly flush: () => Promise<void>;
};

function asRecord(raw: JsonValue): JsonObject | Absent {
  return typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? raw : undefined;
}

function narrowState<TState>(raw: JsonValue, keys: readonly string[]): TState | Absent {
  const record = asRecord(raw);

  if (record === undefined) {
    return undefined;
  }

  const matches = keys.every((key) => typeof record[key] === 'string');

  return matches ? (record as TState) : undefined;
}

export function parseMoveInState(raw: JsonValue): MoveInRequestState | Absent {
  return narrowState<MoveInRequestState>(raw, ['status', 'moveInRequestId']);
}

export function parseMoveOutState(raw: JsonValue): MoveOutRequestState | Absent {
  return narrowState<MoveOutRequestState>(raw, ['status', 'moveOutRequestId']);
}

export function parseNocState(raw: JsonValue): NocRequestState | Absent {
  return narrowState<NocRequestState>(raw, ['status', 'nocRequestId']);
}

export function parseSettlementState(raw: JsonValue): SettlementStageState | Absent {
  return narrowState<SettlementStageState>(raw, ['stage', 'settlementId']);
}

export type MoveLifecycleRuntime = {
  readonly moveIn: MoveInService;
  readonly moveOut: MoveOutService;
  readonly noc: NocService;
  readonly settlement: SettlementService;
  readonly clearance: ClearanceService;
  readonly access: AccessService;
  readonly hydrate: () => Promise<void>;
  readonly flush: () => Promise<void>;
  readonly persistedAggregateIds: () => {
    readonly moveIn: readonly string[];
    readonly moveOut: readonly string[];
    readonly noc: readonly string[];
    readonly settlement: readonly string[];
  };
};

export function createMoveLifecycleRuntime(): MoveLifecycleRuntime {
  const ledger = createAsyncIdempotencyLedger();
  const moveInStore = createAsyncConcurrencyStore<MoveInRequestState>(parseMoveInState);
  const moveOutStore = createAsyncConcurrencyStore<MoveOutRequestState>(parseMoveOutState);
  const nocStore = createAsyncConcurrencyStore<NocRequestState>(parseNocState);
  const settlementStore = createAsyncConcurrencyStore<SettlementStageState>(parseSettlementState);

  const stores: readonly FlushedStore[] = [moveInStore, moveOutStore, nocStore, settlementStore];

  return {
    moveIn: createMoveInService({ ledger, store: moveInStore }),
    moveOut: createMoveOutService({ ledger, store: moveOutStore }),
    noc: createNocService({ ledger, store: nocStore }),
    settlement: createSettlementService({ ledger, store: settlementStore }),
    clearance: createClearanceService(),
    access: createAccessService(),
    hydrate: async () => {
      await ledger.hydrate();
      for (const store of stores) {
        await store.hydrateAll();
      }
    },
    flush: async () => {
      await ledger.flush();
      for (const store of stores) {
        await store.flush();
      }
    },
    persistedAggregateIds: () => ({
      moveIn: moveInStore.aggregateIds(),
      moveOut: moveOutStore.aggregateIds(),
      noc: nocStore.aggregateIds(),
      settlement: settlementStore.aggregateIds(),
    }),
  };
}
