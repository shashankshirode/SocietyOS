import { auditService } from '../../../../core/audit/auditService';
import type { AuditLogEntry } from '../../../../core/audit/audit.types';
import type { Absent } from '../../../../shared/types/absence.types';
import {
  commitCommand,
  fingerprintCommand,
  guardCommand,
  type CommandEnvelope,
  type ConcurrencyStore,
  type IdempotencyLedger,
} from '../domain/guards/commandGuard';
import type { DomainViolation, LifecycleActor } from '../domain/types/primitives';
import { toAuditEntry, violationsToAuditError } from './phase8Audit';

export type RevisionedStatusState = {
  readonly revision: number;
};

export type StatusReader<TState> = (state: TState) => string;

function defaultStatusReader<TState>(state: TState): string {
  const withStatus = state as { readonly status?: string };
  return typeof withStatus.status === 'string' ? withStatus.status : 'UNKNOWN';
}

export type CommandOutcome<TState> =
  | {
      readonly ok: true;
      readonly state: TState;
      readonly fromStatus: string;
      readonly toStatus: string;
      readonly warnings: readonly DomainViolation[];
    }
  | {
      readonly ok: false;
      readonly reason: CommandFailureReason;
      readonly violations: readonly DomainViolation[];
      readonly actualRevision: number | Absent;
    };

export type CommandAuditContext = {
  readonly eventType: string;
  readonly action: string;
  readonly entityType: Parameters<typeof toAuditEntry>[0]['entityType'];
  readonly societyId: string;
  readonly unitId: string | Absent;
};

export type CommandRunner<TState extends RevisionedStatusState> = {
  readonly execute: (
    envelope: CommandEnvelope,
    expectedRevision: number,
    actor: LifecycleActor,
    applyCommand: (current: TState) => { readonly state: TState; readonly toStatus: string } | { readonly violations: readonly DomainViolation[] },
    audit: CommandAuditContext,
  ) => CommandOutcome<TState>;
  readonly create: (
    envelope: CommandEnvelope,
    actor: LifecycleActor,
    buildState: () => TState,
    audit: CommandAuditContext,
  ) => CommandOutcome<TState>;
};

export type CreatableStore<TState> = ConcurrencyStore<TState> & {
  readonly insert: (aggregateId: string, state: TState) => boolean;
};

type CommandFailureReason =
  | 'REPLAY'
  | 'KEY_REUSED'
  | 'STALE_REVISION'
  | 'MISSING'
  | 'CONCURRENT_WRITE'
  | 'DOMAIN_REJECTED';

const REASON_BY_REJECTION: Readonly<Record<string, CommandFailureReason>> = {
  REPLAY: 'REPLAY',
  KEY_REUSED_FOR_DIFFERENT_COMMAND: 'KEY_REUSED',
  STALE_REVISION: 'STALE_REVISION',
  AGGREGATE_MISSING: 'MISSING',
  CONCURRENT_WRITE: 'CONCURRENT_WRITE',
};

