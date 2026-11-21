import { GOVERNANCE_PERMISSIONS, deriveGovernanceActor, governancePermissionsFor, hasGovernancePermission, } from '../actorContext';
import { OTHER_SOCIETY, SOCIETY, T_AFTER, T_BEFORE, T_MID, T_START, appointment, member, session, window, } from './governanceDomainFixtures';
const SOURCE = {
    society: SOCIETY,
    sessionId: 'sess-1',
    authenticatedAt: T_START,
    evaluatedAt: T_MID,
};
function sourceWith(overrides: Record<string, unknown>) {
    return { ...SOURCE, ...overrides };
}
describe('governance actor derivation', () => {
    it('derives a full context for an authorised member', () => {
        const resolved = deriveGovernanceActor({
            ...SOURCE,
            session: session(),
            member: member({ committeeAppointments: [appointment('SECRETARY')] }),
        });
        expect(resolved.ok).toBe(true);
        if (resolved.ok) {
            expect(resolved.actor.societyId).toBe(SOCIETY.societyId);
            expect(resolved.actor.jurisdictionCode).toBe('IN-MH');
            expect(resolved.actor.personId).toBe('per-1');
            expect(resolved.actor.unitId).toBe('unit-A-701');
            expect(resolved.actor.committeeRoles).toEqual(['SECRETARY']);
            expect(hasGovernancePermission(resolved.actor, GOVERNANCE_PERMISSIONS.NOTICE_PUBLISH)).toBe(true);
            expect(resolved.actor.evaluatedAt).toBe(T_MID);
        }
    });
    describe('refuses a session that is not authoritative', () => {
        it('rejects an empty user', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session({ userId: '  ' }),
                member: member(),
            });
            expect(resolved).toMatchObject({ ok: false, code: 'NO_AUTHENTICATED_SESSION' });
        });
        it('rejects a mock session outright', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session({ isMockSession: true }),
                member: member(),
            });
            expect(resolved).toMatchObject({ ok: false, code: 'SESSION_NOT_AUTHORITATIVE' });
        });
        it('rejects a missing trusted society context', () => {
            for (const society of [
                { societyId: '', jurisdictionCode: 'IN-MH' },
                { societyId: 'soc-1', jurisdictionCode: '' },
            ]) {
                expect(deriveGovernanceActor({ ...SOURCE, society, session: session(), member: member() })).toMatchObject({ ok: false, code: 'NO_TRUSTED_SOCIETY_CONTEXT' });
            }
        });
        it('rejects a malformed evaluation instant or session identity', () => {
            expect(deriveGovernanceActor({
                ...SOURCE,
                evaluatedAt: 'nope',
                session: session(),
                member: member(),
            })).toMatchObject({ ok: false, code: 'INVALID_EVALUATION_INSTANT' });
            expect(deriveGovernanceActor({
                ...SOURCE,
                authenticatedAt: 'nope',
                session: session(),
                member: member(),
            })).toMatchObject({ ok: false, code: 'INVALID_EVALUATION_INSTANT' });
            expect(deriveGovernanceActor({ ...SOURCE, sessionId: '  ', session: session(), member: member() })).toMatchObject({ ok: false, code: 'INVALID_EVALUATION_INSTANT' });
        });
    });
    describe('treats the session as a claim to be checked', () => {
        it('rejects a session asserting a different society', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session({ societyId: OTHER_SOCIETY.societyId }),
                member: member(),
            });
            expect(resolved).toMatchObject({ ok: false, code: 'SESSION_SOCIETY_MISMATCH' });
        });
        it('rejects a membership from a different society', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session(),
                member: member({ societyId: OTHER_SOCIETY.societyId }),
            });
            expect(resolved).toMatchObject({ ok: false, code: 'MEMBERSHIP_SOCIETY_MISMATCH' });
        });
        it('rejects a membership belonging to another user', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session(),
                member: member({ userId: 'usr-other' }),
            });
            expect(resolved).toMatchObject({ ok: false, code: 'MEMBERSHIP_USER_MISMATCH' });
        });
        it('rejects a session asserting a different unit', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session({ unitId: 'unit-B-202' }),
                member: member(),
            });
            expect(resolved).toMatchObject({ ok: false, code: 'MEMBERSHIP_UNIT_MISMATCH' });
        });
        it('tolerates a session that asserts neither society nor unit', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: { userId: 'usr-1', name: 'x', role: 'RESIDENT_OWNER', isMockSession: false },
                member: member(),
            });
            expect(resolved.ok).toBe(true);
        });
    });
    describe('refuses a membership that is not effective and active', () => {
        it('rejects a membership not yet effective', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session(),
                member: member({ effective: window(T_AFTER, null) }),
            });
            expect(resolved).toMatchObject({ ok: false, code: 'MEMBERSHIP_NOT_EFFECTIVE' });
        });
        it('rejects an expired membership', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session(),
                member: member({ effective: window(T_START, T_MID) }),
            });
            expect(resolved).toMatchObject({ ok: false, code: 'MEMBERSHIP_NOT_EFFECTIVE' });
        });
        it('rejects a non-active membership', () => {
            for (const status of ['SUSPENDED', 'ENDED', 'REVOKED'] as const) {
                const resolved = deriveGovernanceActor({
                    ...SOURCE,
                    session: session(),
                    member: member({ status }),
                });
                expect(resolved).toMatchObject({ ok: false, code: 'MEMBERSHIP_NOT_ACTIVE' });
            }
        });
    });
    describe('an app role alone confers no governance authority', () => {
        it('grants nothing to a chairperson with no committee appointment', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session({ role: 'CHAIRPERSON' }),
                member: member({ committeeAppointments: [] }),
            });
            expect(resolved.ok).toBe(true);
            if (resolved.ok) {
                expect(resolved.actor.committeeRoles).toEqual([]);
                expect(resolved.actor.permissions.size).toBe(0);
                expect(hasGovernancePermission(resolved.actor, GOVERNANCE_PERMISSIONS.MINUTES_APPROVE)).toBe(false);
                expect(hasGovernancePermission(resolved.actor, GOVERNANCE_PERMISSIONS.ELECTION_ADMINISTER)).toBe(false);
            }
        });
        it('grants nothing to a secretary or treasurer without an appointment', () => {
            for (const role of ['SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER'] as const) {
                const resolved = deriveGovernanceActor({ ...SOURCE, session: session({ role }), member: member() });
                expect(resolved.ok).toBe(true);
                if (resolved.ok) {
                    expect(resolved.actor.permissions.size).toBe(0);
                }
            }
        });
        it('grants committee authority from an effective appointment', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session({ role: 'RESIDENT_OWNER' }),
                member: member({ committeeAppointments: [appointment('CHAIRPERSON')] }),
            });
            expect(resolved.ok).toBe(true);
            if (resolved.ok) {
                expect(hasGovernancePermission(resolved.actor, GOVERNANCE_PERMISSIONS.MINUTES_APPROVE)).toBe(true);
                expect(hasGovernancePermission(resolved.actor, GOVERNANCE_PERMISSIONS.ELECTION_ADMINISTER)).toBe(true);
            }
        });
        it('drops authority when the appointment has expired', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session({ role: 'CHAIRPERSON' }),
                member: member({
                    committeeAppointments: [appointment('CHAIRPERSON', { effective: window(T_START, T_MID) })],
                }),
            });
            expect(resolved.ok).toBe(true);
            if (resolved.ok) {
                expect(resolved.actor.committeeRoles).toEqual([]);
                expect(resolved.actor.permissions.size).toBe(0);
            }
        });
        it('ignores an appointment held for another society', () => {
            const resolved = deriveGovernanceActor({
                ...SOURCE,
                session: session({ role: 'CHAIRPERSON' }),
                member: member({
                    committeeAppointments: [appointment('CHAIRPERSON', { societyId: OTHER_SOCIETY.societyId })],
                }),
            });
            expect(resolved.ok).toBe(true);
            if (resolved.ok) {
                expect(resolved.actor.permissions.size).toBe(0);
            }
        });
    });
    it('unions permissions granted directly on the membership record', () => {
        const resolved = governancePermissionsFor({
            committeeRoles: ['TREASURER'],
            recordPermissions: new Set(['documents.view']),
        });
        expect(resolved.has('documents.view')).toBe(true);
        expect(resolved.has(GOVERNANCE_PERMISSIONS.FUNDS_REPORT)).toBe(true);
        expect(resolved.has(GOVERNANCE_PERMISSIONS.MINUTES_APPROVE)).toBe(false);
        expect(governancePermissionsFor({ committeeRoles: [], recordPermissions: new Set() }).size).toBe(0);
    });
    it('carries membership record permissions through derivation', () => {
        const resolved = deriveGovernanceActor({
            ...SOURCE,
            session: session(),
            member: member({ permissions: new Set(['documents.view']) }),
        });
        expect(resolved.ok).toBe(true);
        if (resolved.ok) {
            expect(hasGovernancePermission(resolved.actor, 'documents.view')).toBe(true);
        }
    });
});
describe('governance identity source', () => {
    it('exposes the trusted society as a caller-supplied dependency', () => {
        const resolved = deriveGovernanceActor(sourceWith({ session: session(), member: member() }) as never);
        expect(resolved.ok).toBe(true);
    });
    it('does not derive a society when the trusted context disagrees', () => {
        const resolved = deriveGovernanceActor({
            ...SOURCE,
            society: { societyId: '', jurisdictionCode: 'IN-MH' },
            session: session(),
            member: member(),
        });
        expect(resolved.ok).toBe(false);
    });
});

