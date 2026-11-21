import type { ResidentScopedEntity } from '../../../../shared/types/residentScope.types';

export type ResidentHouseholdRole = 'RESIDENT_OWNER' | 'RESIDENT_TENANT' | 'RESIDENT_FAMILY';

export type FamilyRelation =
  | 'SPOUSE'
  | 'FATHER'
  | 'MOTHER'
  | 'SON'
  | 'DAUGHTER'
  | 'BROTHER'
  | 'SISTER'
  | 'GRANDFATHER'
  | 'GRANDMOTHER'
  | 'OTHER';

export type ResidentGender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN';

export type FamilyDocumentAccessPermission = 'LIMITED' | 'NONE';

export type ProfileVisibility = 'HOUSEHOLD_ONLY' | 'SOCIETY_DIRECTORY' | 'HIDDEN';

export type FamilyAccessStatus = 'ACTIVE' | 'INACTIVE' | 'REVOKED' | 'PENDING';

export type FamilyStayPattern =
  | 'primaryResident'
  | 'secondarySeasonalResident'
  | 'occasionalFamilyVisitor'
  | 'emergencyContactOnly'
  | 'guardianManagedChild'
  | 'inactiveMovedOut';

export type FamilyLoginInvitationStatus = 'notInvited' | 'pending' | 'accepted' | 'rejected' | 'expired';

export type FamilyAccessPermissions = {
  visitorApprovalPermission: boolean;
  noticeViewPermission: boolean;
  emergencyAccessPermission: boolean;
  facilityBookingPermission: boolean;
  documentAccessPermission: FamilyDocumentAccessPermission;
  profileVisibility: ProfileVisibility;
};

export const defaultFamilyAccessPermissions: FamilyAccessPermissions = {
  visitorApprovalPermission: false,
  noticeViewPermission: true,
  emergencyAccessPermission: true,
  facilityBookingPermission: false,
  documentAccessPermission: 'NONE',
  profileVisibility: 'HOUSEHOLD_ONLY',
};

export type FamilyMember = ResidentScopedEntity & {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: ResidentGender;
  relationToOwner: FamilyRelation;
  phoneNumber: string;
  emailAddress?: string;
  photoMockUri?: string;
  isEmergencyContact: boolean;
  isPrimaryOwner: boolean;
  isSeniorCitizen: boolean;
  isMinor: boolean;
  bloodGroup?: BloodGroup;
  medicalNotes?: string;
  accessStatus: FamilyAccessStatus;
  permissions: FamilyAccessPermissions;
  personProfileId?: string;
  stayPattern?: FamilyStayPattern;
  loginInvitationStatus?: FamilyLoginInvitationStatus;
  guardianFamilyMemberId?: string;
  createdAt: string;
  updatedAt: string;
};

export type HouseholdOccupancyStatus =
  | 'ownerOccupied'
  | 'tenantOccupied'
  | 'vacant'
  | 'mixed'
  | 'tenantOnboarding'
  | 'moveOutInProgress'
  | 'shortTermRental';

export type HouseholdReadinessStatus = 'ready' | 'needsReview' | 'actionRequired' | 'incomplete';

export type HouseholdReadiness = {
  status: HouseholdReadinessStatus;
  progress: number;
  completedItems: number;
  totalItems: number;
  message: string;
};

export type FamilyMemberSummary = {
  id: string;
  fullName: string;
  relationship: string;
  statusLabel: string;
  accessLabel: string;
  isEmergencyContact: boolean;
};

export type TenantOccupancySummary = {
  name: string;
  moveInLabel: string;
  verificationLabel: string;
};

export type EmergencyContactSummary = {
  id: string;
  name: string;
  relationship: string;
  verificationLabel: string;
  isPrimary: boolean;
};

export type HouseholdPermissionSummaryItem = {
  label: string;
  value: string;
};

export type HouseholdAccessSummary = {
  activeAccessCount: number;
  permissions: readonly HouseholdPermissionSummaryItem[];
};

export type HouseholdPendingAction = {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  actionLabel: string;
  onPress: () => void;
};