export function createCommandRunner<TState extends RevisionedStatusState>(
  ledger: IdempotencyLedger,
  store: ConcurrencyStore<TState>,
  readStatus: StatusReader<TState> = defaultStatusReader,
): CommandRunner<TState> {
  const existing: Omit<CommandRunner<TState>, 'create'> = {
    execute: (envelope, expectedRevision, actor, applyCommand, audit) => {
      const decision = guardCommand(envelope, expectedRevision, ledger, store);

      if (!decision.proceed) {
        const reason = REASON_BY_REJECTION[decision.rejection.kind] ?? 'DOMAIN_REJECTED';
        const rejections = toAuditEntry({
          eventType: audit.eventType,
          action: 'REJECT',
          entityType: audit.entityType,
          entityId: envelope.aggregateId,
          actor,
          societyId: audit.societyId,
          unitId: audit.unitId,
          idempotencyKey: envelope.idempotencyKey,
          reason: decision.rejection.kind,
          previousState: undefined,
          newState: undefined,
          outcome: 'FAILURE',
          error: violationsToAuditError(decision.violations),
        });
        auditService.log(rejections);

        return {
          ok: false,
          reason,
          violations: decision.violations,
          actualRevision:
            decision.rejection.kind === 'STALE_REVISION' ||
            decision.rejection.kind === 'CONCURRENT_WRITE'
              ? decision.rejection.actualRevision
              : undefined,
        };
      }

      const before = decision.state;
      const applied = applyCommand(before);

      if ('violations' in applied) {
        const rejection = toAuditEntry({
          eventType: audit.eventType,
          action: 'REJECT',
          entityType: audit.entityType,
          entityId: envelope.aggregateId,
          actor,
          societyId: audit.societyId,
          unitId: audit.unitId,
          idempotencyKey: envelope.idempotencyKey,
          reason: 'DOMAIN_REJECTED',
          previousState: undefined,
          newState: undefined,
          outcome: 'FAILURE',
          error: violationsToAuditError(applied.violations),
        });
        auditService.log(rejection);

        return { ok: false, reason: 'DOMAIN_REJECTED', violations: applied.violations, actualRevision: undefined };
      }

      const committed = commitCommand(
        envelope,
        applied.state,
        applied.toStatus,
        envelope.idempotencyKey,
        ledger,
        store,
      );

      if (!committed) {
        const concurrent = toAuditEntry({
          eventType: audit.eventType,
          action: 'REJECT',
          entityType: audit.entityType,
          entityId: envelope.aggregateId,
          actor,
          societyId: audit.societyId,
          unitId: audit.unitId,
          idempotencyKey: envelope.idempotencyKey,
          reason: 'CONCURRENT_WRITE',
          previousState: undefined,
          newState: undefined,
          outcome: 'FAILURE',
          error: { code: 'REVISION_MISMATCH', message: 'concurrent write' },
        });
        auditService.log(concurrent);

        return {
          ok: false,
          reason: 'CONCURRENT_WRITE',
          violations: [{ code: 'REVISION_MISMATCH', field: 'command.expectedRevision', blocking: true }],
          actualRevision: before.revision,
        };
      }

      const success = toAuditEntry({
        eventType: audit.eventType,
        action: audit.action,
        entityType: audit.entityType,
        entityId: envelope.aggregateId,
        actor,
        societyId: audit.societyId,
        unitId: audit.unitId,
        idempotencyKey: envelope.idempotencyKey,
        reason: undefined,
        previousState: undefined,
        newState: undefined,
        outcome: 'SUCCESS',
        error: undefined,
      });
      auditService.log(success);

      return {
        ok: true,
        state: applied.state,
        fromStatus: readStatus(before),
        toStatus: applied.toStatus,
        warnings: [],
      };
    },
  };

  const create: CommandRunner<TState>['create'] = (envelope, actor, buildState, audit) => {
    const logRejection = (
      reason: string,
      error: { readonly code: string; readonly message: string } | Absent,
      violations: readonly DomainViolation[],
    ): CommandOutcome<TState> => {
      auditService.log(
        toAuditEntry({
          eventType: audit.eventType,
          action: 'REJECT',
          entityType: audit.entityType,
          entityId: envelope.aggregateId,
          actor,
          societyId: audit.societyId,
          unitId: audit.unitId,
          idempotencyKey: envelope.idempotencyKey,
          reason,
          previousState: undefined,
          newState: undefined,
          outcome: 'FAILURE',
          error,
        }),
      );
      return { ok: false, reason: 'DOMAIN_REJECTED', violations, actualRevision: undefined };
    };

    const replay = ledger.find(envelope.idempotencyKey);
    if (replay !== undefined) {
      return logRejection(
        'REPLAY',
        { code: 'IDEMPOTENCY_KEY_REPLAY', message: 'idempotency key already used' },
        [{ code: 'IDEMPOTENCY_KEY_REPLAY', field: 'command.idempotencyKey', blocking: true }],
      );
    }

    const alreadyExists = store.read(envelope.aggregateId);
    if (alreadyExists !== undefined) {
      return logRejection(
        'AGGREGATE_ALREADY_EXISTS',
        { code: 'IDEMPOTENCY_KEY_CONFLICT', message: 'aggregate already exists' },
        [{ code: 'IDEMPOTENCY_KEY_CONFLICT', field: 'command.aggregateId', blocking: true }],
      );
    }

    const creatable = store as Partial<CreatableStore<TState>>;
    if (typeof creatable.insert !== 'function') {
      return logRejection(
        'STORE_CANNOT_INSERT',
        { code: 'PRECONDITION_FAILED', message: 'store cannot create aggregates' },
        [{ code: 'PRECONDITION_FAILED', field: 'store.insert', blocking: true }],
      );
    }

    const initial = buildState();
    if (creatable.insert(envelope.aggregateId, initial) !== true) {
      return logRejection(
        'CONCURRENT_WRITE',
        { code: 'CONCURRENT_WRITE', message: 'aggregate was created concurrently' },
        [{ code: 'CONCURRENT_WRITE', field: 'command.aggregateId', blocking: true }],
      );
    }

    ledger.record({
      envelope,
      fingerprint: fingerprintCommand(envelope),
      committedRevision: initial.revision,
      resultStatus: readStatus(initial),
      committedAt: envelope.idempotencyKey,
    });

    auditService.log(
      toAuditEntry({
        eventType: audit.eventType,
        action: 'CREATE',
        entityType: audit.entityType,
        entityId: envelope.aggregateId,
        actor,
        societyId: audit.societyId,
        unitId: audit.unitId,
        idempotencyKey: envelope.idempotencyKey,
        reason: undefined,
        previousState: undefined,
        newState: { status: readStatus(initial), revision: initial.revision },
        outcome: 'SUCCESS',
        error: undefined,
      }),
    );

    return { ok: true, state: initial, fromStatus: 'NONE', toStatus: readStatus(initial), warnings: [] };
  };

  return { ...existing, create };
}

export type { AuditLogEntry };
