import type { AuthSession } from '../../../../../core/auth/authSession.types';
import type { HouseholdActorRelationship } from '../../../../../core/householdGovernance/householdActionGovernance.types';
import type { TrustedSocietyContext } from '../actorContext';
import type {
  EligibilityRuleSet,
  GovernanceCommitteeAppointment,
  GovernanceCommitteeRole,
  GovernanceMemberRecord,
  GovernanceOccupancyClass,
  MembershipStatus,
} from '../policy.types';
import { definePolicy, type GovernancePolicyDraft } from '../policyRegistry';
import type { EffectiveWindow, IsoInstant } from '../temporal';

export const SOCIETY: TrustedSocietyContext = {
  societyId: 'soc-1',
  jurisdictionCode: 'IN-MH',
};

export const OTHER_SOCIETY: TrustedSocietyContext = {
  societyId: 'soc-2',
  jurisdictionCode: 'IN-MH',
};

export const OTHER_JURISDICTION: TrustedSocietyContext = {
  societyId: 'soc-1',
  jurisdictionCode: 'IN-KA',
};

export const T_START = '2026-01-01T00:00:00.000Z';
export const T_MID = '2026-06-01T00:00:00.000Z';
export const T_END = '2026-12-01T00:00:00.000Z';
export const T_BEFORE = '2025-12-31T23:59:59.999Z';
export const T_AFTER = '2027-01-01T00:00:00.000Z';

export const OPEN_WINDOW: EffectiveWindow = { effectiveFrom: T_START, effectiveTo: null };

export function window(from: IsoInstant, to: IsoInstant | null): EffectiveWindow {
  return { effectiveFrom: from, effectiveTo: to };
}

export function member(overrides: Partial<GovernanceMemberRecord> = {}): GovernanceMemberRecord {
  return {
    membershipId: 'mem-1',
    societyId: SOCIETY.societyId,
    personId: 'per-1',
    userId: 'usr-1',
    residenceId: 'res-1',
    unitId: 'unit-A-701',
    relationship: 'OWNER',
    occupancyClass: 'OWNER_OCCUPIED',
    status: 'ACTIVE',
    effective: OPEN_WINDOW,
    permissions: new Set<string>(),
    committeeAppointments: [],
    ...overrides,
  };
}

export function appointment(
  role: GovernanceCommitteeRole,
  overrides: Partial<GovernanceCommitteeAppointment> = {},
): GovernanceCommitteeAppointment {
  return {
    appointmentId: `appt-${role}`,
    societyId: SOCIETY.societyId,
    personId: 'per-1',
    role,
    effective: OPEN_WINDOW,
    ...overrides,
  };
}

export function session(overrides: Partial<AuthSession> = {}): AuthSession {
  return {
    userId: 'usr-1',
    name: 'Test Resident',
    role: 'RESIDENT_OWNER',
    societyId: SOCIETY.societyId,
    unitId: 'unit-A-701',
    isMockSession: false,
    ...overrides,
  };
}

type PolicyOverrides = Partial<
  Pick<
    GovernancePolicyDraft,
    | 'policyId'
    | 'version'
    | 'jurisdictionCode'
    | 'societyId'
    | 'decisionKind'
    | 'effective'
    | 'eligibility'
    | 'quorum'
    | 'denominator'
    | 'eVoting'
    | 'publishedAt'
  >
>;

export function policy(overrides: PolicyOverrides = {}) {
  return definePolicy({
    policyId: 'pol-1',
    version: 1,
    jurisdictionCode: SOCIETY.jurisdictionCode,
    societyId: null,
    decisionKind: 'RESOLUTION_VOTING',
    effective: OPEN_WINDOW,
    eligibility: { criteria: [] },
    quorum: { kind: 'ABSOLUTE_MINIMUM', minimum: 3 },
    denominator: { strategy: 'COUNT_MEMBERSHIPS' },
    eVoting: { state: 'NOT_CONFIGURED' },
    publishedAt: T_START,
    ...overrides,
  });
}

export function ruleSet(criteria: EligibilityRuleSet['criteria']): EligibilityRuleSet {
  return { criteria };
}

export const NO_EXTERNAL_FACTS: Readonly<Record<string, boolean>> = {};

export const DUECLEARANCE: Readonly<Record<string, boolean>> = {
  FINANCE_DUES_CLEARANCE: true,
};

export type { GovernanceOccupancyClass, MembershipStatus, HouseholdActorRelationship };