export type HouseholdSummary = {
  residenceId: string;
  societyId: string;
  unitId: string;
  occupancyStatus: HouseholdOccupancyStatus;
  familyMemberCount: number;
  activeAccessCount: number;
  emergencyContactCount: number;
  pendingActionCount: number;
  familyMembers: readonly FamilyMemberSummary[];
  tenantSummary: TenantOccupancySummary | null;
  emergencyContacts: readonly EmergencyContactSummary[];
  accessSummary: HouseholdAccessSummary;
  pendingActions: readonly HouseholdPendingAction[];
  readiness: HouseholdReadiness;
  residenceLabel: string;
  societyName: string;
  unitLabel: string;
  residenceContext: string;
};

export type AddFamilyMemberInput = {
  fullName: string;
  dateOfBirth: string;
  gender: ResidentGender;
  relationToOwner: FamilyRelation;
  phoneNumber: string;
  emailAddress?: string;
  photoMockUri?: string;
  isEmergencyContact: boolean;
  isSeniorCitizen: boolean;
  isMinor: boolean;
  bloodGroup?: BloodGroup;
  medicalNotes?: string;
  visitorApprovalPermission: boolean;
  noticeViewPermission: boolean;
  emergencyAccessPermission: boolean;
  facilityBookingPermission: boolean;
  documentAccessPermission: FamilyDocumentAccessPermission;
  profileVisibility: ProfileVisibility;
  accessStatus: FamilyAccessStatus;
};

export type UpdateFamilyMemberInput = AddFamilyMemberInput;

export type UpdateFamilyAccessPermissionsInput = FamilyAccessPermissions;

export type RemoveFamilyMemberAccessInput = {
  reason: string;
  requestedByResidentId: string;
};

export type TenantIdentityDocumentType =
  | 'AADHAAR_METADATA_ONLY'
  | 'PASSPORT'
  | 'DRIVING_LICENSE'
  | 'VOTER_ID'
  | 'PAN'
  | 'OTHER';

export type PoliceVerificationStatus = 'NOT_STARTED' | 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export type TenantPersonalInfoInput = {
  fullName: string;
  dateOfBirth: string;
  gender: ResidentGender;
  phoneNumber: string;
  emailAddress: string;
  occupation?: string;
  companyName?: string;
  permanentAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  identityDocumentType: TenantIdentityDocumentType;
  identityDocumentLast4: string;
  policeVerificationStatus: PoliceVerificationStatus;
  profilePhotoMockUri?: string;
};

export type TenantAgreementInput = {
  agreementStartDate: string;
  agreementEndDate: string;
  monthlyRent?: number;
  securityDeposit?: number;
  lockInPeriodMonths?: number;
  numberOfOccupants: number;
  tenantMoveInDate: string;
  ownerApprovalConfirmed: boolean;
  rulesAcknowledgementRequired: boolean;
  rentAgreementDocumentId?: string;
};

export type TenantDocumentType =
  | 'RENT_AGREEMENT'
  | 'TENANT_KYC'
  | 'POLICE_VERIFICATION'
  | 'OWNER_CONSENT'
  | 'TENANT_PHOTO'
  | 'MOVE_IN_FORM'
  | 'VEHICLE_DETAILS'
  | 'RULE_ACKNOWLEDGEMENT';

export type TenantDocumentStatus =
  | 'MISSING'
  | 'UPLOADED'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export type TenantDocumentVaultMetadata = {
  documentId: string;
  documentType: TenantDocumentType;
  ownerEntityType: 'tenant';
  ownerEntityId: string;
  visibility: 'OWNER_AND_ADMIN_ONLY' | 'TENANT_SELF_AND_ADMIN';
  sensitivity: 'HIGH' | 'MEDIUM';
  verificationStatus: TenantDocumentStatus;
  expiryDate?: string;
  uploadedAt: string;
  uploadedBy: string;
  accessControlledNoteKey: string;
  mockAccessLog: TenantDocumentAccessLogEntry[];
};

export type TenantDocumentAccessLogEntry = {
  id: string;
  documentId: string;
  viewedBy: string;
  viewedAt: string;
  purposeKey: string;
};

export type TenantDocumentChecklistItem = {
  documentType: TenantDocumentType;
  status: TenantDocumentStatus;
  required: boolean;
  metadata?: TenantDocumentVaultMetadata;
};

export type UploadTenantDocumentInput = {
  documentType: TenantDocumentType;
  mockFileName: string;
  expiryDate?: string;
  uploadedBy: string;
};

