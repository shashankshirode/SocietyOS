import type { Absent } from '../../../../../shared/types/absence.types';
import type { AppRole } from '../../../../../core/permissions/permission.types';
import type { ResidenceMembership, IdentitySnapshot } from '../../../../../core/householdGovernance/identity.types';
import type { HouseholdActorRelationship } from '../../../../../core/householdGovernance/householdActionGovernance.types';
import type { AuthSession } from '../../../../../core/auth/authSession.types';
import type { DisputeActor, DisputeActorType } from './primitives';
import type { DisputePartyRole } from './case.types';
import type { DisputeCase } from './case.types';
import { getPermissionsForRoles } from '../../../../../core/permissions/rolePermissionMap';
export const SESSION_AUTHENTICATED_AT_FALLBACK = '1970-01-01T00:00:00.000Z';
export type DisputeIdentitySource = {
    readonly session: AuthSession;
    readonly societyId: string;
    readonly membership: ResidenceMembership;
    readonly displayName: string;
    readonly authenticatedAt: string;
    readonly sessionId: string;
};
export type DisputeActorResolution = {
    readonly ok: true;
    readonly actor: DisputeActor;
    readonly membership: ResidenceMembership;
} | {
    readonly ok: false;
    readonly code: 'ACTOR_NOT_AUTHENTICATED' | 'ACTOR_NOT_AUTHENTICATED_SCOPE' | 'MEMBERSHIP_INACTIVE' | 'MEMBERSHIP_SOCIETY_MISMATCH' | 'UNIT_MISMATCH' | 'ACTOR_TYPE_UNRESOLVED';
    readonly message: string;
};
const FAIL = (code: Extract<DisputeActorResolution, {
    ok: false;
}>['code'], message: string): DisputeActorResolution => ({ ok: false, code, message });
const ROLE_TO_DISPUTE_ACTOR: Partial<Record<AppRole, DisputeActorType>> = {
    SECURITY_GUARD: 'SECURITY_GUARD',
    FACILITY_MANAGER: 'FACILITY_MANAGER',
    COMMITTEE_MEMBER: 'COMMITTEE_MEMBER',
    SECRETARY: 'SOCIETY_SECRETARY',
    CHAIRPERSON: 'SOCIETY_CHAIRPERSON',
    AUDITOR: 'AUDITOR',
    TREASURER: 'TREASURER',
    SOCIETY_ADMIN: 'SOCIETY_ADMIN',
};
const RELATIONSHIP_IS_RESIDENT: ReadonlySet<HouseholdActorRelationship> = new Set<HouseholdActorRelationship>([
    'OWNER',
    'CO_OWNER',
    'TENANT',
    'FAMILY_MEMBER',
    'AUTHORIZED_OCCUPANT',
]);
export function isResidentRelationship(relationship: HouseholdActorRelationship): boolean {
    return RELATIONSHIP_IS_RESIDENT.has(relationship);
}
export function deriveDisputeActor(input: DisputeIdentitySource): DisputeActorResolution {
    const { session, societyId, membership } = input;
    if (session.userId.trim().length === 0) {
        return FAIL('ACTOR_NOT_AUTHENTICATED', 'No authenticated user is present on this session.');
    }
    if (societyId.trim().length === 0) {
        return FAIL('ACTOR_NOT_AUTHENTICATED', 'No trusted society context is present on this session.');
    }
    if (membership.userId !== session.userId) {
        return FAIL('MEMBERSHIP_SOCIETY_MISMATCH', 'The residence membership does not belong to the authenticated user.');
    }
    if (membership.societyId !== societyId) {
        return FAIL('MEMBERSHIP_SOCIETY_MISMATCH', 'The residence membership belongs to a different society.');
    }
    if (session.societyId !== undefined && session.societyId !== societyId) {
        return FAIL('MEMBERSHIP_SOCIETY_MISMATCH', 'The session society and the trusted society context disagree.');
    }
    if (session.unitId !== undefined && session.unitId !== membership.unitId) {
        return FAIL('UNIT_MISMATCH', 'The session unit does not match the residence membership unit.');
    }
    if (membership.status !== 'ACTIVE') {
        return FAIL('MEMBERSHIP_INACTIVE', `The residence membership is ${membership.status}, not ACTIVE.`);
    }
    const actorType = resolveBaselineActorType(session.role, membership.relationship);
    if (actorType === undefined) {
        return FAIL('ACTOR_TYPE_UNRESOLVED', `No dispute actor type is defined for role ${session.role}.`);
    }
    return {
        ok: true,
        membership,
        actor: {
            userId: session.userId,
            role: session.role,
            actorType,
            societyId,
            unitId: membership.unitId,
            displayName: input.displayName,
            sessionId: input.sessionId,
            authenticatedAt: input.authenticatedAt,
        },
    };
}
function resolveBaselineActorType(role: AppRole, relationship: HouseholdActorRelationship): DisputeActorType | undefined {
    if (isResidentRelationship(relationship)) {
        return 'RESIDENT_REPORTER';
    }
    return ROLE_TO_DISPUTE_ACTOR[role];
}
export function deriveDisputeActorForCase(baseline: DisputeActorResolution, disputeCase: DisputeCase): DisputeActorResolution {
    if (!baseline.ok) {
        return baseline;
    }
    if (disputeCase.societyId !== baseline.actor.societyId) {
        return FAIL('MEMBERSHIP_SOCIETY_MISMATCH', 'The case belongs to a different society.');
    }
    const party = disputeCase.parties.find((candidate) => candidate.userId === baseline.actor.userId && candidate.accessRevokedAt === undefined);
    if (party !== undefined) {
        const actorType = PARTY_ROLE_TO_ACTOR_TYPE[party.role];
        if (actorType !== undefined) {
            return { ...baseline, actor: { ...baseline.actor, actorType } };
        }
    }
    return baseline;
}
export function disputeIdentityFromSession(input: {
    readonly session: AuthSession;
    readonly membership: ResidenceMembership;
    readonly displayName: string;
    readonly sessionId: string;
}): DisputeIdentitySource {
    const societyId = input.session.societyId;
    if (societyId === undefined || societyId === '') {
        return {
            session: input.session,
            societyId: '',
            membership: input.membership,
            displayName: input.displayName,
            authenticatedAt: SESSION_AUTHENTICATED_AT_FALLBACK,
            sessionId: input.sessionId,
        };
    }
    return {
        session: input.session,
        societyId,
        membership: input.membership,
        displayName: input.displayName,
        authenticatedAt: SESSION_AUTHENTICATED_AT_FALLBACK,
        sessionId: input.sessionId,
    };
}
const PARTY_ROLE_TO_ACTOR_TYPE: Partial<Record<DisputePartyRole, DisputeActorType>> = {
    REPORTER: 'RESIDENT_REPORTER',
    RESPONDENT: 'RESIDENT_RESPONDENT',
    AFFECTED_PARTY: 'RESIDENT_AFFECTED',
    MEDIATOR: 'MEDIATOR',
    INSPECTOR: 'INSPECTOR',
};
export function hasDisputeCapability(role: AppRole, permission: string): boolean {
    return getPermissionsForRoles([role]).some((granted) => granted === permission);
}
export type { Absent, DisputeActor, DisputeActorType, DisputePartyRole, ResidenceMembership, IdentitySnapshot };

