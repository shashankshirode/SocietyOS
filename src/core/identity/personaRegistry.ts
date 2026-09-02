import type { ActiveContext, PersonProfile, SocietyMembership, UnitRelationship, UserAccount } from './identity.types';

const SOCIETY_ID = 'soc-palm-grove-01';
const SOCIETY_NAME = 'Palm Grove Heights';

const rohanUser: UserAccount = {
  id: 'usr-rohan-01',
  email: 'rohan.sharma@societyos.in',
  phone: '+919876543210',
  createdAtIso: '2025-01-01T00:00:00.000Z',
  isVerified: true,
};

const sunitaUser: UserAccount = {
  id: 'usr-sunita-02',
  email: 'sunita.sharma@societyos.in',
  phone: '+919876543211',
  createdAtIso: '2025-01-05T00:00:00.000Z',
  isVerified: true,
};

const amitUser: UserAccount = {
  id: 'usr-amit-03',
  email: 'amit.sharma@societyos.in',
  phone: '+919876543212',
  createdAtIso: '2025-01-10T00:00:00.000Z',
  isVerified: true,
};

const priyaUser: UserAccount = {
  id: 'usr-priya-04',
  email: 'priya.mehta@societyos.in',
  phone: '+919876543213',
  createdAtIso: '2025-02-01T00:00:00.000Z',
  isVerified: true,
};

const vikramUser: UserAccount = {
  id: 'usr-vikram-05',
  email: 'guard.main@societyos.in',
  phone: '+919876543214',
  createdAtIso: '2024-11-01T00:00:00.000Z',
  isVerified: true,
};

const rajeshUser: UserAccount = {
  id: 'usr-rajesh-06',
  email: 'facility.manager@societyos.in',
  phone: '+919876543215',
  createdAtIso: '2024-11-01T00:00:00.000Z',
  isVerified: true,
};

const meeraUser: UserAccount = {
  id: 'usr-meera-07',
  email: 'treasurer@societyos.in',
  phone: '+919876543216',
  createdAtIso: '2024-11-01T00:00:00.000Z',
  isVerified: true,
};

const sureshUser: UserAccount = {
  id: 'usr-suresh-08',
  email: 'secretary@societyos.in',
  phone: '+919876543217',
  createdAtIso: '2024-11-01T00:00:00.000Z',
  isVerified: true,
};

const superadminUser: UserAccount = {
  id: 'usr-super-09',
  email: 'superadmin@societyos.io',
  phone: '+919876543299',
  createdAtIso: '2024-01-01T00:00:00.000Z',
  isVerified: true,
};

const rohanProfile: PersonProfile = {
  id: 'per-rohan-01',
  userId: rohanUser.id,
  firstName: 'Rohan',
  lastName: 'Sharma',
  preferredName: 'Rohan',
};

const sunitaProfile: PersonProfile = {
  id: 'per-sunita-02',
  userId: sunitaUser.id,
  firstName: 'Sunita',
  lastName: 'Sharma',
  preferredName: 'Sunita',
};

const amitProfile: PersonProfile = {
  id: 'per-amit-03',
  userId: amitUser.id,
  firstName: 'Amit',
  lastName: 'Sharma',
  preferredName: 'Amit',
};

const priyaProfile: PersonProfile = {
  id: 'per-priya-04',
  userId: priyaUser.id,
  firstName: 'Priya',
  lastName: 'Mehta',
  preferredName: 'Priya',
};

const vikramProfile: PersonProfile = {
  id: 'per-vikram-05',
  userId: vikramUser.id,
  firstName: 'Vikram',
  lastName: 'Singh',
  preferredName: 'Vikram',
};

const rajeshProfile: PersonProfile = {
  id: 'per-rajesh-06',
  userId: rajeshUser.id,
  firstName: 'Rajesh',
  lastName: 'Varma',
  preferredName: 'Rajesh',
};

const meeraProfile: PersonProfile = {
  id: 'per-meera-07',
  userId: meeraUser.id,
  firstName: 'Meera',
  lastName: 'Iyer',
  preferredName: 'Meera',
};

