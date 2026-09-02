import type { HouseholdActorRelationship } from './householdActionGovernance.types';

export type PersonProfile = {
  personId: string;
  displayName: string;
  preferredName: string;
};

export type UserAccount = {
  userId: string;
  personId: string;
  login: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
};

export type ResidenceMembership = {
  membershipId: string;
  userId: string;
  personId: string;
  societyId: string;
  residenceId: string;
  unitId: string;
  relationship: HouseholdActorRelationship;
  householdAdmin: boolean;
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'ENDED' | 'REVOKED';
  permissions: ReadonlySet<string>;
  invitedBy?: string;
};

export type IdentitySnapshot = {
  user: UserAccount;
  person: PersonProfile;
  membership: ResidenceMembership;
};