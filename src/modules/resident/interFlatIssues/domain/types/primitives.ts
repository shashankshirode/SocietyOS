import type { Absent } from '../../../../../shared/types/absence.types';
import type { AppRole } from '../../../../../core/permissions/permission.types';

export type DisputeClock = {
  readonly now: () => Date;
};

export type DisputeActorType =
  | 'RESIDENT_REPORTER'
  | 'RESIDENT_RESPONDENT'
  | 'RESIDENT_AFFECTED'
  | 'SOCIETY_ADMIN'
  | 'SOCIETY_SECRETARY'
  | 'SOCIETY_CHAIRPERSON'
  | 'COMMITTEE_MEMBER'
  | 'FACILITY_MANAGER'
  | 'SECURITY_GUARD'
  | 'MEDIATOR'
  | 'INSPECTOR'
  | 'AUDITOR'
  | 'TREASURER'
  | 'SYSTEM';

export type DisputeActor = {
  readonly userId: string;
  readonly role: AppRole;
  readonly actorType: DisputeActorType;
  readonly societyId: string;
  readonly unitId: string | Absent;
  readonly displayName: string;
  readonly sessionId: string;
  readonly authenticatedAt: string;
};

export type DisputeScope = {
  readonly societyId: string;
  readonly caseId: string;
};

export type DisputeRevision = {
  readonly revision: number;
  readonly revisionToken: string;
};

export type DisputeTraceContext = {
  readonly correlationId: string;
  readonly causationId: string | Absent;
};

export type DisputeErrorCode =
  | 'SCOPE_MISMATCH'
  | 'CROSS_SOCIETY_BLOCKED'
  | 'ACTOR_NOT_AUTHENTICATED'
  | 'ACTOR_SESSION_STALE'
  | 'ACTOR_NOT_AUTHORIZED'
  | 'IDOR_BLOCKED'
  | 'NOT_A_PARTY'
  | 'AGGREGATE_NOT_FOUND'
  | 'CONCURRENT_WRITE'
  | 'REVISION_MISMATCH'
  | 'ILLEGAL_TRANSITION'
  | 'TERMINAL_STATE'
  | 'PRECONDITION_FAILED'
  | 'IDEMPOTENCY_KEY_REQUIRED'
  | 'IDEMPOTENCY_KEY_REPLAY'
  | 'IDEMPOTENCY_KEY_CONFLICT'
  | 'VALIDATION_FAILED'
  | 'EVIDENCE_VAULT_UNAVAILABLE'
  | 'EVIDENCE_NOT_VERIFIED'
  | 'EVIDENCE_VISIBILITY_DENIED'
  | 'SLA_POLICY_MISSING'
  | 'INSPECTION_NOT_ASSIGNED'
  | 'INSPECTION_ALREADY_TERMINAL'
  | 'MEDIATION_NOT_ACTIVE'
  | 'MEDIATION_NOTE_VISIBILITY_DENIED'
  | 'PROPOSAL_NOT_AWAITING_DECISION'
  | 'PROPOSAL_ALREADY_DECIDED'
  | 'ACCEPTANCE_SCOPE_NOT_SATISFIED'
  | 'CLOSURE_EVIDENCE_REQUIRED'
  | 'CLOSURE_OUTCOME_REQUIRED'
  | 'ESCALATION_REASON_REQUIRED'
  | 'ESCALATION_TARGET_NOT_CONFIGURED'
  | 'FINANCE_LINK_OUT_OF_SCOPE'
  | 'MOVE_OUT_LINK_OUT_OF_SCOPE'
  | 'COMMUNICATION_NOT_CONSENTED'
  | 'COMMUNICATION_CHANNEL_UNAVAILABLE'
  | 'RETENTION_HOLD_ACTIVE'
  | 'RETENTION_NOT_DUE'
  | 'AUDIT_WRITE_FAILED';

export type DisputeViolation = {
  readonly code: DisputeErrorCode;
  readonly field: string;
  readonly blocking: boolean;
  readonly detail: string | Absent;
};

export type DisputeDecision =
  | { readonly allowed: true; readonly warnings: readonly DisputeViolation[] }
  | { readonly allowed: false; readonly violations: readonly DisputeViolation[] };

export type DisputeValidation =
  | { readonly valid: true; readonly warnings: readonly DisputeViolation[] }
  | {
      readonly valid: false;
      readonly violations: readonly DisputeViolation[];
      readonly warnings: readonly DisputeViolation[];
    };

export type DisputeTransitionResult<State> =
  | {
      readonly allowed: true;
      readonly from: State;
      readonly to: State;
      readonly warnings: readonly DisputeViolation[];
    }
  | {
      readonly allowed: false;
      readonly from: State;
      readonly attempted: State;
      readonly violations: readonly DisputeViolation[];
    };

export type DisputeOutcome<T> =
  | { readonly ok: true; readonly value: T; readonly warnings: readonly DisputeViolation[] }
  | { readonly ok: false; readonly code: DisputeErrorCode; readonly message: string; readonly violations: readonly DisputeViolation[] };

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
  code: DisputeErrorCode,
  field: string,
  detail?: string,
): DisputeViolation {
  return detail === undefined
    ? { code, field, blocking: true, detail: undefined }
    : { code, field, blocking: true, detail };
}

export function warning(
  code: DisputeErrorCode,
  field: string,
  detail?: string,
  blocking = false,
): DisputeViolation {
  return detail === undefined
    ? { code, field, blocking, detail: undefined }
    : { code, field, blocking, detail };
}

export function denied(violations: readonly DisputeViolation[]): DisputeDecision {
  return { allowed: false, violations };
}

export function allowedWith(warnings: readonly DisputeViolation[]): DisputeDecision {
  return { allowed: true, warnings };
}

export function invalid(violations: readonly DisputeViolation[]): DisputeValidation {
  return { valid: false, violations, warnings: [] };
}

export function validWith(warnings: readonly DisputeViolation[]): DisputeValidation {
  return { valid: true, warnings };
}

export function fail<T>(
  code: DisputeErrorCode,
  message: string,
  violations: readonly DisputeViolation[] = [violation(code, 'command')],
): DisputeOutcome<T> {
  return { ok: false, code, message, violations };
}

export function succeed<T>(value: T, warnings: readonly DisputeViolation[] = []): DisputeOutcome<T> {
  return { ok: true, value, warnings };
}

export function firstViolationCode(
  decision: DisputeDecision,
  fallback: DisputeErrorCode,
): DisputeErrorCode {
  return decision.allowed ? fallback : (decision.violations[0]?.code ?? fallback);
}

export function nextRevision(current: DisputeRevision): DisputeRevision {
  return {
    revision: current.revision + 1,
    revisionToken: `rev-${current.revisionToken.split('-').pop() ?? '0'}-${current.revision + 1}`,
  };
}

export type VersionedDisputeAggregate = {
  readonly revision: DisputeRevision;
};
