import { canonicalPreimageSha256, requiredPart, type CanonicalValue, } from '../../moveInMoveOut/domain/crypto/canonicalJson';
import type { DenominatorRule, EligibilityCriterion, EligibilityRuleSet, GovernancePolicy, QuorumRule, } from './policy.types';
import type { IsoInstant } from './temporal';
import { isIsoInstant, normalizeIso } from './temporal';
const POLICY_NAMESPACE = 'governance.policy.v1';
const SNAPSHOT_NAMESPACE = 'governance.eligibilitySnapshot.v1';
function criterionToCanonical(criterion: EligibilityCriterion): CanonicalValue {
    switch (criterion.kind) {
        case 'MEMBERSHIP_STATUS_IN':
            return { kind: criterion.kind, statuses: [...criterion.statuses].sort() };
        case 'RELATIONSHIP_IN':
            return { kind: criterion.kind, relationships: [...criterion.relationships].sort() };
        case 'OCCUPANCY_CLASS_IN':
            return { kind: criterion.kind, classes: [...criterion.classes].sort() };
        case 'TENURE_AT_LEAST_DAYS':
            return { kind: criterion.kind, days: criterion.days };
        case 'EXTERNAL_FLAG_PRESENT':
            return { kind: criterion.kind, flagKey: criterion.flagKey };
    }
}
function ruleSetToCanonical(ruleSet: EligibilityRuleSet): CanonicalValue {
    return { criteria: ruleSet.criteria.map(criterionToCanonical) };
}
function quorumToCanonical(quorum: QuorumRule): CanonicalValue {
    switch (quorum.kind) {
        case 'PERCENTAGE_OF_ELIGIBLE':
            return { kind: quorum.kind, percentBasisPoints: quorum.percentBasisPoints, rounding: quorum.rounding };
        case 'ABSOLUTE_MINIMUM':
            return { kind: quorum.kind, minimum: quorum.minimum };
        case 'PERCENTAGE_AND_ABSOLUTE':
            return {
                kind: quorum.kind,
                percentBasisPoints: quorum.percentBasisPoints,
                rounding: quorum.rounding,
                minimum: quorum.minimum,
            };
    }
}
function denominatorToCanonical(denominator: DenominatorRule): CanonicalValue {
    return denominator.strategy === 'COUNT_UNITS'
        ? { strategy: denominator.strategy, representativeRelationship: denominator.representativeRelationship }
        : { strategy: denominator.strategy };
}
function instantPart(key: string, value: IsoInstant) {
    return requiredPart(key, isIsoInstant(value) ? normalizeIso(value) : `invalid-instant:${value}`);
}
function optionalInstantPart(key: string, value: IsoInstant | null) {
    return requiredPart(key, value === null ? null : isIsoInstant(value) ? normalizeIso(value) : `invalid-instant:${value}`);
}
export function computePolicyContentHash(policy: Omit<GovernancePolicy, 'contentHash'>): string {
    return canonicalPreimageSha256(POLICY_NAMESPACE, [
        requiredPart('policyId', policy.policyId),
        requiredPart('version', policy.version),
        requiredPart('jurisdictionCode', policy.jurisdictionCode),
        requiredPart('societyId', policy.societyId),
        requiredPart('decisionKind', policy.decisionKind),
        instantPart('effectiveFrom', policy.effective.effectiveFrom),
        optionalInstantPart('effectiveTo', policy.effective.effectiveTo),
        requiredPart('eligibility', ruleSetToCanonical(policy.eligibility)),
        requiredPart('quorum', quorumToCanonical(policy.quorum)),
        requiredPart('denominator', denominatorToCanonical(policy.denominator)),
        requiredPart('eVoting', policy.eVoting.state),
        instantPart('publishedAt', policy.publishedAt),
    ]);
}
export type SnapshotHashInput = {
    readonly societyId: string;
    readonly jurisdictionCode: string;
    readonly decisionKind: GovernancePolicy['decisionKind'];
    readonly recordDate: IsoInstant;
    readonly policyId: string;
    readonly policyVersion: number;
    readonly policyContentHash: string;
    readonly denominatorStrategy: GovernancePolicy['denominator']['strategy'];
    readonly eligibleIds: readonly string[];
    readonly denominatorRepresentativeIds: readonly string[];
    readonly denominatorCount: number;
    readonly computedAt: IsoInstant;
};
export function computeSnapshotContentHash(snapshot: SnapshotHashInput): string {
    return canonicalPreimageSha256(SNAPSHOT_NAMESPACE, [
        requiredPart('societyId', snapshot.societyId),
        requiredPart('jurisdictionCode', snapshot.jurisdictionCode),
        requiredPart('decisionKind', snapshot.decisionKind),
        instantPart('recordDate', snapshot.recordDate),
        requiredPart('policyId', snapshot.policyId),
        requiredPart('policyVersion', snapshot.policyVersion),
        requiredPart('policyContentHash', snapshot.policyContentHash),
        requiredPart('denominatorStrategy', snapshot.denominatorStrategy),
        requiredPart('eligibleIds', [...snapshot.eligibleIds].sort()),
        requiredPart('denominatorRepresentativeIds', [...snapshot.denominatorRepresentativeIds].sort()),
        requiredPart('denominatorCount', snapshot.denominatorCount),
        instantPart('computedAt', snapshot.computedAt),
    ]);
}

