import { auditService } from '../../../../../core/audit/auditService';
import type { AuditLogEntry } from '../../../../../core/audit/audit.types';
import { createInMemoryNocService } from '../nocService';
import { createInMemorySettlementService } from '../settlementService';
import { createClearanceService } from '../clearanceService';
import { createAccessService } from '../accessService';
import type { NocCommand, NocRequestState, NocStatus } from '../../domain/types/noc.types';
import type {
  SettlementStageCommand,
  SettlementStageState,
} from '../../domain/stateMachines/settlementStageMachine';
import type { LifecycleActor, LifecycleActorType } from '../../domain/types/primitives';
import type { ClearanceEvaluationInput } from '../../domain/types/clearance.types';
import type { AccessTransitionRequest } from '../../domain/types/access.types';

function actor(actorId: string, actorType: LifecycleActorType): LifecycleActor {
  return {
    actorId,
    actorType,
    displayName: actorId,
    societyId: 'soc-1',
    unitId: undefined,
    onBehalfOfResidentId: undefined,
  };
}

const TREASURER = actor('actor-treasurer', 'TREASURER');
const RESIDENT = actor('actor-resident', 'RESIDENT');
const SYSTEM = actor('system', 'SYSTEM');

function captureAudit(): { readonly entries: () => readonly AuditLogEntry[]; readonly stop: () => void } {
  const seen: AuditLogEntry[] = [];
  const unsubscribe = auditService.onLog((entry) => seen.push(entry));
  return { entries: () => seen, stop: unsubscribe };
}

function nocState(status: NocStatus, revision = 1): NocRequestState {
  return {
    nocRequestId: 'noc-1',
    requestNumber: 'NOC-2026-0001',
    kind: 'MOVE_OUT_NOC',
    status,
    revision,
    scope: { societyId: 'soc-1', unitId: 'unit-9', residentId: 'res-1', occupancyRelationshipId: 'rel-1' },
    linkedMoveOutRequestId: 'mo-1',
    linkedClearanceSnapshotId: undefined,
    linkedSettlementId: undefined,
    requestedByActorId: RESIDENT.actorId,
    requiredByDate: '2026-10-31',
    purposeKey: 'purpose.electricityTransfer',
    purposeDetail: 'transfer',
    approval: undefined,
    signature: undefined,
    certificateId: undefined,
    revocation: undefined,
    archive: undefined,
    cancellation: undefined,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  };
}

function nocCommand(overrides: Partial<NocCommand> = {}): NocCommand {
  return {
    kind: 'BEGIN_REVIEW',
    actor: TREASURER,
    idempotencyKey: 'noc-idem-1',
    expectedRevision: 1,
    occurredAt: '2026-10-01T12:00:00.000Z',
    approvalReference: undefined,
    committeeReference: undefined,
    rejectionReasonKey: undefined,
    rejectionReasonDetail: undefined,
    signatureDocumentId: undefined,
    signatureDocumentChecksum: undefined,
    signatureMethod: undefined,
    certificateId: undefined,
    revocationReasonKey: undefined,
    revocationReasonDetail: undefined,
    accessAlreadyRevoked: false,
    retentionPolicyKey: undefined,
    archiveReference: undefined,
    cancellationReasonKey: undefined,
    cancellationReasonDetail: undefined,
    ...overrides,
  };
}

function settlementState(
  stage: SettlementStageState['stage'] = 'REQUESTED',
  revision = 1,
): SettlementStageState {
  return {
    settlementId: 'stl-1',
    moveOutRequestId: 'mo-1',
    moveOutRevision: 4,
    scope: { societyId: 'soc-1', unitId: 'unit-9', residentId: 'res-1', occupancyRelationshipId: 'rel-1' },
    stage,
    revision,
    frozenPeriod: undefined,
    authoritative: stage === 'CLEARED',
    exceptionReasonKeys: stage === 'EXCEPTION' ? ['reason.pendingInvoice'] : [],
    clearedAt: undefined,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  };
}

function settlementCommand(
  overrides: Partial<SettlementStageCommand> = {},
): SettlementStageCommand {
  return {
    kind: 'FREEZE_PERIOD',
    actor: TREASURER,
    idempotencyKey: 'stl-idem-1',
    expectedRevision: 1,
    occurredAt: '2026-10-01T01:00:00.000Z',
    periodFrom: '2026-10-01',
    periodTo: '2026-10-31',
    settlementSnapshotId: undefined,
    exceptionReasonKeys: [],
    ...overrides,
  };
}

