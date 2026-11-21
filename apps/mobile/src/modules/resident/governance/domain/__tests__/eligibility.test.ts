import { eligibleRecords, evaluateEligibility } from '../eligibility';
import { DUECLEARANCE, NO_EXTERNAL_FACTS, T_MID, T_START, member, policy, ruleSet } from './governanceDomainFixtures';
const AT = T_MID;
const FROM = '2026-01-01T00:00:00.000Z';
function policyWith(criteria: Parameters<typeof ruleSet>[0]) {
    return policy({ eligibility: ruleSet(criteria) });
}
describe('eligibility evaluation', () => {
    it('treats an explicitly empty criteria list as no restriction', () => {
        const outcome = evaluateEligibility({
            policy: policyWith([]),
            record: member({ effective: { effectiveFrom: FROM, effectiveTo: null } }),
            at: AT,
            externalFacts: NO_EXTERNAL_FACTS,
        });
        expect(outcome).toEqual({ membershipId: 'mem-1', eligible: true, failedCriteria: [], tenureDays: 151 });
    });
    describe('criteria', () => {
        it('checks membership status', () => {
            const active = evaluateEligibility({
                policy: policyWith([{ kind: 'MEMBERSHIP_STATUS_IN', statuses: ['ACTIVE'] }]),
                record: member({ status: 'ACTIVE', effective: { effectiveFrom: FROM, effectiveTo: null } }),
                at: AT,
                externalFacts: NO_EXTERNAL_FACTS,
            });
            expect(active.eligible).toBe(true);
            const suspended = evaluateEligibility({
                policy: policyWith([{ kind: 'MEMBERSHIP_STATUS_IN', statuses: ['ACTIVE'] }]),
                record: member({ status: 'SUSPENDED', effective: { effectiveFrom: FROM, effectiveTo: null } }),
                at: AT,
                externalFacts: NO_EXTERNAL_FACTS,
            });
            expect(suspended).toEqual({
                membershipId: 'mem-1',
                eligible: false,
                failedCriteria: ['MEMBERSHIP_STATUS_IN#0'],
                tenureDays: 151,
            });
        });
        it('checks relationship', () => {
            const record = member({ relationship: 'TENANT', effective: { effectiveFrom: FROM, effectiveTo: null } });
            expect(evaluateEligibility({
                policy: policyWith([{ kind: 'RELATIONSHIP_IN', relationships: ['OWNER'] }]),
                record,
                at: AT,
                externalFacts: NO_EXTERNAL_FACTS,
            }).eligible).toBe(false);
            expect(evaluateEligibility({
                policy: policyWith([{ kind: 'RELATIONSHIP_IN', relationships: ['OWNER', 'TENANT'] }]),
                record,
                at: AT,
                externalFacts: NO_EXTERNAL_FACTS,
            }).eligible).toBe(true);
        });
        it('checks occupancy class as a fact, not as a voting rule', () => {
            const record = member({ occupancyClass: 'RENTED', effective: { effectiveFrom: FROM, effectiveTo: null } });
            expect(evaluateEligibility({
                policy: policyWith([{ kind: 'OCCUPANCY_CLASS_IN', classes: ['OWNER_OCCUPIED'] }]),
                record,
                at: AT,
                externalFacts: NO_EXTERNAL_FACTS,
            }).eligible).toBe(false);
            expect(evaluateEligibility({
                policy: policyWith([{ kind: 'OCCUPANCY_CLASS_IN', classes: ['RENTED'] }]),
                record,
                at: AT,
                externalFacts: NO_EXTERNAL_FACTS,
            }).eligible).toBe(true);
        });
        it('checks minimum tenure', () => {
            const record = member({ effective: { effectiveFrom: FROM, effectiveTo: null } });
            expect(evaluateEligibility({
                policy: policyWith([{ kind: 'TENURE_AT_LEAST_DAYS', days: 151 }]),
                record,
                at: AT,
                externalFacts: NO_EXTERNAL_FACTS,
            }).eligible).toBe(true);
            expect(evaluateEligibility({
                policy: policyWith([{ kind: 'TENURE_AT_LEAST_DAYS', days: 152 }]),
                record,
                at: AT,
                externalFacts: NO_EXTERNAL_FACTS,
            }).eligible).toBe(false);
            expect(evaluateEligibility({
                policy: policyWith([{ kind: 'TENURE_AT_LEAST_DAYS', days: 0 }]),
                record,
                at: AT,
                externalFacts: NO_EXTERNAL_FACTS,
            }).eligible).toBe(true);
        });
    });
    describe('external facts owned by other modules', () => {
        const duesCriterion = [{ kind: 'EXTERNAL_FLAG_PRESENT', flagKey: 'FINANCE_DUES_CLEARANCE' }] as const;
        const record = member({ effective: { effectiveFrom: FROM, effectiveTo: null } });
        it('accepts a member when the owning module confirms clearance', () => {
            expect(evaluateEligibility({
                policy: policyWith([...duesCriterion]),
                record,
                at: AT,
                externalFacts: DUECLEARANCE,
            }).eligible).toBe(true);
        });
        it('rejects a member when clearance is explicitly denied', () => {
            expect(evaluateEligibility({
                policy: policyWith([...duesCriterion]),
                record,
                at: AT,
                externalFacts: { FINANCE_DUES_CLEARANCE: false },
            }).eligible).toBe(false);
        });
        it('fails closed when the owning module supplies no fact at all', () => {
            expect(evaluateEligibility({
                policy: policyWith([...duesCriterion]),
                record,
                at: AT,
                externalFacts: NO_EXTERNAL_FACTS,
            })).toEqual({
                membershipId: 'mem-1',
                eligible: false,
                failedCriteria: ['EXTERNAL_FLAG_PRESENT#0'],
                tenureDays: 151,
            });
        });
    });
    it('reports every failure in configured order so an amendment is explainable', () => {
        const record = member({
            status: 'SUSPENDED',
            relationship: 'TENANT',
            effective: { effectiveFrom: FROM, effectiveTo: null },
        });
        const outcome = evaluateEligibility({
            policy: policyWith([
                { kind: 'MEMBERSHIP_STATUS_IN', statuses: ['ACTIVE'] },
                { kind: 'RELATIONSHIP_IN', relationships: ['OWNER'] },
                { kind: 'TENURE_AT_LEAST_DAYS', days: 9999 },
            ]),
            record,
            at: AT,
            externalFacts: NO_EXTERNAL_FACTS,
        });
        expect(outcome.failedCriteria).toEqual([
            'MEMBERSHIP_STATUS_IN#0',
            'RELATIONSHIP_IN#1',
            'TENURE_AT_LEAST_DAYS#2',
        ]);
        expect(outcome.eligible).toBe(false);
    });
    it('is deterministic for the same inputs', () => {
        const built = policyWith([
            { kind: 'MEMBERSHIP_STATUS_IN', statuses: ['ACTIVE'] },
            { kind: 'EXTERNAL_FLAG_PRESENT', flagKey: 'FINANCE_DUES_CLEARANCE' },
        ]);
        const record = member({ effective: { effectiveFrom: FROM, effectiveTo: null } });
        const first = evaluateEligibility({ policy: built, record, at: AT, externalFacts: DUECLEARANCE });
        const second = evaluateEligibility({ policy: built, record, at: AT, externalFacts: DUECLEARANCE });
        expect(first).toEqual(second);
    });
    it('filters a population to the eligible records in register order', () => {
        const records = [
            member({ membershipId: 'mem-1', effective: { effectiveFrom: FROM, effectiveTo: null } }),
            member({
                membershipId: 'mem-2',
                status: 'SUSPENDED',
                effective: { effectiveFrom: FROM, effectiveTo: null },
            }),
            member({ membershipId: 'mem-3', effective: { effectiveFrom: FROM, effectiveTo: null } }),
        ];
        const eligible = eligibleRecords({
            policy: policyWith([{ kind: 'MEMBERSHIP_STATUS_IN', statuses: ['ACTIVE'] }]),
            records,
            at: AT,
            externalFacts: NO_EXTERNAL_FACTS,
        });
        expect(eligible.map((record) => record.membershipId)).toEqual(['mem-1', 'mem-3']);
    });
    it('reports zero tenure for a membership that has not yet begun', () => {
        const outcome = evaluateEligibility({
            policy: policyWith([{ kind: 'TENURE_AT_LEAST_DAYS', days: 0 }]),
            record: member({ effective: { effectiveFrom: '2026-05-01T00:00:00.000Z', effectiveTo: null } }),
            at: AT,
            externalFacts: NO_EXTERNAL_FACTS,
        });
        expect(outcome.tenureDays).toBe(31);
    });
    it('evaluates a policy that has not begun to apply', () => {
        const outcome = evaluateEligibility({
            policy: policy({ publishedAt: T_START, effective: { effectiveFrom: T_MID, effectiveTo: null } }),
            record: member(),
            at: T_START,
            externalFacts: NO_EXTERNAL_FACTS,
        });
        expect(outcome.eligible).toBe(true);
    });
});

