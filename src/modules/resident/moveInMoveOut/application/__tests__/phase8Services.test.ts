import { auditService } from '../../../../../core/audit/auditService';
import type { AuditLogEntry } from '../../../../../core/audit/audit.types';
import { createInMemoryMoveInService } from '../moveInService';
import { createInMemoryMoveOutService } from '../moveOutService';
import {
  RESIDENT_ACTOR,
  SOCIETY_ADMIN_ACTOR,
  makeMoveInCommand,
  makeMoveInState,
  makeMoveOutCommand,
  makeMoveOutState,
  makeVerificationChecks,
} from '../../domain/stateMachines/__tests__/stateMachineFixtures';

function captureAudit(): { readonly entries: () => readonly AuditLogEntry[]; readonly stop: () => void } {
  const seen: AuditLogEntry[] = [];
  const unsubscribe = auditService.onLog((entry) => seen.push(entry));
  return { entries: () => seen, stop: unsubscribe };
}

describe('phase 8 application services', () => {
  it('commits a move in command through the guard and audits it', () => {
    const state = makeMoveInState('REQUESTED');
    const service = createInMemoryMoveInService([state]);
    const audit = captureAudit();

    const outcome = service.dispatch(
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: SOCIETY_ADMIN_ACTOR,
        expectedRevision: state.revision,
        verificationChecks: makeVerificationChecks(),
      }),
      state,
    );
    audit.stop();

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.fromStatus).toBe('REQUESTED');
      expect(outcome.toStatus).toBe('VERIFIED');
    }
    const logged = audit.entries();
    expect(logged).toHaveLength(1);
    expect(logged[0]?.metadata?.eventType).toBe('MOVE_IN_REQUEST_CREATED');
    expect(logged[0]?.outcome).toBe('SUCCESS');
    expect(logged[0]?.action).toBe('VERIFY');
  });

  it('rejects a replayed idempotency key without applying it twice', () => {
    const state = makeMoveInState('REQUESTED');
    const service = createInMemoryMoveInService([state]);
    const command = makeMoveInCommand({
      kind: 'RECORD_VERIFICATION_PASSED',
      actor: SOCIETY_ADMIN_ACTOR,
      expectedRevision: state.revision,
      verificationChecks: makeVerificationChecks(),
    });

    const first = service.dispatch(command, state);
    const second = service.dispatch(command, state);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.reason).toBe('REPLAY');
    }
  });

  it('rejects a stale revision and reports the actual one', () => {
    const state = makeMoveInState('REQUESTED');
    const service = createInMemoryMoveInService([state]);

    const outcome = service.dispatch(
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: SOCIETY_ADMIN_ACTOR,
        expectedRevision: state.revision + 5,
        verificationChecks: makeVerificationChecks(),
      }),
      state,
    );

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.reason).toBe('STALE_REVISION');
      expect(outcome.actualRevision).toBe(state.revision);
    }
  });

  it('audits a domain rejection as a failure rather than a success', () => {
    const state = makeMoveInState('REQUESTED');
    const service = createInMemoryMoveInService([state]);
    const audit = captureAudit();

    const outcome = service.dispatch(
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: RESIDENT_ACTOR,
        expectedRevision: state.revision,
        verificationChecks: makeVerificationChecks(),
      }),
      state,
    );
    audit.stop();

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.reason).toBe('DOMAIN_REJECTED');
    }
    const logged = audit.entries();
    expect(logged).toHaveLength(1);
    expect(logged[0]?.outcome).toBe('FAILURE');
    expect(logged[0]?.error?.code).toBe('ACTOR_NOT_AUTHORIZED');
  });

  it('routes a verification exception to its own audit event', () => {
    const state = makeMoveInState('REQUESTED');
    const service = createInMemoryMoveInService([state]);
    const audit = captureAudit();

    const outcome = service.dispatch(
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_FAILED',
        actor: SOCIETY_ADMIN_ACTOR,
        expectedRevision: state.revision,
        verificationChecks: makeVerificationChecks({ IDENTITY_PROOF: 'FAIL' }),
        verificationFailureReasonKey: 'reason.identityUnverified',
        verificationFailureReasonDetail: 'unreadable',
      }),
      state,
    );
    audit.stop();

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.toStatus).toBe('EXCEPTION');
    }
    expect(audit.entries()[0]?.metadata?.eventType).toBe('MOVE_IN_VERIFICATION_EXCEPTION_RAISED');
  });

  it('refuses to move a move out request that does not exist in the store', () => {
    const service = createInMemoryMoveInService([]);
    const state = makeMoveInState('REQUESTED');
    const outcome = service.dispatch(
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: SOCIETY_ADMIN_ACTOR,
        expectedRevision: state.revision,
        verificationChecks: makeVerificationChecks(),
      }),
      state,
    );
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.reason).toBe('MISSING');
    }
  });

  it('archives a move out request under the archive audit action', () => {
    const state = makeMoveOutState('OCCUPANCY_CLOSED');
    const service = createInMemoryMoveOutService([state]);
    const audit = captureAudit();

    const outcome = service.dispatch(
      makeMoveOutCommand({
        kind: 'ARCHIVE',
        actor: SOCIETY_ADMIN_ACTOR,
        expectedRevision: state.revision,
        retentionPolicyKey: 'policy.retention-7y',
        archiveReference: 'archive/mo-1',
        containsPersonalData: true,
      }),
      state,
    );
    audit.stop();

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.toStatus).toBe('ARCHIVED');
    }
    const logged = audit.entries();
    expect(logged[0]?.metadata?.eventType).toBe('MOVE_OUT_ARCHIVED');
    expect(logged[0]?.action).toBe('ARCHIVE');
  });

  it('records access revocation as its own auditable event', () => {
    const state = makeMoveOutState('ISSUED');
    const service = createInMemoryMoveOutService([state]);
    const audit = captureAudit();

    const outcome = service.dispatch(
      makeMoveOutCommand({
        kind: 'RECORD_ACCESS_REVOCATION',
        actor: SOCIETY_ADMIN_ACTOR,
        expectedRevision: state.revision,
        credentialCount: 2,
        gateIntegrationReference: 'gate-sync-1',
        residenceAccessStatusBefore: 'ACTIVE',
        residenceAccessStatusAfter: 'REVOKED',
      }),
      state,
    );
    audit.stop();

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.toStatus).toBe('ACCESS_REVOKED');
    }
    expect(audit.entries()[0]?.metadata?.eventType).toBe('MOVE_OUT_ACCESS_REVOKED');
  });
});
