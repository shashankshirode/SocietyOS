import {
  isAccessTerminal,
  planAccessTransition,
  requiresCompensation,
  toOutcome,
} from '../accessTransitionEngine';
import type { IntegrationStatus } from '../../types/primitives';
import type { AccessTransitionRequest } from '../../types/access.types';
import {
  RESIDENT_ACTOR,
  SECURITY_ACTOR,
  SOCIETY_ADMIN_ACTOR,
  makeActor,
} from '../../stateMachines/__tests__/stateMachineFixtures';

const RESIDENT = RESIDENT_ACTOR;
const ADMIN = SOCIETY_ADMIN_ACTOR;
const SECURITY = SECURITY_ACTOR;

function activation(overrides: Partial<AccessTransitionRequest> = {}): AccessTransitionRequest {
  return {
    transitionId: 'at-1',
    subject: 'RESIDENT_ACTIVATION',
    intent: 'ACTIVATE_ON_MOVE_IN_COMPLETION',
    idempotencyKey: 'idem-1',
    requestedAt: '2026-10-01T10:00:00.000Z',
    requestedBy: RESIDENT,
    subjectResidentId: 'res-1',
    societyId: 'soc-1',
    unitId: 'unit-1',
    linkedRequestId: 'mi-1',
    credentialCount: 2,
    parkingAllocationAffected: false,
    residenceAccessStatusBefore: 'PENDING',
    gateIntegrationReference: undefined,
    ...overrides,
  };
}

function revocation(overrides: Partial<AccessTransitionRequest> = {}): AccessTransitionRequest {
  return {
    ...activation(),
    transitionId: 'at-2',
    subject: 'RESIDENT_REVOCATION',
    intent: 'REVOKE_ON_NOC_ISSUANCE',
    requestedBy: ADMIN,
    linkedRequestId: 'mo-1',
    residenceAccessStatusBefore: 'ACTIVE',
    ...overrides,
  };
}

const SESSIONS = ['sess-1', 'sess-2'];
const GATES = ['gate-map-1', 'gate-map-2'];

