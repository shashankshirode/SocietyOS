import type { Absent } from '../../../../../shared/types/absence.types';
import {
  canonicalPreimageSha256,
  optionalPart,
  requiredString,
  type CanonicalPart,
} from '../crypto/canonicalJson';
import {
  NOC_QR_ISSUER_ID,
  NOC_QR_SCHEMA_VERSION,
  NOC_TERMINAL_STATUSES,
} from '../types/noc.types';
import type {
  NocCertificate,
  NocCertificateContent,
  NocCommand,
  NocCommandKind,
  NocQrPayload,
  NocRequestState,
  NocStatus,
  NocVerificationOutcome,
} from '../types/noc.types';
import { actorTypeAllowed, allViolations, isAbsent } from '../guards/commandSupport';
import type { DomainViolation } from '../types/primitives';

export type NocTransition =
  | {
      readonly allowed: false;
      readonly fromStatus: NocStatus;
      readonly attempted: NocStatus;
      readonly violations: readonly DomainViolation[];
    }
  | {
      readonly allowed: true;
      readonly fromStatus: NocStatus;
      readonly toStatus: NocStatus;
      readonly state: NocRequestState;
      readonly warnings: readonly DomainViolation[];
    };

const APPLICANT_ACTORS: readonly NocCommand['actor']['actorType'][] = [
  'RESIDENT',
  'OWNER',
  'TENANT',
  'FAMILY_MEMBER',
  'SOCIETY_ADMIN',
  'SYSTEM',
];

const REVIEWER_ACTORS: readonly NocCommand['actor']['actorType'][] = [
  'TREASURER',
  'SOCIETY_SECRETARY',
  'SOCIETY_ADMIN',
];

const APPROVER_ACTORS: readonly NocCommand['actor']['actorType'][] = [
  'SOCIETY_SECRETARY',
  'SOCIETY_CHAIRPERSON',
  'SOCIETY_ADMIN',
];

const PERMITTED_ACTORS_BY_COMMAND: Readonly<Record<NocCommandKind, readonly NocCommand['actor']['actorType'][]>> = {
  SUBMIT_REQUEST: APPLICANT_ACTORS,
  BEGIN_REVIEW: REVIEWER_ACTORS,
  GRANT_APPROVAL: APPROVER_ACTORS,
  REJECT: APPROVER_ACTORS,
  RECORD_SIGNATURE: APPROVER_ACTORS,
  RECORD_ISSUANCE: APPROVER_ACTORS,
  RECORD_REVOCATION: ['SOCIETY_ADMIN', 'SYSTEM'],
  ARCHIVE: ['SOCIETY_ADMIN', 'SYSTEM'],
  CANCEL: [...APPLICANT_ACTORS, 'TREASURER'],
};

const ORIGIN_BY_COMMAND: Readonly<Record<NocCommandKind, readonly NocStatus[]>> = {
  SUBMIT_REQUEST: [],
  BEGIN_REVIEW: ['REQUESTED'],
  GRANT_APPROVAL: ['UNDER_REVIEW'],
  REJECT: ['UNDER_REVIEW', 'APPROVED'],
  RECORD_SIGNATURE: ['APPROVED'],
  RECORD_ISSUANCE: ['SIGNED'],
  RECORD_REVOCATION: ['ISSUED'],
  ARCHIVE: ['ISSUED', 'REVOKED'],
  CANCEL: ['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'SIGNED'],
};

const TARGET_BY_COMMAND: Readonly<Record<NocCommandKind, NocStatus>> = {
  SUBMIT_REQUEST: 'REQUESTED',
  BEGIN_REVIEW: 'UNDER_REVIEW',
  GRANT_APPROVAL: 'APPROVED',
  REJECT: 'REJECTED',
  RECORD_SIGNATURE: 'SIGNED',
  RECORD_ISSUANCE: 'ISSUED',
  RECORD_REVOCATION: 'REVOKED',
  ARCHIVE: 'ARCHIVED',
  CANCEL: 'CANCELLED',
};

const NOC_STATUS_PATH: readonly NocStatus[] = [
  'REQUESTED',
  'UNDER_REVIEW',
  'APPROVED',
  'SIGNED',
  'ISSUED',
  'REVOKED',
  'ARCHIVED',
];

export function nocStatusPath(): readonly NocStatus[] {
  return NOC_STATUS_PATH;
}

export function isNocTerminalStatus(status: NocStatus): boolean {
  return NOC_TERMINAL_STATUSES.includes(status);
}

function blocking(code: DomainViolation['code'], field: string): DomainViolation {
  return { code, field, blocking: true };
}

export function applyNocCommand(state: NocRequestState, command: NocCommand): NocTransition {
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

  if (isNocTerminalStatus(state.status)) {
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
    scopeViolations(state, command),
    fieldViolations(command),
    prerequisiteViolations(state, command),
    revisionViolations(state, command),
  ]);

  if (violations.length > 0) {
    return { allowed: false, fromStatus: state.status, attempted: target, violations };
  }

  return {
    allowed: true,
    fromStatus: state.status,
    toStatus: target,
    state: appliedState(state, command, target),
    warnings: [],
  };
}

