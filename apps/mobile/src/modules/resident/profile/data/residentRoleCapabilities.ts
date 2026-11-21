import type {
  ResidentRoleCapability,
  ResidentRoleCapabilityProfile,
  ResidentRoleVariant,
} from './residentRoleCapabilities.types';

const ownerCapabilities: ResidentRoleCapability[] = [
  {
    key: 'ownerProfile',
    titleMessageKey: 'resident.profile.ownerProfile',
    enabled: true,
    requiredRoutes: ['CurrentOwnerProfile', 'OwnerTenantOverview'],
    requiredActions: ['View owner profile', 'Update owner profile'],
  },
  {
    key: 'family',
    titleMessageKey: 'resident.family.screenTitle',
    enabled: true,
    requiredRoutes: ['FamilyMembers', 'FamilyMemberList'],
    requiredActions: ['resident.household.profile.actions.addFamilyMember', 'resident.household.profile.actions.manageFamilyAccess'],
  },
  {
    key: 'familyMemberManagement',
    titleMessageKey: 'resident.household.profile.sections.householdFamily',
    enabled: true,
    requiredRoutes: ['HouseholdOverview', 'FamilyMemberList', 'AddFamilyMember', 'EditFamilyMember', 'FamilyAccessPermissions'],
    requiredActions: ['resident.household.profile.actions.addFamilyMember', 'resident.household.profile.actions.manageFamilyAccess'],
  },
  {
    key: 'tenantOnboarding',
    titleMessageKey: 'resident.household.profile.sections.tenantManagement',
    enabled: true,
    requiredRoutes: ['TenantManagement', 'AddTenantStart', 'AddTenantReview', 'TenantOnboardingStatus'],
    requiredActions: ['resident.household.profile.actions.addTenant', 'resident.household.profile.actions.viewTenantRequestStatus'],
  },
  {
    key: 'tenantDocumentUpload',
    titleMessageKey: 'resident.tenant.documents.title',
    enabled: true,
    requiredRoutes: ['AddTenantDocuments'],
    requiredActions: ['resident.tenant.documents.mockUploadAction'],
  },
  {
    key: 'tenantAccessPermissionManagement',
    titleMessageKey: 'resident.tenant.permissions.title',
    enabled: true,
    requiredRoutes: ['AddTenantAccessPermissions'],
    requiredActions: ['resident.tenant.permissions.title'],
  },
  {
    key: 'maintenance',
    titleMessageKey: 'resident.billing.screenTitle',
    enabled: true,
    requiredRoutes: ['BillList', 'BillDetail', 'MockPaymentConfirmation', 'PaymentSuccess'],
    requiredActions: ['Pay Maintenance', 'View ledger'],
  },
  {
    key: 'noc',
    titleMessageKey: 'resident.noc.listTitle',
    enabled: true,
    requiredRoutes: ['NocRequestList', 'CreateNocRequest', 'NocRequestDetail'],
    requiredActions: ['Request NOC', 'View NOC status'],
  },
  {
    key: 'documents',
    titleMessageKey: 'resident.documents.screenTitle',
    enabled: true,
    requiredRoutes: ['DocumentVaultHome', 'MyDocuments', 'SocietyDocuments'],
    requiredActions: ['Open Documents', 'Upload document'],
  },
  {
    key: 'vehicles',
    titleMessageKey: 'resident.parking.homeTitle',
    enabled: true,
    requiredRoutes: ['ParkingStack'],
    requiredActions: ['Register vehicle', 'View parking allocation'],
  },
  {
    key: 'governance',
    titleMessageKey: 'resident.governance.homeTitle',
    enabled: true,
    requiredRoutes: ['GovernanceStack'],
    requiredActions: ['RSVP meeting', 'View minutes'],
  },
  {
    key: 'polls',
    titleMessageKey: 'resident.governance.pollListTitle',
    enabled: true,
    requiredRoutes: ['GovernanceStack'],
    requiredActions: ['Vote poll', 'View poll result'],
  },
  {
    key: 'residentConnect',
    titleMessageKey: 'resident.residentConnect.homeTitle',
    enabled: true,
    requiredRoutes: ['ResidentConnectStack'],
    requiredActions: ['Open Resident Connect', 'Send contact request'],
  },
  {
    key: 'emergency',
    titleMessageKey: 'resident.emergency.homeTitle',
    enabled: true,
    requiredRoutes: ['EmergencySos', 'EmergencySafetyStack'],
    requiredActions: ['Trigger SOS', 'Update family connect'],
  },
  {
    key: 'marketplace',
    titleMessageKey: 'resident.marketplace.homeTitle',
    enabled: true,
    requiredRoutes: ['CommunityStack'],
    requiredActions: ['Open Marketplace', 'Create service request'],
  },
  {
    key: 'facilityBooking',
    titleMessageKey: 'resident.facilityBooking.homeTitle',
    enabled: true,
    requiredRoutes: ['FacilityStack'],
    requiredActions: ['Book Amenity', 'View my bookings'],
  },
  {
    key: 'settings',
    titleMessageKey: 'resident.settings.screenTitle',
    enabled: true,
    requiredRoutes: ['ProfileTab'],
    requiredActions: ['Open Settings', 'Logout'],
  },
  {
    key: 'visitors',
    titleMessageKey: 'resident.visitors.screenTitle',
    enabled: true,
    requiredRoutes: ['VisitorList', 'CreateVisitorPass'],
    requiredActions: ['Create Visitor', 'View visitors'],
  },
  {
    key: 'complaints',
    titleMessageKey: 'resident.complaints.screenTitle',
    enabled: true,
    requiredRoutes: ['ComplaintList', 'CreateComplaint'],
    requiredActions: ['Raise Complaint', 'Track complaint'],
  },
];

function withCapabilityOverrides(
  role: ResidentRoleVariant,
  roleLabelKey: string,
  overrides: Partial<Record<ResidentRoleCapability['key'], boolean>>
): ResidentRoleCapabilityProfile {
  return {
    role,
    roleLabelKey,
    capabilities: ownerCapabilities.map((capability) => ({
      ...capability,
      enabled: overrides[capability.key] ?? capability.enabled,
    })),
  };
}

export const residentRoleCapabilities: Record<ResidentRoleVariant, ResidentRoleCapabilityProfile> = {
  RESIDENT_OWNER: {
    role: 'RESIDENT_OWNER',
    roleLabelKey: 'resident.header.roles.owner',
    capabilities: ownerCapabilities,
  },
  RESIDENT_TENANT: withCapabilityOverrides(
    'RESIDENT_TENANT',
    'resident.header.roles.tenant',
    {
      ownerProfile: false,
      familyMemberManagement: false,
      tenantOnboarding: false,
      tenantDocumentUpload: false,
      tenantAccessPermissionManagement: false,
      governance: true,
      polls: true,
    }
  ),
  RESIDENT_FAMILY: withCapabilityOverrides(
    'RESIDENT_FAMILY',
    'resident.header.roles.family',
    {
      ownerProfile: false,
      tenantProfile: false,
      familyMemberManagement: false,
      tenantOnboarding: false,
      tenantDocumentUpload: false,
      tenantAccessPermissionManagement: false,
      maintenance: false,
      noc: false,
      documents: false,
      vehicles: false,
      governance: false,
      polls: false,
      facilityBooking: true,
    }
  ),
};

export function getResidentRoleCapabilityProfile(
  role: ResidentRoleVariant
): ResidentRoleCapabilityProfile {
  return residentRoleCapabilities[role];
}
