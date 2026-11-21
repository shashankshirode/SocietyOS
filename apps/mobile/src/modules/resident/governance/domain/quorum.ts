import { verifySnapshotIntegrity, type EligibilitySnapshot } from './snapshot';
import type { GovernancePolicy, QuorumRule } from './policy.types';
const BASIS_POINTS_PER_HUNDRED_PERCENT = 10000;
export type QuorumNotComputableReason = 'SNAPSHOT_INTEGRITY_FAILURE' | 'POLICY_MISMATCH' | 'DENOMINATOR_EMPTY';
export type QuorumEvaluation = {
    readonly status: 'QUORUM_MET';
    readonly requiredPresent: number;
    readonly presentCount: number;
    readonly denominatorCount: number;
    readonly ignoredPresentIds: readonly string[];
} | {
    readonly status: 'QUORUM_NOT_MET';
    readonly requiredPresent: number;
    readonly presentCount: number;
    readonly denominatorCount: number;
    readonly ignoredPresentIds: readonly string[];
} | {
    readonly status: 'QUORUM_NOT_COMPUTABLE';
    readonly reason: QuorumNotComputableReason;
    readonly detail: string;
};
function percentageThreshold(base: number, percentBasisPoints: number, rounding: 'ROUND_UP' | 'ROUND_DOWN'): number {
    const numerator = base * percentBasisPoints;
    return rounding === 'ROUND_UP'
        ? Math.ceil(numerator / BASIS_POINTS_PER_HUNDRED_PERCENT)
        : Math.floor(numerator / BASIS_POINTS_PER_HUNDRED_PERCENT);
}
export function requiredPresentCount(rule: QuorumRule, denominatorCount: number): number {
    switch (rule.kind) {
        case 'PERCENTAGE_OF_ELIGIBLE':
            return percentageThreshold(denominatorCount, rule.percentBasisPoints, rule.rounding);
        case 'ABSOLUTE_MINIMUM':
            return rule.minimum;
        case 'PERCENTAGE_AND_ABSOLUTE':
            return Math.max(percentageThreshold(denominatorCount, rule.percentBasisPoints, rule.rounding), rule.minimum);
    }
}
export function evaluateQuorum(input: {
    readonly snapshot: EligibilitySnapshot;
    readonly policy: GovernancePolicy;
    readonly presentMembershipIds: readonly string[];
}): QuorumEvaluation {
    const { snapshot, policy } = input;
    if (!verifySnapshotIntegrity(snapshot)) {
        return {
            status: 'QUORUM_NOT_COMPUTABLE',
            reason: 'SNAPSHOT_INTEGRITY_FAILURE',
            detail: 'The record-date snapshot no longer matches its content hash.',
        };
    }
    if (policy.contentHash !== snapshot.policyContentHash) {
        return {
            status: 'QUORUM_NOT_COMPUTABLE',
            reason: 'POLICY_MISMATCH',
            detail: 'The supplied policy is not the policy version frozen into the snapshot.',
        };
    }
    if (snapshot.denominatorRepresentativeIds.length !== snapshot.denominatorCount) {
        return {
            status: 'QUORUM_NOT_COMPUTABLE',
            reason: 'SNAPSHOT_INTEGRITY_FAILURE',
            detail: 'The frozen denominator count does not match its representative set.',
        };
    }
    if (snapshot.denominatorCount === 0) {
        return {
            status: 'QUORUM_NOT_COMPUTABLE',
            reason: 'DENOMINATOR_EMPTY',
            detail: 'No member was eligible at the record date, so no threshold can be met.',
        };
    }
    const eligible = new Set(snapshot.eligibleMembershipIds);
    const present = [...new Set(input.presentMembershipIds)].sort();
    const counted = present.filter((membershipId) => eligible.has(membershipId));
    const ignoredPresentIds = present.filter((membershipId) => !eligible.has(membershipId));
    const required = requiredPresentCount(policy.quorum, snapshot.denominatorCount);
    const common = {
        requiredPresent: required,
        presentCount: counted.length,
        denominatorCount: snapshot.denominatorCount,
        ignoredPresentIds,
    };
    return counted.length >= required
        ? { status: 'QUORUM_MET', ...common }
        : { status: 'QUORUM_NOT_MET', ...common };
}

