import type { Absent } from '../../../../shared/types/absence.types';
import type { AppRole, Permission } from '../../../../core/permissions/permission.types';

export type CommunicationClock = {
  readonly now: () => Date;
};

export type CommunicationActorType =
  | 'RESIDENT_OWNER'
  | 'RESIDENT_TENANT'
  | 'RESIDENT_FAMILY'
  | 'SOCIETY_ADMIN'
  | 'SOCIETY_SECRETARY'
  | 'SOCIETY_CHAIRPERSON'
  | 'SOCIETY_TREASURER'
  | 'COMMITTEE_MEMBER'
  | 'FACILITY_MANAGER'
  | 'SECURITY_GUARD'
  | 'SECURITY_SUPERVISOR'
  | 'VENDOR_USER'
  | 'STAFF_USER'
  | 'AUDITOR'
  | 'SUPER_ADMIN'
  | 'SYSTEM';

export type CommunicationActor = {
  readonly userId: string;
  readonly role: AppRole;
  readonly actorType: CommunicationActorType;
  readonly societyId: string;
  readonly sessionId: string;
  readonly authenticatedAt: string;
};

export type CommunicationScope = {
  readonly societyId: string;
  readonly owningEntityType: string;
  readonly owningEntityId: string;
};

export type Revision = {
  readonly revision: number;
  readonly revisionToken: string;
};

export type IdempotencyKey = {
  readonly idempotencyKey: string;
};

export type TraceContext = {
  readonly correlationId: string;
  readonly causationId: string | Absent;
};

export type CommunicationErrorCode =
  | 'SCOPE_MISMATCH'
  | 'ACTOR_NOT_AUTHENTICATED'
  | 'ACTOR_SESSION_STALE'
  | 'ACTOR_NOT_AUTHORIZED'
  | 'IDOR_BLOCKED'
  | 'CROSS_SOCIETY_BLOCKED'
  | 'HISTORICAL_PRIVACY_BLOCKED'
  | 'DIRECTORY_VISIBILITY_BLOCKED'
  | 'CONTACT_NOT_PERMITTED'
  | 'SELF_CONTACT_BLOCKED'
  | 'DUPLICATE_CONTACT_PAIR'
  | 'PHONE_EXPOSURE_BLOCKED'
  | 'EMAIL_EXPOSURE_BLOCKED'
  | 'INACTIVE_RESIDENT_BLOCKED'
  | 'PRIVACY_OPT_OUT_BLOCKED'
  | 'BLOCKED_RESIDENT_BLOCKED'
  | 'IDEMPOTENCY_KEY_REQUIRED'
  | 'IDEMPOTENCY_KEY_REPLAY'
  | 'IDEMPOTENCY_KEY_CONFLICT'
  | 'AGGREGATE_NOT_FOUND'
  | 'CONCURRENT_WRITE'
  | 'REVISION_MISMATCH'
  | 'ILLEGAL_TRANSITION'
  | 'TERMINAL_STATE'
  | 'PRECONDITION_FAILED'
  | 'CHANNEL_NOT_ACTIVE'
  | 'CHANNEL_MEMBERSHIP_REQUIRED'
  | 'CHANNEL_ALREADY_EXISTS'
  | 'MESSAGE_EMPTY'
  | 'MESSAGE_TOO_LONG'
  | 'MESSAGE_RETENTION_EXPIRED'
  | 'QUEUE_REVALIDATION_FAILED'
  | 'MODERATION_SCOPE_BLOCKED'
  | 'MODERATION_ACTION_NOT_ALLOWED'
  | 'EVIDENCE_REQUIRED'
  | 'NOTICE_AUDIENCE_EMPTY'
  | 'NOTICE_AUDIENCE_FROZEN'
  | 'NOTICE_SCHEDULE_INVALID'
  | 'NOTICE_EMERGENCY_REASON_REQUIRED'
  | 'NOTICE_QUIET_HOURS_OVERRIDE_INVALID'
  | 'NOTICE_NOT_PUBLISHED'
  | 'NOTICE_REVISION_MISMATCH'
  | 'NOTICE_ACKNOWLEDGEMENT_REVISION_MISMATCH'
  | 'DELIVERY_CHANNEL_UNAVAILABLE'
  | 'DELIVERY_ATTEMPT_EXHAUSTED'
  | 'STALE_WORKFLOW_VERSION'
  | 'SOCIETY_INACTIVE'
  | 'UNIT_INACTIVE'
  | 'ACCESS_DENIED'
  | 'FEATURE_DISABLED'
  | 'VALIDATION_FAILED';

export type CommunicationViolation = {
  readonly code: CommunicationErrorCode;
  readonly field: string;
  readonly blocking: boolean;
  readonly detail: string | Absent;
};

export type CommunicationValidation =
  | { readonly valid: true; readonly warnings: readonly CommunicationViolation[] }
  | {
      readonly valid: false;
      readonly violations: readonly CommunicationViolation[];
      readonly warnings: readonly CommunicationViolation[];
    };

export type CommunicationDecision =
  | { readonly allowed: true; readonly warnings: readonly CommunicationViolation[] }
  | { readonly allowed: false; readonly violations: readonly CommunicationViolation[] };

