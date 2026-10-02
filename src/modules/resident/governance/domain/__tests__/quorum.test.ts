import { evaluateQuorum, requiredPresentCount } from '../quorum';
import { computeSnapshotContentHash } from '../integrity';
import { createEligibilitySnapshot, verifySnapshotIntegrity } from '../snapshot';
import type { EligibilitySnapshot } from '../snapshot';
import { DUECLEARANCE, NO_EXTERNAL_FACTS, OTHER_SOCIETY, SOCIETY, T_MID, T_START, member, policy, ruleSet, window, } from './governanceDomainFixtures';
function memberSet() {
    return [
        member({ membershipId: 'mem-1', personId: 'per-1', unitId: 'unit-1' }),
        member({ membershipId: 'mem-2', personId: 'per-2', unitId: 'unit-2' }),
        member({ membershipId: 'mem-3', personId: 'per-3', unitId: 'unit-3' }),
        member({ membershipId: 'mem-4', personId: 'per-4', unitId: 'unit-4' }),
    ];
}
function created(overrides: Parameters<typeof createEligibilitySnapshot>[0] extends infer T ? Partial<T> : never = {}) {
    return createEligibilitySnapshot({
        policies: [policy({ quorum: { kind: 'ABSOLUTE_MINIMUM', minimum: 3 } })],
        records: memberSet(),
        society: SOCIETY,
        decisionKind: 'RESOLUTION_VOTING',
        recordDate: T_MID,
        computedAt: T_MID,
        externalFacts: NO_EXTERNAL_FACTS,
        ...overrides,
    });
}
function snapshotOf(result: ReturnType<typeof created>): EligibilitySnapshot {
    if (result.status !== 'CREATED') {
        throw new Error(`expected CREATED, received ${result.status}`);
    }
    return result.snapshot;
}
describe('record-date eligibility snapshot', () => {
    it('freezes the eligible set, denominator, and policy version', () => {
        const result = created();
        expect(result.status).toBe('CREATED');
        if (result.status !== 'CREATED') {
            return;
        }
        expect(result.snapshot.eligibleMembershipIds).toEqual(['mem-1', 'mem-2', 'mem-3', 'mem-4']);
        expect(result.snapshot.denominatorCount).toBe(4);
        expect(result.snapshot.denominatorStrategy).toBe('COUNT_MEMBERSHIPS');
        expect(result.snapshot.denominatorRepresentativeIds).toEqual([
            'mem-1',
            'mem-2',
            'mem-3',
            'mem-4',
        ]);
        expect(result.snapshot.policyVersion).toBe(1);
        expect(result.snapshot.policyContentHash).toBe(result.policy.contentHash);
        expect(result.snapshot.recordDate).toBe(T_MID);
        expect(verifySnapshotIntegrity(result.snapshot)).toBe(true);
    });
    it('is content-addressed, so the same inputs reproduce the same id', () => {
        const first = snapshotOf(created());
        const second = snapshotOf(created());
        expect(first.snapshotId).toBe(second.snapshotId);
        expect(first.contentHash).toBe(second.contentHash);
    });
    it('produces a different snapshot for a different record date', () => {
        const early = snapshotOf(created({ recordDate: '2026-01-02T00:00:00.000Z' }));
        const late = snapshotOf(created({ recordDate: T_MID }));
        expect(early.snapshotId).not.toBe(late.snapshotId);
    });
    it('refuses to snapshot a decision kind that was never configured', () => {
        const result = created({ policies: [] });
        expect(result.status).toBe('POLICY_UNAVAILABLE');
        if (result.status === 'POLICY_UNAVAILABLE') {
            expect(result.resolution.status).toBe('POLICY_NOT_CONFIGURED');
        }
    });
    it('refuses a register with overlapping memberships for one person', () => {
        const result = created({
            records: [
                member({ membershipId: 'mem-1', personId: 'per-1', effective: { effectiveFrom: T_START, effectiveTo: null } }),
                member({ membershipId: 'mem-2', personId: 'per-1', effective: { effectiveFrom: T_START, effectiveTo: null } }),
            ],
        });
        expect(result.status).toBe('REGISTER_CONFLICT');
        if (result.status === 'REGISTER_CONFLICT') {
            expect(result.conflicts[0]?.reason).toBe('OVERLAPPING_MEMBERSHIP');
        }
    });
    it('ignores conflicts belonging to a different society', () => {
        const result = created({
            records: [
                ...memberSet(),
                member({
                    membershipId: 'mem-x',
                    societyId: OTHER_SOCIETY.societyId,
                    personId: 'per-1',
                    effective: { effectiveFrom: T_START, effectiveTo: null },
                }),
                member({
                    membershipId: 'mem-y',
                    societyId: OTHER_SOCIETY.societyId,
                    personId: 'per-1',
                    effective: { effectiveFrom: T_START, effectiveTo: null },
                }),
            ],
        });
        expect(result.status).toBe('CREATED');
        if (result.status === 'CREATED') {
            expect(result.snapshot.denominatorCount).toBe(4);
        }
    });
    it('rejects a malformed record or computed date', () => {
        expect(created({ recordDate: 'nope' }).status).toBe('INVALID_RECORD_DATE');
        expect(created({ computedAt: '2026-06-31T00:00:00.000Z' }).status).toBe('INVALID_RECORD_DATE');
    });
    it('applies configured eligibility at the record date only', () => {
        const result = created({
            policies: [
                policy({
                    eligibility: ruleSet([{ kind: 'EXTERNAL_FLAG_PRESENT', flagKey: 'FINANCE_DUES_CLEARANCE' }]),
                }),
            ],
            externalFacts: DUECLEARANCE,
        });
        expect(snapshotOf(result).eligibleMembershipIds).toHaveLength(4);
        const withoutClearance = created({
            policies: [
                policy({
                    eligibility: ruleSet([{ kind: 'EXTERNAL_FLAG_PRESENT', flagKey: 'FINANCE_DUES_CLEARANCE' }]),
                }),
            ],
        });
        expect(snapshotOf(withoutClearance).denominatorCount).toBe(0);
    });
    it('applies the configured denominator strategy', () => {
        const result = created({
            policies: [
                policy({
                    denominator: { strategy: 'COUNT_UNITS', representativeRelationship: 'OWNER' },
                    quorum: { kind: 'ABSOLUTE_MINIMUM', minimum: 1 },
                }),
            ],
        });
        expect(snapshotOf(result).denominatorCount).toBe(4);
        expect(snapshotOf(result).denominatorRepresentativeIds).toEqual([
            'unit-1',
            'unit-2',
            'unit-3',
            'unit-4',
        ]);
    });
    it('detects a snapshot edited after freezing', () => {
        const snapshot = snapshotOf(created());
        const tampered: EligibilitySnapshot = {
            ...snapshot,
            eligibleMembershipIds: ['mem-1', 'mem-2', 'mem-3'],
        };
        expect(verifySnapshotIntegrity(snapshot)).toBe(true);
        expect(verifySnapshotIntegrity(tampered)).toBe(false);
    });
    it('detects a snapshot whose denominator was edited', () => {
        const snapshot = snapshotOf(created());
        expect(verifySnapshotIntegrity({ ...snapshot, denominatorCount: 99 })).toBe(false);
        expect(verifySnapshotIntegrity({ ...snapshot, recordDate: T_START })).toBe(false);
    });
});
describe('quorum', () => {
    it('reports quorum met and not met against the frozen snapshot', () => {
        const result = created();
        const snapshot = snapshotOf(result);
        if (result.status !== 'CREATED') {
            throw new Error('unreachable');
        }
        expect(evaluateQuorum({ snapshot, policy: result.policy, presentMembershipIds: ['mem-1', 'mem-2', 'mem-3'] })).toEqual({
            status: 'QUORUM_MET',
            requiredPresent: 3,
            presentCount: 3,
            denominatorCount: 4,
            ignoredPresentIds: [],
        });
        expect(evaluateQuorum({ snapshot, policy: result.policy, presentMembershipIds: ['mem-1', 'mem-2'] })).toMatchObject({ status: 'QUORUM_NOT_MET', requiredPresent: 3, presentCount: 2 });
    });
    it('ignores attendees who were not in the frozen eligible set', () => {
        const result = created();
        const snapshot = snapshotOf(result);
        if (result.status !== 'CREATED') {
            throw new Error('unreachable');
        }
        const evaluation = evaluateQuorum({
            snapshot,
            policy: result.policy,
            presentMembershipIds: ['mem-1', 'mem-2', 'mem-outsider'],
        });
        expect(evaluation).toMatchObject({ presentCount: 2, ignoredPresentIds: ['mem-outsider'] });
    });
    it('counts a repeated attendance only once', () => {
        const result = created();
        const snapshot = snapshotOf(result);
        if (result.status !== 'CREATED') {
            throw new Error('unreachable');
        }
        expect(evaluateQuorum({
            snapshot,
            policy: result.policy,
            presentMembershipIds: ['mem-1', 'mem-1', 'mem-2', 'mem-2', 'mem-2'],
        })).toMatchObject({ presentCount: 2, status: 'QUORUM_NOT_MET' });
    });
    it('is unaffected by membership changes after the record date', () => {
        const first = created();
        const snapshot = snapshotOf(first);
        if (first.status !== 'CREATED') {
            throw new Error('unreachable');
        }
        const later = createEligibilitySnapshot({
            policies: first.policy ? [first.policy] : [],
            records: memberSet().map((record) => ({
                ...record,
                effective: window('2026-01-01T00:00:00.000Z', '2026-01-02T00:00:00.000Z'),
            })),
            society: SOCIETY,
            decisionKind: 'RESOLUTION_VOTING',
            recordDate: T_MID,
            computedAt: T_MID,
            externalFacts: NO_EXTERNAL_FACTS,
        });
        expect(later.status).toBe('CREATED');
        if (later.status !== 'CREATED') {
            return;
        }
        expect(evaluateQuorum({ snapshot, policy: first.policy, presentMembershipIds: ['mem-1', 'mem-2', 'mem-3'] })
            .status).toBe('QUORUM_MET');
        expect(evaluateQuorum({
            snapshot: later.snapshot,
            policy: later.policy,
            presentMembershipIds: ['mem-1', 'mem-2', 'mem-3'],
        }).status).toBe('QUORUM_NOT_COMPUTABLE');
    });
    it('is reproducible across repeated runs', () => {
        const result = created();
        const snapshot = snapshotOf(result);
        if (result.status !== 'CREATED') {
            throw new Error('unreachable');
        }
        const present = ['mem-4', 'mem-2', 'mem-1', 'mem-3'];
        const first = evaluateQuorum({ snapshot, policy: result.policy, presentMembershipIds: present });
        const second = evaluateQuorum({ snapshot, policy: result.policy, presentMembershipIds: present });
        expect(first).toEqual(second);
    });
    it('refuses to compute quorum on an empty denominator', () => {
        const result = created({
            policies: [policy({ eligibility: ruleSet([{ kind: 'MEMBERSHIP_STATUS_IN', statuses: ['REVOKED'] }]) })],
        });
        const snapshot = snapshotOf(result);
        if (result.status !== 'CREATED') {
            throw new Error('unreachable');
        }
        expect(evaluateQuorum({ snapshot, policy: result.policy, presentMembershipIds: ['mem-1', 'mem-2'] })).toMatchObject({ status: 'QUORUM_NOT_COMPUTABLE', reason: 'DENOMINATOR_EMPTY' });
    });
    it('refuses to compute quorum on a tampered snapshot', () => {
        const result = created();
        const snapshot = snapshotOf(result);
        if (result.status !== 'CREATED') {
            throw new Error('unreachable');
        }
        const tampered: EligibilitySnapshot = { ...snapshot, denominatorCount: 1 };
        expect(evaluateQuorum({ snapshot: tampered, policy: result.policy, presentMembershipIds: [] })).toMatchObject({ status: 'QUORUM_NOT_COMPUTABLE', reason: 'SNAPSHOT_INTEGRITY_FAILURE' });
    });
    it('refuses to compute quorum when the policy is not the frozen one', () => {
        const result = created();
        const snapshot = snapshotOf(result);
        if (result.status !== 'CREATED') {
            throw new Error('unreachable');
        }
        const amended = policy({
            policyId: 'pol-1',
            version: 2,
            quorum: { kind: 'ABSOLUTE_MINIMUM', minimum: 1 },
        });
        expect(evaluateQuorum({ snapshot, policy: amended, presentMembershipIds: ['mem-1'] })).toMatchObject({ status: 'QUORUM_NOT_COMPUTABLE', reason: 'POLICY_MISMATCH' });
    });
    it('refuses when the denominator count disagrees with its representative set', () => {
        const result = created();
        const snapshot = snapshotOf(result);
        if (result.status !== 'CREATED') {
            throw new Error('unreachable');
        }
        const skewed: EligibilitySnapshot = { ...snapshot, denominatorRepresentativeIds: ['only-one'] };
        expect(evaluateQuorum({ snapshot: skewed, policy: result.policy, presentMembershipIds: ['mem-1'] }).status).toBe('QUORUM_NOT_COMPUTABLE');
    });
    it('catches a forged snapshot whose hash was recomputed after editing', () => {
        const result = created();
        const snapshot = snapshotOf(result);
        if (result.status !== 'CREATED') {
            throw new Error('unreachable');
        }
        const forgedHash = computeSnapshotContentHash({
            societyId: snapshot.societyId,
            jurisdictionCode: snapshot.jurisdictionCode,
            decisionKind: snapshot.decisionKind,
            recordDate: snapshot.recordDate,
            policyId: snapshot.policyId,
            policyVersion: snapshot.policyVersion,
            policyContentHash: snapshot.policyContentHash,
            denominatorStrategy: snapshot.denominatorStrategy,
            eligibleIds: snapshot.eligibleMembershipIds,
            denominatorRepresentativeIds: ['only-one'],
            denominatorCount: 99,
            computedAt: snapshot.computedAt,
        });
        const forged: EligibilitySnapshot = {
            ...snapshot,
            denominatorRepresentativeIds: ['only-one'],
            denominatorCount: 99,
            contentHash: forgedHash,
        };
        expect(verifySnapshotIntegrity(forged)).toBe(true);
        expect(evaluateQuorum({ snapshot: forged, policy: result.policy, presentMembershipIds: ['mem-1'] })).toMatchObject({
            status: 'QUORUM_NOT_COMPUTABLE',
            reason: 'SNAPSHOT_INTEGRITY_FAILURE',
        });
    });
    describe('thresholds', () => {
        it('computes percentage thresholds in basis points', () => {
            expect(requiredPresentCount({ kind: 'PERCENTAGE_OF_ELIGIBLE', percentBasisPoints: 5000, rounding: 'ROUND_UP' }, 4)).toBe(2);
            expect(requiredPresentCount({ kind: 'PERCENTAGE_OF_ELIGIBLE', percentBasisPoints: 5000, rounding: 'ROUND_DOWN' }, 3)).toBe(1);
            expect(requiredPresentCount({ kind: 'PERCENTAGE_OF_ELIGIBLE', percentBasisPoints: 1250, rounding: 'ROUND_UP' }, 37)).toBe(5);
            expect(requiredPresentCount({ kind: 'PERCENTAGE_OF_ELIGIBLE', percentBasisPoints: 1250, rounding: 'ROUND_DOWN' }, 37)).toBe(4);
            expect(requiredPresentCount({ kind: 'PERCENTAGE_OF_ELIGIBLE', percentBasisPoints: 10000, rounding: 'ROUND_UP' }, 0)).toBe(0);
        });
        it('computes absolute and combined thresholds', () => {
            expect(requiredPresentCount({ kind: 'ABSOLUTE_MINIMUM', minimum: 5 }, 10)).toBe(5);
            expect(requiredPresentCount({ kind: 'PERCENTAGE_AND_ABSOLUTE', percentBasisPoints: 5000, rounding: 'ROUND_UP', minimum: 8 }, 4)).toBe(8);
            expect(requiredPresentCount({ kind: 'PERCENTAGE_AND_ABSOLUTE', percentBasisPoints: 5000, rounding: 'ROUND_UP', minimum: 1 }, 10)).toBe(5);
        });
    });
});

