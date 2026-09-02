import type { IdentitySnapshot, PersonProfile, ResidenceMembership, UserAccount } from './identity.types';

const people: PersonProfile[] = [
  { personId: 'person-rohan', displayName: 'Rohan Deshpande', preferredName: 'Rohan' },
  { personId: 'person-sunita', displayName: 'Sunita Deshpande', preferredName: 'Sunita' },
  { personId: 'person-amit', displayName: 'Amit Deshpande', preferredName: 'Amit' },
];
const users: UserAccount[] = [
  { userId: 'user-rohan', personId: 'person-rohan', login: 'rohan@example.test', status: 'ACTIVE' },
  { userId: 'user-sunita', personId: 'person-sunita', login: 'sunita@example.test', status: 'ACTIVE' },
  { userId: 'user-amit', personId: 'person-amit', login: 'amit@example.test', status: 'ACTIVE' },
];
const memberships: ResidenceMembership[] = [
  { membershipId: 'membership-rohan-green', userId: 'user-rohan', personId: 'person-rohan', societyId: 'society-green', residenceId: 'home-green-b804', unitId: 'unit-b804', relationship: 'OWNER', householdAdmin: true, status: 'ACTIVE', permissions: new Set(['MANAGE_HOUSEHOLD', 'BOOK_FACILITY', 'PAY_MAINTENANCE', 'TRIGGER_SOS']) },
  { membershipId: 'membership-sunita-green', userId: 'user-sunita', personId: 'person-sunita', societyId: 'society-green', residenceId: 'home-green-b804', unitId: 'unit-b804', relationship: 'FAMILY_MEMBER', householdAdmin: false, status: 'ACTIVE', permissions: new Set(['BOOK_FACILITY', 'CREATE_VISITOR', 'TRIGGER_SOS']) },
  { membershipId: 'membership-amit-green', userId: 'user-amit', personId: 'person-amit', societyId: 'society-green', residenceId: 'home-green-b804', unitId: 'unit-b804', relationship: 'FAMILY_MEMBER', householdAdmin: false, status: 'ACTIVE', permissions: new Set(['CREATE_VISITOR', 'TRIGGER_SOS']) },
  { membershipId: 'membership-sunita-maple', userId: 'user-sunita', personId: 'person-sunita', societyId: 'society-maple', residenceId: 'home-maple-p301', unitId: 'unit-p301', relationship: 'OWNER', householdAdmin: true, status: 'ACTIVE', permissions: new Set(['MANAGE_HOUSEHOLD', 'BOOK_FACILITY', 'TRIGGER_SOS']) },
];

export const mockIdentityStore = {
  getPerson(personId: string): PersonProfile {
    const person = people.find((candidate) => candidate.personId === personId);
    if (!person) throw new Error(`Person ${personId} not found`);
    return person;
  },
  getUser(userId: string): UserAccount {
    const user = users.find((candidate) => candidate.userId === userId);
    if (!user) throw new Error(`User ${userId} not found`);
    return user;
  },
  getMembership(membershipId: string): ResidenceMembership {
    const membership = memberships.find((candidate) => candidate.membershipId === membershipId);
    if (!membership) throw new Error(`Membership ${membershipId} not found`);
    return membership;
  },
  getMembershipFor(userId: string, residenceId: string): ResidenceMembership {
    const membership = memberships.find((candidate) => candidate.userId === userId && candidate.residenceId === residenceId);
    if (!membership) throw new Error(`No membership for ${userId} at ${residenceId}`);
    return membership;
  },
  getIdentity(membershipId: string): IdentitySnapshot {
    const membership = this.getMembership(membershipId);
    return { user: this.getUser(membership.userId), person: this.getPerson(membership.personId), membership };
  },
  listMemberships(userId: string): ResidenceMembership[] {
    return memberships.filter((membership) => membership.userId === userId && membership.status === 'ACTIVE');
  },
  setMembershipStatus(membershipId: string, status: ResidenceMembership['status']): void {
    const membership = this.getMembership(membershipId);
    const index = memberships.indexOf(membership);
    memberships[index] = { ...membership, status };
  },
  reset(): void {
    for (const membership of memberships) {
      if (membership.status !== 'ACTIVE') memberships[memberships.indexOf(membership)] = { ...membership, status: 'ACTIVE' };
    }
  },
};