import { computePolicyContentHash } from '../integrity';
import { definePolicy, resolvePolicy } from '../policyRegistry';
import type { GovernanceDecisionKind } from '../policy.types';
import type { HouseholdActorRelationship } from '../../../../../core/householdGovernance/householdActionGovernance.types';
import { OTHER_JURISDICTION, OTHER_SOCIETY, SOCIETY, T_AFTER, T_BEFORE, T_MID, T_START, OPEN_WINDOW, policy, window, } from './governanceDomainFixtures';
const QUERY = {
    jurisdictionCode: SOCIETY.jurisdictionCode,
    societyId: SOCIETY.societyId,
    decisionKind: 'RESOLUTION_VOTING' as const,
    at: T_MID,
};
describe('policy registry', () => {
    it('reports POLICY_NOT_CONFIGURED rather than inventing a default', () => {
        expect(resolvePolicy([], QUERY)).toEqual({
            status: 'POLICY_NOT_CONFIGURED',
            decisionKind: 'RESOLUTION_VOTING',
            at: T_MID,
        });
    });
    it('resolves a jurisdiction-wide default policy', () => {
        const resolved = resolvePolicy([policy()], QUERY);
        expect(resolved.status).toBe('RESOLVED');
        if (resolved.status === 'RESOLVED') {
            expect(resolved.specificity).toBe('JURISDICTION');
            expect(resolved.policy.policyId).toBe('pol-1');
        }
    });
    it('does not apply a policy from another society when a society one exists', () => {
        const resolved = resolvePolicy([policy({ societyId: 'soc-9' })], QUERY);
        expect(resolved.status).toBe('POLICY_NOT_CONFIGURED');
    });
    it('does not apply a policy authored for another jurisdiction', () => {
        const resolved = resolvePolicy([policy({ jurisdictionCode: OTHER_JURISDICTION.jurisdictionCode })], QUERY);
        expect(resolved.status).toBe('POLICY_NOT_CONFIGURED');
    });
    it('does not apply a policy for a different decision kind', () => {
        const resolved = resolvePolicy([policy({ decisionKind: 'ADVISORY_POLL' })], QUERY);
        expect(resolved.status).toBe('POLICY_NOT_CONFIGURED');
    });
    it('prefers a society-specific policy over the jurisdiction default', () => {
        const resolved = resolvePolicy([policy(), policy({ policyId: 'pol-society', societyId: SOCIETY.societyId, version: 1 })], QUERY);
        expect(resolved.status).toBe('RESOLVED');
        if (resolved.status === 'RESOLVED') {
            expect(resolved.specificity).toBe('SOCIETY');
            expect(resolved.policy.policyId).toBe('pol-society');
        }
    });
    it('ignores a society policy belonging to a different society', () => {
        const resolved = resolvePolicy([policy(), policy({ societyId: OTHER_SOCIETY.societyId })], QUERY);
        expect(resolved.status).toBe('RESOLVED');
        if (resolved.status === 'RESOLVED') {
            expect(resolved.policy.policyId).toBe('pol-1');
        }
    });
    it('prefers the latest effective date, then the highest version', () => {
        const resolved = resolvePolicy([
            policy({ policyId: 'old', effective: window(T_START, T_AFTER), version: 9 }),
            policy({ policyId: 'new', effective: window(T_MID, T_AFTER), version: 1 }),
        ], QUERY);
        expect(resolved.status).toBe('RESOLVED');
        if (resolved.status === 'RESOLVED') {
            expect(resolved.policy.policyId).toBe('new');
        }
    });
    it('prefers the higher version when two policies share an effective date', () => {
        const resolved = resolvePolicy([policy({ policyId: 'v1', version: 1 }), policy({ policyId: 'v2', version: 2 })], QUERY);
        expect(resolved.status).toBe('RESOLVED');
        if (resolved.status === 'RESOLVED') {
            expect(resolved.policy.policyId).toBe('v2');
        }
    });
    it('refuses to guess between equally preferred policies', () => {
        const resolved = resolvePolicy([policy({ policyId: 'a', version: 1 }), policy({ policyId: 'b', version: 1 })], QUERY);
        expect(resolved).toEqual({ status: 'POLICY_AMBIGUOUS', conflictingPolicyIds: ['a', 'b'] });
    });
    it('ignores policies that are not yet effective or already expired', () => {
        expect(resolvePolicy([policy({ effective: window(T_AFTER, null) })], QUERY).status).toBe('POLICY_NOT_CONFIGURED');
        expect(resolvePolicy([policy({ effective: window(T_BEFORE, T_START) })], QUERY).status).toBe('POLICY_NOT_CONFIGURED');
    });
    it('rejects a malformed query instant', () => {
        const resolved = resolvePolicy([policy()], { ...QUERY, at: 'nope' });
        expect(resolved.status).toBe('POLICY_INVALID');
    });
    describe('integrity', () => {
        it('seals a draft with a verifiable content hash', () => {
            const sealed = policy();
            expect(computePolicyContentHash(sealed)).toBe(sealed.contentHash);
        });
        it('detects a policy edited after publication', () => {
            const sealed = policy();
            const tampered = { ...sealed, quorum: { kind: 'ABSOLUTE_MINIMUM' as const, minimum: 1 } };
            const resolved = resolvePolicy([tampered], QUERY);
            expect(resolved).toEqual({
                status: 'POLICY_INTEGRITY_FAILURE',
                policyId: 'pol-1',
                version: 1,
            });
        });
        it('detects an effective window edited after publication', () => {
            const sealed = policy();
            const tampered = { ...sealed, effective: window(T_BEFORE, null) };
            expect(resolvePolicy([tampered], QUERY).status).toBe('POLICY_INTEGRITY_FAILURE');
        });
    });
    describe('validation', () => {
        it('rejects an out-of-range quorum percentage', () => {
            const broken = definePolicy({
                policyId: 'pol-bad',
                version: 1,
                jurisdictionCode: SOCIETY.jurisdictionCode,
                societyId: null,
                decisionKind: 'RESOLUTION_VOTING',
                effective: OPEN_WINDOW,
                eligibility: { criteria: [] },
                quorum: { kind: 'PERCENTAGE_OF_ELIGIBLE', percentBasisPoints: 10001, rounding: 'ROUND_UP' },
                denominator: { strategy: 'COUNT_MEMBERSHIPS' },
                eVoting: { state: 'NOT_CONFIGURED' },
                publishedAt: T_START,
            });
            const resolved = resolvePolicy([broken], QUERY);
            expect(resolved.status).toBe('POLICY_INVALID');
            if (resolved.status === 'POLICY_INVALID') {
                expect(resolved.reason).toBe('QUORUM_BASIS_POINTS_OUT_OF_RANGE');
            }
        });
        it('rejects a non-positive version, empty ids, and an invalid window', () => {
            const draft = {
                policyId: 'p',
                version: 0,
                jurisdictionCode: 'IN-MH',
                societyId: null,
                decisionKind: 'RESOLUTION_VOTING' as const,
                effective: OPEN_WINDOW,
                eligibility: { criteria: [] },
                quorum: { kind: 'ABSOLUTE_MINIMUM' as const, minimum: 1 },
                denominator: { strategy: 'COUNT_MEMBERSHIPS' as const },
                eVoting: { state: 'NOT_CONFIGURED' as const },
                publishedAt: T_START,
            };
            expect(resolvePolicy([definePolicy(draft)], QUERY).status).toBe('POLICY_INVALID');
            expect(resolvePolicy([definePolicy({ ...draft, version: 1, policyId: '' })], QUERY).status).toBe('POLICY_INVALID');
            expect(resolvePolicy([
                definePolicy({
                    ...draft,
                    version: 1,
                    effective: { effectiveFrom: 'nope', effectiveTo: null },
                }),
            ], QUERY).status).toBe('POLICY_INVALID');
            expect(resolvePolicy([definePolicy({ ...draft, version: 1, publishedAt: 'nope' })], QUERY).status).toBe('POLICY_INVALID');
            expect(resolvePolicy([definePolicy({ ...draft, version: 1, quorum: { kind: 'ABSOLUTE_MINIMUM', minimum: -1 } })], QUERY).status).toBe('POLICY_INVALID');
            expect(resolvePolicy([
                definePolicy({
                    ...draft,
                    version: 1,
                    quorum: { kind: 'PERCENTAGE_AND_ABSOLUTE', percentBasisPoints: 5000, rounding: 'ROUND_UP', minimum: -1 },
                }),
            ], QUERY).status).toBe('POLICY_INVALID');
            const fractional = resolvePolicy([
                definePolicy({
                    ...draft,
                    version: 1,
                    quorum: {
                        kind: 'PERCENTAGE_AND_ABSOLUTE',
                        percentBasisPoints: 1250.5,
                        rounding: 'ROUND_UP',
                        minimum: 1,
                    },
                }),
            ], QUERY);
            expect(fractional.status).toBe('POLICY_INVALID');
            if (fractional.status === 'POLICY_INVALID') {
                expect(fractional.reason).toBe('QUORUM_BASIS_POINTS_OUT_OF_RANGE');
            }
            const fractionalTenure = resolvePolicy([
                definePolicy({
                    ...draft,
                    version: 1,
                    eligibility: { criteria: [{ kind: 'TENURE_AT_LEAST_DAYS', days: 1.5 }] },
                }),
            ], QUERY);
            expect(fractionalTenure.status).toBe('POLICY_INVALID');
            if (fractionalTenure.status === 'POLICY_INVALID') {
                expect(fractionalTenure.reason).toBe('CRITERION_TENURE_DAYS_INVALID');
            }
        });
        it('treats a policy with no jurisdiction as applying nowhere', () => {
            const resolved = resolvePolicy([definePolicy({ ...emptyJurisdictionDraft(), jurisdictionCode: '' })], QUERY);
            expect(resolved.status).toBe('POLICY_NOT_CONFIGURED');
        });
        it('treats an inverted effective window as applying nowhere', () => {
            expect(resolvePolicy([definePolicy({ ...emptyJurisdictionDraft(), effective: window(T_MID, T_START) })], QUERY)
                .status).toBe('POLICY_NOT_CONFIGURED');
        });
        it('accepts a fully populated policy exercising every criterion and quorum form', () => {
            const populated = policy({
                policyId: 'pol-full',
                eligibility: {
                    criteria: [
                        { kind: 'MEMBERSHIP_STATUS_IN', statuses: ['ACTIVE'] },
                        { kind: 'RELATIONSHIP_IN', relationships: ['OWNER', 'TENANT'] },
                        { kind: 'OCCUPANCY_CLASS_IN', classes: ['OWNER_OCCUPIED'] },
                        { kind: 'TENURE_AT_LEAST_DAYS', days: 0 },
                        { kind: 'EXTERNAL_FLAG_PRESENT', flagKey: 'FINANCE_DUES_CLEARANCE' },
                    ],
                },
                quorum: { kind: 'PERCENTAGE_OF_ELIGIBLE', percentBasisPoints: 5000, rounding: 'ROUND_UP' },
                eVoting: { state: 'ENABLED' },
            });
            expect(resolvePolicy([populated], QUERY).status).toBe('RESOLVED');
            for (const quorumRule of [
                { kind: 'ABSOLUTE_MINIMUM', minimum: 1 },
                { kind: 'PERCENTAGE_OF_ELIGIBLE', percentBasisPoints: 1, rounding: 'ROUND_DOWN' },
                {
                    kind: 'PERCENTAGE_AND_ABSOLUTE',
                    percentBasisPoints: 1,
                    rounding: 'ROUND_UP',
                    minimum: 1,
                },
            ] as const) {
                expect(resolvePolicy([policy({ quorum: quorumRule })], QUERY).status).toBe('RESOLVED');
            }
            expect(resolvePolicy([
                policy({
                    denominator: { strategy: 'COUNT_UNITS', representativeRelationship: 'OWNER' },
                }),
            ], QUERY).status).toBe('RESOLVED');
        });
        it('rejects a decision kind that is not in the known vocabulary', () => {
            const bogus = 'NOT_A_DECISION_KIND';
            const resolved = resolvePolicy([policy({ policyId: 'pol-bogus', decisionKind: bogus as GovernanceDecisionKind })], { ...QUERY, decisionKind: bogus as GovernanceDecisionKind });
            expect(resolved.status).toBe('POLICY_INVALID');
            if (resolved.status === 'POLICY_INVALID') {
                expect(resolved.reason).toBe('DECISION_KIND_UNRECOGNISED');
            }
        });
        it('rejects a matched policy that carries no jurisdiction', () => {
            const resolved = resolvePolicy([policy({ jurisdictionCode: '' })], {
                ...QUERY,
                jurisdictionCode: '',
            });
            expect(resolved.status).toBe('POLICY_INVALID');
            if (resolved.status === 'POLICY_INVALID') {
                expect(resolved.reason).toBe('JURISDICTION_CODE_REQUIRED');
            }
        });
        it('hashes a malformed window instead of throwing, so validation can report it', () => {
            const sealed = definePolicy({
                ...emptyJurisdictionDraft(),
                effective: { effectiveFrom: T_START, effectiveTo: 'nope' },
            });
            expect(sealed.contentHash).toHaveLength(64);
            expect(resolvePolicy([sealed], QUERY).status).toBe('POLICY_NOT_CONFIGURED');
        });
        it('rejects criteria and denominators that are present but empty', () => {
            const base = {
                policyId: 'p',
                version: 1,
                jurisdictionCode: SOCIETY.jurisdictionCode,
                societyId: null,
                decisionKind: 'RESOLUTION_VOTING' as const,
                effective: OPEN_WINDOW,
                quorum: { kind: 'ABSOLUTE_MINIMUM' as const, minimum: 1 },
                denominator: { strategy: 'COUNT_MEMBERSHIPS' as const },
                eVoting: { state: 'NOT_CONFIGURED' as const },
                publishedAt: T_START,
            };
            const cases = [
                { criteria: [{ kind: 'MEMBERSHIP_STATUS_IN' as const, statuses: [] }] },
                { criteria: [{ kind: 'RELATIONSHIP_IN' as const, relationships: [] }] },
                { criteria: [{ kind: 'OCCUPANCY_CLASS_IN' as const, classes: [] }] },
                { criteria: [{ kind: 'TENURE_AT_LEAST_DAYS' as const, days: -1 }] },
                { criteria: [{ kind: 'EXTERNAL_FLAG_PRESENT' as const, flagKey: '' }] },
            ];
            for (const eligibility of cases) {
                const resolved = resolvePolicy([definePolicy({ ...base, eligibility })], QUERY);
                expect(resolved.status).toBe('POLICY_INVALID');
            }
            expect(resolvePolicy([
                definePolicy({
                    ...base,
                    eligibility: { criteria: [] },
                    denominator: {
                        strategy: 'COUNT_UNITS',
                        representativeRelationship: '' as HouseholdActorRelationship,
                    },
                }),
            ], QUERY).status).toBe('POLICY_INVALID');
        });
        it('does not fall back to a broader policy when the society policy is invalid', () => {
            const brokenSociety = definePolicy({
                policyId: 'pol-broken',
                version: 1,
                jurisdictionCode: SOCIETY.jurisdictionCode,
                societyId: SOCIETY.societyId,
                decisionKind: 'RESOLUTION_VOTING',
                effective: OPEN_WINDOW,
                eligibility: { criteria: [] },
                quorum: { kind: 'PERCENTAGE_OF_ELIGIBLE', percentBasisPoints: 0, rounding: 'ROUND_UP' },
                denominator: { strategy: 'COUNT_MEMBERSHIPS' },
                eVoting: { state: 'NOT_CONFIGURED' },
                publishedAt: T_START,
            });
            const resolved = resolvePolicy([policy(), brokenSociety], QUERY);
            expect(resolved.status).toBe('POLICY_INVALID');
            if (resolved.status === 'POLICY_INVALID') {
                expect(resolved.policyId).toBe('pol-broken');
            }
        });
    });
});
function emptyJurisdictionDraft() {
    return {
        policyId: 'p',
        version: 1,
        jurisdictionCode: 'IN-MH',
        societyId: null,
        decisionKind: 'RESOLUTION_VOTING' as const,
        effective: OPEN_WINDOW,
        eligibility: { criteria: [] },
        quorum: { kind: 'ABSOLUTE_MINIMUM' as const, minimum: 1 },
        denominator: { strategy: 'COUNT_MEMBERSHIPS' as const },
        eVoting: { state: 'NOT_CONFIGURED' as const },
        publishedAt: T_START,
    };
}