describe('noc application service', () => {
  it('dispatches a noc command through the guard and audits it', () => {
    const state = nocState('REQUESTED');
    const service = createInMemoryNocService([state]);
    const audit = captureAudit();

    const outcome = service.dispatch(nocCommand(), state);
    audit.stop();

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.fromStatus).toBe('REQUESTED');
      expect(outcome.toStatus).toBe('UNDER_REVIEW');
    }
    expect(audit.entries()[0]?.metadata?.eventType).toBe('NOC_REQUEST_CREATED');
  });

  it('refuses a replayed idempotency key', () => {
    const state = nocState('REQUESTED');
    const service = createInMemoryNocService([state]);
    const command = nocCommand();

    expect(service.dispatch(command, state).ok).toBe(true);
    const replay = service.dispatch(command, state);

    expect(replay.ok).toBe(false);
  });

  it('refuses a stale revision', () => {
    const state = nocState('REQUESTED', 4);
    const service = createInMemoryNocService([state]);

    const outcome = service.dispatch(nocCommand({ expectedRevision: 1 }), state);

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.reason).toBe('STALE_REVISION');
      expect(outcome.actualRevision).toBe(4);
    }
  });

  it('audits a rejected command without applying it', () => {
    const state = nocState('CANCELLED');
    const service = createInMemoryNocService([state]);
    const audit = captureAudit();

    const outcome = service.dispatch(nocCommand(), state);
    audit.stop();

    expect(outcome.ok).toBe(false);
    expect(audit.entries()[0]?.outcome).toBe('FAILURE');
    expect(service.store.read('noc-1')?.status).toBe('CANCELLED');
  });
});

describe('settlement application service', () => {
  it('reports the stage as the status so settlement transitions read correctly', () => {
    const state = settlementState('REQUESTED');
    const service = createInMemorySettlementService([state]);

    const outcome = service.dispatch(settlementCommand(), state);

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.fromStatus).toBe('REQUESTED');
      expect(outcome.toStatus).toBe('CALCULATING');
    }
  });

  it('audits a frozen settlement with the settlement event type', () => {
    const state = settlementState('REQUESTED');
    const service = createInMemorySettlementService([state]);
    const audit = captureAudit();

    service.dispatch(settlementCommand(), state);
    audit.stop();

    const logged = audit.entries()[0];
    expect(logged?.metadata?.eventType).toBe('FINAL_SETTLEMENT_FROZEN');
    expect(logged?.entityType).toBe('FINAL_SETTLEMENT');
  });

  it('refuses to move a cleared settlement further', () => {
    const state = settlementState('CLEARED');
    const service = createInMemorySettlementService([state]);

    const outcome = service.dispatch(settlementCommand(), state);

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.reason).toBe('DOMAIN_REJECTED');
    }
  });

  it('treats a settlement exception as recoverable rather than terminal', () => {
    const state = settlementState('REVIEW');
    const service = createInMemorySettlementService([state]);

    const outcome = service.dispatch(
      settlementCommand({
        kind: 'RECORD_EXCEPTION',
        idempotencyKey: 'stl-exc-1',
        exceptionReasonKeys: ['reason.pendingInvoice'],
      }),
      state,
    );

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.toStatus).toBe('EXCEPTION');
      expect(outcome.state.exceptionReasonKeys).toEqual(['reason.pendingInvoice']);
    }
  });
});

describe('clearance application service', () => {
  const baseInput: ClearanceEvaluationInput = {
    moveOutRequestId: 'mo-1',
    moveOutRevision: 3,
    policyVersion: 'policy-2026-01',
    evaluatedAt: '2026-10-01T00:00:00.000Z',
    evaluatedByActorId: TREASURER.actorId,
    requirements: [],
    readings: [],
    overrides: [],
    settlementSnapshotId: undefined,
    supersedesSnapshotId: undefined,
  };

  it('audits a ready clearance as a clearance evaluated event', () => {
    const service = createClearanceService();
    const audit = captureAudit();

    const outcome = service.evaluate(baseInput, TREASURER);
    audit.stop();

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.evaluation.outcome).toBe('READY');
    }
    expect(audit.entries()[0]?.metadata?.eventType).toBe('MOVE_OUT_CLEARANCE_EVALUATED');
  });

  it('audits an override distinctly from a plain evaluation', () => {
    const service = createClearanceService();
    const audit = captureAudit();

    service.evaluate(baseInput, TREASURER);
    audit.stop();

    const logged = audit.entries()[0];
    expect(logged?.action).toBe('VERIFY');
  });

  it('reports blocked clearance instead of returning a ready snapshot', () => {
    const service = createClearanceService();
    const audit = captureAudit();

    const outcome = service.evaluate(
      {
        ...baseInput,
        requirements: [
          {
            requirementId: 'req-dues',
            kind: 'NO_OUTSTANDING_DUES',
            domain: 'FINANCE',
            severity: 'MANDATORY',
            labelKey: 'label.noOutstandingDues',
            descriptionKey: 'description.noOutstandingDues',
            accountableRole: 'TREASURER',
            blocksReadinessWhenUnsatisfied: true,
            blocksReadinessWhenSourceUnavailable: true,
            dependsOnSettlement: true,
          },
        ],
      },
      TREASURER,
    );
    audit.stop();

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.reason).toBe('CLEARANCE_BLOCKED');
    }
    expect(audit.entries()[0]?.outcome).toBe('FAILURE');
  });
});

