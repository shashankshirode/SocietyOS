import type { Absent } from '../../../../../shared/types/absence.types';
import { allViolations, isAbsent } from '../guards/commandSupport';
import type { DomainViolation, IntegrationStatus } from '../types/primitives';
import {
  ACTIVATION_INTENTS,
  REVOCATION_INTENTS,
  type AccessIntentAdmission,
  type AccessTransitionOutcome,
  type AccessTransitionRequest,
  type AccessTransitionStatus,
} from '../types/access.types';

export type AccessActorType =
  | 'RESIDENT'
  | 'FAMILY_MEMBER'
  | 'SOCIETY_ADMIN'
  | 'SECURITY'
  | 'SYSTEM'
  | 'AUDITOR';

export type AccessResourceKind = 'SESSION' | 'GATE_MAPPING' | 'CREDENTIAL' | 'PARKING_ALLOCATION';

export type AccessResourceState = 'ACTIVE' | 'REVOKED' | 'SUSPENDED' | 'FAILED';

export type AccessResourceOutcome = {
  readonly kind: AccessResourceKind;
  readonly resourceId: string;
  readonly state: AccessResourceState;
  readonly failureCode: string | Absent;
};

export type AccessPlan = {
  readonly transitionId: string;
  readonly request: AccessTransitionRequest;
  readonly admitted: AccessIntentAdmission;
  readonly resources: readonly AccessResourceOutcome[];
  readonly status: AccessTransitionStatus;
  readonly completedAt: string | Absent;
  readonly failureCode: string | Absent;
  readonly retryable: boolean;
  readonly attemptCount: number;
  readonly residenceAccessStatusAfter: string | Absent;
  readonly integrationStatus: IntegrationStatus;
  readonly violations: readonly DomainViolation[];
};

const REQUESTER_ACTORS: readonly AccessActorType[] = [
  'RESIDENT',
  'FAMILY_MEMBER',
  'SOCIETY_ADMIN',
  'SECURITY',
  'SYSTEM',
];

const ACTIVATION_REQUESTERS: readonly AccessActorType[] = [
  'RESIDENT',
  'FAMILY_MEMBER',
  'SOCIETY_ADMIN',
  'SYSTEM',
];

const REVOCATION_REQUESTERS: readonly AccessActorType[] = ['SOCIETY_ADMIN', 'SECURITY', 'SYSTEM'];

export function gateIsAuthoritative(status: IntegrationStatus): boolean {
  return status === 'INTEGRATED' || status === 'API_READY';
}

export function isActivationIntent(intent: AccessTransitionRequest['intent']): boolean {
  return ACTIVATION_INTENTS.includes(intent);
}

export function isRevocationIntent(intent: AccessTransitionRequest['intent']): boolean {
  return REVOCATION_INTENTS.includes(intent);
}

function actorOf(request: AccessTransitionRequest): AccessActorType {
  return request.requestedBy.actorType as AccessActorType;
}

function admitIntent(request: AccessTransitionRequest): AccessIntentAdmission {
  const denialKeys: string[] = [];
  const warnings: string[] = [];
  const actor = actorOf(request);

  if (!REQUESTER_ACTORS.includes(actor)) {
    denialKeys.push('access.actorNotPermitted');
  }

  if (isActivationIntent(request.intent) && !ACTIVATION_REQUESTERS.includes(actor)) {
    denialKeys.push('access.activationRequiresResidentOrAdmin');
  }

  if (isRevocationIntent(request.intent) && !REVOCATION_REQUESTERS.includes(actor)) {
    denialKeys.push('access.revocationRequiresAdminOrSecurity');
  }

  if (isAbsent(request.idempotencyKey)) {
    denialKeys.push('access.idempotencyKeyRequired');
  }

  if (isAbsent(request.linkedRequestId)) {
    denialKeys.push('access.linkedRequestRequired');
  }

  if (isAbsent(request.subjectResidentId)) {
    denialKeys.push('access.subjectResidentRequired');
  }

  if (request.credentialCount < 0) {
    denialKeys.push('access.invalidCredentialCount');
  }

  if (isActivationIntent(request.intent) && request.credentialCount === 0) {
    warnings.push('access.activationWithoutCredential');
  }

  if (isRevocationIntent(request.intent) && request.credentialCount === 0) {
    warnings.push('access.revocationWithoutCredential');
  }

  if (isRevocationIntent(request.intent) && request.parkingAllocationAffected) {
    warnings.push('access.parkingAllocationRequiresReassignment');
  }

  if (denialKeys.length > 0) {
    return { permitted: false, denialKeys };
  }

  return { permitted: true, warnings };
}

function scopeViolations(request: AccessTransitionRequest): readonly DomainViolation[] {
  const groups: DomainViolation[][] = [];
  const actor = request.requestedBy;

  if (actor.societyId !== request.societyId) {
    groups.push([{ code: 'SCOPE_MISMATCH', field: 'request.societyId', blocking: true }]);
  }

  const residentScopedActor =
    actor.actorType === 'RESIDENT' || actor.actorType === 'FAMILY_MEMBER';

  if (residentScopedActor) {
    if (
      isAbsent(actor.onBehalfOfResidentId) ||
      actor.onBehalfOfResidentId !== request.subjectResidentId
    ) {
      groups.push([
        { code: 'SCOPE_MISMATCH', field: 'request.subjectResidentId', blocking: true },
      ]);
    }

    if (!isAbsent(actor.unitId) && actor.unitId !== request.unitId) {
      groups.push([{ code: 'SCOPE_MISMATCH', field: 'request.unitId', blocking: true }]);
    }
  }

  return allViolations(groups);
}

