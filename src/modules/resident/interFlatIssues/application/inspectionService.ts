import type { Absent } from '../../../../shared/types/absence.types';
import type { DisputeCase } from '../domain/types/case.types';
import type { Inspection, InspectionOutcome } from '../domain/types/inspection.types';
import type { DisputeErrorCode, DisputeOutcome, DisputeViolation } from '../domain/types';
import { fail, succeed } from '../domain/types';
import type { InspectionCommandKind } from '../domain/stateMachines/inspectionMachine';
import {
  evaluateInspectionActor,
  evaluateInspectionTransition,
  INSPECTION_TARGET,
} from '../domain/stateMachines/inspectionMachine';
import { inspectionDueAt } from '../domain/engines/slaEngine';
import { evaluateActionPermission, evaluateSocietyBoundary } from '../domain/guards/authorizationGuard';
import type { DisputeAction } from '../domain/types/policy.types';
import type { CaseService, ActorContextInput, CaseCommandOutcome, DisputeCommand } from './caseService';
import { disputeCommand } from './caseService';
import { fingerprintDisputeCommand } from '../domain/guards/commandGuard';
import type { DisputePorts } from './ports';

export type RequestInspectionInput = {
  readonly preferredWindowLabel: string;
  readonly requestedOutcome: string;
};

