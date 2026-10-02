import type { ResidenceMembership } from '../../../../core/householdGovernance/identity.types';
import type { HouseholdActorRelationship } from '../../../../core/householdGovernance/householdActionGovernance.types';
import type { DenominatorRule, DenominatorStrategy, GovernanceCommitteeAppointment, GovernanceCommitteeRole, GovernanceMemberRecord, GovernanceOccupancyClass, MembershipStatus, } from './policy.types';
import { isEffectiveAt, isValidWindow, windowsOverlap } from './temporal';
import type { EffectiveWindow, IsoInstant } from './temporal';
export type MembershipConflict = {
    readonly firstMembershipId: string;
    readonly secondMembershipId: string;
    readonly personId: string;
    readonly societyId: string;
    readonly reason: 'OVERLAPPING_MEMBERSHIP' | 'INVALID_EFFECTIVE_WINDOW';
};
export function isActiveMembership(record: GovernanceMemberRecord): boolean {
    return record.status === 'ACTIVE';
}
export function membershipRecordFromCore(input: {
    readonly membership: ResidenceMembership;
    readonly effective: EffectiveWindow;
    readonly occupancyClass: GovernanceOccupancyClass;
    readonly committeeAppointments?: readonly GovernanceCommitteeAppointment[];
}): GovernanceMemberRecord {
    const { membership } = input;
    return {
        membershipId: membership.membershipId,
        societyId: membership.societyId,
        personId: membership.personId,
        userId: membership.userId,
        residenceId: membership.residenceId,
        unitId: membership.unitId,
        relationship: membership.relationship,
        occupancyClass: input.occupancyClass,
        status: normalizeStatus(membership.status),
        effective: input.effective,
        permissions: membership.permissions,
        committeeAppointments: input.committeeAppointments ?? [],
    };
}
function normalizeStatus(status: ResidenceMembership['status']): MembershipStatus {
    switch (status) {
        case 'ACTIVE':
            return 'ACTIVE';
        case 'SUSPENDED':
            return 'SUSPENDED';
        case 'ENDED':
            return 'ENDED';
        case 'REVOKED':
            return 'REVOKED';
        case 'INVITED':
            return 'SUSPENDED';
    }
}
export function membershipsEffectiveAt(records: readonly GovernanceMemberRecord[], societyId: string, at: IsoInstant): GovernanceMemberRecord[] {
    return records
        .filter((record) => record.societyId === societyId && isEffectiveAt(record.effective, at))
        .sort(compareByMembershipId);
}
function compareByMembershipId(left: GovernanceMemberRecord, right: GovernanceMemberRecord): number {
    if (left.membershipId === right.membershipId) {
        return 0;
    }
    return left.membershipId < right.membershipId ? -1 : 1;
}
export function findMembershipById(records: readonly GovernanceMemberRecord[], membershipId: string, at: IsoInstant): GovernanceMemberRecord | undefined {
    return records.find((record) => record.membershipId === membershipId && isEffectiveAt(record.effective, at));
}
export function membershipsOfUser(records: readonly GovernanceMemberRecord[], userId: string, at: IsoInstant): GovernanceMemberRecord[] {
    return records
        .filter((record) => record.userId === userId && isEffectiveAt(record.effective, at))
        .sort(compareByMembershipId);
}
export function committeeRolesHeldAt(appointments: readonly GovernanceCommitteeAppointment[], personId: string, societyId: string, at: IsoInstant): GovernanceCommitteeRole[] {
    const roles = new Set<GovernanceCommitteeRole>();
    for (const appointment of appointments) {
        if (appointment.personId !== personId || appointment.societyId !== societyId) {
            continue;
        }
        if (isEffectiveAt(appointment.effective, at)) {
            roles.add(appointment.role);
        }
    }
    return [...roles].sort();
}
export function committeeHoldersAt(appointments: readonly GovernanceCommitteeAppointment[], societyId: string, role: GovernanceCommitteeRole, at: IsoInstant): GovernanceCommitteeAppointment[] {
    return appointments
        .filter((appointment) => appointment.societyId === societyId &&
        appointment.role === role &&
        isEffectiveAt(appointment.effective, at))
        .sort((left, right) => left.appointmentId < right.appointmentId ? -1 : left.appointmentId > right.appointmentId ? 1 : 0);
}
export function detectMembershipConflicts(records: readonly GovernanceMemberRecord[]): MembershipConflict[] {
    const conflicts: MembershipConflict[] = [];
    const ordered = [...records].sort(compareByMembershipId);
    ordered.forEach((first, left) => {
        if (!isValidWindow(first.effective)) {
            conflicts.push({
                firstMembershipId: first.membershipId,
                secondMembershipId: first.membershipId,
                personId: first.personId,
                societyId: first.societyId,
                reason: 'INVALID_EFFECTIVE_WINDOW',
            });
            return;
        }
        ordered.slice(left + 1).forEach((second) => {
            if (second.societyId !== first.societyId || second.personId !== first.personId) {
                return;
            }
            if (windowsOverlap(first.effective, second.effective)) {
                conflicts.push({
                    firstMembershipId: first.membershipId,
                    secondMembershipId: second.membershipId,
                    personId: first.personId,
                    societyId: first.societyId,
                    reason: 'OVERLAPPING_MEMBERSHIP',
                });
            }
        });
    });
    return conflicts;
}
export type DenominatorProjection = {
    readonly strategy: DenominatorStrategy;
    readonly representativeIds: readonly string[];
    readonly count: number;
};
export function projectDenominator(eligible: readonly GovernanceMemberRecord[], rule: DenominatorRule): DenominatorProjection {
    switch (rule.strategy) {
        case 'COUNT_MEMBERSHIPS': {
            const representativeIds = [...new Set(eligible.map((record) => record.membershipId))].sort();
            return { strategy: rule.strategy, representativeIds, count: representativeIds.length };
        }
        case 'COUNT_PERSONS': {
            const representativeIds = [...new Set(eligible.map((record) => record.personId))].sort();
            return { strategy: rule.strategy, representativeIds, count: representativeIds.length };
        }
        case 'COUNT_UNITS': {
            const unitsWithRepresentative = new Set<string>();
            for (const record of eligible) {
                if (record.relationship === rule.representativeRelationship) {
                    unitsWithRepresentative.add(record.unitId);
                }
            }
            const representativeIds = [...unitsWithRepresentative].sort();
            return { strategy: rule.strategy, representativeIds, count: representativeIds.length };
        }
    }
}
export type { HouseholdActorRelationship };

