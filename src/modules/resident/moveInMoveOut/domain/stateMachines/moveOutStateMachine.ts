import type {
  DomainViolation,
  LifecycleActorType,
} from '../types/primitives';
import type {
  MoveOutCommand,
  MoveOutCommandKind,
  MoveOutRequestState,
  MoveOutStatus,
} from '../types/moveOut.types';
import { MOVE_OUT_TERMINAL_STATUSES } from '../types/moveOut.types';
import { actorTypeAllowed, allViolations, blocking, isAbsent } from '../guards/commandSupport';

export type MoveOutTransition =
  | {
      readonly allowed: false;
      readonly fromStatus: MoveOutStatus;
      readonly attempted: MoveOutStatus;
      readonly violations: readonly DomainViolation[];
    }
  | {
      readonly allowed: true;
      readonly fromStatus: MoveOutStatus;
      readonly toStatus: MoveOutStatus;
      readonly state: MoveOutRequestState;
      readonly warnings: readonly DomainViolation[];
    };

const RESIDENT_ACTORS: readonly LifecycleActorType[] = [
  'RESIDENT',
  'OWNER',
  'TENANT',
  'FAMILY_MEMBER',
];

const CLEARANCE_ACTORS: readonly LifecycleActorType[] = ['TREASURER', 'SOCIETY_ADMIN'];

const APPROVAL_ACTORS: readonly LifecycleActorType[] = [
  'SOCIETY_SECRETARY',
  'SOCIETY_CHAIRPERSON',
  'SOCIETY_ADMIN',
];

const SIGNING_ACTORS: readonly LifecycleActorType[] = [
  'RESIDENT',
  'OWNER',
  'TENANT',
  'SOCIETY_SECRETARY',
  'SOCIETY_CHAIRPERSON',
  'SOCIETY_ADMIN',
];

const ISSUANCE_ACTORS: readonly LifecycleActorType[] = [
  'SOCIETY_SECRETARY',
  'SOCIETY_CHAIRPERSON',
  'SOCIETY_ADMIN',
];

const REVOCATION_ACTORS: readonly LifecycleActorType[] = ['SECURITY', 'SOCIETY_ADMIN', 'SYSTEM'];

const CLOSURE_ACTORS: readonly LifecycleActorType[] = ['SOCIETY_ADMIN', 'SYSTEM'];

const PERMITTED_ACTORS_BY_COMMAND: Readonly<Record<MoveOutCommandKind, readonly LifecycleActorType[]>> = {
  SUBMIT_REQUEST: [...RESIDENT_ACTORS, 'SOCIETY_ADMIN', 'SYSTEM'],
  BEGIN_CLEARANCE_CHECK: CLEARANCE_ACTORS,
  RECORD_CLEARANCE_SNAPSHOT: CLEARANCE_ACTORS,
  RECORD_CLEARANCE_EXCEPTION: CLEARANCE_ACTORS,
  GRANT_APPROVAL: APPROVAL_ACTORS,
  REJECT_APPROVAL: APPROVAL_ACTORS,
  RECORD_SIGNATURE: SIGNING_ACTORS,
  RECORD_ISSUANCE: ISSUANCE_ACTORS,
  RECORD_ACCESS_REVOCATION: REVOCATION_ACTORS,
  RECORD_OCCUPANCY_CLOSURE: CLOSURE_ACTORS,
  ARCHIVE: ['SOCIETY_ADMIN', 'AUDITOR', 'SYSTEM'],
  CANCEL: [...RESIDENT_ACTORS, 'SOCIETY_ADMIN', 'SYSTEM'],
};

const TARGET_BY_COMMAND: Readonly<Record<MoveOutCommandKind, MoveOutStatus>> = {
  SUBMIT_REQUEST: 'REQUESTED',
  BEGIN_CLEARANCE_CHECK: 'CLEARANCE_CHECK',
  RECORD_CLEARANCE_SNAPSHOT: 'READY',
  RECORD_CLEARANCE_EXCEPTION: 'EXCEPTION',
  GRANT_APPROVAL: 'APPROVED',
  REJECT_APPROVAL: 'REJECTED',
  RECORD_SIGNATURE: 'SIGNED',
  RECORD_ISSUANCE: 'ISSUED',
  RECORD_ACCESS_REVOCATION: 'ACCESS_REVOKED',
  RECORD_OCCUPANCY_CLOSURE: 'OCCUPANCY_CLOSED',
  ARCHIVE: 'ARCHIVED',
  CANCEL: 'CANCELLED',
};

