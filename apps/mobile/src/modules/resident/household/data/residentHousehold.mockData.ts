import type {
  FamilyMember,
  HouseholdOverview,
  TenantDocumentChecklistItem,
  TenantEligibilityResult,
  TenantManagementSummary,
  TenantOnboardingRequest,
  TenantProfile,
} from "./residentHousehold.types";
import { defaultTenantAccessPermissions } from "./residentHousehold.types";

export const residentHouseholdUnitId = "unit-a-1204";
export const residentHouseholdOwnerId = "resident-owner-shashank";

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: residentHouseholdOwnerId,
    fullName: "Shashank Shirode",
    dateOfBirth: "1988-03-12",
    gender: "MALE",
    relationToOwner: "OTHER",
    phoneNumber: "7276834907",
    emailAddress: "shashank.shirode@example.com",
    isEmergencyContact: true,
    isPrimaryOwner: true,
    isSeniorCitizen: false,
    isMinor: false,
    bloodGroup: "O+",
    accessStatus: "ACTIVE",
    permissions: {
      visitorApprovalPermission: true,
      noticeViewPermission: true,
      emergencyAccessPermission: true,
      facilityBookingPermission: true,
      documentAccessPermission: "LIMITED",
      profileVisibility: "SOCIETY_DIRECTORY",
    },
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-04-01T09:00:00.000Z",
  },
  {
    id: "resident-co-owner-ananya",
    fullName: "Ananya Shirode",
    dateOfBirth: "1990-08-24",
    gender: "FEMALE",
    relationToOwner: "SPOUSE",
    phoneNumber: "9876501234",
    emailAddress: "ananya.shirode@example.com",
    isEmergencyContact: true,
    isPrimaryOwner: false,
    isSeniorCitizen: false,
    isMinor: false,
    bloodGroup: "A+",
    accessStatus: "ACTIVE",
    permissions: {
      visitorApprovalPermission: true,
      noticeViewPermission: true,
      emergencyAccessPermission: true,
      facilityBookingPermission: true,
      documentAccessPermission: "LIMITED",
      profileVisibility: "HOUSEHOLD_ONLY",
    },
    createdAt: "2026-04-02T09:00:00.000Z",
    updatedAt: "2026-04-02T09:00:00.000Z",
  },
  {
    id: "resident-family-senior-parent",
    fullName: "Madhav Shirode",
    dateOfBirth: "1958-11-02",
    gender: "MALE",
    relationToOwner: "FATHER",
    phoneNumber: "9765432109",
    isEmergencyContact: true,
    isPrimaryOwner: false,
    isSeniorCitizen: true,
    isMinor: false,
    bloodGroup: "B+",
    medicalNotes: "Diabetes medication reminder",
    accessStatus: "ACTIVE",
    permissions: {
      visitorApprovalPermission: false,
      noticeViewPermission: true,
      emergencyAccessPermission: true,
      facilityBookingPermission: false,
      documentAccessPermission: "NONE",
      profileVisibility: "HOUSEHOLD_ONLY",
    },
    createdAt: "2026-04-03T09:00:00.000Z",
    updatedAt: "2026-04-03T09:00:00.000Z",
  },
  {
    id: "resident-family-minor-child",
    fullName: "Ira Shirode",
    dateOfBirth: "2015-01-18",
    gender: "FEMALE",
    relationToOwner: "DAUGHTER",
    phoneNumber: "",
    isEmergencyContact: false,
    isPrimaryOwner: false,
    isSeniorCitizen: false,
    isMinor: true,
    bloodGroup: "AB+",
    accessStatus: "ACTIVE",
    permissions: {
      visitorApprovalPermission: false,
      noticeViewPermission: false,
      emergencyAccessPermission: true,
      facilityBookingPermission: false,
      documentAccessPermission: "NONE",
      profileVisibility: "HIDDEN",
    },
    createdAt: "2026-04-04T09:00:00.000Z",
    updatedAt: "2026-04-04T09:00:00.000Z",
  },
  {
    id: "resident-family-adult-child",
    fullName: "Aarav Shirode",
    dateOfBirth: "2004-05-27",
    gender: "MALE",
    relationToOwner: "SON",
    phoneNumber: "9988776655",
    isEmergencyContact: false,
    isPrimaryOwner: false,
    isSeniorCitizen: false,
    isMinor: false,
    bloodGroup: "O-",
    accessStatus: "ACTIVE",
    permissions: {
      visitorApprovalPermission: true,
      noticeViewPermission: true,
      emergencyAccessPermission: true,
      facilityBookingPermission: true,
      documentAccessPermission: "NONE",
      profileVisibility: "SOCIETY_DIRECTORY",
    },
    createdAt: "2026-04-05T09:00:00.000Z",
    updatedAt: "2026-04-05T09:00:00.000Z",
  },
];

