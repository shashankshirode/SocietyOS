import { admin, auditor, command, mediator, newRuntime, openStandardCase, outsider, reporter, respondent, revisionOf, SOCIETY_ID, OTHER_SOCIETY_ID, } from './fixtures/disputeHarness';
import type { DisputeRuntime } from '../infrastructure/disputeRuntime';
import type { EvidenceVaultPort } from '../domain/types/evidence.types';
function verifyingVault(): EvidenceVaultPort {
    return {
        vaultName: 'test-document-vault',
        verify: () => ({
            available: true,
            documentVerified: true,
            checksumPresent: true,
            subjectAllowed: true,
            detail: 'Verified by the test vault.',
        }),
    };
}
function openCaseWithMediation(runtime: DisputeRuntime): {
    caseId: string;
    mediationId: string;
} {
    const caseId = openStandardCase(runtime);
    const requested = runtime.mediation.requestMediation(reporter(), command(caseId, 'REQUEST_MEDIATION', 'med-req-1', revisionOf(runtime, caseId)), caseId, { reason: 'Direct conversation has not resolved the recurring disturbance.' });
    if (!requested.ok) {
        throw new Error(`requestMediation failed: ${requested.code}`);
    }
    const assigned = runtime.mediation.assignMediator(admin(), requested.value.id, 'user-mediator');
    if (!assigned.ok) {
        throw new Error(`assignMediator failed: ${assigned.code}`);
    }
    return { caseId, mediationId: requested.value.id };
}
describe('dispute privacy and authorization boundaries', () => {
    it('blocks a resident from another society', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const result = runtime.cases.recordClaim(outsider(), command(caseId, 'RECORD_CLAIM', 'x-society', revisionOf(runtime, caseId)), caseId, {
            statement: 'An attempt to interfere with a case that belongs to another society.',
            claimedCategory: 'NOISE_DISTURBANCE',
            relatedEvidenceIds: [],
            relatedInspectionIds: [],
        });
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('CROSS_SOCIETY_BLOCKED');
    });
    it('hides a case from residents of the same society who are not parties', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const neighbour = reporter('user-neighbour');
        const result = runtime.cases.viewCase(neighbour, caseId);
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(['NOT_A_PARTY', 'IDOR_BLOCKED']).toContain(result.code);
        expect(runtime.cases.listCasesForActor(neighbour)).toHaveLength(0);
    });
    it('never exposes a case to a different society through the case listing', () => {
        const runtime = newRuntime();
        openStandardCase(runtime);
        const visible = runtime.cases.listCasesForActor(outsider());
        expect(visible).toHaveLength(0);
        expect(visible.every((entry) => entry.societyId === OTHER_SOCIETY_ID)).toBe(true);
    });
    it('keeps mediator-only notes out of the party timeline view', () => {
        const runtime = newRuntime();
        const { caseId, mediationId } = openCaseWithMediation(runtime);
        const internal = runtime.mediation.recordMediatorNote(mediator(), mediationId, {
            note: 'Both parties appear to be describing the same events with different recollections.',
            visibility: 'COMMITTEE_AND_MEDIATOR',
        });
        expect(internal.ok).toBe(true);
        const shared = runtime.mediation.recordMediatorNote(mediator(), mediationId, {
            note: 'A joint walkthrough of the shared wall is proposed for both parties.',
            visibility: 'ALL_PARTIES',
        });
        expect(shared.ok).toBe(true);
        const reporterView = runtime.cases.viewCase(reporter(), caseId);
        const committeeView = runtime.cases.viewCase(admin(), caseId);
        expect(reporterView.ok).toBe(true);
        expect(committeeView.ok).toBe(true);
        if (!reporterView.ok || !committeeView.ok) {
            return;
        }
        const reporterNotes = runtime.mediation.notesFor(mediationId, 'RESIDENT_REPORTER');
        const committeeNotes = runtime.mediation.notesFor(mediationId, 'SOCIETY_ADMIN');
        expect(reporterNotes.map((note) => note.note)).toEqual([
            'A joint walkthrough of the shared wall is proposed for both parties.',
        ]);
        expect(committeeNotes).toHaveLength(2);
        for (const note of reporterNotes) {
            expect(note.note).not.toContain('different recollections');
        }
    });
    it('keeps committee-only evidence out of the party evidence view', () => {
        const runtime = newRuntime({ evidenceVault: verifyingVault() });
        const caseId = openStandardCase(runtime);
        const partyEvidence = runtime.cases.attachEvidence(respondent(), command(caseId, 'ATTACH_EVIDENCE', 'ev-party', revisionOf(runtime, caseId)), caseId, {
            kind: 'AUDIO_NOTE',
            caption: 'Phone recording of the drilling at 23:40.',
            visibility: 'PARTIES_ONLY',
            affectedUnitIds: ['unit-1402'],
            vaultDocumentId: 'vault-doc-1',
            vaultVersionId: 'vault-doc-1-v2',
        });
        expect(partyEvidence.ok).toBe(true);
        if (!partyEvidence.ok) {
            return;
        }
        expect(partyEvidence.value.lifecycle).toBe('VERIFIED');
        const committeeEvidence = runtime.cases.attachEvidence(admin(), command(caseId, 'ATTACH_EVIDENCE', 'ev-committee', revisionOf(runtime, caseId)), caseId, {
            kind: 'DOCUMENT',
            caption: 'Building acoustic log covering the same three evenings.',
            visibility: 'COMMITTEE_AND_MEDIATOR',
            affectedUnitIds: [],
            vaultDocumentId: 'vault-doc-2',
            vaultVersionId: 'vault-doc-2-v1',
        });
        expect(committeeEvidence.ok).toBe(true);
        if (!committeeEvidence.ok) {
            return;
        }
        expect(committeeEvidence.value.lifecycle).toBe('VERIFIED');
        const partyView = runtime.cases.viewCase(reporter(), caseId);
        const committeeView = runtime.cases.viewCase(admin(), caseId);
        if (!partyView.ok || !committeeView.ok) {
            throw new Error('case view unexpectedly failed');
        }
        expect(partyView.value.visibleEvidence).toHaveLength(1);
        expect(partyView.value.visibleEvidence[0]?.caption).toContain('Phone recording');
        expect(committeeView.value.visibleEvidence).toHaveLength(2);
    });
    it('attaches evidence with a blocking warning while no Document Vault is wired', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const result = runtime.cases.attachEvidence(reporter(), command(caseId, 'ATTACH_EVIDENCE', 'ev-pending', revisionOf(runtime, caseId)), caseId, {
            kind: 'PHOTO',
            caption: 'Photo of water staining on the utility closet ceiling.',
            visibility: 'PARTIES_ONLY',
            affectedUnitIds: ['unit-1204'],
            vaultDocumentId: 'vault-doc-1',
            vaultVersionId: 'vault-doc-1-v3',
        });
        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.value.lifecycle).toBe('PENDING_VAULT');
        expect(result.warnings.map((entry) => entry.code)).toContain('EVIDENCE_VAULT_UNAVAILABLE');
        expect(result.warnings[0]?.blocking).toBe(true);
    });
    it('withholds unverified evidence from every case view', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const attached = runtime.cases.attachEvidence(reporter(), command(caseId, 'ATTACH_EVIDENCE', 'ev-unverified', revisionOf(runtime, caseId)), caseId, {
            kind: 'PHOTO',
            caption: 'Photo of water staining on the utility closet ceiling.',
            visibility: 'PARTIES_ONLY',
            affectedUnitIds: ['unit-1204'],
            vaultDocumentId: undefined,
            vaultVersionId: undefined,
        });
        expect(attached.ok).toBe(true);
        const committeeView = runtime.cases.viewCase(admin(), caseId);
        expect(committeeView.ok).toBe(true);
        if (!committeeView.ok) {
            return;
        }
        expect(committeeView.value.visibleEvidence).toHaveLength(0);
    });
    it('records a read-only audit warning when an auditor views a case', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const result = runtime.cases.viewCase(auditor(), caseId);
        expect(result.ok).toBe(true);
        const audit = runtime.ports.caseAudit.listByCase(caseId);
        expect(audit.some((entry) => entry.actorUserId === 'user-auditor')).toBe(true);
    });
    it('refuses to open a controlled communication thread while the provider is unwired', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const opened = runtime.ports.communicationThreads.openThread({
            threadId: 'thread-1',
            caseId,
            societyId: SOCIETY_ID,
            participants: [
                { userId: 'user-reporter', role: 'REPORTER', consentedAt: undefined },
                { userId: 'user-respondent', role: 'RESPONDENT', consentedAt: undefined },
            ],
            createdAt: runtime.clock.now().toISOString(),
            channelState: 'PENDING_CONSENT',
            closeReason: undefined,
        });
        expect(opened).toBe(false);
        expect(runtime.ports.communicationThreads.isAvailable()).toBe(false);
    });
    it('prevents a party from closing their own case', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const result = runtime.closure.closeCase(reporter(), command(caseId, 'CLOSE_CASE', 'close-self', revisionOf(runtime, caseId)), caseId, {
            outcome: 'RESOLVED_AGREED',
            summary: 'The reporter considers the matter settled without any agreement being reached.',
            proposalId: undefined,
            closureProofIds: [],
            financeLinkIds: [],
            moveOutLinkIds: [],
        });
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('ACTOR_NOT_AUTHORIZED');
    });
});

