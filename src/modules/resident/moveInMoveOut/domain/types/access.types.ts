import type { Absent } from '../../../../../shared/types/absence.types';
import type { LifecycleActor } from './primitives';

export type AccessTransitionSubject = 'RESIDENT_ACTIVATION' | 'RESIDENT_REVOCATION';

export type AccessTransitionIntent =
  | 'ACTIVATE_ON_MOVE_IN_COMPLETION'
  | 'REVOKE_ON_NOC_ISSUANCE'
  | 'SUSPEND_ON_MOVE_OUT_REQUEST'
  | 'REACTIVATE_ON_MOVE_IN_REVERSAL';

export type AccessTransitionStatus =
  | 'PENDING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'COMPENSATION_REQUIRED';

export type AccessTransitionOutcome = {
  readonly transitionId: string;
  readonly subject: AccessTransitionSubject;
  readonly intent: AccessTransitionIntent;
  readonly status: AccessTransitionStatus;
  readonly requestedAt: string;
  readonly completedAt: string | Absent;
  readonly idempotencyKey: string;
  readonly requestedByActorId: string;
  readonly subjectResidentId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly linkedRequestId: string;
  readonly credentialCount: number;
  readonly parkingAllocationAffected: boolean;
  readonly gateIntegrationReference: string | Absent;
  readonly residenceAccessStatusBefore: string | Absent;
  readonly residenceAccessStatusAfter: string | Absent;
  readonly failureCode: string | Absent;
  readonly failureDetailKey: string | Absent;
  readonly retryable: boolean;
  readonly attemptCount: number;
};

export type AccessTransitionRequest = {
  readonly transitionId: string;
  readonly subject: AccessTransitionSubject;
  readonly intent: AccessTransitionIntent;
  readonly idempotencyKey: string;
  readonly requestedAt: string;
  readonly requestedBy: LifecycleActor;
  readonly subjectResidentId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly linkedRequestId: string;
  readonly credentialCount: number;
  readonly parkingAllocationAffected: boolean;
  readonly residenceAccessStatusBefore: string | Absent;
  readonly gateIntegrationReference: string | Absent;
};

export type AccessIntentAdmission =
  | { readonly permitted: true; readonly warnings: readonly string[] }
  | { readonly permitted: false; readonly denialKeys: readonly string[] };

export const ACTIVATION_INTENTS: readonly AccessTransitionIntent[] = [
  'ACTIVATE_ON_MOVE_IN_COMPLETION',
  'REACTIVATE_ON_MOVE_IN_REVERSAL',
];

export const REVOCATION_INTENTS: readonly AccessTransitionIntent[] = [
  'REVOKE_ON_NOC_ISSUANCE',
  'SUSPEND_ON_MOVE_OUT_REQUEST',
];
