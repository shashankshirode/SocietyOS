import { createInMemoryLedger, createInMemoryStore } from '../domain/guards/commandGuard';
import type { IdempotencyLedger, ConcurrencyStore } from '../domain/guards/commandGuard';
import { applyMoveInCommand } from '../domain/stateMachines/moveInStateMachine';
import type { MoveInCommand, MoveInRequestState } from '../domain/types/moveIn.types';
import { createCommandRunner, type CommandOutcome } from './commandRunner';

export type MoveInDependencies = {
  readonly ledger: IdempotencyLedger;
  readonly store: ConcurrencyStore<MoveInRequestState>;
};

export type CreateMoveInInput = {
  readonly moveInRequestId: string;
  readonly requestNumber: string;
  readonly scope: MoveInRequestState['scope'];
  readonly relationshipType: string;
  readonly occupancyStartDate: string;
  readonly requestedOccupancyEndDate?: string;
  readonly agreementReference?: string;
  readonly partyCount: number;
  readonly vehicleCount: number;
  readonly requiresLiftSlot: boolean;
  readonly requiresParking: boolean;
  readonly createdAt: string;
};

export type MoveInService = {
  readonly create: (
    command: MoveInCommand,
    input: CreateMoveInInput,
  ) => CommandOutcome<MoveInRequestState>;
  readonly submit: (command: MoveInCommand, state: MoveInRequestState) => CommandOutcome<MoveInRequestState>;
  readonly dispatch: (command: MoveInCommand, state: MoveInRequestState) => CommandOutcome<MoveInRequestState>;
};

const AUDIT_BY_COMMAND: Readonly<Record<MoveInCommand['kind'], { readonly eventType: string; readonly action: string }>> = {
  SUBMIT_REQUEST: { eventType: 'MOVE_IN_REQUEST_CREATED', action: 'CREATE' },
  RECORD_VERIFICATION_PASSED: { eventType: 'MOVE_IN_REQUEST_CREATED', action: 'VERIFY' },
  RECORD_VERIFICATION_FAILED: { eventType: 'MOVE_IN_VERIFICATION_EXCEPTION_RAISED', action: 'REJECT' },
  APPROVE_VERIFICATION_EXCEPTION: {
    eventType: 'MOVE_IN_VERIFICATION_EXCEPTION_APPROVED',
    action: 'APPROVE',
  },
  CONFIRM_APPOINTMENT: { eventType: 'MOVE_IN_REQUEST_CREATED', action: 'UPDATE' },
  GRANT_APPROVAL: { eventType: 'MOVE_IN_REQUEST_CREATED', action: 'APPROVE' },
  REVOKE_APPROVAL: { eventType: 'MOVE_IN_REQUEST_CREATED', action: 'REJECT' },
  BEGIN_EXECUTION: { eventType: 'MOVE_IN_REQUEST_CREATED', action: 'UPDATE' },
  COMPLETE_EXECUTION: { eventType: 'MOVE_IN_COMPLETED', action: 'UPDATE' },
  CANCEL: { eventType: 'MOVE_IN_REQUEST_CREATED', action: 'REJECT' },
};

const FALLBACK_AUDIT = { eventType: 'MOVE_IN_REQUEST_CREATED', action: 'UPDATE' } as const;

export function createMoveInService(dependencies: MoveInDependencies): MoveInService {
  const runner = createCommandRunner(dependencies.ledger, dependencies.store);

  const dispatch = (command: MoveInCommand, state: MoveInRequestState): CommandOutcome<MoveInRequestState> => {
    const audit = AUDIT_BY_COMMAND[command.kind] ?? FALLBACK_AUDIT;

    return runner.execute(
      {
        aggregateType: 'MOVE_IN_REQUEST',
        aggregateId: state.moveInRequestId,
        commandKind: command.kind,
        idempotencyKey: command.idempotencyKey,
      },
      command.expectedRevision,
      command.actor,
      (current) => {
        const outcome = applyMoveInCommand(current, command);
        return outcome.allowed
          ? { state: outcome.state, toStatus: outcome.toStatus }
          : { violations: outcome.violations };
      },
      {
        eventType: audit.eventType,
        action: audit.action,
        entityType: 'MOVE_IN_REQUEST',
        societyId: state.scope.societyId,
        unitId: state.scope.unitId,
      },
    );
  };

  return {
    dispatch,
    submit: (command, state) => dispatch(command, state),
    create: (command, input) =>
      runner.create(
        {
          aggregateType: 'MOVE_IN_REQUEST',
          aggregateId: input.moveInRequestId,
          commandKind: 'SUBMIT_REQUEST',
          idempotencyKey: command.idempotencyKey,
        },
        command.actor,
        (): MoveInRequestState => ({
          moveInRequestId: input.moveInRequestId,
          requestNumber: input.requestNumber,
          status: 'REQUESTED',
          revision: 0,
          scope: input.scope,
          relationshipType: input.relationshipType,
          occupancyStartDate: input.occupancyStartDate,
          requestedOccupancyEndDate: input.requestedOccupancyEndDate,
          agreementReference: input.agreementReference,
          partyCount: input.partyCount,
          vehicleCount: input.vehicleCount,
          requiresLiftSlot: input.requiresLiftSlot,
          requiresParking: input.requiresParking,
          verificationChecklist: [],
          verificationOutcome: undefined,
          verificationException: undefined,
          appointmentId: undefined,
          approvalReference: undefined,
          execution: undefined,
          cancellation: undefined,
          createdAt: input.createdAt,
          updatedAt: input.createdAt,
        }),
        {
          eventType: 'MOVE_IN_REQUEST_CREATED',
          action: 'CREATE',
          entityType: 'MOVE_IN_REQUEST',
          societyId: input.scope.societyId,
          unitId: input.scope.unitId,
        },
      ),
  };
}

export function createInMemoryMoveInService(
  seed: readonly MoveInRequestState[] = [],
): MoveInService & {
  readonly ledger: IdempotencyLedger;
  readonly store: ConcurrencyStore<MoveInRequestState>;
} {
  const ledger = createInMemoryLedger();
  const store = createInMemoryStore<MoveInRequestState>(
    seed.map((state) => [state.moveInRequestId, state] as const),
  );
  return { ...createMoveInService({ ledger, store }), ledger, store };
}