describe('access application service', () => {
  function accessRequest(intent: AccessTransitionRequest['intent']): AccessTransitionRequest {
    const isActivation = intent === 'ACTIVATE_ON_MOVE_IN_COMPLETION';
    return {
      transitionId: 'tr-1',
      subject: isActivation ? 'RESIDENT_ACTIVATION' : 'RESIDENT_REVOCATION',
      intent,
      idempotencyKey: 'access-idem-1',
      requestedAt: '2026-10-01T00:00:00.000Z',
      requestedBy: SYSTEM,
      subjectResidentId: 'res-1',
      societyId: 'soc-1',
      unitId: 'unit-9',
      linkedRequestId: 'mo-1',
      credentialCount: 2,
      parkingAllocationAffected: true,
      residenceAccessStatusBefore: 'ACTIVE',
      gateIntegrationReference: undefined,
    };
  }

  it('plans a revocation and audits it as a revocation', () => {
    const service = createAccessService();
    const audit = captureAudit();

    const outcome = service.planTransition(
      accessRequest('REVOKE_ON_NOC_ISSUANCE'),
      'NOT_AVAILABLE',
      ['session-1'],
      ['gate-1'],
    );
    audit.stop();

    expect(outcome.ok).toBe(true);
    expect(audit.entries()[0]?.metadata?.eventType).toBe('ACCESS_REVOCATION_FAILED');
  });

  it('never claims human follow up is unnecessary when the gate is not authoritative', () => {
    const service = createAccessService();

    const outcome = service.planTransition(
      accessRequest('REVOKE_ON_NOC_ISSUANCE'),
      'NOT_AVAILABLE',
      [],
      [],
    );

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.requiresHumanFollowUp).toBe(true);
    }
  });

  it('flags compensation required when a gate mapping cannot be revoked', () => {
    const service = createAccessService();

    const outcome = service.planTransition(
      accessRequest('REVOKE_ON_NOC_ISSUANCE'),
      'NOT_AVAILABLE',
      ['session-1'],
      ['gate-1'],
    );

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.plan.status).toBe('COMPENSATION_REQUIRED');
      expect(outcome.requiresCompensation).toBe(true);
      expect(outcome.requiresHumanFollowUp).toBe(true);
    }
  });

  it('revokes cleanly when the gate is authoritative', () => {
    const service = createAccessService();

    const outcome = service.planTransition(
      accessRequest('REVOKE_ON_NOC_ISSUANCE'),
      'INTEGRATED',
      ['session-1'],
      ['gate-1'],
    );

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.plan.status).toBe('SUCCEEDED');
      expect(outcome.requiresCompensation).toBe(false);
    }
  });

  it('does not consult the gate for an activation', () => {
    const service = createAccessService();

    const outcome = service.planTransition(
      accessRequest('ACTIVATE_ON_MOVE_IN_COMPLETION'),
      'NOT_AVAILABLE',
      [],
      [],
    );

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.plan.status).toBe('SUCCEEDED');
      expect(outcome.requiresHumanFollowUp).toBe(true);
    }
  });

  it('audits a successful activation as an activation', () => {
    const service = createAccessService();
    const audit = captureAudit();

    service.planTransition(
      accessRequest('ACTIVATE_ON_MOVE_IN_COMPLETION'),
      'INTEGRATED',
      [],
      [],
    );
    audit.stop();

    expect(audit.entries()[0]?.metadata?.eventType).toBe('ACCESS_ACTIVATED');
  });
});