export type TransitionResult<State> =
  | {
      readonly allowed: true;
      readonly from: State;
      readonly to: State;
      readonly warnings: readonly CommunicationViolation[];
    }
  | {
      readonly allowed: false;
      readonly from: State;
      readonly attempted: State;
      readonly violation: CommunicationViolation;
    };

export type CommunicationOutcome<T> =
  | { readonly ok: true; readonly value: T; readonly warnings: readonly string[] }
  | { readonly ok: false; readonly code: CommunicationErrorCode; readonly message: string };

export type DeniedDecision = {
  readonly allowed: false;
  readonly violations: readonly CommunicationViolation[];
};

export type DeniedTransition = {
  readonly allowed: false;
  readonly from: unknown;
  readonly attempted: unknown;
  readonly violation: CommunicationViolation;
};

export type IntegrationStatus =
  | 'INTEGRATED'
  | 'PARTIAL'
  | 'API_READY'
  | 'CLIENT_VALIDATED'
  | 'MOCK_ONLY'
  | 'NOT_AVAILABLE';

export type IntegrationCapability = {
  readonly capability: string;
  readonly authoritativeOwner: string;
  readonly status: IntegrationStatus;
  readonly blockingReadiness: boolean;
  readonly gap: string;
};

export function violation(
  code: CommunicationErrorCode,
  field: string,
  detail?: string,
): CommunicationViolation {
  if (detail === undefined) {
    return { code, field, blocking: true, detail: undefined };
  }
  return { code, field, blocking: true, detail };
}

export function warning(
  code: CommunicationErrorCode,
  field: string,
  detail?: string,
): CommunicationViolation {
  if (detail === undefined) {
    return { code, field, blocking: false, detail: undefined };
  }
  return { code, field, blocking: false, detail };
}

export function denied(
  violations: readonly CommunicationViolation[],
): CommunicationDecision {
  return { allowed: false, violations };
}

export function allowedWith(
  warnings: readonly CommunicationViolation[],
): CommunicationDecision {
  return { allowed: true, warnings };
}

export function invalid(
  violations: readonly CommunicationViolation[],
): CommunicationValidation {
  return { valid: false, violations, warnings: [] };
}

export function validWith(
  warnings: readonly CommunicationViolation[],
): CommunicationValidation {
  return { valid: true, warnings };
}

export function isBlocking(
  result: CommunicationValidation,
): result is {
  readonly valid: false;
  readonly violations: readonly CommunicationViolation[];
  readonly warnings: readonly CommunicationViolation[];
} {
  return !result.valid;
}

export function firstViolation(
  violations: readonly CommunicationViolation[],
): CommunicationViolation {
  const first = violations[0];
  if (first === undefined) {
    return violation('VALIDATION_FAILED', 'request', 'Request rejected.');
  }
  return first;
}

export function deniedOutcome(
  denied: DeniedDecision,
): { readonly ok: false; readonly code: CommunicationErrorCode; readonly message: string } {
  const first = firstViolation(denied.violations);
  return { ok: false, code: first.code, message: first.field };
}

export function deniedOutcomeFromViolation(
  single: CommunicationViolation,
): { readonly ok: false; readonly code: CommunicationErrorCode; readonly message: string } {
  return { ok: false, code: single.code, message: single.field };
}

export function scopeMatches(
  scope: CommunicationScope,
  societyId: string,
  owningEntityType: string,
  owningEntityId: string,
): boolean {
  return (
    scope.societyId === societyId &&
    scope.owningEntityType === owningEntityType &&
    scope.owningEntityId === owningEntityId
  );
}

export function isFreshSession(
  actor: CommunicationActor,
  clock: CommunicationClock,
  maxSessionAgeMs: number,
): boolean {
  const authenticatedAt = Date.parse(actor.authenticatedAt);
  if (Number.isNaN(authenticatedAt)) {
    return false;
  }
  const age = clock.now().getTime() - authenticatedAt;
  return age >= 0 && age <= maxSessionAgeMs;
}

export function nextRevision(current: Revision): Revision {
  return {
    revision: current.revision + 1,
    revisionToken: `rev-${current.revision + 1}`,
  };
}

export function sameRevision(current: Revision, expectedRevision: number): boolean {
  return current.revision === expectedRevision;
}

export type CommunicationAction =
  | 'DIRECTORY_SEARCH'
  | 'DIRECTORY_VIEW_PROFILE'
  | 'SEND_CONTACT_REQUEST'
  | 'RESPOND_CONTACT_REQUEST'
  | 'OPEN_PRIVATE_CHANNEL'
  | 'SEND_MESSAGE'
  | 'READ_MESSAGE'
  | 'BLOCK_RESIDENT'
  | 'REPORT_CONTENT'
  | 'VIEW_REPORTED_MESSAGE'
  | 'MODERATE_REPORT'
  | 'VIEW_MODERATION_AUDIT'
  | 'CREATE_NOTICE'
  | 'PUBLISH_NOTICE'
  | 'SCHEDULE_NOTICE'
  | 'WITHDRAW_NOTICE'
  | 'ACKNOWLEDGE_NOTICE'
  | 'VIEW_NOTICE_DELIVERY_REPORT'
  | 'MANAGE_CONTROLLED_GROUP'
  | 'MANAGE_DEPARTMENT_CHANNEL';

export type ActionPermissionRule = {
  readonly action: CommunicationAction;
  readonly permissions: readonly Permission[];
  readonly anyOf: boolean;
};
