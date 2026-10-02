import { computePolicyContentHash } from './integrity';
import type { GovernanceDecisionKind, GovernancePolicy } from './policy.types';
import { GOVERNANCE_DECISION_KINDS } from './policy.types';
import { compareInstants, isEffectiveAt, isIsoInstant, isValidWindow } from './temporal';
import type { IsoInstant } from './temporal';
import { getRequiredItem } from '../../../../shared/utils/requiredItem';
export type PolicySpecificity = 'SOCIETY' | 'JURISDICTION';
export type PolicyResolution = {
    readonly status: 'RESOLVED';
    readonly policy: GovernancePolicy;
    readonly specificity: PolicySpecificity;
} | {
    readonly status: 'POLICY_NOT_CONFIGURED';
    readonly decisionKind: GovernanceDecisionKind;
    readonly at: IsoInstant;
} | {
    readonly status: 'POLICY_INTEGRITY_FAILURE';
    readonly policyId: string;
    readonly version: number;
} | {
    readonly status: 'POLICY_AMBIGUOUS';
    readonly conflictingPolicyIds: readonly string[];
} | {
    readonly status: 'POLICY_INVALID';
    readonly policyId: string;
    readonly version: number;
    readonly reason: string;
};
export type GovernancePolicyDraft = Omit<GovernancePolicy, 'contentHash'>;
export function definePolicy(draft: GovernancePolicyDraft): GovernancePolicy {
    return { ...draft, contentHash: computePolicyContentHash(draft) };
}
function isDecisionKind(value: string): value is GovernanceDecisionKind {
    return (GOVERNANCE_DECISION_KINDS as readonly string[]).includes(value);
}
function validatePolicy(policy: GovernancePolicy): string | undefined {
    if (!isDecisionKind(policy.decisionKind)) {
        return 'DECISION_KIND_UNRECOGNISED';
    }
    if (policy.version < 1) {
        return 'VERSION_MUST_BE_POSITIVE';
    }
    if (!isValidWindow(policy.effective)) {
        return 'EFFECTIVE_WINDOW_INVALID';
    }
    if (!isIsoInstant(policy.publishedAt)) {
        return 'PUBLISHED_AT_INVALID';
    }
    if (policy.policyId.length === 0) {
        return 'POLICY_ID_REQUIRED';
    }
    if (policy.jurisdictionCode.length === 0) {
        return 'JURISDICTION_CODE_REQUIRED';
    }
    for (const criterion of policy.eligibility.criteria) {
        switch (criterion.kind) {
            case 'MEMBERSHIP_STATUS_IN':
                if (criterion.statuses.length === 0) {
                    return 'CRITERION_STATUSES_REQUIRED';
                }
                break;
            case 'RELATIONSHIP_IN':
                if (criterion.relationships.length === 0) {
                    return 'CRITERION_RELATIONSHIPS_REQUIRED';
                }
                break;
            case 'OCCUPANCY_CLASS_IN':
                if (criterion.classes.length === 0) {
                    return 'CRITERION_CLASSES_REQUIRED';
                }
                break;
            case 'TENURE_AT_LEAST_DAYS':
                if (!Number.isInteger(criterion.days) || criterion.days < 0) {
                    return 'CRITERION_TENURE_DAYS_INVALID';
                }
                break;
            case 'EXTERNAL_FLAG_PRESENT':
                if (criterion.flagKey.length === 0) {
                    return 'CRITERION_FLAG_KEY_REQUIRED';
                }
                break;
        }
    }
    switch (policy.quorum.kind) {
        case 'PERCENTAGE_OF_ELIGIBLE':
            if (!Number.isInteger(policy.quorum.percentBasisPoints) ||
                policy.quorum.percentBasisPoints <= 0 ||
                policy.quorum.percentBasisPoints > 10000) {
                return 'QUORUM_BASIS_POINTS_OUT_OF_RANGE';
            }
            break;
        case 'ABSOLUTE_MINIMUM':
            if (!Number.isInteger(policy.quorum.minimum) || policy.quorum.minimum < 0) {
                return 'QUORUM_MINIMUM_INVALID';
            }
            break;
        case 'PERCENTAGE_AND_ABSOLUTE':
            if (!Number.isInteger(policy.quorum.percentBasisPoints) ||
                policy.quorum.percentBasisPoints <= 0 ||
                policy.quorum.percentBasisPoints > 10000) {
                return 'QUORUM_BASIS_POINTS_OUT_OF_RANGE';
            }
            if (!Number.isInteger(policy.quorum.minimum) || policy.quorum.minimum < 0) {
                return 'QUORUM_MINIMUM_INVALID';
            }
            break;
    }
    if (policy.denominator.strategy === 'COUNT_UNITS') {
        if (policy.denominator.representativeRelationship.length === 0) {
            return 'DENOMINATOR_REPRESENTATIVE_REQUIRED';
        }
    }
    return undefined;
}
function isMorePreferred(candidate: GovernancePolicy, incumbent: GovernancePolicy): boolean {
    const byEffectiveDate = compareInstants(candidate.effective.effectiveFrom, incumbent.effective.effectiveFrom);
    if (byEffectiveDate !== 0) {
        return byEffectiveDate > 0;
    }
    return candidate.version > incumbent.version;
}
function equallyPreferred(left: GovernancePolicy, right: GovernancePolicy): boolean {
    return (compareInstants(left.effective.effectiveFrom, right.effective.effectiveFrom) === 0 &&
        left.version === right.version);
}
function specificityOf(policy: GovernancePolicy, societyId: string): PolicySpecificity | undefined {
    if (policy.societyId === societyId) {
        return 'SOCIETY';
    }
    if (policy.societyId === null) {
        return 'JURISDICTION';
    }
    return undefined;
}
export function resolvePolicy(policies: readonly GovernancePolicy[], query: {
    readonly jurisdictionCode: string;
    readonly societyId: string;
    readonly decisionKind: GovernanceDecisionKind;
    readonly at: IsoInstant;
}): PolicyResolution {
    if (!isIsoInstant(query.at)) {
        return {
            status: 'POLICY_INVALID',
            policyId: '',
            version: 0,
            reason: 'AT_INSTANT_INVALID',
        };
    }
    const candidates = policies.filter((policy) => {
        if (policy.decisionKind !== query.decisionKind) {
            return false;
        }
        if (policy.jurisdictionCode !== query.jurisdictionCode) {
            return false;
        }
        if (specificityOf(policy, query.societyId) === undefined) {
            return false;
        }
        return isEffectiveAt(policy.effective, query.at);
    });
    if (candidates.length === 0) {
        return {
            status: 'POLICY_NOT_CONFIGURED',
            decisionKind: query.decisionKind,
            at: query.at,
        };
    }
    const societyScoped = candidates.filter((policy) => specificityOf(policy, query.societyId) === 'SOCIETY');
    const pool = societyScoped.length > 0 ? societyScoped : candidates;
    const specificity: PolicySpecificity = societyScoped.length > 0 ? 'SOCIETY' : 'JURISDICTION';
    let winner = getRequiredItem(pool, 0, 'policyCandidates');
    for (const candidate of pool.slice(1)) {
        if (isMorePreferred(candidate, winner)) {
            winner = candidate;
        }
    }
    const conflicts = pool.filter((policy) => policy.policyId !== winner.policyId && equallyPreferred(policy, winner));
    if (conflicts.length > 0) {
        return {
            status: 'POLICY_AMBIGUOUS',
            conflictingPolicyIds: [...new Set([winner, ...conflicts].map((policy) => policy.policyId))].sort(),
        };
    }
    const invalidReason = validatePolicy(winner);
    if (invalidReason !== undefined) {
        return {
            status: 'POLICY_INVALID',
            policyId: winner.policyId,
            version: winner.version,
            reason: invalidReason,
        };
    }
    if (computePolicyContentHash(winner) !== winner.contentHash) {
        return {
            status: 'POLICY_INTEGRITY_FAILURE',
            policyId: winner.policyId,
            version: winner.version,
        };
    }
    return { status: 'RESOLVED', policy: winner, specificity };
}