export type TenantAccessPermissionsInput = {
  visitorApprovalAllowed: boolean;
  complaintCreationAllowed: boolean;
  facilityBookingAllowed: boolean;
  residentConnectAllowed: boolean;
  noticeViewAllowed: boolean;
  billingViewAllowed: boolean;
  documentUploadAllowed: boolean;
  emergencyAllowed: boolean;
  parkingRequestAllowed: boolean;
  moveOutNocRequestAllowed: boolean;
};

export type TenantOnboardingStatus =
  | 'DRAFT'
  | 'SUBMITTED_BY_OWNER'
  | 'DOCUMENTS_UPLOADED'
  | 'OWNER_CONSENT_CONFIRMED'
  | 'ADMIN_REVIEW_PENDING'
  | 'POLICE_VERIFICATION_PENDING'
  | 'MOVE_IN_SCHEDULED'
  | 'ACCESS_ACTIVATION_PENDING'
  | 'ACTIVE_TENANT'
  | 'REJECTED'
  | 'BLOCKED'
  | 'CANCELLED';

export type TenantStatusTimelineItem = {
  status: TenantOnboardingStatus;
  occurredAt: string;
  responsiblePartyKey: string;
  nextActionKey: string;
  blockingReasonKey?: string;
};

export type TenantEligibilityStatus = 'PASSED' | 'WARNING' | 'BLOCKED' | 'NOT_APPLICABLE';

export type TenantEligibilityCheck = {
  id: string;
  status: TenantEligibilityStatus;
  titleKey: string;
  descriptionKey: string;
};

export type TenantEligibilityResult = {
  canStartOnboarding: boolean;
  checks: TenantEligibilityCheck[];
};

export type SubmitTenantOnboardingInput = {
  ownerConsentConfirmed: boolean;
  responsibilityAccepted: boolean;
};

export type CancelTenantOnboardingInput = {
  reason: string;
};

export type TenantOnboardingRequest = {
  id: string;
  unitId: string;
  createdByResidentId: string;
  status: TenantOnboardingStatus;
  personalInfo?: TenantPersonalInfoInput;
  agreement?: TenantAgreementInput;
  documents: TenantDocumentChecklistItem[];
  accessPermissions: TenantAccessPermissionsInput;
  eligibility: TenantEligibilityResult;
  timeline: TenantStatusTimelineItem[];
  submittedAt?: string;
  blockingReasonKey?: string;
  createdAt: string;
  updatedAt: string;
};

export type TenantProfile = {
  id: string;
  unitId: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  moveInDate: string;
  agreementEndDate: string;
  accessStatus: 'ACTIVE' | 'PENDING_ACTIVATION' | 'RESTRICTED';
  policeVerificationStatus: PoliceVerificationStatus;
  documentSummary: TenantDocumentChecklistItem[];
  permissions: TenantAccessPermissionsInput;
};

export type TenantManagementSummary = {
  unitId: string;
  currentTenant: TenantProfile | null;
  activeRequest: TenantOnboardingRequest | null;
  isExitInitiated?: boolean;
  previousTenantSummary?: {
    fullName: string;
    moveOutDate: string;
    nocStatus: 'COMPLETED' | 'PENDING';
  };
};

export type HouseholdOverview = {
  unitId: string;
  societyName: string;
  unitLabel: string;
  ownerResidentId: string;
  loggedInRole: ResidentHouseholdRole;
  ownerProfileActive: boolean;
  ownerKycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  unitActive: boolean;
  maxOccupancy: number;
  maintenanceDuesBlockingTenantOnboarding: boolean;
  maintenanceDuesPending: boolean;
  tenantManagementFeatureEnabled: boolean;
  familyMemberCount: number;
  activeFamilyAccessCount: number;
  emergencyContactCount: number;
  currentTenantCount: number;
  pendingTenantRequestCount: number;
  reminders: string[];
};

export const defaultTenantAccessPermissions: TenantAccessPermissionsInput = {
  visitorApprovalAllowed: true,
  complaintCreationAllowed: true,
  facilityBookingAllowed: true,
  residentConnectAllowed: true,
  noticeViewAllowed: true,
  billingViewAllowed: false,
  documentUploadAllowed: true,
  emergencyAllowed: true,
  parkingRequestAllowed: true,
  moveOutNocRequestAllowed: true,
};
