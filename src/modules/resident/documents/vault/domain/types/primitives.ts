import type { Absent } from '../../../../../../shared/types/absence.types';
import type { AppRole } from '../../../../../../core/permissions/permission.types';

export type VaultClock = {
  readonly now: () => Date;
};

export type VaultActorType =
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

export type VaultActor = {
  readonly userId: string;
  readonly role: AppRole;
  readonly actorType: VaultActorType;
  readonly societyId: string;
  readonly sessionId: string;
  readonly authenticatedAt: string;
};

export type VaultScope = {
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

export type DocumentVaultErrorCode =
  | 'SCOPE_MISMATCH'
  | 'ACTOR_NOT_AUTHENTICATED'
  | 'ACTOR_SESSION_STALE'
  | 'ACTOR_NOT_AUTHORIZED'
  | 'IDOR_BLOCKED'
  | 'CROSS_SOCIETY_BLOCKED'
  | 'HISTORICAL_PRIVACY_BLOCKED'
  | 'IDEMPOTENCY_KEY_REQUIRED'
  | 'IDEMPOTENCY_KEY_REPLAY'
  | 'IDEMPOTENCY_KEY_CONFLICT'
  | 'AGGREGATE_NOT_FOUND'
  | 'CONCURRENT_WRITE'
  | 'REVISION_MISMATCH'
  | 'ILLEGAL_TRANSITION'
  | 'TERMINAL_STATE'
  | 'PRECONDITION_FAILED'
  | 'UPLOAD_NOT_RESUMABLE'
  | 'UPLOAD_SIZE_MISMATCH'
  | 'UPLOAD_TYPE_NOT_ALLOWED'
  | 'UPLOAD_TYPE_MISMATCH'
  | 'UPLOAD_TOO_LARGE'
  | 'INTEGRITY_CHECKSUM_MISMATCH'
  | 'INTEGRITY_WEAK_ALGORITHM'
  | 'MALWARE_SCAN_PENDING'
  | 'MALWARE_SCAN_FAILED'
  | 'MALWARE_SCANNER_UNAVAILABLE'
  | 'OBJECT_QUARANTINED'
  | 'OBJECT_NOT_AVAILABLE'
  | 'STORAGE_KEY_EXPOSURE_BLOCKED'
  | 'RETRIEVAL_TICKET_EXPIRED'
  | 'RETRIEVAL_TICKET_CONSUMED'
  | 'RETRIEVAL_TICKET_SCOPE_MISMATCH'
  | 'RETRIEVAL_TTL_TOO_LONG'
  | 'VERIFICATION_CASE_NOT_REVIEWABLE'
  | 'VERIFICATION_CHECKLIST_INCOMPLETE'
  | 'VERIFICATION_REASON_REQUIRED'
  | 'VERIFICATION_REVIEWER_NOT_AUTHORIZED'
  | 'SIGNATURE_PROVIDER_UNAVAILABLE'
  | 'SIGNATURE_ALREADY_EXISTS'
  | 'SIGNATURE_NOT_VERIFIED'
  | 'VERSION_ALREADY_CURRENT'
  | 'VERSION_SEQUENCE_CONFLICT'
  | 'VERSION_VERIFICATION_NOT_INHERITED'
  | 'DUPLICATE_CONTENT_SCOPE'
  | 'RETENTION_HOLD_ACTIVE'
  | 'RETENTION_NOT_DUE'
  | 'RETENTION_POLICY_MISSING'
  | 'RETENTION_ERASURE_DEFERRAL'
  | 'RETENTION_DELETE_NOT_CONFIRMED'
  | 'EXPIRY_NOT_REACHED'
  | 'EXPIRY_REVOCATION_REQUIRED'
  | 'POLICY_NOT_EFFECTIVE'
  | 'POLICY_CONFIG_INVALID'
  | 'AUDIT_WRITE_FAILED'
  | 'VALIDATION_FAILED';

export type DocumentVaultViolation = {
  readonly code: DocumentVaultErrorCode;
  readonly field: string;
  readonly blocking: boolean;
  readonly detail: string | Absent;
};

export type DocumentVaultValidation =
  | { readonly valid: true; readonly warnings: readonly DocumentVaultViolation[] }
  | {
      readonly valid: false;
      readonly violations: readonly DocumentVaultViolation[];
      readonly warnings: readonly DocumentVaultViolation[];
    };

export type VaultDecision =
  | { readonly allowed: true; readonly warnings: readonly DocumentVaultViolation[] }
  | { readonly allowed: false; readonly violations: readonly DocumentVaultViolation[] };

export type TransitionResult<State> =
  | {
      readonly allowed: true;
      readonly from: State;
      readonly to: State;
      readonly warnings: readonly DocumentVaultViolation[];
    }
  | {
      readonly allowed: false;
      readonly from: State;
      readonly attempted: State;
      readonly violation: DocumentVaultViolation;
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
  code: DocumentVaultErrorCode,
  field: string,
  detail?: string,
): DocumentVaultViolation {
  if (detail === undefined) {
    return { code, field, blocking: true, detail: undefined };
  }
  return { code, field, blocking: true, detail };
}

export function warning(
  code: DocumentVaultErrorCode,
  field: string,
  detail?: string,
): DocumentVaultViolation {
  if (detail === undefined) {
    return { code, field, blocking: false, detail: undefined };
  }
  return { code, field, blocking: false, detail };
}

export function denied(
  violations: readonly DocumentVaultViolation[],
): VaultDecision {
  return { allowed: false, violations };
}

export function allowedWith(
  warnings: readonly DocumentVaultViolation[],
): VaultDecision {
  return { allowed: true, warnings };
}

export function invalid(
  violations: readonly DocumentVaultViolation[],
): DocumentVaultValidation {
  return { valid: false, violations, warnings: [] };
}

export function validWith(
  warnings: readonly DocumentVaultViolation[],
): DocumentVaultValidation {
  return { valid: true, warnings };
}

export function isBlocking(
  result: DocumentVaultValidation,
): result is { readonly valid: false; readonly violations: readonly DocumentVaultViolation[]; readonly warnings: readonly DocumentVaultViolation[] } {
  return !result.valid;
}

export function scopeMatches(
  scope: VaultScope,
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
  actor: VaultActor,
  clock: VaultClock,
  maxSessionAgeMs: number,
): boolean {
  const authenticatedAt = Date.parse(actor.authenticatedAt);
  if (Number.isNaN(authenticatedAt)) {
    return false;
  }
  const age = clock.now().getTime() - authenticatedAt;
  return age >= 0 && age <= maxSessionAgeMs;
}
