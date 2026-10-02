import type { AuthSession } from '../../../../core/auth/authSession.types';
import type { HouseholdActorRelationship } from '../../../../core/householdGovernance/householdActionGovernance.types';
import { committeeRolesHeldAt } from './memberRegister';
import type { GovernanceCommitteeRole, GovernanceMemberRecord, GovernanceOccupancyClass, } from './policy.types';
import { isEffectiveAt, isIsoInstant, normalizeIso } from './temporal';
import type { IsoInstant } from './temporal';
export const GOVERNANCE_PERMISSIONS = {
    MEETING_CONVENE: 'governance.meeting.convene',
    NOTICE_PUBLISH: 'governance.meeting.notice.publish',
    AGENDA_MANAGE: 'governance.meeting.agenda.manage',
    MINUTES_DRAFT: 'governance.minutes.draft',
    MINUTES_APPROVE: 'governance.minutes.approve',
    RESOLUTION_CONVENE: 'governance.resolution.convene',
    RESOLUTION_TALLY: 'governance.resolution.tally',
    ELECTION_ADMINISTER: 'governance.election.administer',
    FUNDS_REPORT: 'governance.funds.report',
} as const;
export type GovernancePermission = (typeof GOVERNANCE_PERMISSIONS)[keyof typeof GOVERNANCE_PERMISSIONS];
const COMMITTEE_ROLE_PERMISSIONS: Readonly<Record<GovernanceCommitteeRole, readonly string[]>> = {
    CHAIRPERSON: [
        GOVERNANCE_PERMISSIONS.MEETING_CONVENE,
        GOVERNANCE_PERMISSIONS.AGENDA_MANAGE,
        GOVERNANCE_PERMISSIONS.MINUTES_DRAFT,
        GOVERNANCE_PERMISSIONS.MINUTES_APPROVE,
        GOVERNANCE_PERMISSIONS.RESOLUTION_CONVENE,
        GOVERNANCE_PERMISSIONS.RESOLUTION_TALLY,
        GOVERNANCE_PERMISSIONS.ELECTION_ADMINISTER,
    ],
    SECRETARY: [
        GOVERNANCE_PERMISSIONS.MEETING_CONVENE,
        GOVERNANCE_PERMISSIONS.NOTICE_PUBLISH,
        GOVERNANCE_PERMISSIONS.AGENDA_MANAGE,
        GOVERNANCE_PERMISSIONS.MINUTES_DRAFT,
    ],
    TREASURER: [GOVERNANCE_PERMISSIONS.FUNDS_REPORT],
    COMMITTEE_MEMBER: [GOVERNANCE_PERMISSIONS.RESOLUTION_CONVENE],
};
export type TrustedSocietyContext = {
    readonly societyId: string;
    readonly jurisdictionCode: string;
};
export type GovernanceIdentitySource = {
    readonly session: AuthSession;
    readonly society: TrustedSocietyContext;
    readonly member: GovernanceMemberRecord;
    readonly sessionId: string;
    readonly authenticatedAt: IsoInstant;
    readonly evaluatedAt: IsoInstant;
};
export type GovernanceActorContext = {
    readonly societyId: string;
    readonly jurisdictionCode: string;
    readonly personId: string;
    readonly userId: string;
    readonly membershipId: string;
    readonly residenceId: string;
    readonly unitId: string;
    readonly relationship: HouseholdActorRelationship;
    readonly occupancyClass: GovernanceOccupancyClass;
    readonly committeeRoles: readonly GovernanceCommitteeRole[];
    readonly permissions: ReadonlySet<string>;
    readonly sessionId: string;
    readonly authenticatedAt: IsoInstant;
    readonly evaluatedAt: IsoInstant;
};
export type GovernanceActorDenialCode = 'NO_AUTHENTICATED_SESSION' | 'SESSION_NOT_AUTHORITATIVE' | 'NO_TRUSTED_SOCIETY_CONTEXT' | 'INVALID_EVALUATION_INSTANT' | 'SESSION_SOCIETY_MISMATCH' | 'MEMBERSHIP_SOCIETY_MISMATCH' | 'MEMBERSHIP_USER_MISMATCH' | 'MEMBERSHIP_UNIT_MISMATCH' | 'MEMBERSHIP_NOT_EFFECTIVE' | 'MEMBERSHIP_NOT_ACTIVE';
export type GovernanceActorResolution = {
    readonly ok: true;
    readonly actor: GovernanceActorContext;
} | {
    readonly ok: false;
    readonly code: GovernanceActorDenialCode;
    readonly message: string;
};
function deny(code: GovernanceActorDenialCode, message: string): GovernanceActorResolution {
    return { ok: false, code, message };
}
export function governancePermissionsFor(input: {
    readonly committeeRoles: readonly GovernanceCommitteeRole[];
    readonly recordPermissions: ReadonlySet<string>;
}): ReadonlySet<string> {
    const permissions = new Set<string>(input.recordPermissions);
    for (const role of input.committeeRoles) {
        for (const permission of COMMITTEE_ROLE_PERMISSIONS[role]) {
            permissions.add(permission);
        }
    }
    return permissions;
}
export function hasGovernancePermission(actor: GovernanceActorContext, permission: string): boolean {
    return actor.permissions.has(permission);
}
export function deriveGovernanceActor(source: GovernanceIdentitySource): GovernanceActorResolution {
    const { session, society, member } = source;
    if (session.userId.trim().length === 0) {
        return deny('NO_AUTHENTICATED_SESSION', 'No authenticated user is present on this session.');
    }
    if (session.isMockSession) {
        return deny('SESSION_NOT_AUTHORITATIVE', 'A mock session cannot ground a binding governance decision.');
    }
    if (society.societyId.trim().length === 0 ||
        society.jurisdictionCode.trim().length === 0) {
        return deny('NO_TRUSTED_SOCIETY_CONTEXT', 'A trusted society identity and jurisdiction are required before any governance decision.');
    }
    if (!isIsoInstant(source.evaluatedAt) ||
        !isIsoInstant(source.authenticatedAt) ||
        source.sessionId.trim().length === 0) {
        return deny('INVALID_EVALUATION_INSTANT', 'The evaluation instant or session identity is not well formed.');
    }
    if (session.societyId !== undefined && session.societyId !== society.societyId) {
        return deny('SESSION_SOCIETY_MISMATCH', 'The session society disagrees with the trusted society context.');
    }
    if (member.societyId !== society.societyId) {
        return deny('MEMBERSHIP_SOCIETY_MISMATCH', 'The membership record belongs to a different society.');
    }
    if (member.userId !== session.userId) {
        return deny('MEMBERSHIP_USER_MISMATCH', 'The membership record does not belong to the authenticated user.');
    }
    if (session.unitId !== undefined && session.unitId !== member.unitId) {
        return deny('MEMBERSHIP_UNIT_MISMATCH', 'The session unit does not match the membership unit.');
    }
    if (!isEffectiveAt(member.effective, source.evaluatedAt)) {
        return deny('MEMBERSHIP_NOT_EFFECTIVE', 'The membership is not effective at the evaluation instant.');
    }
    if (member.status !== 'ACTIVE') {
        return deny('MEMBERSHIP_NOT_ACTIVE', `The membership is ${member.status}, not ACTIVE.`);
    }
    const committeeRoles = committeeRolesHeldAt(member.committeeAppointments, member.personId, society.societyId, source.evaluatedAt);
    return {
        ok: true,
        actor: {
            societyId: society.societyId,
            jurisdictionCode: society.jurisdictionCode,
            personId: member.personId,
            userId: member.userId,
            membershipId: member.membershipId,
            residenceId: member.residenceId,
            unitId: member.unitId,
            relationship: member.relationship,
            occupancyClass: member.occupancyClass,
            committeeRoles,
            permissions: governancePermissionsFor({
                committeeRoles,
                recordPermissions: member.permissions,
            }),
            sessionId: source.sessionId,
            authenticatedAt: normalizeIso(source.authenticatedAt),
            evaluatedAt: normalizeIso(source.evaluatedAt),
        },
    };
}

