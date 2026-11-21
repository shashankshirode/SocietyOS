import { applyMoveOutCommand } from '../domain/stateMachines/moveOutStateMachine';
import type { MoveOutCommand, MoveOutRequestState } from '../domain/types/moveOut.types';
import type { ConcurrencyStore, IdempotencyLedger } from '../domain/guards/commandGuard';
import { createInMemoryLedger, createInMemoryStore } from '../domain/guards/commandGuard';
import { createCommandRunner, type CommandOutcome } from './commandRunner';

export type MoveOutDependencies = {
  readonly ledger: IdempotencyLedger;
  readonly store: ConcurrencyStore<MoveOutRequestState>;
};

export type MoveOutService = {
  readonly dispatch: (
    command: MoveOutCommand,
    state: MoveOutRequestState,
  ) => CommandOutcome<MoveOutRequestState>;
};

const AUDIT_BY_COMMAND: Readonly<
  Record<MoveOutCommand['kind'], { readonly eventType: string; readonly action: string }>
> = {
  SUBMIT_REQUEST: { eventType: 'MOVE_OUT_REQUEST_CREATED', action: 'CREATE' },
  BEGIN_CLEARANCE_CHECK: { eventType: 'MOVE_OUT_CLEARANCE_EVALUATED', action: 'UPDATE' },
  RECORD_CLEARANCE_SNAPSHOT: { eventType: 'MOVE_OUT_CLEARANCE_EVALUATED', action: 'VERIFY' },
  RECORD_CLEARANCE_EXCEPTION: { eventType: 'MOVE_OUT_CLEARANCE_EVALUATED', action: 'REJECT' },
  GRANT_APPROVAL: { eventType: 'MOVE_OUT_REQUEST_CREATED', action: 'APPROVE' },
  REJECT_APPROVAL: { eventType: 'MOVE_OUT_REQUEST_CREATED', action: 'REJECT' },
  RECORD_SIGNATURE: { eventType: 'MOVE_OUT_REQUEST_CREATED', action: 'SIGN' },
  RECORD_ISSUANCE: { eventType: 'NOC_ISSUED', action: 'SIGN' },
  RECORD_ACCESS_REVOCATION: { eventType: 'MOVE_OUT_ACCESS_REVOKED', action: 'UPDATE' },
  RECORD_OCCUPANCY_CLOSURE: { eventType: 'MOVE_OUT_OCCUPANCY_CLOSED', action: 'UPDATE' },
  ARCHIVE: { eventType: 'MOVE_OUT_ARCHIVED', action: 'ARCHIVE' },
  CANCEL: { eventType: 'MOVE_OUT_REQUEST_CREATED', action: 'REJECT' },
};

const FALLBACK_AUDIT = { eventType: 'MOVE_OUT_REQUEST_CREATED', action: 'UPDATE' } as const;

function auditFor(kind: MoveOutCommand['kind']): { readonly eventType: string; readonly action: string } {
  return AUDIT_BY_COMMAND[kind] ?? FALLBACK_AUDIT;
}

export function createMoveOutService(dependencies: MoveOutDependencies): MoveOutService {
  const runner = createCommandRunner(dependencies.ledger, dependencies.store);

  return {
    dispatch: (command, state) =>
      runner.execute(
        {
          aggregateType: 'MOVE_OUT_REQUEST',
          aggregateId: state.moveOutRequestId,
          commandKind: command.kind,
          idempotencyKey: command.idempotencyKey,
        },
        command.expectedRevision,
        command.actor,
        (current) => {
          const outcome = applyMoveOutCommand(current, command);
          return outcome.allowed
            ? { state: outcome.state, toStatus: outcome.toStatus }
            : { violations: outcome.violations };
        },
        {
          eventType: auditFor(command.kind).eventType,
          action: auditFor(command.kind).action,
          entityType: 'MOVE_IN_OUT_REQUEST',
          societyId: state.scope.societyId,
          unitId: state.scope.unitId,
        },
      ),
  };
}

export function createInMemoryMoveOutService(
  seed: readonly MoveOutRequestState[] = [],
): MoveOutService & {
  readonly ledger: IdempotencyLedger;
  readonly store: ConcurrencyStore<MoveOutRequestState>;
} {
  const ledger = createInMemoryLedger();
  const store = createInMemoryStore<MoveOutRequestState>(
    seed.map((state) => [state.moveOutRequestId, state] as const),
  );
  return { ...createMoveOutService({ ledger, store }), ledger, store };
}
