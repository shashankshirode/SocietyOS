import { applyMoveInCommand, isMoveInTerminalStatus, moveInStatusPath } from '../moveInStateMachine';
import type { MoveInCommand } from '../../types/moveIn.types';
import {
  FACILITY_ACTOR,
  OTHER_RESIDENT_ACTOR,
  RESIDENT_ACTOR,
  SYSTEM_ACTOR,
  SECRETARY_ACTOR,
  SOCIETY_ADMIN_ACTOR,
  makeMoveInCommand,
  makeMoveInState,
  makeVerificationChecks,
} from './stateMachineFixtures';

const EXCEPTION_FIXTURE = {
  raisedAt: '2026-09-26T10:00:00.000Z',
  reasonKey: 'reason.identityUnverified',
  reasonDetail: 'Aadhaar unreadable',
  raisedByActorId: 'actor-SOCIETY_ADMIN',
  approvedAt: undefined,
  approvedByActorId: undefined,
  approvalReference: undefined,
};

describe('moveInStateMachine', () => {
  it('declares the specified forward path and treats completed and cancelled as terminal', () => {
    expect(moveInStatusPath()).toEqual([
      'REQUESTED',
      'VERIFIED',
      'SCHEDULED',
      'APPROVED',
      'IN_PROGRESS',
      'COMPLETED',
    ]);
    expect(isMoveInTerminalStatus('COMPLETED')).toBe(true);
    expect(isMoveInTerminalStatus('CANCELLED')).toBe(true);
    expect(isMoveInTerminalStatus('IN_PROGRESS')).toBe(false);
  });

  it('rejects every command once the request is terminal', () => {
    for (const status of ['COMPLETED', 'CANCELLED'] as const) {
      const outcome = applyMoveInCommand(
        makeMoveInState(status),
        makeMoveInCommand({ kind: 'CANCEL', cancellationReasonKey: 'r', expectedRevision: 3 }),
      );
      expect(outcome.allowed).toBe(false);
      if (!outcome.allowed) {
        expect(outcome.violations.map((violation) => violation.code)).toContain('TERMINAL_STATE');
      }
    }
  });

  it('advances requested to verified only when every mandatory check is satisfied', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: SOCIETY_ADMIN_ACTOR,
        verificationChecks: makeVerificationChecks(),
      }),
    );
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStatus).toBe('VERIFIED');
      expect(outcome.state.revision).toBe(4);
      expect(outcome.state.verificationOutcome).toBe('PASSED');
      expect(outcome.state.verificationChecklist).toHaveLength(7);
    }
  });

  it('blocks verification while any check is unresolved', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: SOCIETY_ADMIN_ACTOR,
        verificationChecks: makeVerificationChecks({ POLICE_VERIFICATION: 'FAIL' }),
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain(
        'verification.POLICE_VERIFICATION',
      );
    }
  });

  it('blocks verification when checks are entirely absent', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: SOCIETY_ADMIN_ACTOR,
        verificationChecks: [],
      }),
    );
    expect(outcome.allowed).toBe(false);
  });

  it('treats a not applicable check as satisfying verification', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: SOCIETY_ADMIN_ACTOR,
        verificationChecks: makeVerificationChecks({ DUES_CLEARANCE_CHECK: 'NOT_APPLICABLE' }),
      }),
    );
    expect(outcome.allowed).toBe(true);
  });

  it('does not treat a not evaluated check as satisfying verification', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: SOCIETY_ADMIN_ACTOR,
        verificationChecks: makeVerificationChecks({ NO_BLOCKING_COMPLAINT: 'NOT_EVALUATED' }),
      }),
    );
    expect(outcome.allowed).toBe(false);
  });

  it('routes a failed verification into a recoverable exception rather than cancelling', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_FAILED',
        actor: SOCIETY_ADMIN_ACTOR,
        verificationChecks: makeVerificationChecks({ IDENTITY_PROOF: 'FAIL' }),
        verificationFailureReasonKey: 'reason.identityUnverified',
        verificationFailureReasonDetail: 'Aadhaar unreadable',
      }),
    );
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStatus).toBe('EXCEPTION');
      expect(outcome.state.verificationOutcome).toBe('FAILED');
      expect(outcome.state.verificationException?.reasonKey).toBe('reason.identityUnverified');
      expect(outcome.state.verificationException?.approvedAt).toBeUndefined();
      expect(outcome.state.cancellation).toBeUndefined();
    }
  });

  it('does not treat an exception as terminal so it can be approved back into review', () => {
    expect(isMoveInTerminalStatus('EXCEPTION')).toBe(false);
  });

  it('recovers an exception into verified once an approver signs it off', () => {
    const raised = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_FAILED',
        actor: SOCIETY_ADMIN_ACTOR,
        verificationChecks: makeVerificationChecks({ IDENTITY_PROOF: 'FAIL' }),
        verificationFailureReasonKey: 'reason.identityUnverified',
        verificationFailureReasonDetail: 'Aadhaar unreadable',
      }),
    );
    expect(raised.allowed).toBe(true);
    if (!raised.allowed) {
      return;
    }

    const approved = applyMoveInCommand(
      raised.state,
      makeMoveInCommand({
        kind: 'APPROVE_VERIFICATION_EXCEPTION',
        actor: SOCIETY_ADMIN_ACTOR,
        expectedRevision: raised.state.revision,
        verificationExceptionApprovalReference: 'approval-exc-1',
        verificationChecks: makeVerificationChecks({ IDENTITY_PROOF: 'PASS' }),
      }),
    );
    expect(approved.allowed).toBe(true);
    if (approved.allowed) {
      expect(approved.toStatus).toBe('VERIFIED');
      expect(approved.state.verificationOutcome).toBe('PASSED');
      expect(approved.state.verificationException?.approvedByActorId).toBe(SOCIETY_ADMIN_ACTOR.actorId);
      expect(approved.state.verificationException?.approvalReference).toBe('approval-exc-1');
      expect(approved.state.verificationException?.reasonKey).toBe('reason.identityUnverified');
    }
  });

  it('keeps the raised reason auditable after the exception is approved', () => {
    const raised = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_FAILED',
        actor: SOCIETY_ADMIN_ACTOR,
        verificationChecks: makeVerificationChecks({ IDENTITY_PROOF: 'FAIL' }),
        verificationFailureReasonKey: 'reason.identityUnverified',
        verificationFailureReasonDetail: 'Aadhaar unreadable',
      }),
    );
    expect(raised.allowed).toBe(true);
    if (!raised.allowed) {
      return;
    }
    const approved = applyMoveInCommand(
      raised.state,
      makeMoveInCommand({
        kind: 'APPROVE_VERIFICATION_EXCEPTION',
        actor: SOCIETY_ADMIN_ACTOR,
        expectedRevision: raised.state.revision,
        verificationExceptionApprovalReference: 'approval-exc-1',
        verificationChecks: makeVerificationChecks({ IDENTITY_PROOF: 'PASS' }),
      }),
    );
    expect(approved.allowed).toBe(true);
    if (approved.allowed) {
      expect(approved.state.verificationException?.reasonDetail).toBe('Aadhaar unreadable');
    }
  });

  it('refuses a system actor approving a verification exception', () => {
    const outcome = applyMoveInCommand(
      { ...makeMoveInState('EXCEPTION'), verificationException: EXCEPTION_FIXTURE },
      makeMoveInCommand({
        kind: 'APPROVE_VERIFICATION_EXCEPTION',
        actor: SYSTEM_ACTOR,
        verificationExceptionApprovalReference: 'approval-exc-1',
        verificationChecks: makeVerificationChecks({ IDENTITY_PROOF: 'PASS' }),
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('ACTOR_NOT_AUTHORIZED');
    }
  });

  it('requires an approval reference to clear a verification exception', () => {
    const outcome = applyMoveInCommand(
      { ...makeMoveInState('EXCEPTION'), verificationException: EXCEPTION_FIXTURE },
      makeMoveInCommand({
        kind: 'APPROVE_VERIFICATION_EXCEPTION',
        actor: SOCIETY_ADMIN_ACTOR,
        verificationChecks: makeVerificationChecks({ IDENTITY_PROOF: 'PASS' }),
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain(
        'command.verificationExceptionApprovalReference',
      );
    }
  });

  it('still allows a resident to cancel out of an exception', () => {
    const outcome = applyMoveInCommand(
      { ...makeMoveInState('EXCEPTION'), verificationException: EXCEPTION_FIXTURE },
      makeMoveInCommand({
        kind: 'CANCEL',
        actor: RESIDENT_ACTOR,
        cancellationReasonKey: 'reason.residentWithdrew',
        cancellationReasonDetail: 'Resident withdrew the application',
      }),
    );
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStatus).toBe('CANCELLED');
    }
  });

  it('requires a failure reason before a verification can fail', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_FAILED',
        actor: SOCIETY_ADMIN_ACTOR,
        verificationChecks: makeVerificationChecks({ IDENTITY_PROOF: 'FAIL' }),
      }),
    );
    expect(outcome.allowed).toBe(false);
  });

  it('walks the full happy path from requested to completed', () => {
    let state = makeMoveInState('REQUESTED');
    const steps: readonly (readonly [MoveInCommand['kind'], MoveInStateStatus, typeof SOCIETY_ADMIN_ACTOR])[] = [
      ['RECORD_VERIFICATION_PASSED', 'VERIFIED', SOCIETY_ADMIN_ACTOR],
      ['CONFIRM_APPOINTMENT', 'SCHEDULED', SOCIETY_ADMIN_ACTOR],
      ['GRANT_APPROVAL', 'APPROVED', SECRETARY_ACTOR],
      ['BEGIN_EXECUTION', 'IN_PROGRESS', FACILITY_ACTOR],
      ['COMPLETE_EXECUTION', 'COMPLETED', FACILITY_ACTOR],
    ];

    for (const [kind, expected, actor] of steps) {
      const outcome = applyMoveInCommand(
        state,
        makeMoveInCommand({
          kind,
          actor,
          expectedRevision: state.revision,
          appointmentId: 'appt-1',
          approvalReference: 'approval-1',
          verificationChecks: kind === 'RECORD_VERIFICATION_PASSED' ? makeVerificationChecks() : [],
          keyHandedOverAt: '2026-10-01T09:00:00.000Z',
          meterReadingReference: 'meter-1',
          accessActivationReference: 'access-1',
          possessionsMovedCount: 12,
        }),
      );
      expect(outcome.allowed).toBe(true);
      if (outcome.allowed) {
        expect(outcome.toStatus).toBe(expected);
        state = outcome.state;
      }
    }

    expect(state.status).toBe('COMPLETED');
    expect(state.appointmentId).toBe('appt-1');
    expect(state.approvalReference).toBe('approval-1');
    expect(state.execution?.completedAt).toBeDefined();
    expect(state.execution?.accessActivationReference).toBe('access-1');
  });

  it('refuses to skip verification when scheduling directly', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({ kind: 'CONFIRM_APPOINTMENT', actor: SECRETARY_ACTOR, appointmentId: 'a' }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations[0]?.code).toBe('ILLEGAL_TRANSITION');
    }
  });

  it('refuses to skip scheduling when approving directly', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('VERIFIED'),
      makeMoveInCommand({ kind: 'GRANT_APPROVAL', actor: SECRETARY_ACTOR, approvalReference: 'a' }),
    );
    expect(outcome.allowed).toBe(false);
  });

  it('requires an appointment reference before scheduling', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('VERIFIED'),
      makeMoveInCommand({ kind: 'CONFIRM_APPOINTMENT', actor: SECRETARY_ACTOR }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain(
        'command.appointmentId',
      );
    }
  });

  it('requires key handover meter reading and access activation to complete execution', () => {
    for (const missing of ['keyHandedOverAt', 'meterReadingReference', 'accessActivationReference'] as const) {
      const outcome = applyMoveInCommand(
        makeMoveInState('IN_PROGRESS'),
        makeMoveInCommand({ kind: 'COMPLETE_EXECUTION', actor: FACILITY_ACTOR, [missing]: undefined }),
      );
      expect(outcome.allowed).toBe(false);
      if (!outcome.allowed) {
        expect(outcome.violations.map((violation) => violation.field)).toContain(
          `command.${missing}`,
        );
      }
    }
  });

  it('rejects a stale expected revision', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('VERIFIED', 7),
      makeMoveInCommand({
        kind: 'CONFIRM_APPOINTMENT',
        actor: SECRETARY_ACTOR,
        appointmentId: 'appt-1',
        expectedRevision: 3,
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('REVISION_MISMATCH');
    }
  });

  it('refuses approval by a resident', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('SCHEDULED'),
      makeMoveInCommand({ kind: 'GRANT_APPROVAL', actor: RESIDENT_ACTOR, approvalReference: 'a' }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain(
        'ACTOR_NOT_AUTHORIZED',
      );
    }
  });

  it('refuses a resident acting for a different unit', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({ kind: 'CANCEL', actor: OTHER_RESIDENT_ACTOR, cancellationReasonKey: 'r' }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('ACTOR_SCOPE_VIOLATION');
    }
  });

  it('refuses an actor from a different society', () => {
    const foreignAdmin = { ...SOCIETY_ADMIN_ACTOR, societyId: 'soc-other' };
    const outcome = applyMoveInCommand(
      makeMoveInState('REQUESTED'),
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: foreignAdmin,
        verificationChecks: makeVerificationChecks(),
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain('actor.societyId');
    }
  });

  it('refuses a system actor for privileged verification approval and revocation', () => {
    const systemActor = { ...SOCIETY_ADMIN_ACTOR, actorId: 'actor-system', actorType: 'SYSTEM' } as const;
    const privileged: readonly MoveInCommand['kind'][] = [
      'RECORD_VERIFICATION_PASSED',
      'RECORD_VERIFICATION_FAILED',
      'GRANT_APPROVAL',
      'REVOKE_APPROVAL',
    ];

    for (const kind of privileged) {
      const outcome = applyMoveInCommand(
        makeMoveInState(kind === 'GRANT_APPROVAL' ? 'SCHEDULED' : kind === 'REVOKE_APPROVAL' ? 'APPROVED' : 'REQUESTED'),
        makeMoveInCommand({
          kind,
          actor: systemActor,
          verificationChecks: makeVerificationChecks(),
          approvalReference: 'a1',
          cancellationReasonKey: 'r',
        }),
      );
      expect(outcome.allowed).toBe(false);
      if (!outcome.allowed) {
        expect(outcome.violations.map((violation) => violation.code)).toContain(
          'ACTOR_NOT_AUTHORIZED',
        );
      }
    }
  });

  it('revokes approval by cancelling and clearing the approval reference', () => {
    const outcome = applyMoveInCommand(
      makeMoveInState('APPROVED'),
      makeMoveInCommand({
        kind: 'REVOKE_APPROVAL',
        actor: SECRETARY_ACTOR,
        cancellationReasonKey: 'reason.approvalWithdrawn',
        cancellationReasonDetail: 'Committee deferred',
      }),
    );
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStatus).toBe('CANCELLED');
      expect(outcome.state.approvalReference).toBeUndefined();
    }
  });

  it('preserves the execution start record when execution completes', () => {
    const started = applyMoveInCommand(
      makeMoveInState('APPROVED'),
      makeMoveInCommand({ kind: 'BEGIN_EXECUTION', actor: FACILITY_ACTOR, possessionsMovedCount: 3 }),
    );
    expect(started.allowed).toBe(true);
    if (!started.allowed) {
      return;
    }
    const completed = applyMoveInCommand(
      started.state,
      makeMoveInCommand({
        kind: 'COMPLETE_EXECUTION',
        actor: FACILITY_ACTOR,
        expectedRevision: started.state.revision,
        keyHandedOverAt: '2026-10-01T09:00:00.000Z',
        meterReadingReference: 'meter-1',
        accessActivationReference: 'access-1',
      }),
    );
    expect(completed.allowed).toBe(true);
    if (completed.allowed) {
      expect(completed.state.execution?.startedByActorId).toBe(started.state.execution?.startedByActorId);
      expect(completed.state.execution?.possessionsMovedCount).toBe(3);
      expect(completed.state.execution?.completedByActorId).toBe(FACILITY_ACTOR.actorId);
    }
  });
});

type MoveInStateStatus = ReturnType<typeof moveInStatusPath>[number];
