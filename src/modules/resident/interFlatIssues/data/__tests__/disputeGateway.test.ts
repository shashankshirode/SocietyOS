import { resetDisputeGateway, disputeGateway, listCasesForActor, viewCase, openCase, attachEvidence, decideProposal, proposeResolution, requestMediation, assignMediator, resolveCase, closeCase, } from '../disputeGateway';
import { createInMemoryCaseStore } from '../../infrastructure/inMemoryDisputeStores';
import { actor, command, openCaseInput, reporter, respondent, admin, mediator, outsider, } from '../../__tests__/fixtures/disputeHarness';
function openViaGateway(): string {
    const result = openCase(reporter(), command('pending', 'OPEN_CASE', 'k1', 0), openCaseInput());
    expect(result.ok).toBe(true);
    if (!result.ok) {
        throw new Error('expected the case to open');
    }
    return result.value.id;
}
function revisionOfGateway(caseId: string): number {
    const outcome = viewCase(admin(), caseId);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
        throw new Error('expected the committee to read the case');
    }
    return outcome.value.disputeCase.revision.revision;
}
function driveToResolved(caseId: string): string {
    const mediation = requestMediation(reporter(), command(caseId, 'REQUEST_MEDIATION', 'm1', revisionOfGateway(caseId)), caseId, { reason: 'Direct conversation has not resolved the recurring disturbance.' });
    expect(mediation.ok).toBe(true);
    if (!mediation.ok) {
        throw new Error('expected mediation to open');
    }
    expect(assignMediator(admin(), mediation.value.id, mediator().userId).ok).toBe(true);
    const proposal = proposeResolution(mediator(), command(mediation.value.id, 'PROPOSE_RESOLUTION', 'p1', 0), mediation.value.id, {
        description: 'Both households agree to quiet hours from 22:00 and re-measure after one month.',
        responsiblePartyLabel: 'Both households',
        targetDate: '2026-04-05',
        acceptanceScope: 'BOTH_PARTIES',
    });
    expect(proposal.ok).toBe(true);
    if (!proposal.ok) {
        throw new Error('expected a resolution proposal');
    }
    for (const party of [reporter(), respondent()]) {
        expect(decideProposal(party, proposal.value.id, { decision: 'ACCEPTED', feedback: 'Agreed.' }).ok).toBe(true);
    }
    const resolved = resolveCase(admin(), command(caseId, 'RESOLVE_CASE', 'r1', revisionOfGateway(caseId)), caseId, {
        summary: 'The committee records the agreement both parties accepted for the shared quiet hours.',
        proposalId: proposal.value.id,
        closureProofIds: [],
    });
    expect(resolved.ok).toBe(true);
    return proposal.value.id;
}
describe('dispute gateway data boundary', () => {
    beforeEach(() => {
        resetDisputeGateway();
    });
    it('starts empty instead of serving fixture disputes', () => {
        expect(listCasesForActor(reporter())).toHaveLength(0);
    });
    it('returns an empty list for a society with no cases rather than fixtures', () => {
        const empty = actor('user-empty', 'RESIDENT_REPORTER', 'RESIDENT_OWNER', { societyId: 'soc-empty' });
        expect(listCasesForActor(empty)).toEqual([]);
    });
    it('isolates cases per reset so one test cannot leak state into another', () => {
        openViaGateway();
        expect(listCasesForActor(reporter())).toHaveLength(1);
        resetDisputeGateway();
        expect(listCasesForActor(reporter())).toHaveLength(0);
    });
    it('refuses to view a case belonging to another society', () => {
        const caseId = openViaGateway();
        const view = viewCase(outsider(), caseId);
        expect(view.ok).toBe(false);
        if (view.ok) {
            return;
        }
        expect(view.code).toBe('CROSS_SOCIETY_BLOCKED');
    });
    it('hides the case from a resident who is not a party', () => {
        const caseId = openViaGateway();
        const uninvolved = actor('user-stranger', 'RESIDENT_REPORTER', 'RESIDENT_OWNER');
        expect(listCasesForActor(uninvolved)).toHaveLength(0);
        const view = viewCase(uninvolved, caseId);
        expect(view.ok).toBe(false);
    });
    it('shows the case to both named parties', () => {
        const caseId = openViaGateway();
        expect(viewCase(reporter(), caseId).ok).toBe(true);
        expect(viewCase(respondent(), caseId).ok).toBe(true);
    });
    it('hides unverified evidence from every viewer, including the submitter', () => {
        const caseId = openViaGateway();
        const attached = attachEvidence(reporter(), command(caseId, 'RECORD_CLAIM', 'k2', revisionOfGateway(caseId)), caseId, {
            kind: 'PHOTO',
            caption: 'Timestamped photo of the drilling at 22:40.',
            visibility: 'PARTIES_ONLY',
            affectedUnitIds: [],
            vaultDocumentId: undefined,
            vaultVersionId: undefined,
        });
        expect(attached.ok).toBe(true);
        const forReporter = viewCase(reporter(), caseId);
        const forAdmin = viewCase(admin(), caseId);
        expect(forReporter.ok).toBe(true);
        expect(forAdmin.ok).toBe(true);
        if (!forReporter.ok || !forAdmin.ok) {
            return;
        }
        expect(forReporter.value.visibleEvidence).toHaveLength(0);
        expect(forAdmin.value.visibleEvidence).toHaveLength(0);
    });
    it('never renders a monetary amount or an adjudication on a case view', () => {
        const caseId = openViaGateway();
        const view = viewCase(admin(), caseId);
        expect(view.ok).toBe(true);
        if (!view.ok) {
            return;
        }
        const serialised = JSON.stringify(view.value);
        expect(serialised).not.toMatch(/penalty|fine|chargeAmount|guilty|liable/i);
    });
    it('cannot close by direct agreement while the Document Vault is unavailable', () => {
        const caseId = openViaGateway();
        driveToResolved(caseId);
        const closed = closeCase(admin(), command(caseId, 'CLOSE_CASE', 'c-vault', revisionOfGateway(caseId)), caseId, {
            outcome: 'RESOLVED_AGREED',
            summary: 'The committee records the agreement both parties accepted for the shared quiet hours.',
            proposalId: undefined,
            closureProofIds: [],
            financeLinkIds: [],
            moveOutLinkIds: [],
        });
        expect(closed.ok).toBe(false);
        if (closed.ok) {
            return;
        }
        expect(closed.code).toBe('CLOSURE_EVIDENCE_REQUIRED');
        const view = viewCase(admin(), caseId);
        expect(view.ok).toBe(true);
        if (!view.ok) {
            return;
        }
        expect(view.value.disputeCase.status).not.toBe('CLOSED');
    });
    it('carries a case from mediation through resolution to closure', () => {
        const caseId = openViaGateway();
        const proposalId = driveToResolved(caseId);
        const view = viewCase(admin(), caseId);
        expect(view.ok).toBe(true);
        if (!view.ok) {
            return;
        }
        expect(view.value.disputeCase.status).toBe('RESOLVED');
        const closed = closeCase(admin(), command(caseId, 'CLOSE_CASE', 'c1', revisionOfGateway(caseId)), caseId, {
            outcome: 'RESOLVED_MEDIATED',
            summary: 'The committee records the agreement both parties accepted for the shared quiet hours.',
            proposalId,
            closureProofIds: [],
            financeLinkIds: [],
            moveOutLinkIds: [],
        });
        expect(closed.ok).toBe(true);
        const after = viewCase(admin(), caseId);
        expect(after.ok).toBe(true);
        if (!after.ok) {
            return;
        }
        expect(after.value.disputeCase.status).toBe('CLOSED');
        expect(after.value.disputeCase.closure?.outcome).toBe('RESOLVED_MEDIATED');
    });
});
describe('in-memory case store contract', () => {
    it('rejects a duplicate insert so a case cannot be written twice', () => {
        const store = createInMemoryCaseStore();
        const base = {
            id: 'case-1',
            societyId: 'soc-1',
            caseNumber: 'IF-2026-0001',
            status: 'OPEN',
            parties: [],
            revision: { version: 1, revision: 1, updatedAt: '2026-03-02T09:00:00.000Z' },
        };
        expect(store.insert(base as never)).toBe(true);
        expect(store.insert(base as never)).toBe(false);
    });
});