function appliedState(
  state: NocRequestState,
  command: NocCommand,
  toStatus: NocStatus,
): NocRequestState {
  if (command.kind === 'GRANT_APPROVAL') {
    return grantApprovalState(state, command, toStatus);
  }
  if (command.kind === 'REJECT') {
    return rejectState(state, command, toStatus);
  }
  return nextState(state, command, toStatus);
}

function authorizationViolations(command: NocCommand): readonly DomainViolation[] {
  const permitted = PERMITTED_ACTORS_BY_COMMAND[command.kind];
  return actorTypeAllowed(command.actor, permitted)
    ? []
    : [blocking('ACTOR_NOT_AUTHORIZED', 'actor.actorType')];
}

function scopeViolations(state: NocRequestState, command: NocCommand): readonly DomainViolation[] {
  const groups: DomainViolation[][] = [];
  const societyWide = command.actor.societyId === undefined;

  if (!societyWide && command.actor.societyId !== state.scope.societyId) {
    groups.push([blocking('ACTOR_SCOPE_VIOLATION', 'actor.societyId')]);
  }

  if (
    command.actor.unitId !== undefined &&
    command.actor.unitId !== state.scope.unitId
  ) {
    groups.push([blocking('ACTOR_SCOPE_VIOLATION', 'actor.unitId')]);
  }

  return allViolations(groups);
}

