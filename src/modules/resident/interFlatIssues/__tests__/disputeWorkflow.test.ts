import { admin, command, inspector, mediator, newRuntime, openStandardCase, reporter, respondent, revisionOf, } from './fixtures/disputeHarness';
import type { DisputeRuntime } from '../infrastructure/disputeRuntime';
function respond(runtime: DisputeRuntime, caseId: string): void {
    const result = runtime.cases.recordResponse(respondent(), command(caseId, 'RECORD_RESPONSE', `resp-${caseId}`, revisionOf(runtime, caseId)), caseId, {
        position: 'ACKNOWLEDGE_AND_COOPERATE',
        statement: 'The drilling did happen on two of those evenings, and we are willing to agree on quiet hours.',
        cooperatesWithInspection: true,
        proposedOutcome: undefined,
        evidenceIds: [],
    });
    if (!result.ok) {
        throw new Error(`recordResponse failed: ${result.code}`);
    }
}
function runInspection(runtime: DisputeRuntime, caseId: string, key: string): string {
    const requested = runtime.inspections.requestInspection(reporter(), command(caseId, 'REQUEST_INSPECTION', `insp-req-${key}`, revisionOf(runtime, caseId)), caseId, {
        preferredWindowLabel: 'Weekday evening after 18:00',
        requestedOutcome: 'Establish whether construction noise reaches the reporter bedroom.',
    });
    if (!requested.ok) {
        throw new Error(`requestInspection failed: ${requested.code}`);
    }
    const scheduled = runtime.inspections.scheduleInspection(inspector(), command(requested.value.id, 'SCHEDULE_INSPECTION', `insp-sched-${key}`, 0), requested.value.id, {
        scheduledFor: '2026-03-05T18:30:00.000Z',
        assignedInspectorUserId: 'user-inspector',
    });
    if (!scheduled.ok) {
        throw new Error(`scheduleInspection failed: ${scheduled.code}`);
    }
    const completed = runtime.inspections.completeInspection(inspector(), command(requested.value.id, 'COMPLETE_INSPECTION', `insp-done-${key}`, 0), requested.value.id, {
        findings: 'Sound level at the bedroom wall measured 62 dBA during drilling and dropped to 38 dBA afterwards.',
        observedSourceUnitId: undefined,
        observedSourceIsSuspected: false,
        rootCauseStatement: 'The observed drilling corresponds to permitted daytime hours recorded in the building log.',
        recommendedAction: 'Agree quiet hours in writing and re-measure after one month.',
        outcome: 'FINDINGS_RECORDED',
        evidenceIds: [],
    });
    if (!completed.ok) {
        throw new Error(`completeInspection failed: ${completed.code}`);
    }
    return requested.value.id;
}
function openMediation(runtime: DisputeRuntime, caseId: string, key: string): string {
    const requested = runtime.mediation.requestMediation(reporter(), command(caseId, 'REQUEST_MEDIATION', `med-req-${key}`, revisionOf(runtime, caseId)), caseId, { reason: 'Direct conversation has not resolved the recurring disturbance.' });
    if (!requested.ok) {
        throw new Error(`requestMediation failed: ${requested.code}`);
    }
    const assigned = runtime.mediation.assignMediator(admin(), requested.value.id, 'user-mediator');
    if (!assigned.ok) {
        throw new Error(`assignMediator failed: ${assigned.code}`);
    }
    return requested.value.id;
}
describe('dispute inspection, mediation and closure', () => {
    it('carries a case through inspection to a recorded neutral finding', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        respond(runtime, caseId);
        const inspectionId = runInspection(runtime, caseId, 'a');
        const stored = runtime.ports.cases.read(caseId);
        const inspection = runtime.ports.inspections.read(inspectionId);
        expect(stored?.status).toBe('INSPECTION_COMPLETED');
        expect(stored?.inspectionIds).toEqual([inspectionId]);
        expect(inspection?.outcome).toBe('FINDINGS_RECORDED');
        expect(inspection?.assignedInspectorUserId).toBe('user-inspector');
    });
    it('refuses to record a conclusive inspection without a neutral root-cause statement', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const requested = runtime.inspections.requestInspection(reporter(), command(caseId, 'REQUEST_INSPECTION', 'insp-req-b', revisionOf(runtime, caseId)), caseId, {
            preferredWindowLabel: 'Weekday evening after 18:00',
            requestedOutcome: 'Establish whether construction noise reaches the reporter bedroom.',
        });
        if (!requested.ok) {
            throw new Error(`requestInspection failed: ${requested.code}`);
        }
        const scheduled = runtime.inspections.scheduleInspection(inspector(), command(requested.value.id, 'SCHEDULE_INSPECTION', 'insp-sched-b', 0), requested.value.id, { scheduledFor: '2026-03-05T18:30:00.000Z', assignedInspectorUserId: 'user-inspector' });
        if (!scheduled.ok) {
            throw new Error(`scheduleInspection failed: ${scheduled.code}`);
        }
        const result = runtime.inspections.completeInspection(inspector(), command(requested.value.id, 'COMPLETE_INSPECTION', 'insp-done-b', 0), requested.value.id, {
            findings: 'Measured 62 dBA at the bedroom wall during the observed drilling.',
            observedSourceUnitId: undefined,
            observedSourceIsSuspected: false,
            rootCauseStatement: '',
            recommendedAction: 'Take action.',
            outcome: 'FINDINGS_RECORDED',
            evidenceIds: [],
        });
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('VALIDATION_FAILED');
        expect(result.violations.some((entry) => entry.field === 'inspection.rootCauseStatement')).toBe(true);
    });
    it('refuses to close a case by agreement without an accepted proposal', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        respond(runtime, caseId);
        const mediationId = openMediation(runtime, caseId, 'c');
        const proposal = runtime.mediation.proposeResolution(mediator(), command(mediationId, 'PROPOSE_RESOLUTION', `prop-${caseId}`, 0), mediationId, {
            description: 'Both households agree to quiet hours from 22:00 and re-measure after one month.',
            responsiblePartyLabel: 'Both households, shared responsibility',
            targetDate: '2026-04-05',
            acceptanceScope: 'BOTH_PARTIES',
        });
        expect(proposal.ok).toBe(true);
        if (!proposal.ok) {
            return;
        }
        expect(proposal.value.requiredPartyIds).toHaveLength(2);
        const closed = runtime.closure.closeCase(admin(), command(caseId, 'CLOSE_CASE', `close-${caseId}`, revisionOf(runtime, caseId)), caseId, {
            outcome: 'RESOLVED_AGREED',
            summary: 'The committee records the outcome of the accepted proposal.',
            proposalId: proposal.value.id,
            closureProofIds: [],
            financeLinkIds: [],
            moveOutLinkIds: [],
        });
        expect(closed.ok).toBe(false);
        if (closed.ok) {
            return;
        }
        const resolved = runtime.closure.resolveCase(admin(), command(caseId, 'RESOLVE_CASE', `resolve-${caseId}`, revisionOf(runtime, caseId)), caseId, {
            summary: 'The committee records that the parties reached a proposed agreement.',
            proposalId: proposal.value.id,
            closureProofIds: [],
        });
        expect(resolved.ok).toBe(false);
        if (resolved.ok) {
            return;
        }
        expect(resolved.code).toBe('PRECONDITION_FAILED');
        expect(runtime.ports.cases.read(caseId)?.status).not.toBe('CLOSED');
        expect(runtime.ports.cases.read(caseId)?.status).not.toBe('RESOLVED');
    });
    it('does not close a case until the required parties accept the proposal', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        respond(runtime, caseId);
        const mediationId = openMediation(runtime, caseId, 'd');
        const proposal = runtime.mediation.proposeResolution(mediator(), command(mediationId, 'PROPOSE_RESOLUTION', `prop-${caseId}`, 0), mediationId, {
            description: 'Both households agree to quiet hours from 22:00 and re-measure after one month.',
            responsiblePartyLabel: 'Both households, shared responsibility',
            targetDate: '2026-04-05',
            acceptanceScope: 'BOTH_PARTIES',
        });
        if (!proposal.ok) {
            throw new Error(`proposeResolution failed: ${proposal.code}`);
        }
        const reporterDecision = runtime.mediation.decideProposal(reporter(), proposal.value.id, { decision: 'ACCEPTED', feedback: 'Agreed, provided the quiet hours are written down.' });
        expect(reporterDecision.ok).toBe(true);
        if (!reporterDecision.ok) {
            return;
        }
        expect(reporterDecision.value.status).toBe('PENDING');
        const respondentDecision = runtime.mediation.decideProposal(respondent(), proposal.value.id, { decision: 'ACCEPTED', feedback: undefined });
        expect(respondentDecision.ok).toBe(true);
        if (!respondentDecision.ok) {
            return;
        }
        expect(respondentDecision.value.status).toBe('ACCEPTED');
    });
    it('keeps direct-contact details out of a resolution proposal', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        respond(runtime, caseId);
        const mediationId = openMediation(runtime, caseId, 'e');
        const result = runtime.mediation.proposeResolution(mediator(), command(mediationId, 'PROPOSE_RESOLUTION', `prop-${caseId}`, 0), mediationId, {
            description: 'Reach out to me on my personal number to arrange the quiet hours agreement.',
            responsiblePartyLabel: 'Reporter',
            targetDate: '2026-04-05',
            acceptanceScope: 'RESPONDENT_ONLY',
        });
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('VALIDATION_FAILED');
    });
    it('records an escalation with a required reason and moves the case to ESCALATED', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        respond(runtime, caseId);
        const result = runtime.closure.escalateCase(reporter(), command(caseId, 'ESCALATE_CASE', `esc-${caseId}`, revisionOf(runtime, caseId)), caseId, {
            level: 'MANAGEMENT',
            reason: 'Two further incidents occurred after the first response was recorded.',
            target: {
                level: 'MANAGEMENT',
                targetLabel: 'Society management committee',
                contactRole: 'SOCIETY_ADMIN',
                requiresReason: true,
            },
            actionTaken: undefined,
            assignedToUserId: 'user-admin',
        });
        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.value.reason).toContain('Two further incidents');
        expect(runtime.ports.cases.read(caseId)?.status).toBe('ESCALATED');
        const notifications = runtime.ports.notifications.listByCase(caseId);
        expect(notifications.some((entry) => entry.event === 'CASE_ESCALATED')).toBe(true);
    });
    it('refuses an escalation with no reason when the target requires one', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const result = runtime.closure.escalateCase(reporter(), command(caseId, 'ESCALATE_CASE', `esc-bad-${caseId}`, revisionOf(runtime, caseId)), caseId, {
            level: 'MANAGEMENT',
            reason: 'bad',
            target: {
                level: 'MANAGEMENT',
                targetLabel: 'Society management committee',
                contactRole: 'SOCIETY_ADMIN',
                requiresReason: true,
            },
            actionTaken: undefined,
            assignedToUserId: undefined,
        });
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('ESCALATION_REASON_REQUIRED');
    });
    it('never attaches an amount to a finance link request', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const result = runtime.links.requestFinanceLink(admin(), caseId, 'The committee needs the accounting owner to confirm the repair invoice already issued.');
        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.value.amount).toBeUndefined();
        expect(result.value.status).toBe('REQUESTED');
        expect(runtime.ports.policies.financeLink.disputeOwnsAmount).toBe(false);
        expect(runtime.ports.policies.financeLink.disputeMayCreateCharge).toBe(false);
    });
    it('blocks disposal while a legal hold is active', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const held = runtime.retention.applyRetention(admin(), caseId, {
            placeLegalHold: true,
            releaseLegalHold: false,
        });
        expect(held.ok).toBe(true);
        if (!held.ok) {
            return;
        }
        expect(held.value.lifecycle).toBe('HOLD');
        expect(held.value.legalHoldActive).toBe(true);
        const disposed = runtime.retention.disposeCase(admin(), caseId);
        expect(disposed.ok).toBe(false);
        if (disposed.ok) {
            return;
        }
        expect(disposed.code).toBe('RETENTION_HOLD_ACTIVE');
    });
    it('refuses disposal before the retention period elapses', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const result = runtime.retention.disposeCase(admin(), caseId);
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('RETENTION_NOT_DUE');
    });
});