export type CompleteInspectionInput = {
  readonly findings: string;
  readonly observedSourceUnitId: string | Absent;
  readonly observedSourceIsSuspected: boolean;
  readonly rootCauseStatement: string;
  readonly recommendedAction: string;
  readonly outcome: InspectionOutcome;
  readonly evidenceIds: readonly string[];
};

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter.toString(36)}`;
}

const ACTION_BY_COMMAND: Readonly<Record<InspectionCommandKind, DisputeAction>> = {
  REQUEST_INSPECTION: 'REQUEST_INSPECTION',
  SCHEDULE_INSPECTION: 'ASSIGN_INSPECTOR',
  START_INSPECTION: 'COMPLETE_INSPECTION',
  COMPLETE_INSPECTION: 'COMPLETE_INSPECTION',
  REQUEST_REVISIT: 'REQUEST_INSPECTION',
  CANCEL_INSPECTION: 'ESCALATE_CASE',
};

export function createInspectionService(ports: DisputePorts, caseService: CaseService) {
  const now = (): string => ports.clock.now().toISOString();

  const resolveInspection = (
    actor: ActorContextInput,
    inspectionId: string,
    command: InspectionCommandKind,
  ):
    | { ok: true; inspection: Inspection; disputeCase: DisputeCase }
    | { ok: false; code: DisputeErrorCode; message: string; violations: readonly DisputeViolation[] } => {
    const inspection = ports.inspections.read(inspectionId);
    if (inspection === undefined) {
      return {
        ok: false,
        code: 'AGGREGATE_NOT_FOUND',
        message: 'Inspection not found.',
        violations: [{ code: 'AGGREGATE_NOT_FOUND', field: 'inspection.id', blocking: true, detail: 'Inspection not found.' }],
      };
    }
    const disputeCase = ports.cases.read(inspection.caseId);
    if (disputeCase === undefined) {
      return {
        ok: false,
        code: 'AGGREGATE_NOT_FOUND',
        message: 'Dispute case not found.',
        violations: [{ code: 'AGGREGATE_NOT_FOUND', field: 'case.id', blocking: true, detail: 'Dispute case not found.' }],
      };
    }
    const society = evaluateSocietyBoundary(actor.societyId, disputeCase);
    if (!society.allowed) {
      return { ok: false, code: 'CROSS_SOCIETY_BLOCKED', message: 'This case belongs to another society.', violations: society.violations };
    }
    const permission = evaluateActionPermission(actor.actorType, actor.role, ACTION_BY_COMMAND[command]);
    if (!permission.allowed) {
      return { ok: false, code: 'ACTOR_NOT_AUTHORIZED', message: 'You may not perform this inspection action.', violations: permission.violations };
    }
    const actorCheck = evaluateInspectionActor(command, actor.actorType);
    if (!actorCheck.allowed) {
      return { ok: false, code: 'ACTOR_NOT_AUTHORIZED', message: 'You may not issue this inspection command.', violations: actorCheck.violations };
    }
    const transition = evaluateInspectionTransition(inspection, command);
    if (!transition.allowed) {
      return {
        ok: false,
        code: transition.violations[0]?.code ?? 'ILLEGAL_TRANSITION',
        message: 'This inspection step is not available in the current state.',
        violations: transition.violations,
      };
    }
    return { ok: true, inspection, disputeCase };
  };

  const requestInspection = (
    actor: ActorContextInput,
    command: DisputeCommand,
    caseId: string,
    input: RequestInspectionInput,
  ): CaseCommandOutcome<Inspection> => {
    const disputeCase = ports.cases.read(caseId);
    if (disputeCase === undefined) {
      return fail('AGGREGATE_NOT_FOUND', 'Dispute case not found.');
    }
    const society = evaluateSocietyBoundary(actor.societyId, disputeCase);
    if (!society.allowed) {
      return fail('CROSS_SOCIETY_BLOCKED', 'This case belongs to another society.', society.violations);
    }
    const permission = evaluateActionPermission(actor.actorType, actor.role, 'REQUEST_INSPECTION');
    if (!permission.allowed) {
      return fail('ACTOR_NOT_AUTHORIZED', 'You may not request an inspection.', permission.violations);
    }
    const violations: DisputeViolation[] = [];
    if (input.preferredWindowLabel.trim().length < 3) {
      violations.push({ code: 'VALIDATION_FAILED', field: 'inspection.preferredWindowLabel', blocking: true, detail: 'A preferred window is required.' });
    }
    if (input.requestedOutcome.trim().length < 10) {
      violations.push({ code: 'VALIDATION_FAILED', field: 'inspection.requestedOutcome', blocking: true, detail: 'State what the inspection is expected to establish.' });
    }
    if (violations.length > 0) {
      return fail('VALIDATION_FAILED', 'The inspection request could not be recorded.', violations);
    }

    const requestedAt = now();
    const inspection: Inspection = {
      id: nextId('insp'),
      inspectionNumber: `${ports.numbering.prefix}-INSP-${ports.inspections.listByCase(caseId).length + 1}`,
      caseId,
      societyId: disputeCase.societyId,
      requestedByUserId: actor.userId,
      requestedAt,
      scheduledFor: undefined,
      assignedInspectorUserId: undefined,
      status: 'REQUESTED',
      findings: undefined,
      observedSourceUnitId: undefined,
      observedSourceIsSuspected: false,
      rootCauseStatement: undefined,
      recommendedAction: undefined,
      outcome: undefined,
      evidenceIds: [],
      completedAt: undefined,
      revisitsRequested: 0,
    };
    if (!ports.inspections.insert(inspection)) {
      return fail('CONCURRENT_WRITE', 'The inspection record was created concurrently.');
    }
    ports.ledger.record({
      envelope: command.envelope,
      fingerprint: fingerprintDisputeCommand(command.envelope),
      committedRevision: 1,
      resultStatus: inspection.status,
      committedAt: requestedAt,
    });

    const applied = attachInspectionToCase(disputeCase, inspection);
    if (!applied.ok) {
      return fail(applied.code, applied.message);
    }
    ports.cases.commit(inspection.caseId, applied.disputeCase, disputeCase.revision.revision);

    caseService.appendTimeline({
      caseId,
      societyId: disputeCase.societyId,
      eventType: 'INSPECTION_REQUESTED',
      actor,
      summary: `An inspection was requested to establish: ${input.requestedOutcome}`,
      relatedEntityId: inspection.id,
    });
    return succeed(inspection);
  };

  const scheduleInspection = (
    actor: ActorContextInput,
    command: DisputeCommand,
    inspectionId: string,
    input: { readonly scheduledFor: string; readonly assignedInspectorUserId: string },
  ): CaseCommandOutcome<Inspection> => {
    const resolved = resolveInspection(actor, inspectionId, 'SCHEDULE_INSPECTION');
    if (!resolved.ok) {
      return fail(resolved.code, resolved.message, resolved.violations);
    }
    if (Number.isNaN(Date.parse(input.scheduledFor))) {
      return fail('VALIDATION_FAILED', 'A valid inspection window is required.');
    }
    const next: Inspection = {
      ...resolved.inspection,
      status: INSPECTION_TARGET.SCHEDULE_INSPECTION,
      scheduledFor: new Date(input.scheduledFor).toISOString(),
      assignedInspectorUserId: input.assignedInspectorUserId,
    };
    if (!ports.inspections.update(next)) {
      return fail('CONCURRENT_WRITE', 'The inspection was modified concurrently.');
    }
    syncCaseSla(resolved.disputeCase, next);
    caseService.appendTimeline({
      caseId: resolved.disputeCase.id,
      societyId: resolved.disputeCase.societyId,
      eventType: 'INSPECTION_SCHEDULED',
      actor,
      summary: 'An inspection visit was scheduled with the facility team.',
      relatedEntityId: next.id,
    });
    caseService.notify(
      resolved.disputeCase.id,
      resolved.disputeCase.societyId,
      'INSPECTION_SCHEDULED',
      resolved.disputeCase.parties.map((party) => party.userId),
      `Inspection scheduled on case ${resolved.disputeCase.caseNumber}`,
      resolved.disputeCase.trace.correlationId,
    );
    void command;
    return succeed(next);
  };

  const completeInspection = (
    actor: ActorContextInput,
    command: DisputeCommand,
    inspectionId: string,
    input: CompleteInspectionInput,
  ): CaseCommandOutcome<Inspection> => {
    const resolved = resolveInspection(actor, inspectionId, 'COMPLETE_INSPECTION');
    if (!resolved.ok) {
      return fail(resolved.code, resolved.message, resolved.violations);
    }
    const violations: DisputeViolation[] = [];
    if (input.findings.trim().length < 15) {
      violations.push({ code: 'VALIDATION_FAILED', field: 'inspection.findings', blocking: true, detail: 'Record what was actually observed.' });
    }
    if (input.outcome !== 'ACCESS_NOT_AVAILABLE' && input.outcome !== 'INCONCLUSIVE' && input.rootCauseStatement.trim().length < 10) {
      violations.push({ code: 'VALIDATION_FAILED', field: 'inspection.rootCauseStatement', blocking: true, detail: 'A neutral root-cause statement is required when findings are conclusive.' });
    }
    if (input.observedSourceUnitId !== undefined && !input.observedSourceIsSuspected) {
      violations.push({ code: 'VALIDATION_FAILED', field: 'inspection.observedSourceIsSuspected', blocking: true, detail: 'An observed source must be recorded as suspected until a rule or inspection decision confirms responsibility.' });
    }
    if (violations.length > 0) {
      return fail('VALIDATION_FAILED', 'The inspection findings could not be recorded.', violations);
    }

    const next: Inspection = {
      ...resolved.inspection,
      status: INSPECTION_TARGET.COMPLETE_INSPECTION,
      findings: input.findings,
      observedSourceUnitId: input.observedSourceUnitId,
      observedSourceIsSuspected: input.observedSourceIsSuspected,
      rootCauseStatement: input.rootCauseStatement,
      recommendedAction: input.recommendedAction,
      outcome: input.outcome,
      evidenceIds: input.evidenceIds,
      completedAt: now(),
    };
    if (!ports.inspections.update(next)) {
      return fail('CONCURRENT_WRITE', 'The inspection was modified concurrently.');
    }
    const disputeCase = ports.cases.read(resolved.disputeCase.id);
    if (disputeCase === undefined) {
      return fail('AGGREGATE_NOT_FOUND', 'Dispute case not found.');
    }
    const commit = disputeCommand(
      disputeCase.id,
      'COMPLETE_INSPECTION',
      command.envelope.idempotencyKey,
      disputeCase.revision.revision,
    );
    if (!ports.cases.commit(disputeCase.id, { ...disputeCase, status: 'INSPECTION_COMPLETED', revision: { revision: disputeCase.revision.revision + 1, revisionToken: `${disputeCase.revision.revisionToken}+1` }, updatedAt: now() }, disputeCase.revision.revision)) {
      return fail('CONCURRENT_WRITE', 'The case was modified concurrently.');
    }
    ports.ledger.record({
      envelope: commit.envelope,
      fingerprint: fingerprintDisputeCommand(commit.envelope),
      committedRevision: disputeCase.revision.revision + 1,
      resultStatus: 'INSPECTION_COMPLETED',
      committedAt: now(),
    });
    caseService.appendTimeline({
      caseId: disputeCase.id,
      societyId: disputeCase.societyId,
      eventType: 'INSPECTION_COMPLETED',
      actor,
      summary: `Inspection findings recorded with outcome ${humanize(input.outcome)}.`,
      relatedEntityId: next.id,
    });
    caseService.notify(
      disputeCase.id,
      disputeCase.societyId,
      'INSPECTION_COMPLETED',
      disputeCase.parties.map((party) => party.userId),
      `Inspection completed on case ${disputeCase.caseNumber}`,
      disputeCase.trace.correlationId,
    );
    return succeed(next);
  };

  const attachInspectionToCase = (
    disputeCase: DisputeCase,
    inspection: Inspection,
  ): { ok: true; disputeCase: DisputeCase } | { ok: false; code: 'CONCURRENT_WRITE'; message: string } => {
    if (disputeCase.inspectionIds.includes(inspection.id)) {
      return { ok: false, code: 'CONCURRENT_WRITE', message: 'The inspection is already attached to this case.' };
    }
    return {
      ok: true,
      disputeCase: {
        ...disputeCase,
        status: 'UNDER_INVESTIGATION',
        inspectionIds: [...disputeCase.inspectionIds, inspection.id],
        sla: {
          ...disputeCase.sla,
          inspectionDueAt: inspectionDueAt(ports.policies.sla, inspection.requestedAt),
        },
        revision: { revision: disputeCase.revision.revision + 1, revisionToken: `${disputeCase.revision.revisionToken}+1` },
        updatedAt: now(),
      },
    };
  };

  const syncCaseSla = (disputeCase: DisputeCase, inspection: Inspection): void => {
    const stored = ports.cases.read(disputeCase.id);
    if (stored === undefined) {
      return;
    }
    const due = inspectionDueAt(ports.policies.sla, inspection.requestedAt);
    if (stored.sla.inspectionDueAt === due) {
      return;
    }
    ports.cases.commit(
      stored.id,
      { ...stored, sla: { ...stored.sla, inspectionDueAt: due }, revision: { revision: stored.revision.revision + 1, revisionToken: `${stored.revision.revisionToken}+1` } },
      stored.revision.revision,
    );
  };

  return {
    requestInspection,
    scheduleInspection,
    completeInspection,
    read: (inspectionId: string): Inspection | Absent => ports.inspections.read(inspectionId),
    listByCase: (caseId: string): readonly Inspection[] => ports.inspections.listByCase(caseId),
  };
}

export type InspectionService = ReturnType<typeof createInspectionService>;

function humanize(value: string): string {
  return value.replace(/_/g, ' ').toLowerCase();
}

export type InspectionOutcomeResult = DisputeOutcome<Inspection>;