function fieldViolations(command: NocCommand): readonly DomainViolation[] {
  const groups: DomainViolation[][] = [];

  switch (command.kind) {
    case 'GRANT_APPROVAL':
      groups.push(
        isAbsent(command.approvalReference)
          ? [blocking('PRECONDITION_FAILED', 'command.approvalReference')]
          : [],
      );
      break;
    case 'REJECT':
      groups.push(
        isAbsent(command.rejectionReasonKey)
          ? [blocking('PRECONDITION_FAILED', 'command.rejectionReasonKey')]
          : [],
      );
      break;
    case 'RECORD_SIGNATURE':
      for (const field of ['signatureDocumentId', 'signatureDocumentChecksum', 'signatureMethod'] as const) {
        groups.push(
          isAbsent(command[field])
            ? [blocking('PRECONDITION_FAILED', `command.${field}`)]
            : [],
        );
      }
      break;
    case 'RECORD_ISSUANCE':
      groups.push(
        isAbsent(command.certificateId)
          ? [blocking('PRECONDITION_FAILED', 'command.certificateId')]
          : [],
      );
      break;
    case 'RECORD_REVOCATION':
      groups.push(
        isAbsent(command.revocationReasonKey)
          ? [blocking('PRECONDITION_FAILED', 'command.revocationReasonKey')]
          : [],
      );
      break;
    case 'ARCHIVE':
      for (const field of ['retentionPolicyKey', 'archiveReference'] as const) {
        groups.push(
          isAbsent(command[field]) ? [blocking('PRECONDITION_FAILED', `command.${field}`)] : [],
        );
      }
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

function prerequisiteViolations(
  state: NocRequestState,
  command: NocCommand,
): readonly DomainViolation[] {
  const groups: DomainViolation[][] = [];

  if (command.kind === 'GRANT_APPROVAL' && isAbsent(state.linkedClearanceSnapshotId)) {
    groups.push([blocking('PRECONDITION_FAILED', 'state.linkedClearanceSnapshotId')]);
  }

  if (command.kind === 'GRANT_APPROVAL' && isAbsent(state.linkedSettlementId)) {
    groups.push([blocking('PRECONDITION_FAILED', 'state.linkedSettlementId')]);
  }

  if (command.kind === 'RECORD_ISSUANCE' && state.approval === undefined) {
    groups.push([blocking('PRECONDITION_FAILED', 'state.approval')]);
  }

  if (command.kind === 'RECORD_ISSUANCE' && state.signature === undefined) {
    groups.push([blocking('PRECONDITION_FAILED', 'state.signature')]);
  }

  if (command.kind === 'CANCEL' && state.status === 'SIGNED' && !command.accessAlreadyRevoked) {
    groups.push([blocking('PRECONDITION_FAILED', 'command.accessAlreadyRevoked')]);
  }

  return allViolations(groups);
}

function revisionViolations(state: NocRequestState, command: NocCommand): readonly DomainViolation[] {
  return command.expectedRevision === state.revision
    ? []
    : [blocking('REVISION_MISMATCH', 'command.expectedRevision')];
}

function nextState(state: NocRequestState, command: NocCommand, toStatus: NocStatus): NocRequestState {
  const base: NocRequestState = {
    ...state,
    status: toStatus,
    revision: state.revision + 1,
    updatedAt: command.occurredAt,
  };

  switch (command.kind) {
    case 'RECORD_SIGNATURE':
      return {
        ...base,
        signature: {
          signedAt: command.occurredAt,
          signedByActorId: command.actor.actorId,
          signatureMethod: command.signatureMethod as string,
          documentId: command.signatureDocumentId as string,
          documentChecksum: command.signatureDocumentChecksum as string,
        },
      };
    case 'RECORD_ISSUANCE':
      return { ...base, certificateId: command.certificateId as string };
    case 'RECORD_REVOCATION':
      return {
        ...base,
        revocation: {
          revokedAt: command.occurredAt,
          revokedByActorId: command.actor.actorId,
          reasonKey: command.revocationReasonKey as string,
          reasonDetail: command.revocationReasonDetail as string,
          accessAlreadyRevoked: command.accessAlreadyRevoked,
        },
      };
    case 'ARCHIVE':
      return {
        ...base,
        archive: {
          archivedAt: command.occurredAt,
          archivedByActorId: command.actor.actorId,
          retentionPolicyKey: command.retentionPolicyKey as string,
          archiveReference: command.archiveReference as string,
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

function grantApprovalState(state: NocRequestState, command: NocCommand, toStatus: NocStatus): NocRequestState {
  return {
    ...nextState(state, command, toStatus),
    approval: {
      approvedAt: command.occurredAt,
      approvedByActorId: command.actor.actorId,
      approvalReference: command.approvalReference as string,
      committeeReference: command.committeeReference,
    },
  };
}

function rejectState(state: NocRequestState, command: NocCommand, toStatus: NocStatus): NocRequestState {
  return {
    ...nextState(state, command, toStatus),
    approval: undefined,
    signature: undefined,
  };
}

export function certificateContentChecksum(content: NocCertificateContent): string {
  const parts: readonly CanonicalPart[] = [
    requiredString('certificateId', content.certificateId),
    requiredString('certificateNumber', content.certificateNumber),
    requiredString('kind', content.kind),
    requiredString('templateId', content.templateId),
    requiredString('templateVersion', content.templateVersion),
    requiredString('societyId', content.societyId),
    requiredString('unitId', content.unitId),
    requiredString('issueDate', content.issueDate),
    optionalPart('validUntil', content.validUntil),
    optionalPart('clearanceSnapshotId', content.clearanceSnapshotId),
    optionalPart('settlementId', content.settlementId),
    optionalPart('settlementOutcomeKey', content.settlementOutcomeKey),
    optionalPart('netSettlementAmountMinor', content.netSettlementAmount?.minorUnits),
    requiredString('disclaimerKey', content.disclaimerKey),
  ];

  return canonicalPreimageSha256('noc.certificate.v1', parts);
}

export function buildQrPayload(certificate: NocCertificate): NocQrPayload {
  return {
    certificateNumber: certificate.certificateNumber,
    verificationCode: certificate.verificationCode,
    contentChecksum: certificate.contentChecksum,
    issuerId: NOC_QR_ISSUER_ID,
    schemaVersion: NOC_QR_SCHEMA_VERSION,
  };
}

const QR_SEGMENT_PATTERN = /^[A-Za-z0-9-]+$/;

export function serializeQrPayload(payload: NocQrPayload): string {
  return [
    payload.schemaVersion,
    payload.issuerId,
    payload.certificateNumber,
    payload.verificationCode,
    payload.contentChecksum,
  ].join('|');
}

export function parseQrPayload(raw: string): NocQrPayload | Absent {
  const segments = raw.split('|');

  if (segments.length !== 5) {
    return undefined;
  }

  const [schemaVersion, issuerId, certificateNumber, verificationCode, contentChecksum] = segments;

  if (
    schemaVersion === undefined ||
    issuerId === undefined ||
    certificateNumber === undefined ||
    verificationCode === undefined ||
    contentChecksum === undefined
  ) {
    return undefined;
  }

  if (schemaVersion !== NOC_QR_SCHEMA_VERSION || issuerId !== NOC_QR_ISSUER_ID) {
    return undefined;
  }

  if (
    certificateNumber === undefined ||
    verificationCode === undefined ||
    contentChecksum === undefined ||
    ![certificateNumber, verificationCode, contentChecksum].every((segment) =>
      QR_SEGMENT_PATTERN.test(segment),
    )
  ) {
    return undefined;
  }

  return {
    schemaVersion,
    issuerId,
    certificateNumber,
    verificationCode,
    contentChecksum,
  };
}

export type NocVerificationSource = {
  readonly findByCertificateNumber: (certificateNumber: string) => NocCertificate | Absent;
  readonly now: () => string;
};

export function verifyNocCertificate(
  raw: string,
  source: NocVerificationSource,
): NocVerificationOutcome {
  const payload = parseQrPayload(raw);

  if (payload === undefined) {
    return { verdict: 'UNPARSEABLE', reasonKey: 'reason.nocQrMalformed', checkedAt: source.now() };
  }

  const certificate = source.findByCertificateNumber(payload.certificateNumber);

  if (certificate === undefined) {
    return {
      verdict: 'NOT_FOUND',
      certificateNumber: payload.certificateNumber,
      checkedAt: source.now(),
    };
  }

  const checkedAt = source.now();

  if (certificate.status === 'REVOKED') {
    return {
      verdict: 'REVOKED',
      certificateId: certificate.certificateId,
      certificateNumber: certificate.certificateNumber,
      revokedAt: certificate.revokedAt ?? checkedAt,
      checkedAt,
    };
  }

  if (certificate.contentChecksum !== payload.contentChecksum) {
    return {
      verdict: 'CHECKSUM_MISMATCH',
      certificateNumber: certificate.certificateNumber,
      expectedChecksum: certificate.contentChecksum,
      actualChecksum: payload.contentChecksum,
      checkedAt,
    };
  }

  if (certificate.verificationCode !== payload.verificationCode) {
    return {
      verdict: 'TAMPERED',
      certificateNumber: certificate.certificateNumber,
      checkedAt,
    };
  }

  const recomputed = certificateContentChecksum(certificate.content);

  if (recomputed !== certificate.contentChecksum) {
    return {
      verdict: 'TAMPERED',
      certificateNumber: certificate.certificateNumber,
      checkedAt,
    };
  }

  return {
    verdict: 'VALID',
    certificate,
    content: certificate.content,
    checkedAt,
  };
}
