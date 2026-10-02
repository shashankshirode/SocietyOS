import { actorTypeAllowed, allViolations, isAbsent } from '../guards/commandSupport';
import type { DomainViolation } from '../types/primitives';
import type { LifecycleActor, LifecycleActorType, LifecycleScope } from '../types/primitives';
import {
  SETTLEMENT_STAGE_PATH,
  SETTLEMENT_TERMINAL_STAGES,
  type SettlementStage,
} from '../types/settlement.types';
import type { Absent } from '../../../../../shared/types/absence.types';

export type SettlementPeriod = {
  readonly from: string;
  readonly to: string;
};

export type SettlementStageState = {
  readonly settlementId: string;
  readonly moveOutRequestId: string;
  readonly moveOutRevision: number;
  readonly scope: LifecycleScope;
  readonly stage: SettlementStage;
  readonly revision: number;
  readonly frozenPeriod: SettlementPeriod | Absent;
  readonly authoritative: boolean;
  readonly exceptionReasonKeys: readonly string[];
  readonly clearedAt: string | Absent;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type SettlementStageCommandKind =
  | 'FREEZE_PERIOD'
  | 'RECORD_REVIEW'
  | 'AWAIT_SETTLEMENT'
  | 'RECORD_CLEARANCE'
  | 'RECORD_EXCEPTION';

export type SettlementStageCommand = {
  readonly kind: SettlementStageCommandKind;
  readonly actor: LifecycleActor;
  readonly idempotencyKey: string;
  readonly expectedRevision: number;
  readonly occurredAt: string;
  readonly periodFrom: string | Absent;
  readonly periodTo: string | Absent;
  readonly settlementSnapshotId: string | Absent;
  readonly exceptionReasonKeys: readonly string[];
};

export type SettlementStageTransition =
  | {
      readonly allowed: false;
      readonly fromStage: SettlementStage;
      readonly attempted: SettlementStage;
      readonly violations: readonly DomainViolation[];
    }
  | {
      readonly allowed: true;
      readonly fromStage: SettlementStage;
      readonly toStage: SettlementStage;
      readonly state: SettlementStageState;
      readonly warnings: readonly DomainViolation[];
    };

const PERMITTED_ACTORS: Readonly<Record<SettlementStageCommandKind, readonly LifecycleActorType[]>> = {
  FREEZE_PERIOD: ['TREASURER', 'SOCIETY_ADMIN'],
  RECORD_REVIEW: ['TREASURER', 'SOCIETY_ADMIN'],
  AWAIT_SETTLEMENT: ['TREASURER', 'SOCIETY_ADMIN'],
  RECORD_CLEARANCE: ['TREASURER', 'SOCIETY_ADMIN'],
  RECORD_EXCEPTION: ['TREASURER', 'SOCIETY_ADMIN'],
};

const ORIGIN_BY_COMMAND: Readonly<Record<SettlementStageCommandKind, readonly SettlementStage[]>> = {
  FREEZE_PERIOD: ['REQUESTED'],
  RECORD_REVIEW: ['CALCULATING', 'EXCEPTION'],
  AWAIT_SETTLEMENT: ['REVIEW'],
  RECORD_CLEARANCE: ['SETTLEMENT_PENDING'],
  RECORD_EXCEPTION: ['CALCULATING', 'REVIEW', 'SETTLEMENT_PENDING'],
};

const TARGET_BY_COMMAND: Readonly<Record<SettlementStageCommandKind, SettlementStage>> = {
  FREEZE_PERIOD: 'CALCULATING',
  RECORD_REVIEW: 'REVIEW',
  AWAIT_SETTLEMENT: 'SETTLEMENT_PENDING',
  RECORD_CLEARANCE: 'CLEARED',
  RECORD_EXCEPTION: 'EXCEPTION',
};

function blocking(code: DomainViolation['code'], field: string): DomainViolation {
  return { code, field, blocking: true };
}

export function settlementStagePath(): readonly SettlementStage[] {
  return SETTLEMENT_STAGE_PATH;
}

export function isSettlementTerminalStage(stage: SettlementStage): boolean {
  return SETTLEMENT_TERMINAL_STAGES.includes(stage);
}

export function applySettlementCommand(
  state: SettlementStageState,
  command: SettlementStageCommand,
): SettlementStageTransition {
  const target = TARGET_BY_COMMAND[command.kind];
  const allowedOrigins = ORIGIN_BY_COMMAND[command.kind];

  if (isSettlementTerminalStage(state.stage)) {
    return {
      allowed: false,
      fromStage: state.stage,
      attempted: target,
      violations: [blocking('TERMINAL_STATE', 'stage')],
    };
  }

  if (!allowedOrigins.includes(state.stage)) {
    return {
      allowed: false,
      fromStage: state.stage,
      attempted: target,
      violations: [blocking('ILLEGAL_TRANSITION', `stage:${state.stage}->${target}`)],
    };
  }

  const violations = allViolations([
    actorTypeAllowed(command.actor, PERMITTED_ACTORS[command.kind])
      ? []
      : [blocking('ACTOR_NOT_AUTHORIZED', 'actor.actorType')],
    command.actor.societyId === state.scope.societyId
      ? []
      : [blocking('ACTOR_SCOPE_VIOLATION', 'actor.societyId')],
    command.expectedRevision === state.revision
      ? []
      : [blocking('REVISION_MISMATCH', 'command.expectedRevision')],
    fieldViolations(state, command),
  ]);

  if (violations.length > 0) {
    return { allowed: false, fromStage: state.stage, attempted: target, violations };
  }

  return {
    allowed: true,
    fromStage: state.stage,
    toStage: target,
    state: nextState(state, command, target),
    warnings: [],
  };
}

function fieldViolations(
  state: SettlementStageState,
  command: SettlementStageCommand,
): readonly DomainViolation[] {
  const groups: DomainViolation[][] = [];

  if (command.kind === 'FREEZE_PERIOD') {
    if (isAbsent(command.periodFrom)) {
      groups.push([blocking('PRECONDITION_FAILED', 'command.periodFrom')]);
    }
    if (isAbsent(command.periodTo)) {
      groups.push([blocking('PRECONDITION_FAILED', 'command.periodTo')]);
    }
  }

  if (command.kind === 'RECORD_REVIEW' && state.frozenPeriod === undefined) {
    groups.push([blocking('PRECONDITION_FAILED', 'state.frozenPeriod')]);
  }

  if (command.kind === 'RECORD_CLEARANCE' && isAbsent(command.settlementSnapshotId)) {
    groups.push([blocking('PRECONDITION_FAILED', 'command.settlementSnapshotId')]);
  }

  if (command.kind === 'RECORD_EXCEPTION' && command.exceptionReasonKeys.length === 0) {
    groups.push([blocking('PRECONDITION_FAILED', 'command.exceptionReasonKeys')]);
  }

  return allViolations(groups);
}

function nextState(
  state: SettlementStageState,
  command: SettlementStageCommand,
  toStage: SettlementStage,
): SettlementStageState {
  const base: SettlementStageState = {
    ...state,
    stage: toStage,
    revision: state.revision + 1,
    updatedAt: command.occurredAt,
  };

  switch (command.kind) {
    case 'FREEZE_PERIOD':
      return {
        ...base,
        frozenPeriod: { from: command.periodFrom as string, to: command.periodTo as string },
      };
    case 'RECORD_CLEARANCE':
      return { ...base, authoritative: true, clearedAt: command.occurredAt };
    case 'RECORD_EXCEPTION':
      return {
        ...base,
        authoritative: false,
        exceptionReasonKeys: [...state.exceptionReasonKeys, ...command.exceptionReasonKeys],
      };
    default:
      return base;
  }
}
