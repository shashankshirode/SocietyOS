import type { EligibilityCriterion, ExternalEligibilityFacts, GovernanceMemberRecord, GovernancePolicy, } from './policy.types';
import { daysEffectiveWithin } from './temporal';
import type { IsoInstant } from './temporal';
export type EligibilityOutcome = {
    readonly membershipId: string;
    readonly eligible: boolean;
    readonly failedCriteria: readonly string[];
    readonly tenureDays: number;
};
function criterionId(criterion: EligibilityCriterion, index: number): string {
    return `${criterion.kind}#${index}`;
}
function criterionSatisfied(criterion: EligibilityCriterion, record: GovernanceMemberRecord, at: IsoInstant, externalFacts: ExternalEligibilityFacts): boolean {
    switch (criterion.kind) {
        case 'MEMBERSHIP_STATUS_IN':
            return criterion.statuses.includes(record.status);
        case 'RELATIONSHIP_IN':
            return (criterion.relationships as readonly string[]).includes(record.relationship);
        case 'OCCUPANCY_CLASS_IN':
            return (criterion.classes as readonly string[]).includes(record.occupancyClass);
        case 'TENURE_AT_LEAST_DAYS':
            return daysEffectiveWithin(record.effective, at) >= criterion.days;
        case 'EXTERNAL_FLAG_PRESENT':
            return externalFacts[criterion.flagKey] === true;
    }
}
export function evaluateEligibility(input: {
    readonly policy: GovernancePolicy;
    readonly record: GovernanceMemberRecord;
    readonly at: IsoInstant;
    readonly externalFacts: ExternalEligibilityFacts;
}): EligibilityOutcome {
    const { policy, record, at, externalFacts } = input;
    const tenureDays = daysEffectiveWithin(record.effective, at);
    const failedCriteria: string[] = [];
    policy.eligibility.criteria.forEach((criterion, index) => {
        if (!criterionSatisfied(criterion, record, at, externalFacts)) {
            failedCriteria.push(criterionId(criterion, index));
        }
    });
    return {
        membershipId: record.membershipId,
        eligible: failedCriteria.length === 0,
        failedCriteria,
        tenureDays,
    };
}
export function eligibleRecords(input: {
    readonly policy: GovernancePolicy;
    readonly records: readonly GovernanceMemberRecord[];
    readonly at: IsoInstant;
    readonly externalFacts: ExternalEligibilityFacts;
}): GovernanceMemberRecord[] {
    return input.records.filter((record) => evaluateEligibility({
        policy: input.policy,
        record,
        at: input.at,
        externalFacts: input.externalFacts,
    }).eligible);
}

