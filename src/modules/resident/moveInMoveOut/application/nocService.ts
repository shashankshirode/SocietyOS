import { createInMemoryLedger, createInMemoryStore } from '../domain/guards/commandGuard';
import type { IdempotencyLedger, ConcurrencyStore } from '../domain/guards/commandGuard';
import { applyNocCommand } from '../domain/stateMachines/nocStateMachine';
import type { NocCommand, NocRequestState } from '../domain/types/noc.types';
import { createCommandRunner, type CommandOutcome } from './commandRunner';

export type NocDependencies = {
  readonly ledger: IdempotencyLedger;
  readonly store: ConcurrencyStore<NocRequestState>;
};

export type NocService = {
  readonly dispatch: (command: NocCommand, state: NocRequestState) => CommandOutcome<NocRequestState>;
};

const AUDIT_BY_COMMAND: Readonly<
  Record<NocCommand['kind'], { readonly eventType: string; readonly action: string }>
> = {
  SUBMIT_REQUEST: { eventType: 'NOC_REQUEST_CREATED', action: 'CREATE' },
  BEGIN_REVIEW: { eventType: 'NOC_REQUEST_CREATED', action: 'UPDATE' },
  GRANT_APPROVAL: { eventType: 'NOC_REQUEST_CREATED', action: 'APPROVE' },
  REJECT: { eventType: 'NOC_REQUEST_CREATED', action: 'REJECT' },
  RECORD_SIGNATURE: { eventType: 'NOC_ISSUED', action: 'SIGN' },
  RECORD_ISSUANCE: { eventType: 'NOC_ISSUED', action: 'CREATE' },
  RECORD_REVOCATION: { eventType: 'NOC_VERIFIED', action: 'REVERSE' },
  ARCHIVE: { eventType: 'NOC_VERIFIED', action: 'ARCHIVE' },
  CANCEL: { eventType: 'NOC_REQUEST_CREATED', action: 'REJECT' },
};

const FALLBACK_AUDIT = { eventType: 'NOC_REQUEST_CREATED', action: 'UPDATE' } as const;

export function createNocService(dependencies: NocDependencies): NocService {
  const runner = createCommandRunner(dependencies.ledger, dependencies.store);

  return {
    dispatch: (command, state) => {
      const audit = AUDIT_BY_COMMAND[command.kind] ?? FALLBACK_AUDIT;

      return runner.execute(
        {
          aggregateType: 'NOC_REQUEST',
          aggregateId: state.nocRequestId,
          commandKind: command.kind,
          idempotencyKey: command.idempotencyKey,
        },
        command.expectedRevision,
        command.actor,
        (current) => {
          const outcome = applyNocCommand(current, command);
          return outcome.allowed
            ? { state: outcome.state, toStatus: outcome.toStatus }
            : { violations: outcome.violations };
        },
        {
          eventType: audit.eventType,
          action: audit.action,
          entityType: 'NOC_REQUEST',
          societyId: state.scope.societyId,
          unitId: state.scope.unitId,
        },
      );
    },
  };
}

export function createInMemoryNocService(
  seed: readonly NocRequestState[] = [],
): NocService & {
  readonly ledger: IdempotencyLedger;
  readonly store: ConcurrencyStore<NocRequestState>;
} {
  const ledger = createInMemoryLedger();
  const store = createInMemoryStore<NocRequestState>(
    seed.map((state) => [state.nocRequestId, state] as const),
  );
  return { ...createNocService({ ledger, store }), ledger, store };
}
