import { createInMemoryLedger, createInMemoryStore } from '../domain/guards/commandGuard';
import type { IdempotencyLedger, ConcurrencyStore } from '../domain/guards/commandGuard';
import { applySettlementCommand } from '../domain/stateMachines/settlementStageMachine';
import type {
  SettlementStageCommand,
  SettlementStageState,
} from '../domain/stateMachines/settlementStageMachine';
import { createCommandRunner, type CommandOutcome } from './commandRunner';

export type SettlementDependencies = {
  readonly ledger: IdempotencyLedger;
  readonly store: ConcurrencyStore<SettlementStageState>;
};

export type SettlementService = {
  readonly dispatch: (
    command: SettlementStageCommand,
    state: SettlementStageState,
  ) => CommandOutcome<SettlementStageState>;
};

const AUDIT_BY_COMMAND: Readonly<
  Record<SettlementStageCommand['kind'], { readonly eventType: string; readonly action: string }>
> = {
  FREEZE_PERIOD: { eventType: 'FINAL_SETTLEMENT_FROZEN', action: 'UPDATE' },
  RECORD_REVIEW: { eventType: 'FINAL_SETTLEMENT_REVIEWED', action: 'VERIFY' },
  AWAIT_SETTLEMENT: { eventType: 'FINAL_SETTLEMENT_CALCULATED', action: 'UPDATE' },
  RECORD_CLEARANCE: { eventType: 'FINAL_SETTLEMENT_CLEARED', action: 'SETTLE' },
  RECORD_EXCEPTION: { eventType: 'FINAL_SETTLEMENT_EXCEPTION_RAISED', action: 'REJECT' },
};

const FALLBACK_AUDIT = { eventType: 'FINAL_SETTLEMENT_REVIEWED', action: 'UPDATE' } as const;

export function createSettlementService(dependencies: SettlementDependencies): SettlementService {
  const runner = createCommandRunner(dependencies.ledger, dependencies.store, (state) => state.stage);

  return {
    dispatch: (command, state) => {
      const audit = AUDIT_BY_COMMAND[command.kind] ?? FALLBACK_AUDIT;

      return runner.execute(
        {
          aggregateType: 'FINAL_SETTLEMENT',
          aggregateId: state.settlementId,
          commandKind: command.kind,
          idempotencyKey: command.idempotencyKey,
        },
        command.expectedRevision,
        command.actor,
        (current) => {
          const outcome = applySettlementCommand(current, command);
          return outcome.allowed
            ? { state: outcome.state, toStatus: outcome.toStage }
            : { violations: outcome.violations };
        },
        {
          eventType: audit.eventType,
          action: audit.action,
          entityType: 'FINAL_SETTLEMENT',
          societyId: state.scope.societyId,
          unitId: state.scope.unitId,
        },
      );
    },
  };
}

export function createInMemorySettlementService(
  seed: readonly SettlementStageState[] = [],
): SettlementService & {
  readonly ledger: IdempotencyLedger;
  readonly store: ConcurrencyStore<SettlementStageState>;
} {
  const ledger = createInMemoryLedger();
  const store = createInMemoryStore<SettlementStageState>(
    seed.map((state) => [state.settlementId, state] as const),
  );
  return { ...createSettlementService({ ledger, store }), ledger, store };
}
