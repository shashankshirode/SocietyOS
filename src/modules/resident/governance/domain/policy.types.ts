import type { HouseholdActorRelationship } from '../../../../core/householdGovernance/householdActionGovernance.types';
import type { EffectiveWindow, IsoInstant } from './temporal';
export const GOVERNANCE_DECISION_KINDS = [
    'MEETING_PARTICIPATION',
    'RESOLUTION_VOTING',
    'ADVISORY_POLL',
    'ELECTION_VOTING',
] as const;
export type GovernanceDecisionKind = (typeof GOVERNANCE_DECISION_KINDS)[number];
export const GOVERNANCE_COMMITTEE_ROLES = [
    'CHAIRPERSON',
    'SECRETARY',
    'TREASURER',
    'COMMITTEE_MEMBER',
] as const;
export type GovernanceCommitteeRole = (typeof GOVERNANCE_COMMITTEE_ROLES)[number];
export type MembershipStatus = 'ACTIVE' | 'SUSPENDED' | 'ENDED' | 'REVOKED';
export const GOVERNANCE_OCCUPANCY_CLASSES = [
    'OWNER_OCCUPIED',
    'OWNER_LEASED',
    'RENTED',
    'SHARED',
    'UNOCCUPIED',
] as const;
export type GovernanceOccupancyClass = (typeof GOVERNANCE_OCCUPANCY_CLASSES)[number];
export type ExternalEligibilityFacts = Readonly<Record<string, boolean>>;
export type EligibilityCriterion = {
    readonly kind: 'MEMBERSHIP_STATUS_IN';
    readonly statuses: readonly MembershipStatus[];
} | {
    readonly kind: 'RELATIONSHIP_IN';
    readonly relationships: readonly HouseholdActorRelationship[];
} | {
    readonly kind: 'OCCUPANCY_CLASS_IN';
    readonly classes: readonly GovernanceOccupancyClass[];
} | {
    readonly kind: 'TENURE_AT_LEAST_DAYS';
    readonly days: number;
} | {
    readonly kind: 'EXTERNAL_FLAG_PRESENT';
    readonly flagKey: string;
};
export type EligibilityRuleSet = {
    readonly criteria: readonly EligibilityCriterion[];
};
export type QuorumRounding = 'ROUND_UP' | 'ROUND_DOWN';
export type QuorumRule = {
    readonly kind: 'PERCENTAGE_OF_ELIGIBLE';
    readonly percentBasisPoints: number;
    readonly rounding: QuorumRounding;
} | {
    readonly kind: 'ABSOLUTE_MINIMUM';
    readonly minimum: number;
} | {
    readonly kind: 'PERCENTAGE_AND_ABSOLUTE';
    readonly percentBasisPoints: number;
    readonly rounding: QuorumRounding;
    readonly minimum: number;
};
export type DenominatorRule = {
    readonly strategy: 'COUNT_MEMBERSHIPS';
    readonly representativeRelationship?: never;
} | {
    readonly strategy: 'COUNT_UNITS';
    readonly representativeRelationship: HouseholdActorRelationship;
} | {
    readonly strategy: 'COUNT_PERSONS';
    readonly representativeRelationship?: never;
};
export type DenominatorStrategy = DenominatorRule['strategy'];
export type EVotingActivation = {
    readonly state: 'NOT_CONFIGURED';
} | {
    readonly state: 'DISABLED';
} | {
    readonly state: 'ENABLED';
};
export type GovernancePolicy = {
    readonly policyId: string;
    readonly version: number;
    readonly jurisdictionCode: string;
    readonly societyId: string | null;
    readonly decisionKind: GovernanceDecisionKind;
    readonly effective: EffectiveWindow;
    readonly eligibility: EligibilityRuleSet;
    readonly quorum: QuorumRule;
    readonly denominator: DenominatorRule;
    readonly eVoting: EVotingActivation;
    readonly publishedAt: IsoInstant;
    readonly contentHash: string;
};
export type GovernanceCommitteeAppointment = {
    readonly appointmentId: string;
    readonly societyId: string;
    readonly personId: string;
    readonly role: GovernanceCommitteeRole;
    readonly effective: EffectiveWindow;
};
export type GovernanceMemberRecord = {
    readonly membershipId: string;
    readonly societyId: string;
    readonly personId: string;
    readonly userId: string;
    readonly residenceId: string;
    readonly unitId: string;
    readonly relationship: HouseholdActorRelationship;
    readonly occupancyClass: GovernanceOccupancyClass;
    readonly status: MembershipStatus;
    readonly effective: EffectiveWindow;
    readonly permissions: ReadonlySet<string>;
    readonly committeeAppointments: readonly GovernanceCommitteeAppointment[];
};

