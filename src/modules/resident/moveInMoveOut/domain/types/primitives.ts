import type { Absent } from '../../../../../shared/types/absence.types';

export type LifecycleActorType =
  | 'RESIDENT'
  | 'OWNER'
  | 'TENANT'
  | 'FAMILY_MEMBER'
  | 'SOCIETY_ADMIN'
  | 'SOCIETY_SECRETARY'
  | 'SOCIETY_CHAIRPERSON'
  | 'TREASURER'
  | 'FACILITY_MANAGER'
  | 'SECURITY'
  | 'SYSTEM'
  | 'AUDITOR';

export type LifecycleActor = {
  readonly actorId: string;
  readonly actorType: LifecycleActorType;
  readonly displayName: string;
  readonly societyId: string;
  readonly unitId: string | Absent;
  readonly onBehalfOfResidentId: string | Absent;
};

export type LifecycleScope = {
  readonly societyId: string;
  readonly unitId: string;
  readonly residentId: string;
  readonly occupancyRelationshipId: string;
};

export type Revision = {
  readonly revision: number;
  readonly revisionToken: string;
};

export type IdempotencyKey = {
  readonly idempotencyKey: string;
};

export type DomainCommand<Payload> = LifecycleScope &
  Revision &
  IdempotencyKey & {
    readonly actor: LifecycleActor;
    readonly payload: Payload;
    readonly reason: string | Absent;
  };

export type DomainErrorCode =
  | 'SCOPE_MISMATCH'
  | 'ACTOR_NOT_AUTHORIZED'
  | 'ACTOR_SCOPE_VIOLATION'
  | 'REVISION_MISMATCH'
  | 'REVISION_REQUIRED'
  | 'IDEMPOTENCY_KEY_REQUIRED'
  | 'IDEMPOTENCY_KEY_REPLAY'
  | 'IDEMPOTENCY_KEY_CONFLICT'
  | 'AGGREGATE_NOT_FOUND'
  | 'CONCURRENT_WRITE'
  | 'STALE_PREREQUISITE'
  | 'ILLEGAL_TRANSITION'
  | 'TERMINAL_STATE'
  | 'PRECONDITION_FAILED'
  | 'MANDATORY_ITEM_BLOCKED'
  | 'SNAPSHOT_CHECKSUM_MISMATCH'
  | 'SNAPSHOT_SUPERSEDED'
  | 'LEDGER_NOT_RECONCILED'
  | 'SLOT_CONFLICT'
  | 'SLOT_OUTSIDE_WINDOW'
  | 'SLOT_BLACKED_OUT'
  | 'SLOT_BUFFER_VIOLATION'
  | 'SLOT_HOLD_EXPIRED'
  | 'CERIFICATE_ALREADY_ISSUED'
  | 'CERTIFICATE_NOT_SIGNED'
  | 'CERTIFICATE_CHECKSUM_MISMATCH'
  | 'VERIFICATION_CODE_INVALID'
  | 'DUPLICATE_ACTIVE_REQUEST'
  | 'OCCUPANCY_NOT_ACTIVE'
  | 'OCCUPANCY_MISMATCH'
  | 'MONEY_PRECISION_INVALID'
  | 'CURRENCY_MISMATCH'
  | 'VALIDATION_FAILED';

export type DomainViolation = {
  readonly code: DomainErrorCode;
  readonly field: string;
  readonly blocking: boolean;
};

export type DomainValidationResult =
  | { readonly valid: true; readonly warnings: readonly DomainViolation[] }
  | {
      readonly valid: false;
      readonly violations: readonly DomainViolation[];
      readonly warnings: readonly DomainViolation[];
    };

export type IntegrationStatus =
  | 'INTEGRATED'
  | 'PARTIAL'
  | 'API_READY'
  | 'LOCAL_ONLY'
  | 'MOCK_ONLY'
  | 'NOT_AVAILABLE';

export type IntegrationCapability = {
  readonly capability: string;
  readonly authoritativeDomain: string;
  readonly status: IntegrationStatus;
  readonly blockingReadiness: boolean;
  readonly gap: string;
};

export type TransitionOutcome<State> =
  | {
      readonly allowed: true;
      readonly from: State;
      readonly to: State;
      readonly warnings: readonly DomainViolation[];
    }
  | {
      readonly allowed: false;
      readonly from: State;
      readonly attempted: State;
      readonly violation: DomainViolation;
    };

export const REQUIRED_MONEY_DECIMAL_PLACES = 2;
export const MINOR_UNITS_PER_MAJOR = 100;
export const MAX_REASONABLE_MONEY_MINOR_UNITS = 100_000_000_00;
