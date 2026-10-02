import {
  actorTypeAllowed,
  allViolations,
  blocking,
  isAbsent,
} from '../guards/commandSupport';
import type { DomainViolation, LifecycleActorType } from '../types/primitives';
import type {
  MoveInCommand,
  MoveInCommandKind,
  MoveInRequestState,
  MoveInStatus,
  MoveInVerificationCheckResult,
} from '../types/moveIn.types';
import { MOVE_IN_TERMINAL_STATUSES } from '../types/moveIn.types';

export type MoveInTransition =
  | {
      readonly allowed: false;
      readonly fromStatus: MoveInStatus;
      readonly attempted: MoveInStatus;
      readonly violations: readonly DomainViolation[];
    }
  | {
      readonly allowed: true;
      readonly fromStatus: MoveInStatus;
      readonly toStatus: MoveInStatus;
      readonly state: MoveInRequestState;
      readonly warnings: readonly DomainViolation[];
    };

const SATISFIED_VERIFICATION_RESULTS: readonly MoveInVerificationCheckResult[] = [
  'PASS',
  'NOT_APPLICABLE',
];

const PERMITTED_ACTORS_BY_COMMAND: Readonly<Record<MoveInCommandKind, readonly LifecycleActorType[]>> = {
  SUBMIT_REQUEST: ['RESIDENT', 'OWNER', 'TENANT', 'FAMILY_MEMBER', 'SOCIETY_ADMIN', 'SYSTEM'],
  RECORD_VERIFICATION_PASSED: ['SOCIETY_ADMIN'],
  RECORD_VERIFICATION_FAILED: ['SOCIETY_ADMIN'],
  APPROVE_VERIFICATION_EXCEPTION: ['SOCIETY_SECRETARY', 'SOCIETY_CHAIRPERSON', 'SOCIETY_ADMIN'],
  CONFIRM_APPOINTMENT: ['SOCIETY_ADMIN', 'FACILITY_MANAGER', 'SYSTEM'],
  GRANT_APPROVAL: ['SOCIETY_SECRETARY', 'SOCIETY_CHAIRPERSON', 'SOCIETY_ADMIN'],
  REVOKE_APPROVAL: ['SOCIETY_SECRETARY', 'SOCIETY_CHAIRPERSON', 'SOCIETY_ADMIN'],
  BEGIN_EXECUTION: ['FACILITY_MANAGER', 'SECURITY', 'SOCIETY_ADMIN', 'SYSTEM'],
  COMPLETE_EXECUTION: ['FACILITY_MANAGER', 'SECURITY', 'SOCIETY_ADMIN', 'SYSTEM'],
  CANCEL: ['RESIDENT', 'OWNER', 'TENANT', 'FAMILY_MEMBER', 'SOCIETY_ADMIN', 'SYSTEM'],
};

const RESIDENT_INITIATED_ACTORS: readonly LifecycleActorType[] = [
  'RESIDENT',
  'OWNER',
  'TENANT',
  'FAMILY_MEMBER',
];

const TARGET_BY_COMMAND: Readonly<Record<MoveInCommandKind, MoveInStatus>> = {
  SUBMIT_REQUEST: 'REQUESTED',
  RECORD_VERIFICATION_PASSED: 'VERIFIED',
  RECORD_VERIFICATION_FAILED: 'EXCEPTION',
  APPROVE_VERIFICATION_EXCEPTION: 'VERIFIED',
  CONFIRM_APPOINTMENT: 'SCHEDULED',
  GRANT_APPROVAL: 'APPROVED',
  REVOKE_APPROVAL: 'CANCELLED',
  BEGIN_EXECUTION: 'IN_PROGRESS',
  COMPLETE_EXECUTION: 'COMPLETED',
  CANCEL: 'CANCELLED',
};

const ORIGIN_BY_COMMAND: Readonly<Record<MoveInCommandKind, readonly MoveInStatus[]>> = {
  SUBMIT_REQUEST: [],
  RECORD_VERIFICATION_PASSED: ['REQUESTED'],
  RECORD_VERIFICATION_FAILED: ['REQUESTED'],
  APPROVE_VERIFICATION_EXCEPTION: ['EXCEPTION'],
  CONFIRM_APPOINTMENT: ['VERIFIED'],
  GRANT_APPROVAL: ['SCHEDULED'],
  REVOKE_APPROVAL: ['APPROVED'],
  BEGIN_EXECUTION: ['APPROVED'],
  COMPLETE_EXECUTION: ['IN_PROGRESS'],
  CANCEL: ['REQUESTED', 'VERIFIED', 'SCHEDULED', 'APPROVED', 'EXCEPTION'],
};

export function isMoveInTerminalStatus(status: MoveInStatus): boolean {
  return MOVE_IN_TERMINAL_STATUSES.includes(status);
}

export function permittedMoveInActors(commandKind: MoveInCommandKind): readonly LifecycleActorType[] {
  return PERMITTED_ACTORS_BY_COMMAND[commandKind];
}

