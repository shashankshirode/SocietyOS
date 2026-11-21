import type { FeatureFlagKey } from '../../../core/featureFlags/featureFlags';
import type { Permission } from '../../../core/permissions/permission.types';
import type { ResidentRoleCapability } from './ResidentRoleCapability';
import type { ResidentScenarioId } from './ResidentScenario';

export type ResidentCapabilityId =
  | 'resident.authentication'
  | 'resident.membership'
  | 'resident.homeContext'
  | 'resident.household'
  | 'resident.familyPortability'
  | 'resident.tenantLifecycle'
  | 'resident.rentalDeclaration'
  | 'resident.shortStay'
  | 'resident.visitors'
  | 'resident.billing'
  | 'resident.complaints'
  | 'resident.interFlatIssues'
  | 'resident.notices'
  | 'resident.governance'
  | 'resident.documents'
  | 'resident.nocAndMoveOut'
  | 'resident.parking'
  | 'resident.facilities'
  | 'resident.chat'
  | 'resident.residentConnect'
  | 'resident.domesticHelp'
  | 'resident.emergency'
  | 'resident.community'
  | 'resident.settings'
  | 'resident.notifications';

export type ResidentFeatureArea =
  | 'access'
  | 'homes'
  | 'household'
  | 'occupancy'
  | 'security'
  | 'finance'
  | 'support'
  | 'governance'
  | 'records'
  | 'mobility'
  | 'amenities'
  | 'communication'
  | 'staff'
  | 'safety'
  | 'community'
  | 'preferences';

export type ResidentRouteId =
  | 'ResidentAuth'
  | 'ResidentMembership'
  | 'ResidentHome'
  | 'HouseholdOverview'
  | 'FamilyPortability'
  | 'TenantManagement'
  | 'RentalDeclaration'
  | 'ShortStayManagement'
  | 'VisitorTab'
  | 'BillTab'
  | 'ComplaintTab'
  | 'InterFlatStack'
  | 'NoticeListFromHome'
  | 'GovernanceStack'
  | 'DocumentVaultHome'
  | 'NocRequestList'
  | 'ParkingStack'
  | 'FacilityStack'
  | 'ChatTab'
  | 'ResidentConnectStack'
  | 'DomesticHelp'
  | 'EmergencySafetyStack'
  | 'CommunityStack'
  | 'ProfileTab'
  | 'NotificationSettings';

export type ResidentRepositoryId =
  | 'residentAuthRepository'
  | 'residentMembershipRepository'
  | 'residentHomeContextRepository'
  | 'residentHouseholdRepository'
  | 'residentLifecycleRepository'
  | 'ownerTenantRepository'
  | 'visitorsRepository'
  | 'residentBillingRepository'
  | 'residentComplaintsRepository'
  | 'interFlatRepository'
  | 'noticesRepository'
  | 'governanceRepository'
  | 'documentRepository'
  | 'nocRepository'
  | 'parkingRepository'
  | 'facilityRepository'
  | 'residentChatRepository'
  | 'residentConnectRepository'
  | 'domesticHelpRepository'
  | 'residentEmergencyRepository'
  | 'communityRepository'
  | 'residentSettingsRepository'
  | 'residentNotificationRepository';

export type ResidentCapabilityAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'submit'
  | 'approve'
  | 'reject'
  | 'cancel'
  | 'retry'
  | 'switchResidence'
  | 'managePermissions'
  | 'linkPerson'
  | 'pay'
  | 'acknowledge'
  | 'download'
  | 'share'
  | 'book'
  | 'reschedule'
  | 'checkIn'
  | 'checkOut'
  | 'message'
  | 'block'
  | 'report'
  | 'triggerSos'
  | 'configure';

export type ResidentCapabilityState =
  | 'loaded'
  | 'empty'
  | 'partialData'
  | 'paginationLoading'
  | 'paginationExhausted'
  | 'recoverableError'
  | 'nonRecoverableError'
  | 'offlineCached'
  | 'permissionDenied'
  | 'featureDisabled'
  | 'membershipSuspended'
  | 'residenceUnavailable';

export type ResidentCapability = ResidentRoleCapability & {
  id: ResidentCapabilityId;
  featureArea: ResidentFeatureArea;
  requiredFeatureFlag: FeatureFlagKey;
  route: ResidentRouteId;
  repository: ResidentRepositoryId;
  permission?: Permission;
  supportedActions: readonly ResidentCapabilityAction[];
  supportedStates: readonly ResidentCapabilityState[];
  requiredTests: readonly ResidentScenarioId[];
};