export const mockTenantDocuments: TenantDocumentChecklistItem[] = [
  { documentType: "RENT_AGREEMENT", status: "UPLOADED", required: true },
  { documentType: "TENANT_KYC", status: "VERIFIED", required: true },
  {
    documentType: "POLICE_VERIFICATION",
    status: "PENDING_VERIFICATION",
    required: true,
  },
  { documentType: "OWNER_CONSENT", status: "VERIFIED", required: true },
  { documentType: "TENANT_PHOTO", status: "UPLOADED", required: true },
  { documentType: "MOVE_IN_FORM", status: "MISSING", required: true },
  { documentType: "VEHICLE_DETAILS", status: "MISSING", required: false },
  { documentType: "RULE_ACKNOWLEDGEMENT", status: "UPLOADED", required: true },
];

export const mockCurrentTenant: TenantProfile = {
  id: "tenant-rohan-mehta",
  unitId: residentHouseholdUnitId,
  fullName: "Rohan Mehta",
  phoneNumber: "9123456789",
  emailAddress: "rohan.mehta@example.com",
  moveInDate: "2026-07-15",
  agreementEndDate: "2027-06-30",
  accessStatus: "PENDING_ACTIVATION",
  policeVerificationStatus: "PENDING",
  documentSummary: mockTenantDocuments,
  permissions: defaultTenantAccessPermissions,
};

export const mockTenantEligibilityPassed: TenantEligibilityResult = {
  canStartOnboarding: true,
  checks: [
    {
      id: "owner-role",
      status: "PASSED",
      titleKey: "resident.household.eligibility.ownerRole.title",
      descriptionKey: "resident.household.eligibility.ownerRole.passed",
    },
    {
      id: "unit-active",
      status: "PASSED",
      titleKey: "resident.household.eligibility.unitActive.title",
      descriptionKey: "resident.household.eligibility.unitActive.passed",
    },
    {
      id: "dues",
      status: "WARNING",
      titleKey: "resident.household.eligibility.dues.title",
      descriptionKey: "resident.household.eligibility.dues.warning",
    },
  ],
};

export const mockTenantEligibilityBlockedByActiveTenant: TenantEligibilityResult =
  {
    canStartOnboarding: false,
    checks: [
      {
        id: "active-tenant",
        status: "BLOCKED",
        titleKey: "resident.household.eligibility.activeTenant.title",
        descriptionKey: "resident.household.eligibility.activeTenant.blocked",
      },
      {
        id: "feature-enabled",
        status: "PASSED",
        titleKey: "resident.household.eligibility.featureEnabled.title",
        descriptionKey: "resident.household.eligibility.featureEnabled.passed",
      },
    ],
  };

export const mockTenantEligibilityBlockedByNoc: TenantEligibilityResult = {
  canStartOnboarding: false,
  checks: [
    {
      id: "previous-noc",
      status: "BLOCKED",
      titleKey: "resident.household.eligibility.previousNoc.title",
      descriptionKey: "resident.household.eligibility.previousNoc.blocked",
    },
  ],
};