function commandAuthorizationViolations(command: MoveInCommand): readonly DomainViolation[] {
  const permitted = PERMITTED_ACTORS_BY_COMMAND[command.kind];
  return actorTypeAllowed(command.actor, permitted)
    ? []
    : [blocking('ACTOR_NOT_AUTHORIZED', `command.${command.kind}`)];
}

function requestScopeViolations(
  state: MoveInRequestState,
  command: MoveInCommand,
): readonly DomainViolation[] {
  const violations: DomainViolation[] = [];
  if (state.scope.societyId !== command.actor.societyId) {
    violations.push(blocking('ACTOR_SCOPE_VIOLATION', 'actor.societyId'));
  }
  if (
    RESIDENT_INITIATED_ACTORS.includes(command.actor.actorType) &&
    command.actor.unitId !== state.scope.unitId
  ) {
    violations.push(blocking('ACTOR_SCOPE_VIOLATION', 'actor.unitId'));
  }
  if (
    command.actor.onBehalfOfResidentId !== undefined &&
    command.actor.onBehalfOfResidentId !== state.scope.residentId
  ) {
    violations.push(blocking('OCCUPANCY_MISMATCH', 'actor.onBehalfOfResidentId'));
  }
  return violations;
}

function verificationViolations(command: MoveInCommand): readonly DomainViolation[] {
  const checks = command.verificationChecks;
  if (checks.length === 0) {
    return [blocking('PRECONDITION_FAILED', 'command.verificationChecks')];
  }
  const unresolved = checks.filter(
    (check) => !SATISFIED_VERIFICATION_RESULTS.includes(check.result),
  );
  if (unresolved.length > 0) {
    return unresolved.map((check) => blocking('PRECONDITION_FAILED', `verification.${check.checkKey}`));
  }
  return [];
}

function commandFieldViolations(command: MoveInCommand): readonly DomainViolation[] {
  const groups: (readonly DomainViolation[])[] = [];

  switch (command.kind) {
    case 'RECORD_VERIFICATION_PASSED':
      groups.push(verificationViolations(command));
      break;
    case 'RECORD_VERIFICATION_FAILED':
      groups.push(
        isAbsent(command.verificationFailureReasonKey)
          ? [blocking('PRECONDITION_FAILED', 'command.verificationFailureReasonKey')]
          : [],
      );
      break;
    case 'APPROVE_VERIFICATION_EXCEPTION':
      groups.push(
        isAbsent(command.verificationExceptionApprovalReference)
          ? [blocking('PRECONDITION_FAILED', 'command.verificationExceptionApprovalReference')]
          : [],
      );
      break;
    case 'CONFIRM_APPOINTMENT':
      groups.push(
        isAbsent(command.appointmentId)
          ? [blocking('PRECONDITION_FAILED', 'command.appointmentId')]
          : [],
      );
      break;
    case 'GRANT_APPROVAL':
      groups.push(
        isAbsent(command.approvalReference)
          ? [blocking('PRECONDITION_FAILED', 'command.approvalReference')]
          : [],
      );
      break;
    case 'COMPLETE_EXECUTION':
      groups.push(
        isAbsent(command.keyHandedOverAt)
          ? [blocking('PRECONDITION_FAILED', 'command.keyHandedOverAt')]
          : [],
      );
      groups.push(
        isAbsent(command.meterReadingReference)
          ? [blocking('PRECONDITION_FAILED', 'command.meterReadingReference')]
          : [],
      );
      groups.push(
        isAbsent(command.accessActivationReference)
          ? [blocking('PRECONDITION_FAILED', 'command.accessActivationReference')]
          : [],
      );
      break;
    case 'CANCEL':
    case 'REVOKE_APPROVAL':
      groups.push(
        isAbsent(command.cancellationReasonKey)
          ? [blocking('PRECONDITION_FAILED', 'command.cancellationReasonKey')]
          : [],
      );
      break;
    default:
      break;
  }

  return allViolations(groups);
}

function verificationStateFor(  state: MoveInRequestState,
  command: MoveInCommand,
): MoveInRequestState['verificationChecklist'] {
  if (command.verificationChecks.length === 0) {
    return state.verificationChecklist;
  }
  return command.verificationChecks.map((check) => ({
    checkKey: check.checkKey,
    result: check.result,
    detailKey: check.detailKey,
    evaluatedAt: command.occurredAt,
    evaluatedByActorId: command.actor.actorId,
    evidenceRefs: check.evidenceRefs,
  }));
}