const sureshProfile: PersonProfile = {
  id: 'per-suresh-08',
  userId: sureshUser.id,
  firstName: 'Suresh',
  lastName: 'Kulkarni',
  preferredName: 'Suresh',
};

const superadminProfile: PersonProfile = {
  id: 'per-super-09',
  userId: superadminUser.id,
  firstName: 'System',
  lastName: 'SuperAdmin',
  preferredName: 'SuperAdmin',
};

const rohanUnit: UnitRelationship = {
  id: 'rel-rohan-b804',
  userId: rohanUser.id,
  personId: rohanProfile.id,
  societyId: SOCIETY_ID,
  unitId: 'unit-b804',
  unitNumber: 'B-804',
  towerOrBlock: 'Tower B',
  relationshipType: 'PRIMARY_OWNER',
  status: 'ACTIVE',
  isHouseholdAdmin: true,
  allowedCapabilities: ['*'],
  validFromIso: '2025-01-01T00:00:00.000Z',
};

const sunitaUnit: UnitRelationship = {
  id: 'rel-sunita-b804',
  userId: sunitaUser.id,
  personId: sunitaProfile.id,
  societyId: SOCIETY_ID,
  unitId: 'unit-b804',
  unitNumber: 'B-804',
  towerOrBlock: 'Tower B',
  relationshipType: 'FAMILY_MEMBER',
  status: 'ACTIVE',
  isHouseholdAdmin: false,
  allowedCapabilities: ['VISITOR_CREATE', 'FACILITY_BOOK_FREE', 'FACILITY_BOOK_PAID', 'BILL_VIEW', 'COMPLAINT_CREATE', 'SOS_TRIGGER'],
  validFromIso: '2025-01-05T00:00:00.000Z',
};

const amitUnit: UnitRelationship = {
  id: 'rel-amit-b804',
  userId: amitUser.id,
  personId: amitProfile.id,
  societyId: SOCIETY_ID,
  unitId: 'unit-b804',
  unitNumber: 'B-804',
  towerOrBlock: 'Tower B',
  relationshipType: 'FAMILY_MEMBER',
  status: 'ACTIVE',
  isHouseholdAdmin: false,
  allowedCapabilities: ['VISITOR_CREATE', 'FACILITY_BOOK_FREE', 'COMPLAINT_CREATE', 'SOS_TRIGGER'],
  validFromIso: '2025-01-10T00:00:00.000Z',
};

const priyaUnit: UnitRelationship = {
  id: 'rel-priya-a302',
  userId: priyaUser.id,
  personId: priyaProfile.id,
  societyId: SOCIETY_ID,
  unitId: 'unit-a302',
  unitNumber: 'A-302',
  towerOrBlock: 'Tower A',
  relationshipType: 'TENANT',
  status: 'ACTIVE',
  isHouseholdAdmin: true,
  allowedCapabilities: ['VISITOR_CREATE', 'FACILITY_BOOK_FREE', 'FACILITY_BOOK_PAID', 'BILL_VIEW', 'BILL_PAY', 'COMPLAINT_CREATE', 'SOS_TRIGGER'],
  validFromIso: '2025-02-01T00:00:00.000Z',
};

