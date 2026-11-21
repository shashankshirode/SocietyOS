import { committeeHoldersAt, committeeRolesHeldAt, detectMembershipConflicts, findMembershipById, isActiveMembership, membershipsEffectiveAt, membershipsOfUser, membershipRecordFromCore, projectDenominator, } from '../memberRegister';
import type { ResidenceMembership } from '../../../../../core/householdGovernance/identity.types';
import { OTHER_SOCIETY, SOCIETY, T_AFTER, T_BEFORE, T_MID, T_START, OPEN_WINDOW, appointment, member, window, } from './governanceDomainFixtures';
describe('member register', () => {
    describe('membershipRecordFromCore', () => {
        const core: ResidenceMembership = {
            membershipId: 'mem-core',
            userId: 'usr-1',
            personId: 'per-1',
            societyId: SOCIETY.societyId,
            residenceId: 'res-1',
            unitId: 'unit-A-701',
            relationship: 'TENANT',
            householdAdmin: false,
            status: 'INVITED',
            permissions: new Set(['documents.view']),
        };
        it('projects the core membership with the supplied dates', () => {
            const record = membershipRecordFromCore({
                membership: core,
                effective: window(T_START, T_AFTER),
                occupancyClass: 'RENTED',
            });
            expect(record.membershipId).toBe('mem-core');
            expect(record.relationship).toBe('TENANT');
            expect(record.occupancyClass).toBe('RENTED');
            expect(record.effective).toEqual(window(T_START, T_AFTER));
            expect(record.permissions.has('documents.view')).toBe(true);
        });
        it('treats an invited but not accepted membership as not active', () => {
            const record = membershipRecordFromCore({
                membership: core,
                effective: OPEN_WINDOW,
                occupancyClass: 'RENTED',
            });
            expect(record.status).toBe('SUSPENDED');
            expect(isActiveMembership(record)).toBe(false);
        });
        it('defaults committee appointments to none', () => {
            const record = membershipRecordFromCore({
                membership: core,
                effective: OPEN_WINDOW,
                occupancyClass: 'RENTED',
            });
            expect(record.committeeAppointments).toEqual([]);
        });
        it('carries every core status through, mapping INVITED to a non-active state', () => {
            const expectations = [
                ['ACTIVE', 'ACTIVE'],
                ['SUSPENDED', 'SUSPENDED'],
                ['ENDED', 'ENDED'],
                ['REVOKED', 'REVOKED'],
                ['INVITED', 'SUSPENDED'],
            ] as const;
            for (const [coreStatus, expected] of expectations) {
                const record = membershipRecordFromCore({
                    membership: { ...core, status: coreStatus },
                    effective: OPEN_WINDOW,
                    occupancyClass: 'RENTED',
                });
                expect(record.status).toBe(expected);
                expect(isActiveMembership(record)).toBe(expected === 'ACTIVE');
            }
        });
    });
    describe('membershipsEffectiveAt', () => {
        const records = [
            member({ membershipId: 'mem-a', effective: window(T_START, T_MID) }),
            member({ membershipId: 'mem-b', effective: window(T_MID, T_AFTER) }),
            member({ membershipId: 'mem-other', societyId: OTHER_SOCIETY.societyId }),
        ];
        it('returns only records effective at the instant, in stable order', () => {
            expect(membershipsEffectiveAt(records, SOCIETY.societyId, T_MID).map((r) => r.membershipId)).toEqual([
                'mem-b',
            ]);
            expect(membershipsEffectiveAt(records, SOCIETY.societyId, '2026-01-15T00:00:00.000Z').map((r) => r.membershipId)).toEqual(['mem-a']);
        });
        it('excludes a record from another society', () => {
            const ids = membershipsEffectiveAt(records, OTHER_SOCIETY.societyId, T_MID).map((r) => r.membershipId);
            expect(ids).toEqual(['mem-other']);
        });
        it('is empty when nothing is effective', () => {
            expect(membershipsEffectiveAt(records, SOCIETY.societyId, T_BEFORE)).toEqual([]);
        });
        it('keeps records with an identical id rather than dropping one', () => {
            const duplicated = [member({ membershipId: 'dup' }), member({ membershipId: 'dup' })];
            expect(membershipsEffectiveAt(duplicated, SOCIETY.societyId, T_MID)).toHaveLength(2);
        });
        it('orders out-of-order input by membership id', () => {
            const shuffled = [
                member({ membershipId: 'mem-3' }),
                member({ membershipId: 'mem-1' }),
                member({ membershipId: 'mem-2' }),
            ];
            expect(membershipsEffectiveAt(shuffled, SOCIETY.societyId, T_MID).map((r) => r.membershipId)).toEqual([
                'mem-1',
                'mem-2',
                'mem-3',
            ]);
        });
    });
    it('finds and lists memberships by id and user, respecting dates', () => {
        const records = [
            member({ membershipId: 'mem-a', effective: window(T_START, T_MID) }),
            member({ membershipId: 'mem-b', effective: window(T_MID, T_AFTER), userId: 'usr-2' }),
        ];
        expect(findMembershipById(records, 'mem-a', T_START)?.membershipId).toBe('mem-a');
        expect(findMembershipById(records, 'mem-a', T_AFTER)).toBeUndefined();
        expect(findMembershipById(records, 'missing', T_MID)).toBeUndefined();
        expect(membershipsOfUser(records, 'usr-1', T_START).map((r) => r.membershipId)).toEqual(['mem-a']);
        expect(membershipsOfUser(records, 'usr-2', T_MID).map((r) => r.membershipId)).toEqual(['mem-b']);
    });
    describe('committee roles', () => {
        it('returns only roles effective at the instant, deduplicated and sorted', () => {
            const appointments = [
                appointment('SECRETARY', { appointmentId: 'a1' }),
                appointment('CHAIRPERSON', {
                    appointmentId: 'a2',
                    effective: window(T_START, T_MID),
                }),
                appointment('SECRETARY', { appointmentId: 'a3', personId: 'per-2' }),
            ];
            expect(committeeRolesHeldAt(appointments, 'per-1', SOCIETY.societyId, T_MID)).toEqual([
                'SECRETARY',
            ]);
            expect(committeeRolesHeldAt(appointments, 'per-1', SOCIETY.societyId, T_START)).toEqual([
                'CHAIRPERSON',
                'SECRETARY',
            ]);
            expect(committeeRolesHeldAt(appointments, 'per-2', SOCIETY.societyId, T_START)).toEqual([
                'SECRETARY',
            ]);
            expect(committeeRolesHeldAt(appointments, 'per-1', OTHER_SOCIETY.societyId, T_START)).toEqual([]);
        });
        it('lists holders of a role at an instant', () => {
            const appointments = [
                appointment('TREASURER', { appointmentId: 'z', personId: 'per-9' }),
                appointment('TREASURER', { appointmentId: 'a', personId: 'per-1' }),
            ];
            expect(committeeHoldersAt(appointments, SOCIETY.societyId, 'TREASURER', T_START)).toHaveLength(2);
            expect(committeeHoldersAt(appointments, OTHER_SOCIETY.societyId, 'TREASURER', T_START)).toEqual([]);
        });
        it('keeps appointments that share an id', () => {
            const duplicated = [
                appointment('TREASURER', { appointmentId: 'b', personId: 'per-3' }),
                appointment('TREASURER', { appointmentId: 'a', personId: 'per-1' }),
                appointment('TREASURER', { appointmentId: 'b', personId: 'per-4' }),
                appointment('TREASURER', { appointmentId: 'a', personId: 'per-2' }),
            ];
            const holders = committeeHoldersAt(duplicated, SOCIETY.societyId, 'TREASURER', T_START);
            expect(holders.map((held) => held.appointmentId)).toEqual(['a', 'a', 'b', 'b']);
        });
    });
    describe('detectMembershipConflicts', () => {
        it('finds two memberships for one person on overlapping dates', () => {
            const conflicts = detectMembershipConflicts([
                member({ membershipId: 'mem-a', effective: window(T_START, T_AFTER) }),
                member({ membershipId: 'mem-b', effective: window(T_MID, T_AFTER) }),
            ]);
            expect(conflicts).toEqual([
                {
                    firstMembershipId: 'mem-a',
                    secondMembershipId: 'mem-b',
                    personId: 'per-1',
                    societyId: SOCIETY.societyId,
                    reason: 'OVERLAPPING_MEMBERSHIP',
                },
            ]);
        });
        it('allows a move between units as long as the records do not overlap', () => {
            expect(detectMembershipConflicts([
                member({ membershipId: 'mem-a', effective: window(T_START, T_MID) }),
                member({ membershipId: 'mem-b', effective: window(T_MID, T_AFTER) }),
            ])).toEqual([]);
        });
        it('does not treat the same person in two societies as a conflict', () => {
            expect(detectMembershipConflicts([
                member({ membershipId: 'mem-a', effective: OPEN_WINDOW }),
                member({ membershipId: 'mem-b', societyId: OTHER_SOCIETY.societyId, effective: OPEN_WINDOW }),
            ])).toEqual([]);
        });
        it('does not treat two different people as a conflict', () => {
            expect(detectMembershipConflicts([
                member({ membershipId: 'mem-a', personId: 'per-1', effective: OPEN_WINDOW }),
                member({ membershipId: 'mem-b', personId: 'per-2', effective: OPEN_WINDOW }),
            ])).toEqual([]);
        });
        it('reports a malformed effective window', () => {
            const conflicts = detectMembershipConflicts([
                member({ membershipId: 'mem-a', effective: { effectiveFrom: 'nope', effectiveTo: null } }),
            ]);
            expect(conflicts).toEqual([
                {
                    firstMembershipId: 'mem-a',
                    secondMembershipId: 'mem-a',
                    personId: 'per-1',
                    societyId: SOCIETY.societyId,
                    reason: 'INVALID_EFFECTIVE_WINDOW',
                },
            ]);
        });
        it('is empty for a clean register', () => {
            expect(detectMembershipConflicts([member()])).toEqual([]);
            expect(detectMembershipConflicts([])).toEqual([]);
        });
    });
    describe('projectDenominator', () => {
        const eligible = [
            member({ membershipId: 'mem-1', personId: 'per-1', unitId: 'unit-1', relationship: 'OWNER' }),
            member({ membershipId: 'mem-2', personId: 'per-2', unitId: 'unit-1', relationship: 'TENANT' }),
            member({ membershipId: 'mem-3', personId: 'per-3', unitId: 'unit-2', relationship: 'OWNER' }),
        ];
        it('counts each membership', () => {
            const projection = projectDenominator(eligible, { strategy: 'COUNT_MEMBERSHIPS' });
            expect(projection.count).toBe(3);
            expect(projection.representativeIds).toEqual(['mem-1', 'mem-2', 'mem-3']);
        });
        it('counts each person once', () => {
            const projection = projectDenominator([...eligible, member({ membershipId: 'mem-4', personId: 'per-1', unitId: 'unit-3' })], { strategy: 'COUNT_PERSONS' });
            expect(projection.count).toBe(3);
            expect(projection.representativeIds).toEqual(['per-1', 'per-2', 'per-3']);
        });
        it('counts one per unit represented by the configured relationship', () => {
            const projection = projectDenominator(eligible, {
                strategy: 'COUNT_UNITS',
                representativeRelationship: 'OWNER',
            });
            expect(projection.count).toBe(2);
            expect(projection.representativeIds).toEqual(['unit-1', 'unit-2']);
        });
        it('counts nothing when no eligible member holds the representative relationship', () => {
            const projection = projectDenominator(eligible, {
                strategy: 'COUNT_UNITS',
                representativeRelationship: 'SOCIETY_STAFF',
            });
            expect(projection.count).toBe(0);
            expect(projection.representativeIds).toEqual([]);
        });
    });
});