export const mockTenantOnboardingDraft: TenantOnboardingRequest = {
  id: "tenant-request-draft",
  unitId: residentHouseholdUnitId,
  createdByResidentId: residentHouseholdOwnerId,
  status: "DRAFT",
  documents: mockTenantDocuments.map((document) => ({
    ...document,
    status:
      document.documentType === "RENT_AGREEMENT" ? "MISSING" : document.status,
  })),
  accessPermissions: defaultTenantAccessPermissions,
  eligibility: mockTenantEligibilityPassed,
  timeline: [
    {
      status: "DRAFT",
      occurredAt: "2026-07-08T10:00:00.000Z",
      responsiblePartyKey: "resident.tenant.status.owner",
      nextActionKey: "resident.tenant.status.nextPersonalInfo",
    },
  ],
  createdAt: "2026-07-08T10:00:00.000Z",
  updatedAt: "2026-07-08T10:00:00.000Z",
};

export const mockTenantOnboardingSubmitted: TenantOnboardingRequest = {
  ...mockTenantOnboardingDraft,
  id: "tenant-request-submitted",
  status: "SUBMITTED_BY_OWNER",
  submittedAt: "2026-07-08T12:00:00.000Z",
  timeline: [
    ...mockTenantOnboardingDraft.timeline,
    {
      status: "SUBMITTED_BY_OWNER",
      occurredAt: "2026-07-08T12:00:00.000Z",
      responsiblePartyKey: "resident.tenant.status.owner",
      nextActionKey: "resident.tenant.status.nextAdminReview",
    },
  ],
};

export const mockTenantOnboardingBlockedActiveTenant: TenantOnboardingRequest =
  {
    ...mockTenantOnboardingDraft,
    id: "tenant-request-blocked-active-tenant",
    status: "BLOCKED",
    eligibility: mockTenantEligibilityBlockedByActiveTenant,
    blockingReasonKey: "resident.tenant.blocked.activeTenant",
  };

export const mockTenantOnboardingBlockedPreviousNoc: TenantOnboardingRequest = {
  ...mockTenantOnboardingDraft,
  id: "tenant-request-blocked-previous-noc",
  status: "BLOCKED",
  eligibility: mockTenantEligibilityBlockedByNoc,
  blockingReasonKey: "resident.tenant.blocked.previousNoc",
};

export const mockHouseholdOverview: HouseholdOverview = {
  unitId: residentHouseholdUnitId,
  societyName: "Green Valley Heights",
  unitLabel: "A-1204, Tower A",
  ownerResidentId: residentHouseholdOwnerId,
  loggedInRole: "RESIDENT_OWNER",
  ownerProfileActive: true,
  ownerKycStatus: "VERIFIED",
  unitActive: true,
  maxOccupancy: 6,
  maintenanceDuesBlockingTenantOnboarding: false,
  maintenanceDuesPending: true,
  tenantManagementFeatureEnabled: true,
  familyMemberCount: mockFamilyMembers.length,
  activeFamilyAccessCount: mockFamilyMembers.filter(
    (member) => member.accessStatus === "ACTIVE",
  ).length,
  emergencyContactCount: mockFamilyMembers.filter(
    (member) => member.isEmergencyContact,
  ).length,
  currentTenantCount: 1,
  pendingTenantRequestCount: 1,
  reminders: [
    "resident.dashboard.household.reminders.emergencyContactMissing",
    "resident.dashboard.household.reminders.seniorCheckInPending",
    "resident.dashboard.household.reminders.tenantPoliceVerificationPending",
    "resident.dashboard.household.reminders.rentAgreementExpiring",
    "resident.dashboard.household.reminders.tenantOnboardingBlocked",
    "resident.dashboard.household.reminders.moveInScheduled",
    "resident.dashboard.household.reminders.previousNocPending",
  ],
};

export const mockTenantManagementSummary: TenantManagementSummary = {
  unitId: residentHouseholdUnitId,
  currentTenant: mockCurrentTenant,
  activeRequest: mockTenantOnboardingSubmitted,
  previousTenantSummary: {
    fullName: "Neha Kulkarni",
    moveOutDate: "2026-05-31",
    nocStatus: "PENDING",
  },
};
