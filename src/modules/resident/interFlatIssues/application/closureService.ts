import type { Absent } from '../../../../shared/types/absence.types';
import type { ClosureOutcomeReason, DisputeCase, DisputeClosureRecord } from '../domain/types/case.types';
import type { ClosureProof } from '../domain/types/mediation.types';
import type { Escalation, EscalationLevel, EscalationTarget } from '../domain/types/escalation.types';
import type { DisputeRetentionRecord } from '../domain/types/retention.types';
import { disposeReady, shouldReview } from '../domain/types/retention.types';
import type { FinanceLinkRequest, MoveOutLinkRequest } from '../domain/types/policy.types';
import type { DisputeErrorCode, DisputeOutcome, DisputeViolation } from '../domain/types';
import { fail, succeed } from '../domain/types';
import { evaluateCaseTransition } from '../domain/stateMachines/caseLifecycle';
import { evaluateSla, summariseBreaches } from '../domain/engines/slaEngine';
import { isNeutralSummary } from '../domain/types/timeline.types';
import { evaluateActionPermission, evaluateCaseAccess, evaluateSocietyBoundary } from '../domain/guards/authorizationGuard';
import type { ActorContextInput, CaseCommandOutcome, CaseService, DisputeCommand } from './caseService';
import { fingerprintDisputeCommand } from '../domain/guards/commandGuard';
import type { DisputePorts } from './ports';

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter.toString(36)}`;
}

export type CloseCaseInput = {
  readonly outcome: ClosureOutcomeReason;
  readonly summary: string;
  readonly proposalId: string | Absent;
  readonly closureProofIds: readonly string[];
  readonly financeLinkIds: readonly string[];
  readonly moveOutLinkIds: readonly string[];
};

export type EscalateCaseInput = {
  readonly level: EscalationLevel;
  readonly reason: string;
  readonly target: EscalationTarget;
  readonly actionTaken?: string | Absent;
  readonly assignedToUserId?: string | Absent;
};

type Guarded<T> =
  | { readonly ok: true; readonly disputeCase: DisputeCase; readonly value: T }
  | { readonly ok: false; readonly code: DisputeErrorCode; readonly message: string; readonly violations: readonly DisputeViolation[] };

const MISSING: Guarded<never> = {
  ok: false,
  code: 'AGGREGATE_NOT_FOUND',
  message: 'Dispute case not found.',
  violations: [{ code: 'AGGREGATE_NOT_FOUND', field: 'case.id', blocking: true, detail: 'Dispute case not found.' }],
};

export function createClosureService(ports: DisputePorts, caseService: CaseService) {
  const now = (): string => ports.clock.now().toISOString();

  const guard = (
    actor: ActorContextInput,
    caseId: string,
    action: Parameters<typeof evaluateCaseAccess>[2],
  ): Guarded<DisputeCase> => {
    const disputeCase = ports.cases.read(caseId);
    if (disputeCase === undefined) {
      return MISSING;
    }
    const society = evaluateSocietyBoundary(actor.societyId, disputeCase);
    if (!society.allowed) {
      return { ok: false, code: 'CROSS_SOCIETY_BLOCKED', message: 'This case belongs to another society.', violations: society.violations };
    }
    const access = evaluateCaseAccess(actor, disputeCase, action);
    if (!access.allowed) {
      return {
        ok: false,
        code: access.violations[0]?.code ?? 'ACTOR_NOT_AUTHORIZED',
        message: 'You may not perform this action on this case.',
        violations: access.violations,
      };
    }
    return { ok: true, disputeCase, value: disputeCase };
  };

  const verifiedProofs = (caseId: string): readonly ClosureProof[] =>
    ports.closureProofs
      .listByCase(caseId)
      .filter((proof) => proof.verifiedAt !== undefined);

  const resolveCase = (
    actor: ActorContextInput,
    command: DisputeCommand,
    caseId: string,
    input: {
      readonly summary: string;
      readonly proposalId: string | Absent;
      readonly closureProofIds: readonly string[];
    },
  ): CaseCommandOutcome<DisputeCase> => {
    const guarded = guard(actor, caseId, 'CLOSE_CASE');
    if (!guarded.ok) {
      return fail(guarded.code, guarded.message, guarded.violations);
    }
    const disputeCase = guarded.value;
    const transition = evaluateCaseTransition(disputeCase, 'RESOLVE_CASE');
    if (!transition.allowed) {
      return fail(
        transition.violations[0]?.code ?? 'ILLEGAL_TRANSITION',
        'This case cannot be resolved from its current state.',
        transition.violations,
      );
    }
    const violations: DisputeViolation[] = [];
    if (input.summary.trim().length < 15) {
      violations.push({
        code: 'VALIDATION_FAILED',
        field: 'resolution.summary',
        blocking: true,
        detail: 'Summarise the neutral reasoning that resolves this case.',
      });
    }
    if (!isNeutralSummary(input.summary)) {
      violations.push({
        code: 'VALIDATION_FAILED',
        field: 'resolution.summary',
        blocking: true,
        detail: 'A resolution summary must not assign guilt or fault.',
      });
    }
    if (input.proposalId !== undefined) {
      const proposal = ports.proposals.read(input.proposalId);
      if (proposal === undefined || proposal.caseId !== disputeCase.id) {
        violations.push({
          code: 'AGGREGATE_NOT_FOUND',
          field: 'resolution.proposalId',
          blocking: true,
          detail: 'The referenced resolution proposal is not on this case.',
        });
      } else if (proposal.status !== 'ACCEPTED') {
        violations.push({
          code: 'PRECONDITION_FAILED',
          field: 'resolution.proposalId',
          blocking: true,
          detail: 'A case can only be resolved on a proposal the required parties accepted.',
        });
      }
    }
    if (input.closureProofIds.length > 0) {
      const verified = verifiedProofs(disputeCase.id);
      for (const proofId of input.closureProofIds) {
        if (!verified.some((proof) => proof.id === proofId)) {
          violations.push({
            code: 'CLOSURE_EVIDENCE_REQUIRED',
            field: 'resolution.closureProofIds',
            blocking: true,
            detail: 'Every cited closure proof must be verified by the committee.',
          });
        }
      }
    }
    if (violations.length > 0) {
      return fail(violations[0]?.code ?? 'VALIDATION_FAILED', 'The case could not be resolved.', violations);
    }

    const stored = ports.cases.commit(
      disputeCase.id,
      caseService.withStatus(disputeCase, 'RESOLVED'),
      disputeCase.revision.revision,
    );
    if (!stored) {
      return fail('CONCURRENT_WRITE', 'The case changed while resolution was in flight; reload and retry.');
    }
    ports.ledger.record({
      envelope: command.envelope,
      fingerprint: fingerprintDisputeCommand(command.envelope),
      committedRevision: disputeCase.revision.revision + 1,
      resultStatus: 'RESOLVED',
      committedAt: now(),
    });
    caseService.saveRetentionFor(disputeCase.id);
    caseService.appendTimeline({
      caseId: disputeCase.id,
      societyId: disputeCase.societyId,
      eventType: 'CASE_RESOLVED',
      actor,
      summary: input.summary,
      relatedEntityId: input.proposalId,
    });
    caseService.notify(
      disputeCase.id,
      disputeCase.societyId,
      'CASE_CLOSED',
      disputeCase.parties.map((party) => party.userId),
      `Case ${disputeCase.caseNumber} was resolved and is awaiting closure`,
      disputeCase.trace.correlationId,
    );
    const resolved = ports.cases.read(disputeCase.id);
    return resolved === undefined
      ? fail('AGGREGATE_NOT_FOUND', 'Dispute case not found after resolution.')
      : succeed(resolved);
  };

  const closeCase = (
    actor: ActorContextInput,
    command: DisputeCommand,
    caseId: string,
    input: CloseCaseInput,
  ): CaseCommandOutcome<DisputeCase> => {
    const guarded = guard(actor, caseId, 'CLOSE_CASE');
    if (!guarded.ok) {
      return fail(guarded.code, guarded.message, guarded.violations);
    }
    const disputeCase = guarded.value;
    const transition = evaluateCaseTransition(disputeCase, 'CLOSE_CASE');
    if (!transition.allowed) {
      return fail(
        transition.violations[0]?.code ?? 'ILLEGAL_TRANSITION',
        'This case cannot be closed from its current state.',
        transition.violations,
      );
    }

    const violations: DisputeViolation[] = [];
    if (input.summary.trim().length < 15) {
      violations.push({ code: 'VALIDATION_FAILED', field: 'closure.summary', blocking: true, detail: 'Summarise the neutral outcome and the reasoning that led to it.' });
    }
    if (input.outcome === 'RESOLVED_AGREED' && verifiedProofs(disputeCase.id).length === 0) {
      violations.push({ code: 'CLOSURE_EVIDENCE_REQUIRED', field: 'closure.outcome', blocking: true, detail: 'A verified closure proof is required before recording a resolved outcome.' });
    }
    if (input.outcome === 'RESOLVED_MEDIATED' && input.proposalId === undefined) {
      violations.push({ code: 'PRECONDITION_FAILED', field: 'closure.proposalId', blocking: true, detail: 'A mediated resolution must reference the proposal that was mediated.' });
    }
    if (input.outcome === 'RESOLVED_AFTER_INSPECTION' && disputeCase.inspectionIds.length === 0) {
      violations.push({ code: 'PRECONDITION_FAILED', field: 'closure.outcome', blocking: true, detail: 'A post-inspection resolution requires at least one recorded inspection on this case.' });
    }
    if (input.outcome === 'UNRESOLVED_NO_RESPONSE' && disputeCase.responses.length > 0) {
      violations.push({ code: 'PRECONDITION_FAILED', field: 'closure.outcome', blocking: true, detail: 'A no-response outcome cannot be recorded once a response exists on the case.' });
    }
    if (input.proposalId !== undefined) {
      const proposal = ports.proposals.read(input.proposalId);
      if (proposal === undefined || proposal.caseId !== disputeCase.id) {
        violations.push({ code: 'AGGREGATE_NOT_FOUND', field: 'closure.proposalId', blocking: true, detail: 'The referenced resolution proposal is not on this case.' });
      } else if (input.outcome === 'RESOLVED_AGREED' && proposal.status !== 'ACCEPTED') {
        violations.push({ code: 'PRECONDITION_FAILED', field: 'closure.proposalId', blocking: true, detail: 'The referenced proposal has not been accepted by the required parties.' });
      }
    }
    for (const proofId of input.closureProofIds) {
      const proof = ports.closureProofs.read(proofId);
      if (proof === undefined || proof.caseId !== disputeCase.id) {
        violations.push({ code: 'AGGREGATE_NOT_FOUND', field: 'closure.closureProofIds', blocking: true, detail: 'A referenced closure proof is not on this case.' });
      }
    }
    if (input.financeLinkIds.length > 0 && !ports.policies.financeLink.disputeMayReferenceFinanceDecision) {
      violations.push({ code: 'FINANCE_LINK_OUT_OF_SCOPE', field: 'closure.financeLinkIds', blocking: true, detail: 'This society policy does not permit dispute cases to reference finance decisions.' });
    }
    if (input.moveOutLinkIds.length > 0 && !ports.policies.moveOutLink.disputeOwnsClearance) {
      violations.push({ code: 'MOVE_OUT_LINK_OUT_OF_SCOPE', field: 'closure.moveOutLinkIds', blocking: true, detail: 'Move-out clearance is owned by the move-out domain, not the dispute case.' });
    }
    if (violations.length > 0) {
      return fail(violations[0]?.code ?? 'VALIDATION_FAILED', 'The case could not be closed.', violations);
    }

    const sla = evaluateSla(disputeCase, ports.policies.sla, ports.clock.now());
    const closedAt = now();
    const closure: DisputeClosureRecord = {
      outcome: input.outcome,
      summary: input.summary,
      closedByUserId: actor.userId,
      closedAt,
      proposalId: input.proposalId,
      closureProofIds: input.closureProofIds,
      financeLinkIds: input.financeLinkIds,
      moveOutLinkIds: input.moveOutLinkIds,
      slaBreachesAtClosure: summariseBreaches(sla.breaches),
    };
    const stored = ports.cases.commit(
      disputeCase.id,
      caseService.withStatus(disputeCase, 'CLOSED', closure),
      disputeCase.revision.revision,
    );
    if (!stored) {
      return fail('CONCURRENT_WRITE', 'The case changed while closure was in flight; reload and retry.');
    }
    ports.ledger.record({
      envelope: command.envelope,
      fingerprint: fingerprintDisputeCommand(command.envelope),
      committedRevision: disputeCase.revision.revision + 1,
      resultStatus: 'CLOSED',
      committedAt: closedAt,
    });
    caseService.saveRetentionFor(disputeCase.id);
    caseService.appendTimeline({
      caseId: disputeCase.id,
      societyId: disputeCase.societyId,
      eventType: 'CASE_CLOSED',
      actor,
      summary: `Case closed with outcome ${input.outcome}. ${input.summary}`,
      relatedEntityId: disputeCase.id,
    });
    caseService.notify(
      disputeCase.id,
      disputeCase.societyId,
      'CASE_CLOSED',
      disputeCase.parties.map((party) => party.userId),
      `Case ${disputeCase.caseNumber} was closed`,
      disputeCase.trace.correlationId,
    );
    const closed = ports.cases.read(disputeCase.id);
    return closed === undefined
      ? fail('AGGREGATE_NOT_FOUND', 'Dispute case not found after closure.')
      : succeed(closed);
  };

  const escalateCase = (
    actor: ActorContextInput,
    command: DisputeCommand,
    caseId: string,
    input: EscalateCaseInput,
  ): CaseCommandOutcome<Escalation> => {
    const guarded = guard(actor, caseId, 'ESCALATE_CASE');
    if (!guarded.ok) {
      return fail(guarded.code, guarded.message, guarded.violations);
    }
    const disputeCase = guarded.value;
    const transition = evaluateCaseTransition(disputeCase, 'ESCALATE_CASE');
    if (!transition.allowed) {
      return fail(
        transition.violations[0]?.code ?? 'ILLEGAL_TRANSITION',
        'This case cannot be escalated from its current state.',
        transition.violations,
      );
    }
    const violations: DisputeViolation[] = [];
    if (input.target.requiresReason && input.reason.trim().length < 10) {
      violations.push({ code: 'ESCALATION_REASON_REQUIRED', field: 'escalation.reason', blocking: true, detail: 'Explain why this case is being escalated to a higher level.' });
    }
    if (input.target.targetLabel.trim().length < 3 || input.target.contactRole.trim().length < 3) {
      violations.push({ code: 'ESCALATION_TARGET_NOT_CONFIGURED', field: 'escalation.target', blocking: true, detail: 'An escalation target and contact role must be configured by policy.' });
    }
    if (input.level === 'EXTERNAL_ADVISOR' && input.actionTaken === undefined) {
      violations.push({
        code: 'PRECONDITION_FAILED',
        field: 'escalation.actionTaken',
        blocking: true,
        detail: 'External advisor escalation requires a recorded consent reference before the advisor is contacted.',
      });
    }
    if (violations.length > 0) {
      return fail(violations[0]?.code ?? 'VALIDATION_FAILED', 'The escalation could not be recorded.', violations);
    }

    const createdAt = now();
    const escalation: Escalation = {
      id: nextId('esc'),
      caseId,
      societyId: disputeCase.societyId,
      escalatedByUserId: actor.userId,
      reason: input.reason,
      level: input.level,
      target: input.target,
      actionTaken: input.actionTaken,
      assignedToUserId: input.assignedToUserId,
      createdAt,
      acknowledgedAt: undefined,
      resolvedAt: undefined,
    };
    if (!ports.escalations.insert(escalation)) {
      return fail('CONCURRENT_WRITE', 'The escalation was recorded concurrently.');
    }
    const stored = ports.cases.commit(
      disputeCase.id,
      caseService.withStatus(disputeCase, 'ESCALATED'),
      disputeCase.revision.revision,
    );
    if (!stored) {
      return fail('CONCURRENT_WRITE', 'The case changed while escalation was in flight; reload and retry.');
    }
    ports.ledger.record({
      envelope: command.envelope,
      fingerprint: fingerprintDisputeCommand(command.envelope),
      committedRevision: disputeCase.revision.revision + 1,
      resultStatus: 'ESCALATED',
      committedAt: createdAt,
    });
    caseService.appendTimeline({
      caseId,
      societyId: disputeCase.societyId,
      eventType: 'CASE_ESCALATED',
      actor,
      summary: `Case escalated to ${input.level}: ${input.reason}`,
      relatedEntityId: escalation.id,
    });
    if (input.assignedToUserId !== undefined) {
      caseService.notify(
        caseId,
        disputeCase.societyId,
        'CASE_ESCALATED',
        [input.assignedToUserId],
        `Case ${disputeCase.caseNumber} was escalated to you`,
        disputeCase.trace.correlationId,
      );
    }
    return succeed(escalation);
  };

  const acknowledgeEscalation = (
    actor: ActorContextInput,
    escalationId: string,
    actionTaken: string,
  ): CaseCommandOutcome<Escalation> => {
    const escalation = ports.escalations.read(escalationId);
    if (escalation === undefined) {
      return fail('AGGREGATE_NOT_FOUND', 'Escalation not found.');
    }
    const guarded = guard(actor, escalation.caseId, 'ESCALATE_CASE');
    if (!guarded.ok) {
      return fail(guarded.code, guarded.message, guarded.violations);
    }
    if (escalation.acknowledgedAt !== undefined) {
      return fail('PRECONDITION_FAILED', 'This escalation has already been acknowledged.');
    }
    if (actionTaken.trim().length < 10) {
      return fail('ESCALATION_REASON_REQUIRED', 'Record what was done in response to the escalation.');
    }
    const next: Escalation = {
      ...escalation,
      actionTaken,
      assignedToUserId: escalation.assignedToUserId ?? actor.userId,
      acknowledgedAt: now(),
    };
    if (!ports.escalations.update(next)) {
      return fail('CONCURRENT_WRITE', 'The escalation was modified concurrently.');
    }
    caseService.appendTimeline({
      caseId: escalation.caseId,
      societyId: escalation.societyId,
      eventType: 'ESCALATION_ACKNOWLEDGED',
      actor,
      summary: `Escalation acknowledged: ${actionTaken}`,
      relatedEntityId: escalation.id,
    });
    return succeed(next);
  };

  return {
    resolveCase,
    closeCase,
    escalateCase,
    acknowledgeEscalation,
    verifiedClosureProofs: verifiedProofs,
    readEscalation: (escalationId: string): Escalation | Absent => ports.escalations.read(escalationId),
    listEscalations: (caseId: string): readonly Escalation[] => ports.escalations.listByCase(caseId),
  };
}

export type ClosureService = ReturnType<typeof createClosureService>;

export type ApplyRetentionInput = {
  readonly placeLegalHold: boolean;
  readonly releaseLegalHold: boolean;
};

export function createRetentionService(ports: DisputePorts, caseService: CaseService) {
  const now = (): string => ports.clock.now().toISOString();

  const guard = (actor: ActorContextInput, caseId: string, action: Parameters<typeof evaluateCaseAccess>[2]): Guarded<DisputeRetentionRecord> => {
    const disputeCase = ports.cases.read(caseId);
    if (disputeCase === undefined) {
      return MISSING;
    }
    const society = evaluateSocietyBoundary(actor.societyId, disputeCase);
    if (!society.allowed) {
      return { ok: false, code: 'CROSS_SOCIETY_BLOCKED', message: 'This case belongs to another society.', violations: society.violations };
    }
    const access = evaluateCaseAccess(actor, disputeCase, action);
    if (!access.allowed) {
      return {
        ok: false,
        code: access.violations[0]?.code ?? 'ACTOR_NOT_AUTHORIZED',
        message: 'You may not manage retention for this case.',
        violations: access.violations,
      };
    }
    return { ok: true, disputeCase, value: ports.retention.read(caseId) ?? projected(disputeCase) };
  };

  const projected = (disputeCase: DisputeCase): DisputeRetentionRecord => caseService.retentionFor(disputeCase);

  const evaluateDue = (record: DisputeRetentionRecord, disputeCase: DisputeCase): DisputeRetentionRecord => {
    const at = ports.clock.now();
    const base = projected(disputeCase);
    const next: DisputeRetentionRecord = {
      ...base,
      ...record,
      reviewDueAt: record.reviewDueAt ?? base.reviewDueAt,
      disposeAfterAt: record.disposeAfterAt ?? base.disposeAfterAt,
    };
    if (next.disposedAt !== undefined) {
      return { ...next, lifecycle: 'DISPOSED' };
    }
    if (next.legalHoldActive) {
      return { ...next, lifecycle: 'HOLD' };
    }
    if (shouldReview(next, at)) {
      return { ...next, lifecycle: 'REVIEW_DUE' };
    }
    return { ...next, lifecycle: 'ACTIVE' };
  };

  const applyRetention = (
    actor: ActorContextInput,
    caseId: string,
    input: ApplyRetentionInput,
  ): CaseCommandOutcome<DisputeRetentionRecord> => {
    const guarded = guard(actor, caseId, input.placeLegalHold ? 'PLACE_LEGAL_HOLD' : 'APPLY_RETENTION');
    if (!guarded.ok) {
      return fail(guarded.code, guarded.message, guarded.violations);
    }
    if (input.placeLegalHold && input.releaseLegalHold) {
      return fail('VALIDATION_FAILED', 'Place and release a legal hold in separate steps so the audit trail stays unambiguous.');
    }
    const disputeCase = guarded.disputeCase;
    const current = ports.retention.read(caseId) ?? projected(disputeCase);
    const next = evaluateDue(
      {
        ...current,
        legalHoldActive: input.placeLegalHold ? true : input.releaseLegalHold ? false : current.legalHoldActive,
      },
      disputeCase,
    );
    if (!ports.retention.upsert(next)) {
      return fail('CONCURRENT_WRITE', 'The retention record was modified concurrently.');
    }
    caseService.appendTimeline({
      caseId,
      societyId: disputeCase.societyId,
      eventType: input.placeLegalHold ? 'LEGAL_HOLD_PLACED' : input.releaseLegalHold ? 'LEGAL_HOLD_RELEASED' : 'RETENTION_REVIEW_RECORDED',
      actor,
      summary: input.placeLegalHold
        ? 'A legal hold was placed; disposal is blocked for this case.'
        : input.releaseLegalHold
          ? 'The legal hold was released; retention policy now applies.'
          : 'Retention review completed; the case record is retained under society policy.',
      relatedEntityId: caseId,
    });
    return succeed(next);
  };

  const disposeCase = (actor: ActorContextInput, caseId: string): CaseCommandOutcome<DisputeRetentionRecord> => {
    const guarded = guard(actor, caseId, 'APPLY_RETENTION');
    if (!guarded.ok) {
      return fail(guarded.code, guarded.message, guarded.violations);
    }
    const disputeCase = guarded.disputeCase;
    const current = ports.retention.read(caseId) ?? projected(disputeCase);
    const evaluated = evaluateDue(current, disputeCase);
    if (evaluated.legalHoldActive) {
      return fail('RETENTION_HOLD_ACTIVE', 'Disposal is blocked while a legal hold is active.');
    }
    if (!disposeReady(evaluated, ports.clock.now())) {
      return fail('RETENTION_NOT_DUE', 'The retention period for this case has not elapsed.');
    }
    const next: DisputeRetentionRecord = { ...evaluated, lifecycle: 'DISPOSED', disposedAt: now() };
    if (!ports.retention.upsert(next)) {
      return fail('CONCURRENT_WRITE', 'The retention record was modified concurrently.');
    }
    caseService.appendTimeline({
      caseId,
      societyId: disputeCase.societyId,
      eventType: 'CASE_RECORD_DISPOSED',
      actor,
      summary: 'The dispute record was disposed under the society retention policy. Evidence remains governed by the vault policy.',
      relatedEntityId: caseId,
    });
    return succeed(next);
  };

  return {
    applyRetention,
    disposeCase,
    read: (caseId: string): DisputeRetentionRecord | Absent => ports.retention.read(caseId),
    listBySociety: (societyId: string): readonly DisputeRetentionRecord[] => ports.retention.listBySociety(societyId),
    refresh: (caseId: string): DisputeRetentionRecord | Absent => {
      const record = ports.retention.read(caseId);
      const disputeCase = ports.cases.read(caseId);
      if (record === undefined || disputeCase === undefined) {
        return record;
      }
      const next = evaluateDue(record, disputeCase);
      ports.retention.upsert(next);
      return next;
    },
  };
}

export type RetentionService = ReturnType<typeof createRetentionService>;

export function createIntegrationLinkService(ports: DisputePorts, caseService: CaseService) {
  const now = (): string => ports.clock.now().toISOString();

  const guardFinance = (actor: ActorContextInput, caseId: string): Guarded<DisputeCase> => {
    const disputeCase = ports.cases.read(caseId);
    if (disputeCase === undefined) {
      return MISSING;
    }
    const society = evaluateSocietyBoundary(actor.societyId, disputeCase);
    if (!society.allowed) {
      return { ok: false, code: 'CROSS_SOCIETY_BLOCKED', message: 'This case belongs to another society.', violations: society.violations };
    }
    const access = evaluateCaseAccess(actor, disputeCase, 'REQUEST_FINANCE_LINK');
    if (!access.allowed) {
      return {
        ok: false,
        code: access.violations[0]?.code ?? 'ACTOR_NOT_AUTHORIZED',
        message: 'You may not request a finance link from this case.',
        violations: access.violations,
      };
    }
    return { ok: true, disputeCase, value: disputeCase };
  };

  const requestFinanceLink = (
    actor: ActorContextInput,
    caseId: string,
    reason: string,
  ): CaseCommandOutcome<FinanceLinkRequest> => {
    const guarded = guardFinance(actor, caseId);
    if (!guarded.ok) {
      return fail(guarded.code, guarded.message, guarded.violations);
    }
    const policy = ports.policies.financeLink;
    if (!policy.disputeMayReferenceFinanceDecision) {
      return fail('FINANCE_LINK_OUT_OF_SCOPE', 'This society policy does not allow dispute cases to reference finance decisions.');
    }
    if (policy.requiresCommitteeDecision && actor.actorType !== 'SOCIETY_ADMIN') {
      return fail('ACTOR_NOT_AUTHORIZED', 'A finance link requires a committee decision recorded by the society administrator.');
    }
    if (reason.trim().length < 10) {
      return fail('VALIDATION_FAILED', 'Record why finance review is relevant to this dispute.');
    }
    const requestedAt = now();
    const request: FinanceLinkRequest = {
      id: nextId('fin'),
      caseId,
      societyId: guarded.value.societyId,
      requestedByUserId: actor.userId,
      reason,
      requestedAt,
      amount: undefined,
      status: 'REQUESTED',
      financeDecisionReference: undefined,
    };
    if (!ports.financeLinks.insert(request)) {
      return fail('CONCURRENT_WRITE', 'The finance link request was created concurrently.');
    }
    caseService.appendTimeline({
      caseId,
      societyId: request.societyId,
      eventType: 'FINANCE_LINK_REQUESTED',
      actor,
      summary: `Finance review was requested: ${reason}. The dispute case does not determine any amount.`,
      relatedEntityId: request.id,
    });
    return succeed(request);
  };

  const recordFinanceDecision = (
    actor: ActorContextInput,
    linkId: string,
    input: { readonly status: FinanceLinkRequest['status']; readonly financeDecisionReference: string },
  ): CaseCommandOutcome<FinanceLinkRequest> => {
    const request = ports.financeLinks.read(linkId);
    if (request === undefined) {
      return fail('AGGREGATE_NOT_FOUND', 'Finance link request not found.');
    }
    const permission = evaluateActionPermission(actor.actorType, actor.role, 'REQUEST_FINANCE_LINK');
    if (!permission.allowed) {
      return fail('ACTOR_NOT_AUTHORIZED', 'Only the finance owner may record a finance decision.', permission.violations);
    }
    if (request.status !== 'REQUESTED') {
      return fail('PRECONDITION_FAILED', 'This finance link has already been decided.');
    }
    if (input.status === 'REQUESTED') {
      return fail('VALIDATION_FAILED', 'A finance decision must be recorded as accepted or rejected.');
    }
    if (input.financeDecisionReference.trim().length < 3) {
      return fail('VALIDATION_FAILED', 'Record the finance decision reference that the dispute case will cite.');
    }
    const next: FinanceLinkRequest = {
      ...request,
      status: input.status,
      financeDecisionReference: input.financeDecisionReference,
    };
    if (!ports.financeLinks.update(next)) {
      return fail('CONCURRENT_WRITE', 'The finance link was modified concurrently.');
    }
    const disputeCase = ports.cases.read(request.caseId);
    caseService.appendTimeline({
      caseId: request.caseId,
      societyId: request.societyId,
      eventType: 'FINANCE_LINK_DECIDED',
      actor,
      summary: `Finance recorded a decision for this case (${input.status}); the amount remains owned by the finance module.`,
      relatedEntityId: request.id,
    });
    if (disputeCase !== undefined) {
      caseService.notify(
        request.caseId,
        request.societyId,
        'FINANCE_LINK_DECIDED',
        [disputeCase.reporterUserId],
        `Finance decision recorded on case ${disputeCase.caseNumber}`,
        disputeCase.trace.correlationId,
      );
    }
    return succeed(next);
  };

  const requestMoveOutLink = (
    actor: ActorContextInput,
    caseId: string,
    reason: string,
  ): CaseCommandOutcome<MoveOutLinkRequest> => {
    const guarded = guardFinance(actor, caseId);
    if (!guarded.ok) {
      return fail(guarded.code, guarded.message, guarded.violations);
    }
    const policy = ports.policies.moveOutLink;
    if (!policy.disputeMayBlockClearance && !policy.disputeOwnsClearance) {
      return fail('MOVE_OUT_LINK_OUT_OF_SCOPE', 'This society policy does not allow dispute cases to reference move-out clearance.');
    }
    if (reason.trim().length < 10) {
      return fail('VALIDATION_FAILED', 'Record why move-out clearance is relevant to this dispute.');
    }
    const requestedAt = now();
    const request: MoveOutLinkRequest = {
      id: nextId('mo'),
      caseId,
      societyId: guarded.value.societyId,
      requestedByUserId: actor.userId,
      reason,
      requestedAt,
      status: 'REQUESTED',
      clearanceReference: undefined,
    };
    if (!ports.moveOutLinks.insert(request)) {
      return fail('CONCURRENT_WRITE', 'The move-out link request was created concurrently.');
    }
    caseService.appendTimeline({
      caseId,
      societyId: request.societyId,
      eventType: 'MOVE_OUT_LINK_REQUESTED',
      actor,
      summary: `Move-out clearance was notified of this case: ${reason}. Clearance remains decided by the move-out module.`,
      relatedEntityId: request.id,
    });
    return succeed(request);
  };

  return {
    requestFinanceLink,
    recordFinanceDecision,
    requestMoveOutLink,
    listFinanceLinks: (caseId: string): readonly FinanceLinkRequest[] => ports.financeLinks.listByCase(caseId),
    listMoveOutLinks: (caseId: string): readonly MoveOutLinkRequest[] => ports.moveOutLinks.listByCase(caseId),
  };
}

export type IntegrationLinkService = ReturnType<typeof createIntegrationLinkService>;
