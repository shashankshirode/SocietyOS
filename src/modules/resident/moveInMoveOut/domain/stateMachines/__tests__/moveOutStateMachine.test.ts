import type { MoveOutCommandKind, MoveOutStatus } from '../../types/moveOut.types';
import {
  applyMoveOutCommand,
  isMoveOutTerminalStatus,
  moveOutStatusPath,
} from '../moveOutStateMachine';
import {
  FACILITY_ACTOR,
  OTHER_RESIDENT_ACTOR,
  RESIDENT_ACTOR,
  SECRETARY_ACTOR,
  SYSTEM_ACTOR,
  SECURITY_ACTOR,
  SOCIETY_ADMIN_ACTOR,
  TREASURER_ACTOR,
  makeMoveOutCommand,
  makeMoveOutState,
} from './stateMachineFixtures';

describe('moveOutStateMachine', () => {
  it('declares the specified chain and marks only archive and cancellation as terminal', () => {
    expect(moveOutStatusPath()).toEqual([
      'REQUESTED',
      'CLEARANCE_CHECK',
      'READY',
      'APPROVED',
      'SIGNED',
      'ISSUED',
      'ACCESS_REVOKED',
      'OCCUPANCY_CLOSED',
      'ARCHIVED',
    ]);
    expect(isMoveOutTerminalStatus('OCCUPANCY_CLOSED')).toBe(false);
    expect(isMoveOutTerminalStatus('ARCHIVED')).toBe(true);
    expect(isMoveOutTerminalStatus('CANCELLED')).toBe(true);
    expect(isMoveOutTerminalStatus('ACCESS_REVOKED')).toBe(false);
  });

  it('rejects every command once the request is terminal', () => {
    for (const status of ['ARCHIVED', 'CANCELLED'] as const) {
      const outcome = applyMoveOutCommand(
        makeMoveOutState(status),
        makeMoveOutCommand({ kind: 'CANCEL', cancellationReasonKey: 'r' }),
      );
      expect(outcome.allowed).toBe(false);
      if (!outcome.allowed) {
        expect(outcome.violations.map((violation) => violation.code)).toContain('TERMINAL_STATE');
      }
    }
  });

  it('refuses to open a new command after the request has been cancelled but before archive', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('CANCELLED'),
      makeMoveOutCommand({
        kind: 'RECORD_CLEARANCE_SNAPSHOT',
        actor: TREASURER_ACTOR,
        clearanceSnapshotId: 'snap-1',
        settlementSnapshotId: 'settle-1',
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('TERMINAL_STATE');
    }
  });

  it('cannot jump straight from requested to ready', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('REQUESTED'),
      makeMoveOutCommand({
        kind: 'RECORD_CLEARANCE_SNAPSHOT',
        actor: TREASURER_ACTOR,
        clearanceSnapshotId: 'snap-1',
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations[0]?.code).toBe('ILLEGAL_TRANSITION');
    }
  });

  it('requires a clearance snapshot before recording ready', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('CLEARANCE_CHECK'),
      makeMoveOutCommand({ kind: 'RECORD_CLEARANCE_SNAPSHOT', actor: TREASURER_ACTOR }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain(
        'command.clearanceSnapshotId',
      );
    }
  });

  it('requires both a clearance snapshot and a settlement snapshot before recording an exception', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('CLEARANCE_CHECK'),
      makeMoveOutCommand({
        kind: 'RECORD_CLEARANCE_EXCEPTION',
        actor: TREASURER_ACTOR,
        clearanceSnapshotId: 'snap-1',
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain(
        'command.settlementSnapshotId',
      );
    }
  });

  it('requires a linked clearance snapshot and a recorded final settlement before granting approval', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('READY'),
      makeMoveOutCommand({ kind: 'GRANT_APPROVAL', actor: SECRETARY_ACTOR, approvalReference: 'a1' }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain(
        'command.clearanceSnapshotId',
      );
    }
  });

  it('refuses approval from a treasurer', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('READY'),
      makeMoveOutCommand({
        kind: 'GRANT_APPROVAL',
        actor: TREASURER_ACTOR,
        approvalReference: 'a1',
        clearanceSnapshotId: 'snap-1',
        settlementSnapshotId: 'settle-1',
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain(
        'ACTOR_NOT_AUTHORIZED',
      );
    }
  });

  it('re-enters clearance check from a rejected approval', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('REJECTED'),
      makeMoveOutCommand({ kind: 'BEGIN_CLEARANCE_CHECK', actor: TREASURER_ACTOR }),
    );
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStatus).toBe('CLEARANCE_CHECK');
    }
  });

  it('requires document checksum and signature method to record a signature', () => {
    for (const missing of ['signatureDocumentId', 'signatureDocumentChecksum', 'signatureMethod'] as const) {
      const outcome = applyMoveOutCommand(
        makeMoveOutState('APPROVED'),
        makeMoveOutCommand({ kind: 'RECORD_SIGNATURE', actor: SECRETARY_ACTOR, [missing]: undefined }),
      );
      expect(outcome.allowed).toBe(false);
      if (!outcome.allowed) {
        expect(outcome.violations.map((violation) => violation.field)).toContain(
          `command.${missing}`,
        );
      }
    }
  });

  it('requires a certificate id and a gate integration reference and a positive credential count', () => {
    const issuance = applyMoveOutCommand(
      makeMoveOutState('SIGNED'),
      makeMoveOutCommand({ kind: 'RECORD_ISSUANCE', actor: SECRETARY_ACTOR }),
    );
    expect(issuance.allowed).toBe(false);

    const revocation = applyMoveOutCommand(
      makeMoveOutState('ISSUED'),
      makeMoveOutCommand({
        kind: 'RECORD_ACCESS_REVOCATION',
        actor: SECURITY_ACTOR,
        credentialCount: 0,
        gateIntegrationReference: undefined,
      }),
    );
    expect(revocation.allowed).toBe(false);
    if (!revocation.allowed) {
      const fields = revocation.violations.map((violation) => violation.field);
      expect(fields).toContain('command.credentialCount');
      expect(fields).toContain('command.gateIntegrationReference');
    }
  });

  it('requires an occupancy end date before closing occupancy', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('ACCESS_REVOKED'),
      makeMoveOutCommand({ kind: 'RECORD_OCCUPANCY_CLOSURE', actor: SOCIETY_ADMIN_ACTOR }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain(
        'command.occupancyEndDate',
      );
    }
  });

  it('requires a retention policy and archive reference before archiving', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('OCCUPANCY_CLOSED'),
      makeMoveOutCommand({ kind: 'ARCHIVE', actor: SOCIETY_ADMIN_ACTOR }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      const fields = outcome.violations.map((violation) => violation.field);
      expect(fields).toContain('command.retentionPolicyKey');
      expect(fields).toContain('command.archiveReference');
    }
  });

  it('allows cancellation after approval but emits a stale prerequisite warning', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('APPROVED'),
      makeMoveOutCommand({
        kind: 'CANCEL',
        actor: RESIDENT_ACTOR,
        cancellationReasonKey: 'reason.withdrawn',
        cancellationReasonDetail: 'Staying on',
      }),
    );
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStatus).toBe('CANCELLED');
      expect(outcome.warnings.map((warning) => warning.code)).toContain('STALE_PREREQUISITE');
    }
  });

  it('refuses cancellation once the certificate is issued', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('ISSUED'),
      makeMoveOutCommand({
        kind: 'CANCEL',
        actor: RESIDENT_ACTOR,
        cancellationReasonKey: 'reason.withdrawn',
      }),
    );
    expect(outcome.allowed).toBe(false);
  });

  it('rejects a stale expected revision', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('CLEARANCE_CHECK', 9),
      makeMoveOutCommand({
        kind: 'RECORD_CLEARANCE_SNAPSHOT',
        actor: TREASURER_ACTOR,
        clearanceSnapshotId: 'snap-1',
        settlementSnapshotId: 'settle-1',
        expectedRevision: 5,
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('REVISION_MISMATCH');
    }
  });

  it('refuses a resident acting for a different unit', () => {
    const outcome = applyMoveOutCommand(
      makeMoveOutState('REQUESTED'),
      makeMoveOutCommand({
        kind: 'CANCEL',
        actor: OTHER_RESIDENT_ACTOR,
        cancellationReasonKey: 'r',
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('ACTOR_SCOPE_VIOLATION');
    }
  });

  it('walks the entire happy path and records every stage artifact', () => {
    let state = makeMoveOutState('REQUESTED');

    const steps: readonly (readonly [Parameters<typeof applyMoveOutCommand>[1]['kind'], string])[] = [
      ['BEGIN_CLEARANCE_CHECK', 'CLEARANCE_CHECK'],
      ['RECORD_CLEARANCE_SNAPSHOT', 'READY'],
      ['GRANT_APPROVAL', 'APPROVED'],
      ['RECORD_SIGNATURE', 'SIGNED'],
      ['RECORD_ISSUANCE', 'ISSUED'],
      ['RECORD_ACCESS_REVOCATION', 'ACCESS_REVOKED'],
      ['RECORD_OCCUPANCY_CLOSURE', 'OCCUPANCY_CLOSED'],
      ['ARCHIVE', 'ARCHIVED'],
    ];

    for (const [kind, expected] of steps) {
      const outcome = applyMoveOutCommand(
        state,
        makeMoveOutCommand({
          kind,
          expectedRevision: state.revision,
          actor:
            kind === 'RECORD_SIGNATURE' || kind === 'GRANT_APPROVAL' || kind === 'RECORD_ISSUANCE'
              ? SECRETARY_ACTOR
              : kind === 'RECORD_ACCESS_REVOCATION'
                ? SECURITY_ACTOR
                : kind === 'RECORD_CLEARANCE_SNAPSHOT' || kind === 'BEGIN_CLEARANCE_CHECK'
                  ? TREASURER_ACTOR
                  : SOCIETY_ADMIN_ACTOR,
          clearanceSnapshotId: 'snap-1',
          settlementSnapshotId: 'settle-1',
          approvalReference: 'approval-1',
          signatureDocumentId: 'doc-1',
          signatureDocumentChecksum: 'checksum-1',
          signatureMethod: 'DIGITAL',
          templateVersion: 'v1',
          nocCertificateId: 'noc-1',
          credentialCount: 3,
          gateIntegrationReference: 'gate-1',
          residenceAccessStatusBefore: 'ACTIVE',
          residenceAccessStatusAfter: 'ACCESS_REVOKED',
          occupancyEndDate: '2026-10-31',
          finalMeterReadingReference: 'meter-final-1',
          retentionPolicyKey: 'retention.moveOut',
          archiveReference: 'archive-1',
        }),
      );
      expect(outcome.allowed).toBe(true);
      if (outcome.allowed) {
        expect(outcome.toStatus).toBe(expected);
        state = outcome.state;
      }
    }

    expect(state.status).toBe('ARCHIVED');
    expect(state.clearanceSnapshotId).toBe('snap-1');
    expect(state.settlementSnapshotId).toBe('settle-1');
    expect(state.approvalReference).toBe('approval-1');
    expect(state.signature?.documentChecksum).toBe('checksum-1');
    expect(state.nocCertificateId).toBe('noc-1');
    expect(state.accessRevocation?.credentialCount).toBe(3);
    expect(state.accessRevocation?.residenceAccessStatusAfter).toBe('ACCESS_REVOKED');
    expect(state.occupancyClosure?.relationshipId).toBe('rel-1');
    expect(state.occupancyClosure?.finalMeterReadingReference).toBe('meter-final-1');
    expect(state.archiveRecord?.containsPersonalData).toBe(true);
    expect(state.revision).toBe(13);
  });

  it('still enforces scope and revision when cancelling after approval', () => {
    const foreign = applyMoveOutCommand(
      makeMoveOutState('APPROVED'),
      makeMoveOutCommand({
        kind: 'CANCEL',
        actor: OTHER_RESIDENT_ACTOR,
        cancellationReasonKey: 'r',
      }),
    );
    expect(foreign.allowed).toBe(false);
    if (!foreign.allowed) {
      expect(foreign.violations.map((violation) => violation.code)).toContain('ACTOR_SCOPE_VIOLATION');
    }

    const stale = applyMoveOutCommand(
      makeMoveOutState('APPROVED', 9),
      makeMoveOutCommand({
        kind: 'CANCEL',
        actor: RESIDENT_ACTOR,
        cancellationReasonKey: 'r',
        expectedRevision: 4,
      }),
    );
    expect(stale.allowed).toBe(false);
    if (!stale.allowed) {
      expect(stale.violations.map((violation) => violation.code)).toContain('REVISION_MISMATCH');
    }
  });

  it('refuses a facility manager to close occupancy', () => {
    const closure = applyMoveOutCommand(
      makeMoveOutState('ACCESS_REVOKED'),
      makeMoveOutCommand({
        kind: 'RECORD_OCCUPANCY_CLOSURE',
        actor: FACILITY_ACTOR,
        occupancyEndDate: '2026-10-31',
      }),
    );
    expect(closure.allowed).toBe(false);
    if (!closure.allowed) {
      expect(closure.violations.map((violation) => violation.code)).toContain(
        'ACTOR_NOT_AUTHORIZED',
      );
    }
  });

  it('refuses privileged operations to the SYSTEM actor', () => {
    const privileged: ReadonlyArray<readonly [MoveOutCommandKind, MoveOutStatus]> = [
      ['BEGIN_CLEARANCE_CHECK', 'REQUESTED'],
      ['RECORD_CLEARANCE_SNAPSHOT', 'CLEARANCE_CHECK'],
      ['RECORD_CLEARANCE_EXCEPTION', 'CLEARANCE_CHECK'],
      ['GRANT_APPROVAL', 'READY'],
      ['REJECT_APPROVAL', 'READY'],
      ['RECORD_SIGNATURE', 'APPROVED'],
      ['RECORD_ISSUANCE', 'SIGNED'],
    ];

    for (const [kind, status] of privileged) {
      const outcome = applyMoveOutCommand(
        makeMoveOutState(status),
        makeMoveOutCommand({ kind, actor: SYSTEM_ACTOR }),
      );
      expect(outcome.allowed).toBe(false);
      if (!outcome.allowed) {
        expect(outcome.violations.map((violation) => violation.code)).toContain(
          'ACTOR_NOT_AUTHORIZED',
        );
      }
    }
  });
});