const CANCELLABLE_AFTER_SIGNING: readonly MoveOutStatus[] = ['APPROVED'];

const ORIGIN_BY_COMMAND: Readonly<Record<MoveOutCommandKind, readonly MoveOutStatus[]>> = {
  SUBMIT_REQUEST: [],
  BEGIN_CLEARANCE_CHECK: ['REQUESTED', 'EXCEPTION', 'REJECTED'],
  RECORD_CLEARANCE_SNAPSHOT: ['CLEARANCE_CHECK'],
  RECORD_CLEARANCE_EXCEPTION: ['CLEARANCE_CHECK', 'REJECTED'],
  GRANT_APPROVAL: ['READY'],
  REJECT_APPROVAL: ['READY'],
  RECORD_SIGNATURE: ['APPROVED'],
  RECORD_ISSUANCE: ['SIGNED'],
  RECORD_ACCESS_REVOCATION: ['ISSUED'],
  RECORD_OCCUPANCY_CLOSURE: ['ACCESS_REVOKED'],
  ARCHIVE: ['OCCUPANCY_CLOSED', 'CANCELLED'],
  CANCEL: [
    'REQUESTED',
    'CLEARANCE_CHECK',
    'EXCEPTION',
    'REJECTED',
    'READY',
    ...CANCELLABLE_AFTER_SIGNING,
  ],
};

export function isMoveOutTerminalStatus(status: MoveOutStatus): boolean {
  return MOVE_OUT_TERMINAL_STATUSES.includes(status);
}

export function permittedMoveOutActors(
  commandKind: MoveOutCommandKind,
): readonly LifecycleActorType[] {
  return PERMITTED_ACTORS_BY_COMMAND[commandKind];
}

export function moveOutStatusPath(): readonly MoveOutStatus[] {
  return [
    'REQUESTED',
    'CLEARANCE_CHECK',
    'READY',
    'APPROVED',
    'SIGNED',
    'ISSUED',
    'ACCESS_REVOKED',
    'OCCUPANCY_CLOSED',
    'ARCHIVED',
  ];
}

function authorizationViolations(command: MoveOutCommand): readonly DomainViolation[] {
  const permitted = PERMITTED_ACTORS_BY_COMMAND[command.kind];
  const actorViolations = actorTypeAllowed(command.actor, permitted)
    ? []
    : [blocking('ACTOR_NOT_AUTHORIZED', `command.${command.kind}`)];

  const scopeViolations =
    command.actor.societyId === '' ? [blocking('ACTOR_SCOPE_VIOLATION', 'actor.societyId')] : [];

  return allViolations([actorViolations, scopeViolations]);
}

