import type { AppRole } from '../permissions/permission.types';

export interface UserAccount {
  readonly id: string;
  readonly email: string;
  readonly phone: string;
  readonly createdAtIso: string;
  readonly isVerified: boolean;
}

export interface PersonProfile {
  readonly id: string;
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly preferredName?: string;
  readonly avatarUrl?: string;
}

export interface SocietyMembership {
  readonly id: string;
  readonly userId: string;
  readonly societyId: string;
  readonly societyName: string;
  readonly status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'TERMINATED';
  readonly joinedAtIso: string;
  readonly defaultRole: AppRole;
}

export type UnitRelationshipType =
  | 'PRIMARY_OWNER'
  | 'CO_OWNER'
  | 'TENANT'
  | 'FAMILY_MEMBER'
  | 'AUTHORIZED_OCCUPANT'
  | 'SHORT_STAY_OCCUPANT';

export interface UnitRelationship {
  readonly id: string;
  readonly userId: string;
  readonly personId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly unitNumber: string;
  readonly towerOrBlock?: string;
  readonly relationshipType: UnitRelationshipType;
  readonly status: 'ACTIVE' | 'PENDING_APPROVAL' | 'EXPIRED' | 'REVOKED';
  readonly isHouseholdAdmin: boolean;
  readonly allowedCapabilities: readonly string[];
  readonly validFromIso: string;
  readonly validToIso?: string;
}

export interface ActiveContext {
  readonly user: UserAccount;
  readonly person: PersonProfile;
  readonly membership: SocietyMembership;
  readonly unitRelationship?: UnitRelationship;
  readonly activeRole: AppRole;
  readonly isHouseholdAdmin: boolean;
}
