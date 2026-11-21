import type { Absent } from '../../../../shared/types/absence.types';
import type { DisputeCase } from '../domain/types/case.types';
import type { ClosureProof, MediatorNote, MediatorNoteVisibility, PartyDecision, ResolutionAcceptanceScope, ResolutionProposal, } from '../domain/types/mediation.types';
import { requiredPartiesFor } from '../domain/types/mediation.types';
import type { DisputeErrorCode, DisputeOutcome, DisputeViolation } from '../domain/types';
import { fail, succeed } from '../domain/types';
import type { Mediation, MediationCommandKind, MediationStatus } from '../domain/stateMachines/mediationMachine';
import { evaluateMediationActor, evaluateMediationTransition, MEDIATION_TARGET, mediatorNoteViolations, noteVisibilityForActor, visibleNotesFor, } from '../domain/stateMachines/mediationMachine';
import { mediationReviewDueAt } from '../domain/engines/slaEngine';
import { containsDirectContactDetail, isNeutralSummary } from '../domain/types/timeline.types';
import { evaluateActionPermission, evaluateCaseAccess, evaluateSocietyBoundary } from '../domain/guards/authorizationGuard';
import type { ActorContextInput, CaseCommandOutcome, CaseService, DisputeCommand } from './caseService';
import { fingerprintDisputeCommand } from '../domain/guards/commandGuard';
import type { DisputePorts } from './ports';
let counter = 0;
function nextId(prefix: string): string {
    counter += 1;
    return `${prefix}-${counter.toString(36)}`;
}
export type RequestMediationInput = {
    readonly reason: string;
};
export type RecordMediatorNoteInput = {
    readonly note: string;
    readonly visibility: MediatorNoteVisibility;
};
export type ProposeResolutionInput = {
    readonly description: string;
    readonly responsiblePartyLabel: string;
    readonly targetDate: string;
    readonly acceptanceScope: ResolutionAcceptanceScope;
};
export type DecideProposalInput = {
    readonly decision: 'ACCEPTED' | 'REJECTED';
    readonly feedback: string | Absent;
};
type Guarded = {
    readonly ok: true;
    readonly disputeCase: DisputeCase;
} | {
    readonly ok: false;
    readonly code: DisputeErrorCode;
    readonly message: string;
    readonly violations: readonly DisputeViolation[];
};
export function createMediationService(ports: DisputePorts, caseService: CaseService) {
    const now = (): string => ports.clock.now().toISOString();
    const guardCase = (actor: ActorContextInput, caseId: string, action: Parameters<typeof evaluateCaseAccess>[2]): Guarded => {
        const disputeCase = ports.cases.read(caseId);
        if (disputeCase === undefined) {
            return { ok: false, code: 'AGGREGATE_NOT_FOUND', message: 'Dispute case not found.', violations: [{ code: 'AGGREGATE_NOT_FOUND', field: 'case.id', blocking: true, detail: 'Dispute case not found.' }] };
        }
        const society = evaluateSocietyBoundary(actor.societyId, disputeCase);
        if (!society.allowed) {
            return { ok: false, code: 'CROSS_SOCIETY_BLOCKED', message: 'This case belongs to another society.', violations: society.violations };
        }
        const access = evaluateCaseAccess(actor, disputeCase, action);
        if (!access.allowed) {
            return { ok: false, code: access.violations[0]?.code ?? 'ACTOR_NOT_AUTHORIZED', message: 'You may not perform this action.', violations: access.violations };
        }
        return { ok: true, disputeCase };
    };
    const guardMediation = (actor: ActorContextInput, mediation: Mediation, command: MediationCommandKind): {
        readonly ok: true;
        readonly disputeCase: DisputeCase;
    } | {
        readonly ok: false;
        readonly code: DisputeErrorCode;
        readonly message: string;
        readonly violations: readonly DisputeViolation[];
    } => {
        const guarded = guardCase(actor, mediation.caseId, 'VIEW_CASE_SUMMARY');
        if (!guarded.ok) {
            return guarded;
        }
        const actorCheck = evaluateMediationActor(command, actor.actorType);
        if (!actorCheck.allowed) {
            return { ok: false, code: 'ACTOR_NOT_AUTHORIZED', message: 'You may not issue this mediation command.', violations: actorCheck.violations };
        }
        const transition = evaluateMediationTransition(mediation, command);
        if (!transition.allowed) {
            return {
                ok: false,
                code: transition.violations[0]?.code ?? 'MEDIATION_NOT_ACTIVE',
                message: 'This mediation step is not available in the current state.',
                violations: transition.violations,
            };
        }
        return guarded;
    };
    const advanceMediation = (mediation: Mediation, status: MediationStatus): Mediation => {
        if (!ports.mediations.update({ ...mediation, status })) {
            return mediation;
        }
        return { ...mediation, status };
    };
    const setCaseStatus = (disputeCase: DisputeCase, status: DisputeCase['status'], patch: Partial<Pick<DisputeCase, 'mediationId' | 'proposalId'>> = {}): DisputeCase => {
        const next: DisputeCase = {
            ...disputeCase,
            ...patch,
            status,
            updatedAt: now(),
            revision: { revision: disputeCase.revision.revision + 1, revisionToken: `${disputeCase.revision.revisionToken}+1` },
        };
        ports.cases.commit(disputeCase.id, next, disputeCase.revision.revision);
        caseService.saveRetention(next);
        return next;
    };
    const requestMediation = (actor: ActorContextInput, command: DisputeCommand, caseId: string, input: RequestMediationInput): CaseCommandOutcome<Mediation> => {
        const guarded = guardCase(actor, caseId, 'REQUEST_MEDIATION');
        if (!guarded.ok) {
            return fail(guarded.code, guarded.message, guarded.violations);
        }
        if (input.reason.trim().length < 10) {
            return fail('VALIDATION_FAILED', 'State why mediation is being requested.');
        }
        const existing = ports.mediations.read(guarded.disputeCase.mediationId ?? '');
        if (existing !== undefined && existing.status !== 'CLOSED') {
            return fail('PRECONDITION_FAILED', 'An open mediation already exists for this case.');
        }
        const requestedAt = now();
        const mediation: Mediation = {
            id: nextId('med'),
            caseId,
            societyId: guarded.disputeCase.societyId,
            status: MEDIATION_TARGET.REQUEST_MEDIATION,
            mediatorUserId: undefined,
            notes: [],
            requestedByUserId: actor.userId,
            requestedAt,
            assignedAt: undefined,
            closedAt: undefined,
        };
        if (!ports.mediations.insert(mediation)) {
            return fail('CONCURRENT_WRITE', 'The mediation record was created concurrently.');
        }
        ports.ledger.record({
            envelope: command.envelope,
            fingerprint: fingerprintDisputeCommand(command.envelope),
            committedRevision: guarded.disputeCase.revision.revision,
            resultStatus: 'MEDIATION_REQUESTED',
            committedAt: requestedAt,
        });
        setCaseStatus(guarded.disputeCase, 'MEDIATION_REQUESTED', { mediationId: mediation.id });
        caseService.appendTimeline({
            caseId,
            societyId: guarded.disputeCase.societyId,
            eventType: 'MEDIATION_REQUESTED',
            actor,
            summary: `Mediation was requested: ${input.reason}`,
            relatedEntityId: mediation.id,
        });
        return succeed(mediation);
    };
    const assignMediator = (actor: ActorContextInput, mediationId: string, mediatorUserId: string): CaseCommandOutcome<Mediation> => {
        const mediation = ports.mediations.read(mediationId);
        if (mediation === undefined) {
            return fail('AGGREGATE_NOT_FOUND', 'Mediation not found.');
        }
        const guarded = guardMediation(actor, mediation, 'ASSIGN_MEDIATOR');
        if (!guarded.ok) {
            return fail(guarded.code, guarded.message, guarded.violations);
        }
        const next = advanceMediation(mediation, MEDIATION_TARGET.ASSIGN_MEDIATOR);
        const withMediator = ports.mediations.update({ ...next, mediatorUserId, assignedAt: now() });
        if (!withMediator) {
            return fail('CONCURRENT_WRITE', 'The mediation was modified concurrently.');
        }
        setCaseStatus(guarded.disputeCase, 'MEDIATION_ACTIVE');
        caseService.appendTimeline({
            caseId: mediation.caseId,
            societyId: mediation.societyId,
            eventType: 'MEDIATOR_ASSIGNED',
            actor,
            summary: 'A neutral mediator was assigned to the case.',
            relatedEntityId: mediationId,
        });
        caseService.notify(mediation.caseId, mediation.societyId, 'MEDIATION_ASSIGNED', [mediatorUserId], 'A mediator was assigned to your dispute case', guarded.disputeCase.trace.correlationId);
        return succeed({ ...next, mediatorUserId, assignedAt: now() });
    };
    const recordMediatorNote = (actor: ActorContextInput, mediationId: string, input: RecordMediatorNoteInput): CaseCommandOutcome<MediatorNote> => {
        const mediation = ports.mediations.read(mediationId);
        if (mediation === undefined) {
            return fail('AGGREGATE_NOT_FOUND', 'Mediation not found.');
        }
        const guarded = guardMediation(actor, mediation, 'RECORD_NOTE');
        if (!guarded.ok) {
            return fail(guarded.code, guarded.message, guarded.violations);
        }
        const visibility = noteVisibilityForActor(input.visibility, actor.actorType);
        if (!visibility.allowed) {
            return fail('MEDIATION_NOTE_VISIBILITY_DENIED', 'You may not record a note with that visibility.', visibility.violations);
        }
        const violations = mediatorNoteViolations(input.note, input.visibility);
        if (violations.length > 0) {
            return fail('VALIDATION_FAILED', 'The mediator note could not be recorded.', violations);
        }
        const note: MediatorNote = {
            id: nextId('note'),
            mediationId,
            caseId: mediation.caseId,
            authorUserId: actor.userId,
            authorRoleLabel: actor.actorType,
            note: input.note,
            visibility: input.visibility,
            createdAt: now(),
        };
        const next: Mediation = { ...mediation, notes: [...mediation.notes, note] };
        if (!ports.mediations.update(next)) {
            return fail('CONCURRENT_WRITE', 'The mediation was modified concurrently.');
        }
        caseService.appendTimeline({
            caseId: mediation.caseId,
            societyId: mediation.societyId,
            eventType: 'MEDIATION_NOTE_RECORDED',
            actor,
            summary: 'A mediation note was recorded.',
            audience: input.visibility === 'ALL_PARTIES' ? 'ALL_PARTIES' : 'COMMITTEE_AND_MEDIATOR',
            relatedEntityId: note.id,
        });
        return succeed(note);
    };
    const proposeResolution = (actor: ActorContextInput, command: DisputeCommand, mediationId: string, input: ProposeResolutionInput): CaseCommandOutcome<ResolutionProposal> => {
        const mediation = ports.mediations.read(mediationId);
        if (mediation === undefined) {
            return fail('AGGREGATE_NOT_FOUND', 'Mediation not found.');
        }
        const guarded = guardMediation(actor, mediation, 'PROPOSE_RESOLUTION');
        if (!guarded.ok) {
            return fail(guarded.code, guarded.message, guarded.violations);
        }
        const violations: DisputeViolation[] = [];
        if (input.description.trim().length < 15) {
            violations.push({ code: 'VALIDATION_FAILED', field: 'proposal.description', blocking: true, detail: 'Describe the proposed outcome.' });
        }
        if (!isNeutralSummary(input.description)) {
            violations.push({
                code: 'VALIDATION_FAILED',
                field: 'proposal.description',
                blocking: true,
                detail: 'A proposal must describe an outcome without assigning guilt or fault.',
            });
        }
        if (containsDirectContactDetail(input.description)) {
            violations.push({
                code: 'COMMUNICATION_NOT_CONSENTED',
                field: 'proposal.description',
                blocking: true,
                detail: 'Direct contact details must not be recorded in a case. Use the controlled channel instead.',
            });
        }
        if (Number.isNaN(Date.parse(input.targetDate))) {
            violations.push({ code: 'VALIDATION_FAILED', field: 'proposal.targetDate', blocking: true, detail: 'A valid target date is required.' });
        }
        const reporterPartyId = caseService.partyIdFor(guarded.disputeCase, 'REPORTER');
        const respondentPartyId = caseService.partyIdFor(guarded.disputeCase, 'RESPONDENT');
        const committeePartyId = caseService.partyIdFor(guarded.disputeCase, 'COMMITTEE_OBSERVER');
        const requiredPartyIds = requiredPartiesFor(input.acceptanceScope, {
            reporter: reporterPartyId ?? 'REPORTER_MISSING',
            respondent: respondentPartyId,
            committee: committeePartyId,
        });
        if (input.acceptanceScope === 'RESPONDENT_ONLY' && respondentPartyId === undefined) {
            violations.push({ code: 'PRECONDITION_FAILED', field: 'proposal.acceptanceScope', blocking: true, detail: 'No respondent is registered on this case.' });
        }
        if (violations.length > 0) {
            return fail('VALIDATION_FAILED', 'The resolution proposal could not be created.', violations);
        }
        const proposal: ResolutionProposal = {
            id: nextId('prop'),
            proposalNumber: `${ports.numbering.prefix}-PROP-${ports.proposals.listByCase(mediation.caseId).length + 1}`,
            mediationId,
            caseId: mediation.caseId,
            societyId: mediation.societyId,
            description: input.description,
            responsiblePartyLabel: input.responsiblePartyLabel,
            targetDate: new Date(input.targetDate).toISOString(),
            acceptanceScope: input.acceptanceScope,
            requiredPartyIds,
            decisions: [],
            status: 'PENDING',
            committeeApprovedByUserId: undefined,
            createdByUserId: actor.userId,
            createdAt: now(),
            decidedAt: undefined,
        };
        if (!ports.proposals.insert(proposal)) {
            return fail('CONCURRENT_WRITE', 'The proposal was created concurrently.');
        }
        ports.ledger.record({
            envelope: command.envelope,
            fingerprint: fingerprintDisputeCommand(command.envelope),
            committedRevision: 1,
            resultStatus: 'PENDING',
            committedAt: proposal.createdAt,
        });
        advanceMediation(mediation, MEDIATION_TARGET.PROPOSE_RESOLUTION);
        setCaseStatus(guarded.disputeCase, 'RESOLUTION_PROPOSED');
        caseService.appendTimeline({
            caseId: mediation.caseId,
            societyId: mediation.societyId,
            eventType: 'RESOLUTION_PROPOSED',
            actor,
            summary: 'A resolution proposal was recorded for party consideration.',
            relatedEntityId: proposal.id,
        });
        caseService.notify(mediation.caseId, mediation.societyId, 'RESOLUTION_PROPOSED', guarded.disputeCase.parties.map((party) => party.userId), `A resolution proposal is ready on case ${guarded.disputeCase.caseNumber}`, guarded.disputeCase.trace.correlationId);
        return succeed(proposal);
    };
    const decideProposal = (actor: ActorContextInput, proposalId: string, input: DecideProposalInput): CaseCommandOutcome<ResolutionProposal> => {
        const proposal = ports.proposals.read(proposalId);
        if (proposal === undefined) {
            return fail('AGGREGATE_NOT_FOUND', 'Resolution proposal not found.');
        }
        const guarded = guardCase(actor, proposal.caseId, input.decision === 'ACCEPTED' ? 'ACCEPT_PROPOSAL' : 'REJECT_PROPOSAL');
        if (!guarded.ok) {
            return fail(guarded.code, guarded.message, guarded.violations);
        }
        if (proposal.status !== 'PENDING') {
            return fail('PROPOSAL_ALREADY_DECIDED', 'This proposal has already been decided.');
        }
        const party = caseService.partyOf(proposal.caseId, actor.userId);
        const isCommittee = actor.actorType === 'SOCIETY_ADMIN' || actor.actorType === 'COMMITTEE_MEMBER' || actor.actorType === 'SOCIETY_SECRETARY' || actor.actorType === 'SOCIETY_CHAIRPERSON';
        if (!isCommittee && party === undefined) {
            return fail('NOT_A_PARTY', 'Only a registered party or the committee may decide a proposal.');
        }
        const partyId = party?.partyId;
        if (!isCommittee && partyId !== undefined && !proposal.requiredPartyIds.includes(partyId)) {
            return fail('PRECONDITION_FAILED', 'This proposal requires acceptance from a different set of parties.');
        }
        const decision: PartyDecision = {
            partyId: isCommittee ? 'COMMITTEE' : (partyId ?? 'UNASSIGNED'),
            decidedByUserId: actor.userId,
            decision: input.decision,
            feedback: input.feedback,
            decidedAt: now(),
        };
        const decisions = proposal.decisions.filter((existing) => existing.partyId !== decision.partyId);
        const merged = [...decisions, decision];
        const required = new Set(proposal.requiredPartyIds);
        const satisfied = required.size > 0 && [...required].every((id) => merged.some((entry) => entry.partyId === id));
        const rejected = merged.some((entry) => entry.decision === 'REJECTED');
        const status = rejected ? 'REJECTED' : satisfied ? 'ACCEPTED' : 'PENDING';
        const next: ResolutionProposal = {
            ...proposal,
            decisions: merged,
            status,
            committeeApprovedByUserId: isCommittee ? actor.userId : proposal.committeeApprovedByUserId,
            decidedAt: status === 'PENDING' ? undefined : now(),
        };
        if (!ports.proposals.update(next)) {
            return fail('CONCURRENT_WRITE', 'The proposal was modified concurrently.');
        }
        caseService.appendTimeline({
            caseId: proposal.caseId,
            societyId: proposal.societyId,
            eventType: status === 'REJECTED' ? 'PROPOSAL_REJECTED' : 'PROPOSAL_ACCEPTED',
            actor,
            summary: status === 'REJECTED'
                ? 'A party recorded a rejection of the proposed outcome.'
                : satisfied
                    ? 'The required parties accepted the proposed outcome.'
                    : 'A party recorded acceptance; further acceptance is still required.',
            relatedEntityId: proposal.id,
        });
        caseService.notify(proposal.caseId, proposal.societyId, 'PROPOSAL_DECIDED', [proposal.createdByUserId], `Proposal ${proposal.proposalNumber} was updated`, guarded.disputeCase.trace.correlationId);
        return succeed(next);
    };
    const submitClosureProof = (actor: ActorContextInput, caseId: string, input: {
        readonly statement: string;
        readonly proposalId: string;
        readonly evidenceIds: readonly string[];
    }): CaseCommandOutcome<ClosureProof> => {
        const guarded = guardCase(actor, caseId, 'SUBMIT_CLOSURE_PROOF');
        if (!guarded.ok) {
            return fail(guarded.code, guarded.message, guarded.violations);
        }
        const proposal = ports.proposals.read(input.proposalId);
        if (proposal === undefined || proposal.caseId !== caseId) {
            return fail('AGGREGATE_NOT_FOUND', 'The referenced resolution proposal was not found on this case.');
        }
        if (proposal.status !== 'ACCEPTED') {
            return fail('PRECONDITION_FAILED', 'Closure proof can only follow an accepted resolution proposal.');
        }
        if (input.statement.trim().length < 15) {
            return fail('VALIDATION_FAILED', 'Describe what was done to satisfy the resolution.');
        }
        const proof: ClosureProof = {
            id: nextId('proof'),
            caseId,
            proposalId: input.proposalId,
            societyId: guarded.disputeCase.societyId,
            submittedByUserId: actor.userId,
            statement: input.statement,
            evidenceIds: input.evidenceIds,
            submittedAt: now(),
            verifiedByUserId: undefined,
            verifiedAt: undefined,
        };
        if (!ports.closureProofs.insert(proof)) {
            return fail('CONCURRENT_WRITE', 'The closure proof was recorded concurrently.');
        }
        setCaseStatus(guarded.disputeCase, 'AWAITING_CLOSURE_PROOF');
        caseService.appendTimeline({
            caseId,
            societyId: guarded.disputeCase.societyId,
            eventType: 'CLOSURE_PROOF_SUBMITTED',
            actor,
            summary: 'Closure proof was submitted for committee verification.',
            relatedEntityId: proof.id,
        });
        return succeed(proof);
    };
    const verifyClosureProof = (actor: ActorContextInput, proofId: string): CaseCommandOutcome<ClosureProof> => {
        const proof = ports.closureProofs.read(proofId);
        if (proof === undefined) {
            return fail('AGGREGATE_NOT_FOUND', 'Closure proof not found.');
        }
        const guarded = guardCase(actor, proof.caseId, 'VERIFY_CLOSURE_PROOF');
        if (!guarded.ok) {
            return fail(guarded.code, guarded.message, guarded.violations);
        }
        if (proof.verifiedAt !== undefined) {
            return fail('PROPOSAL_ALREADY_DECIDED', 'This closure proof was already verified.');
        }
        const next: ClosureProof = { ...proof, verifiedByUserId: actor.userId, verifiedAt: now() };
        if (!ports.closureProofs.update(next)) {
            return fail('CONCURRENT_WRITE', 'The closure proof was modified concurrently.');
        }
        return succeed(next);
    };
    const notesFor = (mediationId: string, actorType: ActorContextInput['actorType']): readonly MediatorNote[] => {
        const mediation = ports.mediations.read(mediationId);
        return mediation === undefined ? [] : visibleNotesFor(mediation.notes, actorType);
    };
    return {
        requestMediation,
        assignMediator,
        recordMediatorNote,
        proposeResolution,
        decideProposal,
        submitClosureProof,
        verifyClosureProof,
        notesFor,
        readMediation: (mediationId: string): Mediation | Absent => ports.mediations.read(mediationId),
        readProposal: (proposalId: string): ResolutionProposal | Absent => ports.proposals.read(proposalId),
        mediationReviewDue: (requestedAt: string): string => mediationReviewDueAt(ports.policies.sla, requestedAt),
    };
}
export type MediationService = ReturnType<typeof createMediationService>;