function nextState(
  state: MoveInRequestState,
  command: MoveInCommand,
  toStatus: MoveInStatus,
): MoveInRequestState {
  const base: MoveInRequestState = {
    ...state,
    status: toStatus,
    revision: state.revision + 1,
    updatedAt: command.occurredAt,
  };

  switch (command.kind) {
    case 'RECORD_VERIFICATION_PASSED':
      return { ...base, verificationChecklist: verificationStateFor(state, command), verificationOutcome: 'PASSED' };
    case 'RECORD_VERIFICATION_FAILED':
      return {
        ...base,
        verificationChecklist: verificationStateFor(state, command),
        verificationOutcome: 'FAILED',
        verificationException: {
          raisedAt: command.occurredAt,
          reasonKey: command.verificationFailureReasonKey as string,
          reasonDetail: command.verificationFailureReasonDetail as string,
          raisedByActorId: command.actor.actorId,
          approvedAt: undefined,
          approvedByActorId: undefined,
          approvalReference: undefined,
        },
      };
    case 'APPROVE_VERIFICATION_EXCEPTION':
      return {
        ...base,
        verificationChecklist: verificationStateFor(state, command),
        verificationOutcome: 'PASSED',
        verificationException: state.verificationException === undefined
          ? undefined
          : {
              ...state.verificationException,
              approvedAt: command.occurredAt,
              approvedByActorId: command.actor.actorId,
              approvalReference: command.verificationExceptionApprovalReference as string,
            },
      };
    case 'CONFIRM_APPOINTMENT':
      return { ...base, appointmentId: command.appointmentId as string };
    case 'GRANT_APPROVAL':
      return { ...base, approvalReference: command.approvalReference as string };
    case 'REVOKE_APPROVAL':
      return {
        ...base,
        approvalReference: undefined,
        cancellation: {
          cancelledAt: command.occurredAt,
          cancelledByActorId: command.actor.actorId,
          reasonKey: command.cancellationReasonKey as string,
          reasonDetail: command.cancellationReasonDetail as string,
        },
      };
    case 'BEGIN_EXECUTION':
      return {
        ...base,
        execution: {
          startedAt: command.occurredAt,
          startedByActorId: command.actor.actorId,
          completedAt: undefined,
          completedByActorId: undefined,
          possessionsMovedCount: command.possessionsMovedCount,
          keyHandedOverAt: undefined,
          meterReadingReference: undefined,
          accessActivationReference: undefined,
        },
      };
    case 'COMPLETE_EXECUTION':
      return {
        ...base,
        execution: {
          startedAt: state.execution === undefined ? command.occurredAt : state.execution.startedAt,
          startedByActorId:
            state.execution === undefined ? command.actor.actorId : state.execution.startedByActorId,
          completedAt: command.occurredAt,
          completedByActorId: command.actor.actorId,
          possessionsMovedCount:
            state.execution === undefined
              ? command.possessionsMovedCount
              : state.execution.possessionsMovedCount,
          keyHandedOverAt: command.keyHandedOverAt as string,
          meterReadingReference: command.meterReadingReference as string,
          accessActivationReference: command.accessActivationReference as string,
        },
      };
    case 'CANCEL':
      return {
        ...base,
        cancellation: {
          cancelledAt: command.occurredAt,
          cancelledByActorId: command.actor.actorId,
          reasonKey: command.cancellationReasonKey as string,
          reasonDetail: command.cancellationReasonDetail as string,
        },
      };
    default:
      return base;
  }
}

export function applyMoveInCommand(
  state: MoveInRequestState,
  command: MoveInCommand,
): MoveInTransition {
  const target = TARGET_BY_COMMAND[command.kind];
  const allowedOrigins = ORIGIN_BY_COMMAND[command.kind];

  if (allowedOrigins.length === 0) {
    return {
      allowed: false,
      fromStatus: state.status,
      attempted: target,
      violations: [blocking('ILLEGAL_TRANSITION', 'command.kind')],
    };
  }

  if (isMoveInTerminalStatus(state.status)) {
    return {
      allowed: false,
      fromStatus: state.status,
      attempted: target,
      violations: [blocking('TERMINAL_STATE', 'status')],
    };
  }

  if (!allowedOrigins.includes(state.status)) {
    return {
      allowed: false,
      fromStatus: state.status,
      attempted: target,
      violations: [blocking('ILLEGAL_TRANSITION', `status:${state.status}->${target}`)],
    };
  }

  const violations = allViolations([
    commandAuthorizationViolations(command),
    requestScopeViolations(state, command),
    commandFieldViolations(command),
    command.expectedRevision === state.revision
      ? []
      : [blocking('REVISION_MISMATCH', 'command.expectedRevision')],
  ]);

  if (violations.length > 0) {
    return {
      allowed: false,
      fromStatus: state.status,
      attempted: target,
      violations,
    };
  }

  return {
    allowed: true,
    fromStatus: state.status,
    toStatus: target,
    state: nextState(state, command, target),
    warnings: [],
  };
}

export function canApplyMoveInCommand(
  state: MoveInRequestState,
  commandKind: MoveInCommandKind,
): boolean {
  return ORIGIN_BY_COMMAND[commandKind].includes(state.status);
}

export function moveInStatusPath(): readonly MoveInStatus[] {
  return [
    'REQUESTED',
    'VERIFIED',
    'SCHEDULED',
    'APPROVED',
    'IN_PROGRESS',
    'COMPLETED',
  ];
}