export function planAccessTransition(
  request: AccessTransitionRequest,
  integrationStatus: IntegrationStatus,
  liveSessionIds: readonly string[],
  gateMappingIds: readonly string[],
): AccessPlan {
  const admission = admitIntent(request);
  const violations = scopeViolations(request);

  if (!admission.permitted || violations.length > 0) {
    return {
      transitionId: request.transitionId,
      request,
      admitted: admission,
      resources: [],
      status: 'PENDING',
      completedAt: undefined,
      failureCode: 'PRECONDITION_FAILED',
      retryable: false,
      attemptCount: 0,
      residenceAccessStatusAfter: request.residenceAccessStatusBefore,
      integrationStatus,
      violations,
    };
  }

  const activation = isActivationIntent(request.intent);
  const resources: AccessResourceOutcome[] = [];

  if (activation) {
    resources.push({
      kind: 'CREDENTIAL',
      resourceId: `credential-${request.transitionId}`,
      state: 'ACTIVE',
      failureCode: undefined,
    });
    resources.push({
      kind: 'SESSION',
      resourceId: `session-${request.transitionId}`,
      state: 'ACTIVE',
      failureCode: undefined,
    });
  } else {
    for (const sessionId of liveSessionIds) {
      resources.push({
        kind: 'SESSION',
        resourceId: sessionId,
        state: 'REVOKED',
        failureCode: undefined,
      });
    }

    for (const mappingId of gateMappingIds) {
      const gateFailure = !gateIsAuthoritative(integrationStatus);
      resources.push({
        kind: 'GATE_MAPPING',
        resourceId: mappingId,
        state: gateFailure ? 'FAILED' : 'REVOKED',
        failureCode: gateFailure ? 'GATE_INTEGRATION_UNAVAILABLE' : undefined,
      });
    }

    for (let index = 0; index < request.credentialCount; index += 1) {
      resources.push({
        kind: 'CREDENTIAL',
        resourceId: `credential-${request.transitionId}-${index + 1}`,
        state: 'REVOKED',
        failureCode: undefined,
      });
    }
  }

  const failures = resources.filter((resource) => resource.state === 'FAILED');

  if (failures.length === 0) {
    return {
      transitionId: request.transitionId,
      request,
      admitted: admission,
      resources,
      status: 'SUCCEEDED',
      completedAt: request.requestedAt,
      failureCode: undefined,
      retryable: false,
      attemptCount: 1,
      residenceAccessStatusAfter: activation ? 'ACTIVE' : 'REVOKED',
      integrationStatus,
      violations: [],
    };
  }

  const partiallyRevoked = resources.some((resource) => resource.state === 'REVOKED');

  return {
    transitionId: request.transitionId,
    request,
    admitted: admission,
    resources,
    status: partiallyRevoked ? 'COMPENSATION_REQUIRED' : 'FAILED',
    completedAt: request.requestedAt,
    failureCode: 'GATE_INTEGRATION_UNAVAILABLE',
    retryable: true,
    attemptCount: 1,
    residenceAccessStatusAfter: activation ? 'ACTIVE' : 'SUSPENDED',
    integrationStatus,
    violations: [],
  };
}

export function toOutcome(plan: AccessPlan): AccessTransitionOutcome {
  return {
    transitionId: plan.transitionId,
    subject: plan.request.subject,
    intent: plan.request.intent,
    status: plan.status,
    requestedAt: plan.request.requestedAt,
    completedAt: plan.completedAt,
    idempotencyKey: plan.request.idempotencyKey,
    requestedByActorId: plan.request.requestedBy.actorId,
    subjectResidentId: plan.request.subjectResidentId,
    societyId: plan.request.societyId,
    unitId: plan.request.unitId,
    linkedRequestId: plan.request.linkedRequestId,
    credentialCount: plan.request.credentialCount,
    parkingAllocationAffected: plan.request.parkingAllocationAffected,
    gateIntegrationReference: plan.request.gateIntegrationReference,
    residenceAccessStatusBefore: plan.request.residenceAccessStatusBefore,
    residenceAccessStatusAfter: plan.residenceAccessStatusAfter,
    failureCode: plan.failureCode,
    failureDetailKey:
      plan.status === 'SUCCEEDED' ? undefined : `access.transition.${plan.status.toLowerCase()}`,
    retryable: plan.retryable,
    attemptCount: plan.attemptCount,
  };
}

export function isAccessTerminal(status: AccessTransitionStatus): boolean {
  return status === 'SUCCEEDED' || status === 'FAILED';
}

export function requiresCompensation(status: AccessTransitionStatus): boolean {
  return status === 'COMPENSATION_REQUIRED';
}