export const MOCK_PERSONAS = {
  rohan: {
    user: rohanUser,
    person: rohanProfile,
    membership: {
      id: 'mem-rohan-01',
      userId: rohanUser.id,
      societyId: SOCIETY_ID,
      societyName: SOCIETY_NAME,
      status: 'ACTIVE',
      joinedAtIso: '2025-01-01T00:00:00.000Z',
      defaultRole: 'RESIDENT_OWNER',
    } as SocietyMembership,
    unitRelationship: rohanUnit,
    activeRole: 'RESIDENT_OWNER' as const,
    isHouseholdAdmin: true,
  } as ActiveContext,
  sunita: {
    user: sunitaUser,
    person: sunitaProfile,
    membership: {
      id: 'mem-sunita-02',
      userId: sunitaUser.id,
      societyId: SOCIETY_ID,
      societyName: SOCIETY_NAME,
      status: 'ACTIVE',
      joinedAtIso: '2025-01-05T00:00:00.000Z',
      defaultRole: 'RESIDENT_FAMILY',
    } as SocietyMembership,
    unitRelationship: sunitaUnit,
    activeRole: 'RESIDENT_FAMILY' as const,
    isHouseholdAdmin: false,
  } as ActiveContext,
  amit: {
    user: amitUser,
    person: amitProfile,
    membership: {
      id: 'mem-amit-03',
      userId: amitUser.id,
      societyId: SOCIETY_ID,
      societyName: SOCIETY_NAME,
      status: 'ACTIVE',
      joinedAtIso: '2025-01-10T00:00:00.000Z',
      defaultRole: 'RESIDENT_FAMILY',
    } as SocietyMembership,
    unitRelationship: amitUnit,
    activeRole: 'RESIDENT_FAMILY' as const,
    isHouseholdAdmin: false,
  } as ActiveContext,
  priya: {
    user: priyaUser,
    person: priyaProfile,
    membership: {
      id: 'mem-priya-04',
      userId: priyaUser.id,
      societyId: SOCIETY_ID,
      societyName: SOCIETY_NAME,
      status: 'ACTIVE',
      joinedAtIso: '2025-02-01T00:00:00.000Z',
      defaultRole: 'RESIDENT_TENANT',
    } as SocietyMembership,
    unitRelationship: priyaUnit,
    activeRole: 'RESIDENT_TENANT' as const,
    isHouseholdAdmin: true,
  } as ActiveContext,
  vikram: {
    user: vikramUser,
    person: vikramProfile,
    membership: {
      id: 'mem-vikram-05',
      userId: vikramUser.id,
      societyId: SOCIETY_ID,
      societyName: SOCIETY_NAME,
      status: 'ACTIVE',
      joinedAtIso: '2024-11-01T00:00:00.000Z',
      defaultRole: 'SECURITY_GUARD',
    } as SocietyMembership,
    activeRole: 'SECURITY_GUARD' as const,
    isHouseholdAdmin: false,
  } as ActiveContext,
  rajesh: {
    user: rajeshUser,
    person: rajeshProfile,
    membership: {
      id: 'mem-rajesh-06',
      userId: rajeshUser.id,
      societyId: SOCIETY_ID,
      societyName: SOCIETY_NAME,
      status: 'ACTIVE',
      joinedAtIso: '2024-11-01T00:00:00.000Z',
      defaultRole: 'FACILITY_MANAGER',
    } as SocietyMembership,
    activeRole: 'FACILITY_MANAGER' as const,
    isHouseholdAdmin: false,
  } as ActiveContext,
  meera: {
    user: meeraUser,
    person: meeraProfile,
    membership: {
      id: 'mem-meera-07',
      userId: meeraUser.id,
      societyId: SOCIETY_ID,
      societyName: SOCIETY_NAME,
      status: 'ACTIVE',
      joinedAtIso: '2024-11-01T00:00:00.000Z',
      defaultRole: 'TREASURER',
    } as SocietyMembership,
    activeRole: 'TREASURER' as const,
    isHouseholdAdmin: false,
  } as ActiveContext,
  suresh: {
    user: sureshUser,
    person: sureshProfile,
    membership: {
      id: 'mem-suresh-08',
      userId: sureshUser.id,
      societyId: SOCIETY_ID,
      societyName: SOCIETY_NAME,
      status: 'ACTIVE',
      joinedAtIso: '2024-11-01T00:00:00.000Z',
      defaultRole: 'SOCIETY_ADMIN',
    } as SocietyMembership,
    activeRole: 'SOCIETY_ADMIN' as const,
    isHouseholdAdmin: false,
  } as ActiveContext,
  superadmin: {
    user: superadminUser,
    person: superadminProfile,
    membership: {
      id: 'mem-super-09',
      userId: superadminUser.id,
      societyId: 'soc-platform-root',
      societyName: 'Society OS Platform',
      status: 'ACTIVE',
      joinedAtIso: '2024-01-01T00:00:00.000Z',
      defaultRole: 'SUPER_ADMIN',
    } as SocietyMembership,
    activeRole: 'SUPER_ADMIN' as const,
    isHouseholdAdmin: false,
  } as ActiveContext,
};
