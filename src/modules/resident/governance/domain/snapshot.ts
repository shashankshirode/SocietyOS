import { computeSnapshotContentHash } from './integrity';
import { eligibleRecords } from './eligibility';
import { detectMembershipConflicts, membershipsEffectiveAt, projectDenominator, } from './memberRegister';
import { resolvePolicy } from './policyRegistry';
import type { PolicyResolution } from './policyRegistry';
import type { DenominatorStrategy, ExternalEligibilityFacts, GovernanceDecisionKind, GovernanceMemberRecord, GovernancePolicy, } from './policy.types';
import { isIsoInstant, normalizeIso } from './temporal';
import type { IsoInstant } from './temporal';
import type { TrustedSocietyContext } from './actorContext';
import type { MembershipConflict } from './memberRegister';
export type EligibilitySnapshot = {
    readonly snapshotId: string;
    readonly societyId: string;
    readonly jurisdictionCode: string;
    readonly recordDate: IsoInstant;
    readonly decisionKind: GovernanceDecisionKind;
    readonly policyId: string;
    readonly policyVersion: number;
    readonly policyContentHash: string;
    readonly denominatorStrategy: DenominatorStrategy;
    readonly eligibleMembershipIds: readonly string[];
    readonly denominatorRepresentativeIds: readonly string[];
    readonly denominatorCount: number;
    readonly computedAt: IsoInstant;
    readonly contentHash: string;
};
export type SnapshotCreation = {
    readonly status: 'CREATED';
    readonly snapshot: EligibilitySnapshot;
    readonly policy: GovernancePolicy;
} | {
    readonly status: 'POLICY_UNAVAILABLE';
    readonly resolution: PolicyResolution;
} | {
    readonly status: 'REGISTER_CONFLICT';
    readonly conflicts: readonly MembershipConflict[];
} | {
    readonly status: 'INVALID_RECORD_DATE';
};
export function createEligibilitySnapshot(input: {
    readonly policies: readonly GovernancePolicy[];
    readonly records: readonly GovernanceMemberRecord[];
    readonly society: TrustedSocietyContext;
    readonly decisionKind: GovernanceDecisionKind;
    readonly recordDate: IsoInstant;
    readonly computedAt: IsoInstant;
    readonly externalFacts: ExternalEligibilityFacts;
}): SnapshotCreation {
    if (!isIsoInstant(input.recordDate) || !isIsoInstant(input.computedAt)) {
        return { status: 'INVALID_RECORD_DATE' };
    }
    const resolution = resolvePolicy(input.policies, {
        jurisdictionCode: input.society.jurisdictionCode,
        societyId: input.society.societyId,
        decisionKind: input.decisionKind,
        at: input.recordDate,
    });
    if (resolution.status !== 'RESOLVED') {
        return { status: 'POLICY_UNAVAILABLE', resolution };
    }
    const policy = resolution.policy;
    const societyRecords = input.records.filter((record) => record.societyId === input.society.societyId);
    const conflicts = detectMembershipConflicts(societyRecords);
    if (conflicts.length > 0) {
        return { status: 'REGISTER_CONFLICT', conflicts };
    }
    const effective = membershipsEffectiveAt(societyRecords, input.society.societyId, input.recordDate);
    const eligible = eligibleRecords({
        policy,
        records: effective,
        at: input.recordDate,
        externalFacts: input.externalFacts,
    });
    const denominator = projectDenominator(eligible, policy.denominator);
    const eligibleMembershipIds = eligible.map((record) => record.membershipId).sort();
    const recordDate = normalizeIso(input.recordDate);
    const computedAt = normalizeIso(input.computedAt);
    const contentHash = computeSnapshotContentHash({
        societyId: input.society.societyId,
        jurisdictionCode: input.society.jurisdictionCode,
        decisionKind: input.decisionKind,
        recordDate,
        policyId: policy.policyId,
        policyVersion: policy.version,
        policyContentHash: policy.contentHash,
        denominatorStrategy: denominator.strategy,
        eligibleIds: eligibleMembershipIds,
        denominatorRepresentativeIds: denominator.representativeIds,
        denominatorCount: denominator.count,
        computedAt,
    });
    return {
        status: 'CREATED',
        policy,
        snapshot: {
            snapshotId: `snap-${contentHash.slice(0, 16)}`,
            societyId: input.society.societyId,
            jurisdictionCode: input.society.jurisdictionCode,
            recordDate,
            decisionKind: input.decisionKind,
            policyId: policy.policyId,
            policyVersion: policy.version,
            policyContentHash: policy.contentHash,
            denominatorStrategy: denominator.strategy,
            eligibleMembershipIds,
            denominatorRepresentativeIds: denominator.representativeIds,
            denominatorCount: denominator.count,
            computedAt,
            contentHash,
        },
    };
}
export function verifySnapshotIntegrity(snapshot: EligibilitySnapshot): boolean {
    return (computeSnapshotContentHash({
        societyId: snapshot.societyId,
        jurisdictionCode: snapshot.jurisdictionCode,
        decisionKind: snapshot.decisionKind,
        recordDate: snapshot.recordDate,
        policyId: snapshot.policyId,
        policyVersion: snapshot.policyVersion,
        policyContentHash: snapshot.policyContentHash,
        denominatorStrategy: snapshot.denominatorStrategy,
        eligibleIds: snapshot.eligibleMembershipIds,
        denominatorRepresentativeIds: snapshot.denominatorRepresentativeIds,
        denominatorCount: snapshot.denominatorCount,
        computedAt: snapshot.computedAt,
    }) === snapshot.contentHash);
}

