import { deriveDisputeActor, deriveDisputeActorForCase, disputeIdentityFromSession, isResidentRelationship, hasDisputeCapability, SESSION_AUTHENTICATED_AT_FALLBACK, type DisputeIdentitySource, } from '../actorContext.types';
import type { ResidenceMembership } from '../../../../../../core/householdGovernance/identity.types';
import type { AuthSession } from '../../../../../../core/auth/authSession.types';
import type { DisputeCase } from '../case.types';
import { openStandardCase, reporter, respondent, newRuntime, command, revisionOf } from '../../../__tests__/fixtures/disputeHarness';
const membership = (overrides: Partial<ResidenceMembership> = {}): ResidenceMembership => ({
    membershipId: 'mem-1',
    userId: 'user-rohan',
    personId: 'person-rohan',
    societyId: 'soc-test-1',
    residenceId: 'home-b804',
    unitId: 'unit-b804',
    relationship: 'OWNER',
    householdAdmin: true,
    status: 'ACTIVE',
    permissions: new Set(['CREATE_COMPLAINT']),
    ...overrides,
});
const session = (overrides: Partial<AuthSession> = {}): AuthSession => ({
    userId: 'user-rohan',
    name: 'Rohan Deshpande',
    role: 'RESIDENT_OWNER',
    societyId: 'soc-test-1',
    unitId: 'unit-b804',
    isMockSession: false,
    ...overrides,
});
const source = (overrides: Partial<DisputeIdentitySource> = {}): DisputeIdentitySource => ({
    session: session(),
    societyId: 'soc-test-1',
    membership: membership(),
    displayName: 'Rohan',
    authenticatedAt: '2026-03-02T09:00:00.000Z',
    sessionId: 'sess-1',
    ...overrides,
});
describe('dispute actor derivation', () => {
    it('derives a resident reporter from a trusted membership', () => {
        const result = deriveDisputeActor(source());
        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.actor.actorType).toBe('RESIDENT_REPORTER');
        expect(result.actor.societyId).toBe('soc-test-1');
        expect(result.actor.unitId).toBe('unit-b804');
        expect(result.actor.userId).toBe('user-rohan');
    });
    it('takes the society from trusted context, never from a route parameter', () => {
        const result = deriveDisputeActor(source({ societyId: 'soc-other' }));
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('MEMBERSHIP_SOCIETY_MISMATCH');
    });
    it('rejects a session whose society disagrees with trusted context', () => {
        const result = deriveDisputeActor(source({ session: session({ societyId: 'soc-other' }) }));
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('MEMBERSHIP_SOCIETY_MISMATCH');
    });
    it('rejects a session asserting a unit the membership contradicts', () => {
        const result = deriveDisputeActor(source({ session: session({ unitId: 'unit-z999' }) }));
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('UNIT_MISMATCH');
    });
    it('rejects a membership belonging to a different user', () => {
        const result = deriveDisputeActor(source({ membership: membership({ userId: 'user-someone-else' }) }));
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('MEMBERSHIP_SOCIETY_MISMATCH');
    });
    it.each(['INVITED', 'SUSPENDED', 'ENDED', 'REVOKED'] as const)('refuses a %s membership', (status) => {
        const result = deriveDisputeActor(source({ membership: membership({ status }) }));
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('MEMBERSHIP_INACTIVE');
    });
    it('refuses an unauthenticated session', () => {
        const result = deriveDisputeActor(source({ session: session({ userId: '' }) }));
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('ACTOR_NOT_AUTHENTICATED');
    });
    it('refuses to derive an actor without trusted society context', () => {
        const result = deriveDisputeActor(source({ societyId: '' }));
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('ACTOR_NOT_AUTHENTICATED');
    });
    it('maps non-resident app roles to their dispute counterpart', () => {
        const result = deriveDisputeActor(source({
            session: session({ userId: 'user-auditor', role: 'AUDITOR' }),
            membership: membership({ userId: 'user-auditor', relationship: 'SOCIETY_STAFF', societyId: 'soc-test-1' }),
        }));
        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.actor.actorType).toBe('AUDITOR');
    });
    it('classifies resident relationships distinctly from society staff', () => {
        expect(isResidentRelationship('OWNER')).toBe(true);
        expect(isResidentRelationship('TENANT')).toBe(true);
        expect(isResidentRelationship('FAMILY_MEMBER')).toBe(true);
        expect(isResidentRelationship('SOCIETY_STAFF')).toBe(false);
    });
    it('grants auditors read access for audit but never a decision action', () => {
        expect(hasDisputeCapability('AUDITOR', 'INTER_FLAT_VIEW_ALL')).toBe(true);
        expect(hasDisputeCapability('AUDITOR', 'INTER_FLAT_AUDIT_VIEW')).toBe(true);
        expect(hasDisputeCapability('AUDITOR', 'INTER_FLAT_CLOSE')).toBe(false);
        expect(hasDisputeCapability('AUDITOR', 'DISPUTE_MEDIATION_MANAGE')).toBe(false);
        expect(hasDisputeCapability('AUDITOR', 'INTER_FLAT_ESCALATE')).toBe(false);
    });
    it('grants the committee decision capabilities that auditors lack', () => {
        expect(hasDisputeCapability('SOCIETY_ADMIN', 'INTER_FLAT_CLOSE')).toBe(true);
        expect(hasDisputeCapability('SOCIETY_ADMIN', 'DISPUTE_MEDIATION_MANAGE')).toBe(true);
    });
});
describe('case-scoped actor derivation', () => {
    it('reads the party role from the case, not from the session', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const disputeCase = runtime.ports.cases.read(caseId);
        expect(disputeCase).toBeDefined();
        if (disputeCase === undefined) {
            return;
        }
        const asReporter = deriveDisputeActorForCase(deriveDisputeActor(source()), disputeCase);
        expect(asReporter.ok).toBe(true);
        if (!asReporter.ok) {
            return;
        }
        expect(asReporter.actor.actorType).toBe('RESIDENT_REPORTER');
        const asRespondent = deriveDisputeActorForCase(deriveDisputeActor(source({
            session: session({ userId: 'user-respondent' }),
            membership: membership({ userId: 'user-respondent' }),
        })), disputeCase);
        expect(asRespondent.ok).toBe(true);
        if (!asRespondent.ok) {
            return;
        }
        expect(asRespondent.actor.actorType).toBe('RESIDENT_RESPONDENT');
    });
    it('leaves a non-party resident as a reporter baseline', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const disputeCase = runtime.ports.cases.read(caseId);
        if (disputeCase === undefined) {
            return;
        }
        const stranger = deriveDisputeActorForCase(deriveDisputeActor(source({
            session: session({ userId: 'user-stranger' }),
            membership: membership({ userId: 'user-stranger' }),
        })), disputeCase);
        expect(stranger.ok).toBe(true);
        if (!stranger.ok) {
            return;
        }
        expect(stranger.actor.actorType).toBe('RESIDENT_REPORTER');
    });
    it('refuses to scope an actor to a case in another society', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const disputeCase = runtime.ports.cases.read(caseId);
        if (disputeCase === undefined) {
            return;
        }
        const result = deriveDisputeActorForCase(deriveDisputeActor(source({ societyId: 'soc-elsewhere' })), disputeCase);
        expect(result.ok).toBe(false);
        if (result.ok) {
            return;
        }
        expect(result.code).toBe('MEMBERSHIP_SOCIETY_MISMATCH');
    });
    it('ignores a party whose access has been revoked', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const stored = runtime.ports.cases.read(caseId);
        if (stored === undefined) {
            return;
        }
        const revoked: DisputeCase = {
            ...stored,
            parties: stored.parties.map((party) => party.userId === 'user-respondent'
                ? { ...party, accessRevokedAt: '2026-03-03T00:00:00.000Z' }
                : party),
        };
        const result = deriveDisputeActorForCase(deriveDisputeActor(source({
            session: session({ userId: 'user-respondent' }),
            membership: membership({ userId: 'user-respondent' }),
        })), revoked);
        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.actor.actorType).toBe('RESIDENT_REPORTER');
    });
});
describe('session identity input', () => {
    it('falls back to a fixed epoch when a session recorded no authentication instant', () => {
        const identity = disputeIdentityFromSession({
            session: session({ token: undefined }),
            membership: membership(),
            displayName: 'Rohan',
            sessionId: 'sess-1',
        });
        expect(identity.authenticatedAt).toBe(SESSION_AUTHENTICATED_AT_FALLBACK);
    });
    it('carries the session society through as trusted context', () => {
        const identity = disputeIdentityFromSession({
            session: session(),
            membership: membership(),
            displayName: 'Rohan',
            sessionId: 'sess-1',
        });
        expect(identity.societyId).toBe('soc-test-1');
    });
    it('refuses derivation when the session carries no society', () => {
        const identity = disputeIdentityFromSession({
            session: session({ societyId: undefined }),
            membership: membership(),
            displayName: 'Rohan',
            sessionId: 'sess-1',
        });
        const result = deriveDisputeActor(identity);
        expect(result.ok).toBe(false);
    });
});

