import type { Absent } from '../../../../../shared/types/absence.types';
import type { LifecycleActor, LifecycleScope } from './primitives';

export type MoveInStatus =
  | 'REQUESTED'
  | 'VERIFIED'
  | 'SCHEDULED'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'EXCEPTION'
  | 'COMPLETED'
  | 'CANCELLED';

export type MoveInActorRole =
  | 'RESIDENT_OR_REPRESENTATIVE'
  | 'SOCIETY_VERIFIER'
  | 'SOCIETY_ADMIN'
  | 'SYSTEM';

export type MoveInCommandKind =
  | 'SUBMIT_REQUEST'
  | 'RECORD_VERIFICATION_PASSED'
  | 'RECORD_VERIFICATION_FAILED'
  | 'APPROVE_VERIFICATION_EXCEPTION'
  | 'CONFIRM_APPOINTMENT'
  | 'GRANT_APPROVAL'
  | 'REVOKE_APPROVAL'
  | 'BEGIN_EXECUTION'
  | 'COMPLETE_EXECUTION'
  | 'CANCEL';

export type MoveInRequestState = {
  readonly moveInRequestId: string;
  readonly requestNumber: string;
  readonly status: MoveInStatus;
  readonly revision: number;
  readonly scope: LifecycleScope;
  readonly relationshipType: string;
  readonly occupancyStartDate: string;
  readonly requestedOccupancyEndDate: string | Absent;
  readonly agreementReference: string | Absent;
  readonly partyCount: number;
  readonly vehicleCount: number;
  readonly requiresLiftSlot: boolean;
  readonly requiresParking: boolean;
  readonly verificationChecklist: readonly MoveInVerificationCheck[];
  readonly verificationOutcome: MoveInVerificationOutcome | Absent;
  readonly verificationException: MoveInVerificationException | Absent;
  readonly appointmentId: string | Absent;
  readonly approvalReference: string | Absent;
  readonly execution: MoveInExecution | Absent;
  readonly cancellation: MoveInCancellation | Absent;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type MoveInVerificationOutcome = 'PASSED' | 'FAILED';

export type MoveInVerificationException = {
  readonly raisedAt: string;
  readonly reasonKey: string;
  readonly reasonDetail: string;
  readonly raisedByActorId: string;
  readonly approvedAt: string | Absent;
  readonly approvedByActorId: string | Absent;
  readonly approvalReference: string | Absent;
};

export type MoveInVerificationCheckKey =
  | 'IDENTITY_PROOF'
  | 'OWNERSHIP_OR_TENANCY_PROOF'
  | 'POLICE_VERIFICATION'
  | 'AGREEMENT_REGISTERED'
  | 'DUPLICATE_OCCUPANCY_CHECK'
  | 'DUES_CLEARANCE_CHECK'
  | 'NO_BLOCKING_COMPLAINT';

export type MoveInVerificationCheckResult = 'PASS' | 'FAIL' | 'NOT_EVALUATED' | 'NOT_APPLICABLE';

export type MoveInVerificationCheck = {
  readonly checkKey: MoveInVerificationCheckKey;
  readonly result: MoveInVerificationCheckResult;
  readonly detailKey: string;
  readonly evaluatedAt: string | Absent;
  readonly evaluatedByActorId: string | Absent;
  readonly evidenceRefs: readonly string[];
};

export type MoveInExecution = {
  readonly startedAt: string;
  readonly startedByActorId: string;
  readonly completedAt: string | Absent;
  readonly completedByActorId: string | Absent;
  readonly possessionsMovedCount: number;
  readonly keyHandedOverAt: string | Absent;
  readonly meterReadingReference: string | Absent;
  readonly accessActivationReference: string | Absent;
};

export type MoveInCancellation = {
  readonly cancelledAt: string;
  readonly cancelledByActorId: string;
  readonly reasonKey: string;
  readonly reasonDetail: string;
};

export type MoveInCommand = {
  readonly kind: MoveInCommandKind;
  readonly actor: LifecycleActor;
  readonly idempotencyKey: string;
  readonly expectedRevision: number;
  readonly occurredAt: string;
  readonly verificationChecks: readonly MoveInVerificationCheck[];
  readonly verificationFailureReasonKey: string | Absent;
  readonly verificationFailureReasonDetail: string | Absent;
  readonly verificationExceptionApprovalReference: string | Absent;
  readonly appointmentId: string | Absent;
  readonly approvalReference: string | Absent;
  readonly possessionsMovedCount: number;
  readonly keyHandedOverAt: string | Absent;
  readonly meterReadingReference: string | Absent;
  readonly accessActivationReference: string | Absent;
  readonly cancellationReasonKey: string | Absent;
  readonly cancellationReasonDetail: string | Absent;
};

export const MOVE_IN_TERMINAL_STATUSES: readonly MoveInStatus[] = ['COMPLETED', 'CANCELLED'];

export const MOVE_IN_STATUS_PATH: readonly MoveInStatus[] = [
  'REQUESTED',
  'VERIFIED',
  'SCHEDULED',
  'APPROVED',
  'IN_PROGRESS',
  'COMPLETED',
];