describe('accessTransitionEngine', () => {
  it('activates a credential and session on move-in completion', () => {
    const plan = planAccessTransition(activation(), 'INTEGRATED', [], []);
    expect(plan.status).toBe('SUCCEEDED');
    expect(plan.residenceAccessStatusAfter).toBe('ACTIVE');
    expect(plan.resources.map((resource) => resource.kind)).toEqual(['CREDENTIAL', 'SESSION']);
  });

  it('refuses activation requested by security, who may only revoke', () => {
    const plan = planAccessTransition(activation({ requestedBy: SECURITY }), 'INTEGRATED', [], []);
    expect(plan.status).toBe('PENDING');
    expect(plan.admitted.permitted).toBe(false);
    if (!plan.admitted.permitted) {
      expect(plan.admitted.denialKeys).toContain('access.activationRequiresResidentOrAdmin');
    }
  });

  it('refuses a resident revoking their own access', () => {
    const plan = planAccessTransition(revocation({ requestedBy: RESIDENT }), 'INTEGRATED', SESSIONS, GATES);
    expect(plan.admitted.permitted).toBe(false);
    if (!plan.admitted.permitted) {
      expect(plan.admitted.denialKeys).toContain('access.revocationRequiresAdminOrSecurity');
    }
  });

  it('invalidates every live session and gate mapping on revocation', () => {
    const plan = planAccessTransition(revocation(), 'INTEGRATED', SESSIONS, GATES);
    expect(plan.status).toBe('SUCCEEDED');
    expect(plan.residenceAccessStatusAfter).toBe('REVOKED');
    expect(plan.resources.filter((resource) => resource.kind === 'SESSION')).toHaveLength(2);
    expect(plan.resources.filter((resource) => resource.kind === 'GATE_MAPPING')).toHaveLength(2);
    expect(plan.resources.every((resource) => resource.state === 'REVOKED')).toBe(true);
  });

  it('refuses to complete a revocation while the gate integration is unavailable', () => {
    const plan = planAccessTransition(revocation(), 'MOCK_ONLY', SESSIONS, GATES);
    expect(plan.status).toBe('COMPENSATION_REQUIRED');
    expect(plan.retryable).toBe(true);
    expect(requiresCompensation(plan.status)).toBe(true);
    expect(plan.resources.filter((resource) => resource.state === 'REVOKED').length).toBeGreaterThan(0);
    expect(plan.resources.filter((resource) => resource.state === 'FAILED').length).toBe(2);
  });

  it('never reports a successful revocation while gate mappings survive', () => {
    const plan = planAccessTransition(revocation(), 'NOT_AVAILABLE', SESSIONS, GATES);
    expect(plan.status).not.toBe('SUCCEEDED');
    expect(plan.residenceAccessStatusAfter).toBe('SUSPENDED');
  });

  it('treats an api-ready but unwired gate as a blocked revocation, not a success', () => {
    const plan = planAccessTransition(revocation(), 'LOCAL_ONLY', SESSIONS, GATES);
    expect(plan.status).toBe('COMPENSATION_REQUIRED');
  });

  it('refuses a resident scoped to another unit', () => {
    const plan = planAccessTransition(
      activation({ requestedBy: makeActor('RESIDENT', { onBehalfOfResidentId: 'res-3', unitId: 'unit-9' }) }),
      'INTEGRATED',
      [],
      [],
    );
    expect(plan.violations.map((violation) => violation.code)).toContain('SCOPE_MISMATCH');
    expect(plan.status).toBe('PENDING');
  });

  it('refuses an actor from another society', () => {
    const plan = planAccessTransition(
      activation({ requestedBy: makeActor('SOCIETY_ADMIN', { societyId: 'soc-9' }) }),
      'INTEGRATED',
      [],
      [],
    );
    expect(plan.violations.map((violation) => violation.code)).toContain('SCOPE_MISMATCH');
  });

  it('requires an idempotency key and a linked request', () => {
    const plan = planAccessTransition(
      activation({ idempotencyKey: '', linkedRequestId: '' }),
      'INTEGRATED',
      [],
      [],
    );
    expect(plan.admitted.permitted).toBe(false);
    if (!plan.admitted.permitted) {
      expect(plan.admitted.denialKeys).toContain('access.idempotencyKeyRequired');
      expect(plan.admitted.denialKeys).toContain('access.linkedRequestRequired');
    }
  });

  it('warns when a parking allocation is affected so it is not silently dropped', () => {
    const plan = planAccessTransition(
      revocation({ parkingAllocationAffected: true }),
      'INTEGRATED',
      SESSIONS,
      GATES,
    );
    expect(plan.admitted.permitted).toBe(true);
    if (plan.admitted.permitted) {
      expect(plan.admitted.warnings).toContain('access.parkingAllocationRequiresReassignment');
    }
  });

  it('warns when activation would issue no credential at all', () => {
    const plan = planAccessTransition(activation({ credentialCount: 0 }), 'INTEGRATED', [], []);
    if (plan.admitted.permitted) {
      expect(plan.admitted.warnings).toContain('access.activationWithoutCredential');
    }
  });

  it('projects the plan onto the auditable outcome shape', () => {
    const outcome = toOutcome(planAccessTransition(revocation(), 'INTEGRATED', SESSIONS, GATES));
    expect(outcome.intent).toBe('REVOKE_ON_NOC_ISSUANCE');
    expect(outcome.status).toBe('SUCCEEDED');
    expect(outcome.completedAt).toBe('2026-10-01T10:00:00.000Z');
    expect(outcome.failureCode).toBeUndefined();
    expect(outcome.failureDetailKey).toBeUndefined();
  });

  it('marks compensation as non terminal so it is retried rather than forgotten', () => {
    const plan = planAccessTransition(revocation(), 'MOCK_ONLY', SESSIONS, GATES);
    expect(isAccessTerminal(plan.status)).toBe(false);
    expect(plan.retryable).toBe(true);
    expect(plan.attemptCount).toBe(1);
  });

  it('accepts a partially integrated gate when mappings are declared unavailable', () => {
    const plan = planAccessTransition(revocation(), 'API_READY', SESSIONS, []);
    expect(plan.status).toBe('SUCCEEDED');
  });

  it('keeps the full integration status on the outcome for honest reporting', () => {
    for (const status of ['INTEGRATED', 'PARTIAL', 'MOCK_ONLY'] as const satisfies readonly IntegrationStatus[]) {
      const plan = planAccessTransition(revocation(), status, SESSIONS, GATES);
      expect(plan.integrationStatus).toBe(status);
    }
  });
});
