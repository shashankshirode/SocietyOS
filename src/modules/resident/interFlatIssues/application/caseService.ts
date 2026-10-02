import type { Absent } from '../../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../../core/audit/audit.types';
import type { DisputeCase, DisputeClaim, DisputeClosureRecord, DisputeParty, DisputePartyRole, DisputePropertyTag, DisputeResponse, DisputeResponsePosition, DisputeSeverity, DisputeCategory, } from '../domain/types/case.types';
import { findPartyByUserId } from '../domain/types/case.types';
import type { CaseAuditEntry, TimelineEvent, TimelineEventType } from '../domain/types/timeline.types';
import { containsDirectContactDetail, isNeutralSummary, nextSequence } from '../domain/types/timeline.types';
import type { EvidenceRecord, EvidenceSubmission } from '../domain/types/evidence.types';
import type { Inspection } from '../domain/types/inspection.types';
import type { DisputeCaseStatus } from '../domain/types/case.types';
import type { DisputeRetentionRecord } from '../domain/types/retention.types';
import type { DisputeActor, DisputeDecision, DisputeErrorCode, DisputeOutcome, DisputeTraceContext, DisputeViolation, } from '../domain/types';
import { fail, nextRevision, succeed, warning } from '../domain/types';
import type { CaseCommandKind } from '../domain/stateMachines/caseLifecycle';
import { evaluateCaseTransition, evaluateCommandActor, TARGET_STATUS_BY_COMMAND } from '../domain/stateMachines/caseLifecycle';
import { commitDisputeCommand, digestDisputePayload, fingerprintDisputeCommand, guardDisputeCommand, type DisputeCommandEnvelope, } from '../domain/guards/commandGuard';
import { evaluateActionPermission, evaluateCaseAccess, evaluatePartyMembership, evaluateSocietyBoundary, visibleEvidenceFor, visibleTimelineFor, type ActorContext, } from '../domain/guards/authorizationGuard';
import { responseDueAt } from '../domain/engines/slaEngine';
import type { CaseNotification, DisputePorts } from './ports';
export type ActorContextInput = ActorContext & {
    readonly displayName: string;
};
export function toActorContext(actor: DisputeActor): ActorContextInput {
    return {
        userId: actor.userId,
        role: actor.role,
        actorType: actor.actorType,
        societyId: actor.societyId,
        sessionId: actor.sessionId,
        authenticatedAt: actor.authenticatedAt,
        displayName: actor.displayName,
    };
}
export type DisputeCommand = {
    readonly envelope: DisputeCommandEnvelope;
    readonly expectedRevision: number;
};
export function disputeCommand(aggregateId: string, commandKind: string, idempotencyKey: string, expectedRevision: number, aggregateType: DisputeCommandEnvelope['aggregateType'] = 'DISPUTE_CASE', payloadParts: readonly string[] = []): DisputeCommand {
    return {
        envelope: {
            aggregateType,
            aggregateId,
            commandKind,
            idempotencyKey,
            payloadDigest: digestDisputePayload(payloadParts),
        },
        expectedRevision,
    };
}
export type OpenCaseInput = {
    readonly title: string;
    readonly category: DisputeCategory;
    readonly severity: DisputeSeverity;
    readonly description: string;
    readonly locationLabel: string;
    readonly reporterUnitId: string;
    readonly reporterTowerId: string | Absent;
    readonly respondentUnitId: string | Absent;
    readonly respondentUnitLabel: string | Absent;
    readonly respondentTowerId: string | Absent;
    readonly respondentUserId: string | Absent;
    readonly propertyTags: readonly DisputePropertyTag[];
    readonly trace: DisputeTraceContext;
};
export type RecordClaimInput = {
    readonly statement: string;
    readonly claimedCategory: DisputeCategory;
    readonly relatedEvidenceIds: readonly string[];
    readonly relatedInspectionIds: readonly string[];
};
export type RecordResponseInput = {
    readonly position: DisputeResponsePosition;
    readonly statement: string;
    readonly cooperatesWithInspection: boolean;
    readonly proposedOutcome: string | Absent;
    readonly evidenceIds: readonly string[];
};
export type CaseView = {
    readonly disputeCase: DisputeCase;
    readonly visibleEvents: readonly TimelineEvent[];
    readonly visibleEvidence: readonly EvidenceRecord[];
    readonly inspections: readonly Inspection[];
    readonly auditEntries: readonly CaseAuditEntry[];
};
export type CaseCommandOutcome<T> = DisputeOutcome<T> & {
    readonly revision?: number;
};
let idCounter = 0;
function nextId(prefix: string): string {
    idCounter += 1;
    return `${prefix}-${idCounter.toString(36)}`;
}
function neutralGuard(field: string, text: string): readonly DisputeViolation[] {
    const violations: DisputeViolation[] = [];
    if (!isNeutralSummary(text)) {
        violations.push({
            code: 'VALIDATION_FAILED',
            field,
            blocking: true,
            detail: 'Dispute records must stay neutral; adjudicative language is rejected.',
        });
    }
    if (containsDirectContactDetail(text)) {
        violations.push({
            code: 'COMMUNICATION_NOT_CONSENTED',
            field,
            blocking: true,
            detail: 'Direct contact details must not be recorded in a dispute case. Use the controlled channel so both parties are protected.',
        });
    }
    return violations;
}
function required(field: string, message: string, satisfied: boolean): readonly DisputeViolation[] {
    return satisfied
        ? []
        : [{ code: 'VALIDATION_FAILED' as const, field, blocking: true, detail: message }];
}
export function createCaseService(ports: DisputePorts) {
    const now = (): string => ports.clock.now().toISOString();
    const platformAudit = (input: {
        actor: ActorContextInput;
        action: AuditLogEntry['action'];
        entityType: AuditLogEntry['entityType'];
        entityId: string;
        outcome: AuditLogEntry['outcome'];
        correlationId: string;
        idempotencyKey: string;
    }): void => {
        ports.platformAudit.emit({
            id: `aud-${nextId('dispute')}`,
            timestamp: now(),
            correlationId: input.correlationId,
            actor: {
                userId: input.actor.userId,
                type: 'RESIDENT',
                role: input.actor.role,
                societyId: input.actor.societyId,
            },
            action: input.action,
            entityType: input.entityType,
            entityId: input.entityId,
            outcome: input.outcome,
            metadata: { source: 'MOBILE', idempotencyKey: input.idempotencyKey },
        });
    };
    const caseAudit = (input: {
        caseId: string;
        societyId: string;
        actor: ActorContextInput;
        action: string;
        entityType: string;
        entityId: string;
        correlationId: string;
        outcome: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
        detail: string;
    }): void => {
        const entry: CaseAuditEntry = {
            id: nextId('caudit'),
            caseId: input.caseId,
            societyId: input.societyId,
            occurredAt: now(),
            actorUserId: input.actor.userId,
            actorRole: input.actor.actorType,
            action: input.action,
            entityType: input.entityType,
            entityId: input.entityId,
            correlationId: input.correlationId,
            outcome: input.outcome,
            detail: input.detail,
        };
        ports.caseAudit.emit(entry);
    };
    const appendTimeline = (input: {
        caseId: string;
        societyId: string;
        eventType: TimelineEventType;
        actor: ActorContextInput;
        summary: string;
        audience?: TimelineEvent['audience'];
        relatedEntityId?: string | Absent;
    }): DisputeOutcome<TimelineEvent> => {
        const violations = neutralGuard('timeline.summary', input.summary);
        if (violations.length > 0) {
            return fail('VALIDATION_FAILED', 'Timeline summaries must remain neutral.', violations);
        }
        const event: TimelineEvent = {
            id: nextId('tl'),
            caseId: input.caseId,
            societyId: input.societyId,
            sequence: nextSequence(ports.timeline.listByCase(input.caseId)),
            eventType: input.eventType,
            actorUserId: input.actor.userId,
            actorRoleLabel: input.actor.actorType,
            occurredAt: now(),
            summary: input.summary,
            audience: input.audience ?? 'ALL_PARTIES',
            neutralStatement: true,
            relatedEntityId: input.relatedEntityId,
        };
        ports.timeline.append(event);
        return succeed(event);
    };
    const notify = (caseId: string, societyId: string, event: CaseNotification['event'], recipientUserIds: readonly (string | Absent)[], subject: string, correlationId: string): CaseNotification => {
        const recipients = [...new Set(recipientUserIds.filter((id): id is string => id !== undefined && id.length > 0))];
        const available = ports.notifications.isAvailable();
        const notification: CaseNotification = {
            notificationId: nextId('ntf'),
            caseId,
            societyId,
            event,
            recipientUserIds: recipients,
            channel: 'IN_APP',
            subject,
            delivered: available && recipients.length > 0,
            skipReason: available
                ? recipients.length === 0
                    ? 'NO_RECIPIENTS'
                    : undefined
                : 'CHANNEL_UNAVAILABLE',
            createdAt: now(),
        };
        return ports.notifications.send(notification);
    };
    const partyOf = (caseId: string, userId: string): DisputeParty | Absent => {
        const disputeCase = ports.cases.read(caseId);
        return disputeCase === undefined ? undefined : findPartyByUserId(disputeCase, userId);
    };
    const retentionFor = (disputeCase: DisputeCase): DisputeRetentionRecord => {
        const months = disputeCase.closedAt !== undefined
            ? ports.policies.retention.caseClosureRetentionMonths
            : ports.policies.retention.unresolvedRetentionMonths;
        const base = disputeCase.closedAt ?? disputeCase.createdAt;
        const reviewDueAt = new Date(Date.parse(base) + months * 2592000000).toISOString();
        const disposeAfterAt = new Date(Date.parse(reviewDueAt) + 2592000000).toISOString();
        return {
            caseId: disputeCase.id,
            societyId: disputeCase.societyId,
            policyRef: `${ports.policies.retention.caseClosureRetentionMonths}m/${ports.policies.retention.unresolvedRetentionMonths}m`,
            lifecycle: disputeCase.retentionHold ? 'HOLD' : 'ACTIVE',
            legalHoldActive: disputeCase.retentionHold,
            closureDate: disputeCase.closedAt,
            lastAccessAt: now(),
            reviewDueAt,
            disposeAfterAt,
            disposedAt: undefined,
        };
    };
    const saveRetention = (disputeCase: DisputeCase): void => {
        ports.retention.upsert(retentionFor(disputeCase));
    };
    const saveRetentionFor = (caseId: string): void => {
        const disputeCase = ports.cases.read(caseId);
        if (disputeCase !== undefined) {
            saveRetention(disputeCase);
        }
    };
    const withStatus = (disputeCase: DisputeCase, status: DisputeCase['status'], closure?: DisputeClosureRecord): DisputeCase => ({
        ...disputeCase,
        status,
        resolvedAt: status === 'RESOLVED' ? disputeCase.resolvedAt ?? now() : disputeCase.resolvedAt,
        closedAt: status === 'CLOSED' ? closure?.closedAt ?? now() : disputeCase.closedAt,
        closureOutcome: closure?.outcome ?? disputeCase.closureOutcome,
        closure,
        updatedAt: now(),
    });
    type Guarded = {
        readonly ok: true;
        readonly disputeCase: DisputeCase;
    } | {
        readonly ok: false;
        readonly code: DisputeErrorCode;
        readonly message: string;
        readonly violations: readonly DisputeViolation[];
    };
    const readCase = (caseId: string): DisputeCase | Absent => ports.cases.read(caseId);
    const authorize = (actor: ActorContextInput, disputeCase: DisputeCase, action: Parameters<typeof evaluateCaseAccess>[2]): DisputeDecision => evaluateCaseAccess(actor, disputeCase, action);
    const guardMutation = (actor: ActorContextInput, command: DisputeCommand, caseId: string, domainCommand: CaseCommandKind, action: Parameters<typeof evaluateCaseAccess>[2]): Guarded => {
        const disputeCase = readCase(caseId);
        if (disputeCase === undefined) {
            return { ok: false, code: 'AGGREGATE_NOT_FOUND', message: 'Dispute case not found.', violations: [{ code: 'AGGREGATE_NOT_FOUND', field: 'case.id', blocking: true, detail: 'Dispute case not found.' }] };
        }
        const society = evaluateSocietyBoundary(actor.societyId, disputeCase);
        if (!society.allowed) {
            caseAudit({
                caseId,
                societyId: disputeCase.societyId,
                actor,
                action: domainCommand,
                entityType: 'DISPUTE_CASE',
                entityId: caseId,
                correlationId: disputeCase.trace.correlationId,
                outcome: 'FAILURE',
                detail: 'Rejected: cross-society boundary.',
            });
            return { ok: false, code: 'CROSS_SOCIETY_BLOCKED', message: 'This case belongs to another society.', violations: society.violations };
        }
        const access = authorize(actor, disputeCase, action);
        if (!access.allowed) {
            caseAudit({
                caseId,
                societyId: disputeCase.societyId,
                actor,
                action: domainCommand,
                entityType: 'DISPUTE_CASE',
                entityId: caseId,
                correlationId: disputeCase.trace.correlationId,
                outcome: 'FAILURE',
                detail: `Rejected: ${access.violations[0]?.code ?? 'ACTOR_NOT_AUTHORIZED'}.`,
            });
            return {
                ok: false,
                code: access.violations[0]?.code ?? 'ACTOR_NOT_AUTHORIZED',
                message: 'You may not perform this action on this case.',
                violations: access.violations,
            };
        }
        const permitted = evaluateCommandActor(domainCommand, actor.actorType);
        if (!permitted.allowed) {
            return { ok: false, code: 'ACTOR_NOT_AUTHORIZED', message: 'You may not issue this command.', violations: permitted.violations };
        }
        const transition = evaluateCaseTransition(disputeCase, domainCommand);
        if (!transition.allowed) {
            return {
                ok: false,
                code: transition.violations[0]?.code ?? 'ILLEGAL_TRANSITION',
                message: 'This action is not available in the current case state.',
                violations: transition.violations,
            };
        }
        const guarded = guardDisputeCommand(command.envelope, command.expectedRevision, ports.ledger, ports.cases);
        if (!guarded.proceed) {
            const code = rejectionCode(guarded.rejection.kind);
            caseAudit({
                caseId,
                societyId: disputeCase.societyId,
                actor,
                action: domainCommand,
                entityType: 'DISPUTE_CASE',
                entityId: caseId,
                correlationId: disputeCase.trace.correlationId,
                outcome: 'FAILURE',
                detail: `Rejected: ${guarded.rejection.kind}.`,
            });
            return { ok: false, code, message: `Command rejected (${guarded.rejection.kind}).`, violations: guarded.violations };
        }
        return { ok: true, disputeCase };
    };
    const commitCase = (actor: ActorContextInput, command: DisputeCommand, disputeCase: DisputeCase, domainCommand: CaseCommandKind, mutate: (current: DisputeCase) => DisputeCase): {
        ok: true;
        disputeCase: DisputeCase;
    } | {
        ok: false;
        code: 'CONCURRENT_WRITE' | 'AGGREGATE_NOT_FOUND';
        message: string;
    } => {
        const timestamp = now();
        const next: DisputeCase = {
            ...mutate({ ...disputeCase, status: TARGET_STATUS_BY_COMMAND[domainCommand] }),
            revision: nextRevision(disputeCase.revision),
            updatedAt: timestamp,
        };
        if (!commitDisputeCommand(command.envelope, next, next.status, timestamp, ports.ledger, ports.cases)) {
            return { ok: false, code: 'CONCURRENT_WRITE', message: 'The case changed while this action was in flight; reload and retry.' };
        }
        const stored = readCase(disputeCase.id);
        if (stored === undefined) {
            return { ok: false, code: 'AGGREGATE_NOT_FOUND', message: 'Dispute case not found after commit.' };
        }
        saveRetention(stored);
        caseAudit({
            caseId: stored.id,
            societyId: stored.societyId,
            actor,
            action: domainCommand,
            entityType: 'DISPUTE_CASE',
            entityId: stored.id,
            correlationId: stored.trace.correlationId,
            outcome: 'SUCCESS',
            detail: `${domainCommand} applied; case is now ${stored.status}.`,
        });
        return { ok: true, disputeCase: stored };
    };
    const openCase = (actor: ActorContextInput, command: DisputeCommand, input: OpenCaseInput): CaseCommandOutcome<DisputeCase> => {
        const violations = [
            ...required('case.title', 'A short factual title is required.', input.title.trim().length >= 5),
            ...required('case.description', 'Describe what was observed in at least 20 characters.', input.description.trim().length >= 20),
            ...required('case.locationLabel', 'A location reference is required.', input.locationLabel.trim().length > 0),
            ...neutralGuard('case.description', input.description),
        ];
        if (violations.length > 0) {
            return fail('VALIDATION_FAILED', 'The dispute case could not be opened.', violations);
        }
        const openPermission = evaluateActionPermission(actor.actorType, actor.role, 'OPEN_CASE');
        if (!openPermission.allowed) {
            return fail('ACTOR_NOT_AUTHORIZED', 'Your role may not open dispute cases.', openPermission.violations);
        }
        const openingFingerprint = ledgerFingerprint({
            ...command.envelope,
            payloadDigest: digestDisputePayload([
                input.title.trim(),
                input.category,
                input.severity,
                input.description.trim(),
                input.locationLabel.trim(),
                input.reporterUnitId,
                input.respondentUnitId ?? '',
            ]),
        });
        const replay = ports.ledger.find(command.envelope.idempotencyKey);
        if (replay !== undefined) {
            const code = replay.fingerprint === openingFingerprint
                ? 'IDEMPOTENCY_KEY_REPLAY'
                : 'IDEMPOTENCY_KEY_CONFLICT';
            return fail(code, code === 'IDEMPOTENCY_KEY_REPLAY'
                ? 'This case was already opened with the supplied idempotency key.'
                : 'This idempotency key was already used for a different command.', [{ code, field: 'command.idempotencyKey', blocking: true, detail: 'Idempotency guard rejected the command.' }]);
        }
        if (command.envelope.idempotencyKey.trim().length === 0) {
            return fail('VALIDATION_FAILED', 'An idempotency key is required to open a dispute case.', [
                { code: 'VALIDATION_FAILED', field: 'command.idempotencyKey', blocking: true, detail: 'An idempotency key is required.' },
            ]);
        }
        const createdAt = now();
        const caseId = command.envelope.aggregateId.trim().length > 0 ? command.envelope.aggregateId : nextId('case');
        const sequence = ports.cases.nextCaseSequence(actor.societyId);
        const parties: DisputeParty[] = [
            {
                partyId: nextId('party'),
                role: 'REPORTER',
                userId: actor.userId,
                unitId: input.reporterUnitId,
                towerId: input.reporterTowerId,
                displayLabel: actor.displayName,
                invitedAt: createdAt,
                respondedAt: undefined,
                accessRevokedAt: undefined,
            },
        ];
        if (input.respondentUnitLabel !== undefined) {
            parties.push({
                partyId: nextId('party'),
                role: 'RESPONDENT',
                userId: input.respondentUserId,
                unitId: input.respondentUnitId,
                towerId: input.respondentTowerId,
                displayLabel: input.respondentUnitLabel,
                invitedAt: createdAt,
                respondedAt: undefined,
                accessRevokedAt: undefined,
            });
        }
        const disputeCase: DisputeCase = {
            id: caseId,
            caseNumber: `${ports.numbering.prefix}-${String(sequence).padStart(4, '0')}`,
            societyId: actor.societyId,
            title: input.title,
            category: input.category,
            severity: input.severity,
            status: 'OPEN',
            description: input.description,
            locationLabel: input.locationLabel,
            reporterUserId: actor.userId,
            reporterUnitId: input.reporterUnitId,
            parties,
            propertyTags: input.propertyTags,
            claims: [],
            responses: [],
            evidenceIds: [],
            inspectionIds: [],
            mediationId: undefined,
            proposalId: undefined,
            escalationId: undefined,
            financeLinkId: undefined,
            moveOutLinkId: undefined,
            communicationThreadId: undefined,
            retentionHold: false,
            retentionReviewAt: undefined,
            sla: {
                responseDueAt: responseDueAt(ports.policies.sla, input.severity, createdAt),
                inspectionDueAt: undefined,
                mediationReviewDueAt: undefined,
                lastBreachCode: undefined,
                lastBreachAt: undefined,
            },
            createdAt,
            updatedAt: createdAt,
            resolvedAt: undefined,
            closedAt: undefined,
            closureOutcome: undefined,
            closure: undefined,
            revision: { revision: 1, revisionToken: `rev-${caseId}-1` },
            trace: input.trace,
        };
        if (!ports.cases.insert(disputeCase)) {
            return fail('CONCURRENT_WRITE', 'The dispute case was created concurrently.');
        }
        ports.ledger.record({
            envelope: { ...command.envelope, aggregateId: caseId },
            fingerprint: openingFingerprint,
            committedRevision: disputeCase.revision.revision,
            resultStatus: disputeCase.status,
            committedAt: createdAt,
        });
        caseAudit({
            caseId,
            societyId: actor.societyId,
            actor,
            action: 'OPEN_CASE',
            entityType: 'DISPUTE_CASE',
            entityId: caseId,
            correlationId: input.trace.correlationId,
            outcome: 'SUCCESS',
            detail: `Case ${disputeCase.caseNumber} opened for ${disputeCase.category}.`,
        });
        platformAudit({
            actor,
            action: 'CREATE',
            entityType: 'COMPLAINT',
            entityId: caseId,
            outcome: 'SUCCESS',
            correlationId: input.trace.correlationId,
            idempotencyKey: command.envelope.idempotencyKey,
        });
        appendTimeline({
            caseId,
            societyId: actor.societyId,
            eventType: 'CASE_OPENED',
            actor,
            summary: `Case ${disputeCase.caseNumber} opened regarding ${humanize(disputeCase.category)}.`,
        });
        appendTimeline({
            caseId,
            societyId: actor.societyId,
            eventType: 'PARTY_INVITED',
            actor,
            summary: input.respondentUnitLabel === undefined
                ? 'No other party has been named on this case.'
                : `The unit recorded as ${input.respondentUnitLabel} was invited to respond.`,
        });
        notify(caseId, actor.societyId, 'CASE_OPENED', parties.map((party) => party.userId), `Dispute case ${disputeCase.caseNumber} opened`, input.trace.correlationId);
        notify(caseId, actor.societyId, 'RESPONSE_REQUESTED', parties.filter((party) => party.role === 'RESPONDENT').map((party) => party.userId), `Response requested on case ${disputeCase.caseNumber}`, input.trace.correlationId);
        return succeed(disputeCase, []);
    };
    const recordClaim = (actor: ActorContextInput, command: DisputeCommand, caseId: string, input: RecordClaimInput): CaseCommandOutcome<DisputeClaim> => {
        const guard = guardMutation(actor, command, caseId, 'RECORD_CLAIM', 'RECORD_CLAIM');
        if (!guard.ok) {
            return fail(guard.code, guard.message, guard.violations);
        }
        const violations = [
            ...required('claim.statement', 'A claim must describe what was observed.', input.statement.trim().length >= 10),
            ...neutralGuard('claim.statement', input.statement),
        ];
        if (violations.length > 0) {
            return fail('VALIDATION_FAILED', 'The claim could not be recorded.', violations);
        }
        const claim: DisputeClaim = {
            claimId: nextId('claim'),
            raisedByUserId: actor.userId,
            raisedAt: now(),
            statement: input.statement,
            claimedCategory: input.claimedCategory,
            relatedEvidenceIds: input.relatedEvidenceIds,
            relatedInspectionIds: input.relatedInspectionIds,
        };
        const committed = commitCase(actor, command, guard.disputeCase, 'RECORD_CLAIM', (current) => ({
            ...current,
            claims: [...current.claims, claim],
        }));
        if (!committed.ok) {
            return fail(committed.code, committed.message);
        }
        appendTimeline({
            caseId,
            societyId: guard.disputeCase.societyId,
            eventType: 'CLAIM_RECORDED',
            actor,
            summary: `A party recorded a claim describing ${humanize(input.claimedCategory)}.`,
        });
        return succeed(claim);
    };
    const recordResponse = (actor: ActorContextInput, command: DisputeCommand, caseId: string, input: RecordResponseInput): CaseCommandOutcome<DisputeResponse> => {
        const party = partyOf(caseId, actor.userId);
        if (party === undefined) {
            return fail('NOT_A_PARTY', 'Only a registered party of this case may record a response.');
        }
        const guard = guardMutation(actor, command, caseId, 'RECORD_RESPONSE', 'RECORD_RESPONSE');
        if (!guard.ok) {
            return fail(guard.code, guard.message, guard.violations);
        }
        const violations = [
            ...required('response.statement', 'A response must explain the position taken.', input.statement.trim().length >= 10),
            ...neutralGuard('response.statement', input.statement),
        ];
        if (violations.length > 0) {
            return fail('VALIDATION_FAILED', 'The response could not be recorded.', violations);
        }
        const response: DisputeResponse = {
            responseId: nextId('resp'),
            caseId,
            respondedByUserId: actor.userId,
            respondedByPartyId: party.partyId,
            position: input.position,
            statement: input.statement,
            cooperatesWithInspection: input.cooperatesWithInspection,
            proposedOutcome: input.proposedOutcome,
            evidenceIds: input.evidenceIds,
            submittedAt: now(),
        };
        const committed = commitCase(actor, command, guard.disputeCase, 'RECORD_RESPONSE', (current) => ({
            ...current,
            responses: [...current.responses, response],
            parties: current.parties.map((existing) => existing.partyId === party.partyId
                ? { ...existing, respondedAt: response.submittedAt }
                : existing),
        }));
        if (!committed.ok) {
            return fail(committed.code, committed.message);
        }
        appendTimeline({
            caseId,
            societyId: guard.disputeCase.societyId,
            eventType: 'RESPONSE_RECORDED',
            actor,
            summary: `The ${humanize(party.role)} position of ${humanize(input.position)} was recorded.`,
        });
        notify(caseId, guard.disputeCase.societyId, 'RESPONSE_RECEIVED', [guard.disputeCase.reporterUserId], `Response recorded on case ${guard.disputeCase.caseNumber}`, guard.disputeCase.trace.correlationId);
        return succeed(response);
    };
    const attachEvidence = (actor: ActorContextInput, command: DisputeCommand, caseId: string, input: EvidenceSubmission): CaseCommandOutcome<EvidenceRecord> => {
        const guard = guardMutation(actor, command, caseId, 'RECORD_CLAIM', 'ATTACH_EVIDENCE');
        if (!guard.ok) {
            return fail(guard.code, guard.message, guard.violations);
        }
        const violations = required('evidence.caption', 'Evidence must be captioned so its relevance is clear.', input.caption.trim().length >= 5);
        if (violations.length > 0) {
            return fail('VALIDATION_FAILED', 'The evidence could not be attached.', violations);
        }
        const party = partyOf(caseId, actor.userId);
        const verification = input.vaultDocumentId === undefined || input.vaultVersionId === undefined
            ? {
                available: false,
                documentVerified: false,
                checksumPresent: false,
                subjectAllowed: false,
                detail: 'Evidence must reference a Document Vault record before it can be retrieved.',
            }
            : ports.evidenceVault.verify({
                societyId: guard.disputeCase.societyId,
                caseId,
                requestingUserId: actor.userId,
                documentId: input.vaultDocumentId,
                versionId: input.vaultVersionId,
            });
        const lifecycle = verification.available && verification.documentVerified && verification.checksumPresent
            ? 'VERIFIED'
            : verification.available
                ? 'REJECTED'
                : 'PENDING_VAULT';
        const record: EvidenceRecord = {
            id: nextId('ev'),
            caseId,
            societyId: guard.disputeCase.societyId,
            kind: input.kind,
            caption: input.caption,
            submittedByUserId: actor.userId,
            submittedByPartyId: party?.partyId ?? 'UNASSIGNED',
            submittedAt: now(),
            vaultDocumentId: input.vaultDocumentId,
            vaultVersionId: input.vaultVersionId,
            vaultChecksum: undefined,
            visibility: input.visibility,
            lifecycle,
            affectedUnitIds: input.affectedUnitIds,
            rejectionReason: lifecycle === 'REJECTED' ? verification.detail : undefined,
            withdrawnAt: undefined,
        };
        if (!ports.evidence.insert(record)) {
            return fail('CONCURRENT_WRITE', 'That evidence record already exists.');
        }
        const committed = commitCase(actor, command, guard.disputeCase, 'RECORD_CLAIM', (current) => ({
            ...current,
            evidenceIds: [...current.evidenceIds, record.id],
        }));
        if (!committed.ok) {
            return fail(committed.code, committed.message);
        }
        appendTimeline({
            caseId,
            societyId: guard.disputeCase.societyId,
            eventType: lifecycle === 'VERIFIED' ? 'EVIDENCE_ATTACHED' : 'EVIDENCE_REJECTED',
            actor,
            summary: `Evidence of type ${humanize(input.kind)} was submitted and recorded as ${lifecycle.toLowerCase()}.`,
        });
        if (lifecycle === 'VERIFIED') {
            return succeed(record);
        }
        return succeed(record, [
            warning(lifecycle === 'PENDING_VAULT' ? 'EVIDENCE_VAULT_UNAVAILABLE' : 'EVIDENCE_NOT_VERIFIED', 'evidence.lifecycle', lifecycle === 'PENDING_VAULT'
                ? 'The evidence is attached but not retrievable until the Document Vault verifies it.'
                : verification.detail, true),
        ]);
    };
    const viewCase = (actor: ActorContextInput, caseId: string): CaseCommandOutcome<CaseView> => {
        const disputeCase = readCase(caseId);
        if (disputeCase === undefined) {
            return fail('AGGREGATE_NOT_FOUND', 'Dispute case not found.');
        }
        const access = authorize(actor, disputeCase, 'VIEW_CASE_SUMMARY');
        if (!access.allowed) {
            caseAudit({
                caseId,
                societyId: disputeCase.societyId,
                actor,
                action: 'VIEW_CASE_SUMMARY',
                entityType: 'DISPUTE_CASE',
                entityId: caseId,
                correlationId: disputeCase.trace.correlationId,
                outcome: 'FAILURE',
                detail: `Denied: ${access.violations[0]?.code ?? 'ACTOR_NOT_AUTHORIZED'}.`,
            });
            return fail(access.violations[0]?.code ?? 'ACTOR_NOT_AUTHORIZED', 'You may not view this dispute case.', access.violations);
        }
        const maySeeParties = authorize(actor, disputeCase, 'VIEW_PARTY_DETAILS').allowed;
        caseAudit({
            caseId,
            societyId: disputeCase.societyId,
            actor,
            action: 'VIEW_CASE_SUMMARY',
            entityType: 'DISPUTE_CASE',
            entityId: caseId,
            correlationId: disputeCase.trace.correlationId,
            outcome: 'SUCCESS',
            detail: `Case ${disputeCase.caseNumber} viewed.`,
        });
        return succeed({
            disputeCase: maySeeParties
                ? disputeCase
                : { ...disputeCase, parties: disputeCase.parties.map((party) => ({ ...party, displayLabel: 'Other affected unit' })) },
            visibleEvents: visibleTimelineFor(ports.timeline.listByCase(caseId), actor.actorType),
            visibleEvidence: visibleEvidenceFor(ports.evidence.listByCase(caseId), actor.actorType),
            inspections: maySeeParties ? ports.inspections.listByCase(caseId) : [],
            auditEntries: ports.caseAudit.listByCase(caseId),
        });
    };
    const listCasesForActor = (actor: ActorContextInput): readonly DisputeCase[] => {
        const candidates = new Map<string, DisputeCase>();
        for (const disputeCase of ports.cases.listBySociety(actor.societyId)) {
            candidates.set(disputeCase.id, disputeCase);
        }
        for (const disputeCase of ports.cases.listByParty(actor.societyId, actor.userId)) {
            candidates.set(disputeCase.id, disputeCase);
        }
        return [...candidates.values()].filter((disputeCase) => authorize(actor, disputeCase, 'VIEW_CASE_SUMMARY').allowed);
    };
    const partyIdFor = (disputeCase: DisputeCase, role: DisputePartyRole): string | Absent => disputeCase.parties.find((party) => party.role === role && party.accessRevokedAt === undefined)?.partyId;
    return {
        openCase,
        recordClaim,
        recordResponse,
        attachEvidence,
        viewCase,
        listCasesForActor,
        partyOf,
        partyIdFor,
        membershipDecision: (actorType: ActorContextInput['actorType'], userId: string, disputeCase: DisputeCase) => evaluatePartyMembership(actorType, userId, disputeCase, 'VIEW_CASE_SUMMARY'),
        retentionFor,
        saveRetention,
        saveRetentionFor,
        withStatus,
        appendTimeline,
        notify,
        caseAudit,
        platformAudit,
        now,
        ports,
    };
}
export type CaseService = ReturnType<typeof createCaseService>;
function humanize(value: string): string {
    return value.replace(/_/g, ' ').toLowerCase();
}
function ledgerFingerprint(envelope: DisputeCommandEnvelope): string {
    return fingerprintDisputeCommand(envelope);
}
function rejectionCode(kind: string): 'IDEMPOTENCY_KEY_REPLAY' | 'IDEMPOTENCY_KEY_CONFLICT' | 'REVISION_MISMATCH' | 'AGGREGATE_NOT_FOUND' | 'CONCURRENT_WRITE' {
    if (kind === 'REPLAY') {
        return 'IDEMPOTENCY_KEY_REPLAY';
    }
    if (kind === 'STALE_REVISION') {
        return 'REVISION_MISMATCH';
    }
    if (kind === 'AGGREGATE_MISSING') {
        return 'AGGREGATE_NOT_FOUND';
    }
    if (kind === 'CONCURRENT_WRITE') {
        return 'CONCURRENT_WRITE';
    }
    return 'IDEMPOTENCY_KEY_CONFLICT';
}