function requestScopeViolations(
  state: MoveOutRequestState,
  command: MoveOutCommand,
): readonly DomainViolation[] {
  const violations: DomainViolation[] = [];
  if (state.scope.societyId !== command.actor.societyId) {
    violations.push(blocking('ACTOR_SCOPE_VIOLATION', 'actor.societyId'));
  }
  if (
    RESIDENT_ACTORS.includes(command.actor.actorType) &&
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

function commandFieldViolations(command: MoveOutCommand): readonly DomainViolation[] {
  const groups: (readonly DomainViolation[])[] = [];

  switch (command.kind) {
    case 'RECORD_CLEARANCE_SNAPSHOT':
      groups.push(
        isAbsent(command.clearanceSnapshotId)
          ? [blocking('PRECONDITION_FAILED', 'command.clearanceSnapshotId')]
          : [],
      );
      groups.push(
        isAbsent(command.settlementSnapshotId)
          ? [blocking('PRECONDITION_FAILED', 'command.settlementSnapshotId')]
          : [],
      );
      break;
    case 'RECORD_CLEARANCE_EXCEPTION':
      groups.push(
        isAbsent(command.clearanceSnapshotId)
          ? [blocking('PRECONDITION_FAILED', 'command.clearanceSnapshotId')]
          : [],
      );
      groups.push(
        isAbsent(command.settlementSnapshotId)
          ? [blocking('PRECONDITION_FAILED', 'command.settlementSnapshotId')]
          : [],
      );
      break;
    case 'GRANT_APPROVAL':
      groups.push(
        isAbsent(command.approvalReference)
          ? [blocking('PRECONDITION_FAILED', 'command.approvalReference')]
          : [],
      );
      groups.push(
        isAbsent(command.clearanceSnapshotId)
          ? [blocking('PRECONDITION_FAILED', 'command.clearanceSnapshotId')]
          : [],
      );
      break;
    case 'REJECT_APPROVAL':
      groups.push(
        isAbsent(command.rejectionReasonKey)
          ? [blocking('PRECONDITION_FAILED', 'command.rejectionReasonKey')]
          : [],
      );
      break;
    case 'RECORD_SIGNATURE':
      groups.push(
        isAbsent(command.signatureDocumentId)
          ? [blocking('PRECONDITION_FAILED', 'command.signatureDocumentId')]
          : [],
      );
      groups.push(
        isAbsent(command.signatureDocumentChecksum)
          ? [blocking('PRECONDITION_FAILED', 'command.signatureDocumentChecksum')]
          : [],
      );
      groups.push(
        isAbsent(command.signatureMethod)
          ? [blocking('PRECONDITION_FAILED', 'command.signatureMethod')]
          : [],
      );
      break;
    case 'RECORD_ISSUANCE':
      groups.push(
        isAbsent(command.nocCertificateId)
          ? [blocking('PRECONDITION_FAILED', 'command.nocCertificateId')]
          : [],
      );
      break;
    case 'RECORD_ACCESS_REVOCATION':
      groups.push(
        isAbsent(command.gateIntegrationReference)
          ? [blocking('PRECONDITION_FAILED', 'command.gateIntegrationReference')]
          : [],
      );
      groups.push(
        command.credentialCount > 0 ? [] : [blocking('PRECONDITION_FAILED', 'command.credentialCount')],
      );
      break;
    case 'RECORD_OCCUPANCY_CLOSURE':
      groups.push(
        isAbsent(command.occupancyEndDate)
          ? [blocking('PRECONDITION_FAILED', 'command.occupancyEndDate')]
          : [],
      );
      break;
    case 'ARCHIVE':
      groups.push(
        isAbsent(command.retentionPolicyKey)
          ? [blocking('PRECONDITION_FAILED', 'command.retentionPolicyKey')]
          : [],
      );
      groups.push(
        isAbsent(command.archiveReference)
          ? [blocking('PRECONDITION_FAILED', 'command.archiveReference')]
          : [],
      );
      break;
    case 'CANCEL':
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

function stalePrerequisiteWarnings(
  state: MoveOutRequestState,
  command: MoveOutCommand,
): readonly DomainViolation[] {
  return command.kind === 'CANCEL' && CANCELLABLE_AFTER_SIGNING.includes(state.status)
    ? [blocking('STALE_PREREQUISITE', 'status.approvedButNotSigned')]
    : [];
}

function prerequisiteViolations(
  state: MoveOutRequestState,
  command: MoveOutCommand,
): readonly DomainViolation[] {
  const groups: DomainViolation[][] = [];

  if (command.kind === 'GRANT_APPROVAL' && isAbsent(state.settlementSnapshotId)) {
    groups.push([blocking('PRECONDITION_FAILED', 'state.settlementSnapshotId')]);
  }

  if (command.kind === 'RECORD_ISSUANCE' && state.signature === undefined) {
    groups.push([blocking('PRECONDITION_FAILED', 'state.signature')]);
  }

  return allViolations(groups);
}

function revisionViolations(
  state: MoveOutRequestState,
  command: MoveOutCommand,
): readonly DomainViolation[] {
  return command.expectedRevision === state.revision
    ? []
    : [blocking('REVISION_MISMATCH', 'command.expectedRevision')];
}

function nextState(
  state: MoveOutRequestState,
  command: MoveOutCommand,
  toStatus: MoveOutStatus,
): MoveOutRequestState {
  const base: MoveOutRequestState = {
    ...state,
    status: toStatus,
    revision: state.revision + 1,
    updatedAt: command.occurredAt,
  };

  switch (command.kind) {
    case 'BEGIN_CLEARANCE_CHECK':
      return base;
    case 'RECORD_CLEARANCE_SNAPSHOT':
      return {
        ...base,
        clearanceSnapshotId: command.clearanceSnapshotId as string,
        settlementSnapshotId: command.settlementSnapshotId as string,
      };
    case 'RECORD_CLEARANCE_EXCEPTION':
      return {
        ...base,
        clearanceSnapshotId: command.clearanceSnapshotId as string,
        settlementSnapshotId: command.settlementSnapshotId as string,
      };
    case 'GRANT_APPROVAL':
      return {
        ...base,
        approvalReference: command.approvalReference as string,
        clearanceSnapshotId: state.clearanceSnapshotId,
      };
    case 'REJECT_APPROVAL':
      return { ...base, approvalReference: undefined };
    case 'RECORD_SIGNATURE':
      return {
        ...base,
        signature: {
          signedAt: command.occurredAt,
          signedByActorId: command.actor.actorId,
          signatureMethod: command.signatureMethod as string,
          documentId: command.signatureDocumentId as string,
          documentChecksum: command.signatureDocumentChecksum as string,
          templateVersion: command.templateVersion as string,
        },
      };
    case 'RECORD_ISSUANCE':
      return { ...base, nocCertificateId: command.nocCertificateId as string };
    case 'RECORD_ACCESS_REVOCATION':
      return {
        ...base,
        accessRevocation: {
          revokedAt: command.occurredAt,
          revokedByActorId: command.actor.actorId,
          credentialCount: command.credentialCount,
          parkingAllocationReleased: command.parkingAllocationReleased,
          gateIntegrationReference: command.gateIntegrationReference as string,
          residenceAccessStatusBefore:
            command.residenceAccessStatusBefore === undefined
              ? 'UNKNOWN'
              : command.residenceAccessStatusBefore,
          residenceAccessStatusAfter:
            command.residenceAccessStatusAfter === undefined
              ? 'UNKNOWN'
              : command.residenceAccessStatusAfter,
          failureReference: command.failureReference,
        },
      };
    case 'RECORD_OCCUPANCY_CLOSURE':
      return {
        ...base,
        occupancyClosure: {
          closedAt: command.occurredAt,
          closedByActorId: command.actor.actorId,
          relationshipId: state.scope.occupancyRelationshipId,
          occupancyEndDate: command.occupancyEndDate as string,
          finalMeterReadingReference: command.finalMeterReadingReference,
        },
      };
    case 'ARCHIVE':
      return {
        ...base,
        archiveRecord: {
          archivedAt: command.occurredAt,
          archivedByActorId: command.actor.actorId,
          retentionPolicyKey: command.retentionPolicyKey as string,
          archiveReference: command.archiveReference as string,
          containsPersonalData: command.containsPersonalData,
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

export function applyMoveOutCommand(
  state: MoveOutRequestState,
  command: MoveOutCommand,
): MoveOutTransition {
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

  if (isMoveOutTerminalStatus(state.status)) {
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
    authorizationViolations(command),
    requestScopeViolations(state, command),
    commandFieldViolations(command),
    prerequisiteViolations(state, command),
    revisionViolations(state, command),
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
    warnings: stalePrerequisiteWarnings(state, command),
  };
}

export function canApplyMoveOutCommand(
  state: MoveOutRequestState,
  commandKind: MoveOutCommandKind,
): boolean {
  return ORIGIN_BY_COMMAND[commandKind].includes(state.status);
}
