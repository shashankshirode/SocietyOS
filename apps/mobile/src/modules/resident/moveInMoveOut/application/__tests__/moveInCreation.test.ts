import { auditService } from '../../../../../core/audit/auditService';
import type { AuditLogEntry } from '../../../../../core/audit/audit.types';
import { createInMemoryMoveInService, type CreateMoveInInput } from '../moveInService';
import {
  RESIDENT_ACTOR,
  SOCIETY_ADMIN_ACTOR,
  TEST_NOW,
  TEST_RELATIONSHIP_ID,
  TEST_RESIDENT_ID,
  TEST_SOCIETY_ID,
  TEST_UNIT_ID,
  makeMoveInCommand,
  makeVerificationChecks,
} from '../../domain/stateMachines/__tests__/stateMachineFixtures';

function captureAudit(): { readonly entries: () => readonly AuditLogEntry[]; readonly stop: () => void } {
  const seen: AuditLogEntry[] = [];
  const unsubscribe = auditService.onLog((entry) => seen.push(entry));
  return { entries: () => seen, stop: unsubscribe };
}

const CREATE_INPUT: CreateMoveInInput = {
  moveInRequestId: 'mi-new-1',
  requestNumber: 'MIR-0099',
  scope: {
    societyId: TEST_SOCIETY_ID,
    unitId: TEST_UNIT_ID,
    residentId: TEST_RESIDENT_ID,
    occupancyRelationshipId: TEST_RELATIONSHIP_ID,
  },
  relationshipType: 'OWNER',
  occupancyStartDate: '2026-11-01',
  partyCount: 2,
  vehicleCount: 1,
  requiresLiftSlot: true,
  requiresParking: false,
  createdAt: TEST_NOW,
};

function submitCommand(idempotencyKey: string) {
  return makeMoveInCommand({
    kind: 'SUBMIT_REQUEST',
    actor: RESIDENT_ACTOR,
    idempotencyKey,
    expectedRevision: 0,
  });
}

describe('move in aggregate creation', () => {
  it('creates a new aggregate at revision zero in the requested status', () => {
    const service = createInMemoryMoveInService();
    const audit = captureAudit();

    const outcome = service.create(submitCommand('create-1'), CREATE_INPUT);
    audit.stop();

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.state.status).toBe('REQUESTED');
      expect(outcome.state.revision).toBe(0);
      expect(outcome.state.moveInRequestId).toBe('mi-new-1');
      expect(outcome.state.requestNumber).toBe('MIR-0099');
      expect(outcome.fromStatus).toBe('NONE');
      expect(outcome.toStatus).toBe('REQUESTED');
    }
  });

  it('persists the created aggregate so it can be dispatched afterwards', () => {
    const service = createInMemoryMoveInService();

    const created = service.create(submitCommand('create-1'), CREATE_INPUT);
    expect(created.ok).toBe(true);

    const stored = service.store.read('mi-new-1');
    expect(stored?.status).toBe('REQUESTED');
    expect(stored?.revision).toBe(0);
  });

  it('carries the submitted scope and occupancy details into the initial state', () => {
    const service = createInMemoryMoveInService();

    const outcome = service.create(submitCommand('create-1'), CREATE_INPUT);

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.state.scope.societyId).toBe(TEST_SOCIETY_ID);
      expect(outcome.state.scope.unitId).toBe(TEST_UNIT_ID);
      expect(outcome.state.relationshipType).toBe('OWNER');
      expect(outcome.state.occupancyStartDate).toBe('2026-11-01');
      expect(outcome.state.partyCount).toBe(2);
      expect(outcome.state.vehicleCount).toBe(1);
      expect(outcome.state.requiresLiftSlot).toBe(true);
      expect(outcome.state.requiresParking).toBe(false);
      expect(outcome.state.createdAt).toBe(TEST_NOW);
    }
  });

  it('starts with no verification, appointment, execution or cancellation', () => {
    const service = createInMemoryMoveInService();

    const outcome = service.create(submitCommand('create-1'), CREATE_INPUT);

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.state.verificationOutcome).toBeUndefined();
      expect(outcome.state.verificationException).toBeUndefined();
      expect(outcome.state.appointmentId).toBeUndefined();
      expect(outcome.state.approvalReference).toBeUndefined();
      expect(outcome.state.execution).toBeUndefined();
      expect(outcome.state.cancellation).toBeUndefined();
      expect(outcome.state.verificationChecklist).toEqual([]);
    }
  });

  it('audits the creation as a move in request created event', () => {
    const service = createInMemoryMoveInService();
    const audit = captureAudit();

    service.create(submitCommand('create-1'), CREATE_INPUT);
    audit.stop();

    const logged = audit.entries();
    expect(logged).toHaveLength(1);
    expect(logged[0]?.metadata?.eventType).toBe('MOVE_IN_REQUEST_CREATED');
    expect(logged[0]?.action).toBe('CREATE');
    expect(logged[0]?.outcome).toBe('SUCCESS');
    expect(logged[0]?.entityId).toBe('mi-new-1');
  });

  it('records the idempotency key so a replay is refused', () => {
    const service = createInMemoryMoveInService();
    const first = service.create(submitCommand('create-1'), CREATE_INPUT);
    expect(first.ok).toBe(true);
    const audit = captureAudit();

    const replay = service.create(submitCommand('create-1'), CREATE_INPUT);
    audit.stop();

    expect(replay.ok).toBe(false);
    if (!replay.ok) {
      expect(replay.violations[0]?.code).toBe('IDEMPOTENCY_KEY_REPLAY');
      expect(replay.violations[0]?.field).toBe('command.idempotencyKey');
    }
  });

  it('refuses to create the same aggregate id twice with a different key', () => {
    const service = createInMemoryMoveInService();
    expect(service.create(submitCommand('create-1'), CREATE_INPUT).ok).toBe(true);

    const duplicate = service.create(submitCommand('create-2'), CREATE_INPUT);

    expect(duplicate.ok).toBe(false);
    if (!duplicate.ok) {
      expect(duplicate.violations[0]?.code).toBe('IDEMPOTENCY_KEY_CONFLICT');
    }
  });

  it('audits a rejected creation attempt', () => {
    const service = createInMemoryMoveInService();
    expect(service.create(submitCommand('create-1'), CREATE_INPUT).ok).toBe(true);
    const audit = captureAudit();

    service.create(submitCommand('create-2'), CREATE_INPUT);
    audit.stop();

    const logged = audit.entries();
    expect(logged).toHaveLength(1);
    expect(logged[0]?.outcome).toBe('FAILURE');
    expect(logged[0]?.action).toBe('REJECT');
  });

  it('continues into the normal dispatch flow after creation', () => {
    const service = createInMemoryMoveInService();
    const created = service.create(submitCommand('create-1'), CREATE_INPUT);
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    const verified = service.dispatch(
      makeMoveInCommand({
        kind: 'RECORD_VERIFICATION_PASSED',
        actor: SOCIETY_ADMIN_ACTOR,
        idempotencyKey: 'verify-1',
        expectedRevision: 0,
        verificationChecks: makeVerificationChecks(),
      }),
      created.state,
    );

    expect(verified.ok).toBe(true);
    if (verified.ok) {
      expect(verified.fromStatus).toBe('REQUESTED');
      expect(verified.toStatus).toBe('VERIFIED');
      expect(service.store.read('mi-new-1')?.revision).toBe(1);
    }
  });
});
