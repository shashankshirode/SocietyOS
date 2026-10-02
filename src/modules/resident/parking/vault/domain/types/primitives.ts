import type { Absent } from '../../../../../../shared/types/absence.types';
import type { AppRole } from '../../../../../../core/permissions/permission.types';

export type ParkingVaultClock = {
  readonly now: () => Date;
};

export type ParkingVaultActorType =
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

export type ParkingVaultActor = {
  readonly userId: string;
  readonly role: AppRole;
  readonly actorType: ParkingVaultActorType;
  readonly societyId: string;
  readonly sessionId: string;
  readonly authenticatedAt: string;
};

export type VaultActor = ParkingVaultActor;

export type ParkingVaultScope = {
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

export type ParkingVaultErrorCode =
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
  | 'VEHICLE_VERIFICATION_PENDING'
  | 'VEHICLE_ALREADY_REGISTERED'
  | 'VEHICLE_NUMBER_MISMATCH'
  | 'ALLOCATION_CONFLICT'
  | 'SLOT_UNAVAILABLE'
  | 'TEMPORARY_ALLOCATION_CONFLICT'
  | 'VISITOR_PARKING_FULL'
  | 'VEHICLE_NOT_VERIFIED'
  | 'INSUFFICIENT_ENTITLEMENT'
  | 'SLOT_INCOMPATIBLE'
  | 'HOLD_EXPIRED'
  | 'TRANSFER_TARGET_UNAVAILABLE'
  | 'VEHICLE_REPLACEMENT_PENDING'
  | 'STICKER_RFID_MISMATCH'
  | 'ANPR_LOW_CONFIDENCE'
  | 'HARDWARE_UNAVAILABLE'
  | 'INCIDENT_ALREADY_RESOLVED'
  | 'VIOLATION_DISMISSED'
  | 'PENALTY_ALREADY_APPLIED'
  | 'PENALTY_REVERSAL_FAILED'
  | 'RFID_REVOKED'
  | 'ANPR_MATCH_FAILED'
  | 'HARDWARE_OFFLINE'
  | 'STALE_WORKFLOW_VERSION'
  | 'SOCIETY_INACTIVE'
  | 'UNIT_INACTIVE'
  | 'ACCESS_DENIED'
  | 'FEATURE_DISABLED'
  | 'VALIDATION_FAILED';

export type ParkingVaultViolation = {
  readonly code: ParkingVaultErrorCode;
  readonly field: string;
  readonly blocking: boolean;
  readonly detail: string | Absent;
};

export type ParkingVaultValidation =
  | { readonly valid: true; readonly warnings: readonly ParkingVaultViolation[] }
  | {
      readonly valid: false;
      readonly violations: readonly ParkingVaultViolation[];
      readonly warnings: readonly ParkingVaultViolation[];
    };

export type ParkingVaultDecision =
  | { readonly allowed: true; readonly warnings: readonly ParkingVaultViolation[] }
  | { readonly allowed: false; readonly violations: readonly ParkingVaultViolation[] };

export type TransitionResult<State> =
  | {
      readonly allowed: true;
      readonly from: State;
      readonly to: State;
      readonly warnings: readonly ParkingVaultViolation[];
    }
  | {
      readonly allowed: false;
      readonly from: State;
      readonly attempted: State;
      readonly violation: ParkingVaultViolation;
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
  code: ParkingVaultErrorCode,
  field: string,
  detail?: string,
): ParkingVaultViolation {
  if (detail === undefined) {
    return { code, field, blocking: true, detail: undefined };
  }
  return { code, field, blocking: true, detail };
}

export function warning(
  code: ParkingVaultErrorCode,
  field: string,
  detail?: string,
): ParkingVaultViolation {
  if (detail === undefined) {
    return { code, field, blocking: false, detail: undefined };
  }
  return { code, field, blocking: false, detail };
}

export function denied(
  violations: readonly ParkingVaultViolation[],
): ParkingVaultDecision {
  return { allowed: false, violations };
}

export function allowedWith(
  warnings: readonly ParkingVaultViolation[],
): ParkingVaultDecision {
  return { allowed: true, warnings };
}

export function invalid(
  violations: readonly ParkingVaultViolation[],
): ParkingVaultValidation {
  return { valid: false, violations, warnings: [] };
}

export function validWith(
  warnings: readonly ParkingVaultViolation[],
): ParkingVaultValidation {
  return { valid: true, warnings };
}

export function isBlocking(
  result: ParkingVaultValidation,
): result is { readonly valid: false; readonly violations: readonly ParkingVaultViolation[]; readonly warnings: readonly ParkingVaultViolation[] } {
  return !result.valid;
}

export function scopeMatches(
  scope: ParkingVaultScope,
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
  actor: ParkingVaultActor,
  clock: ParkingVaultClock,
  maxSessionAgeMs: number,
): boolean {
  const authenticatedAt = Date.parse(actor.authenticatedAt);
  if (Number.isNaN(authenticatedAt)) {
    return false;
  }
  const age = clock.now().getTime() - authenticatedAt;
  return age >= 0 && age <= maxSessionAgeMs;
}