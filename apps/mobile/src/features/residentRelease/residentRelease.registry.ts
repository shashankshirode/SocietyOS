import { residentCapabilityRegistry } from '../residentCapabilities/configuration/residentCapabilityRegistry';
import type { ResidentCapabilityId } from '../residentCapabilities/models/ResidentCapability';
import type { ResidentReleaseCapability } from './residentRelease.types';

type ResidentReleaseEvidence = {
  routes?: readonly string[];
  screens: readonly string[];
  components: readonly string[];
};

const evidenceByCapability: Readonly<Record<ResidentCapabilityId, ResidentReleaseEvidence>> = {
  'resident.authentication': { screens: ['ResidentAuthenticationScreen'], components: ['ResidentEntryNavigator'] },
  'resident.membership': { screens: ['ResidentAuthenticationScreen'], components: ['ResidentHomeContextCard'] },
  'resident.homeContext': { screens: ['ResidentHomeScreen'], components: ['ResidentHomeSwitcherSheet', 'ResidentHomeContextBadge'] },
  'resident.household': { screens: ['HouseholdOverviewScreen', 'FamilyMemberListScreen'], components: ['HouseholdIdentityCard', 'HouseholdReadinessPanel'] },
  'resident.familyPortability': { screens: ['FamilyPortabilityScreen'], components: ['FamilyMemberCard'] },
  'resident.tenantLifecycle': { screens: ['TenantManagementScreen', 'TenantDetailScreen'], components: ['TenantOccupancyCard'] },
  'resident.rentalDeclaration': { screens: ['RentalDeclarationScreen'], components: ['TenantAgreementForm'] },
  'resident.shortStay': { screens: ['ShortStayManagementScreen'], components: ['TenantOccupancyCard'] },
  'resident.visitors': { screens: ['VisitorListScreen', 'VisitorDetailScreen'], components: ['VisitorExitConfirmationSheet'] },
  'resident.billing': { screens: ['BillListScreen', 'BillDetailScreen'], components: ['BillSummaryCard'] },
  'resident.complaints': { screens: ['ComplaintListScreen', 'ComplaintDetailScreen'], components: ['ComplaintJourney'] },
  'resident.interFlatIssues': { screens: ['InterFlatHomeScreen', 'InterFlatIssueDetailScreen'], components: ['DisputePrivacyNotice'] },
  'resident.notices': { screens: ['NoticeListScreen', 'NoticeDetailScreen'], components: ['SocietyNoticeCard'] },
  'resident.governance': { screens: ['GovernanceHomeScreen', 'SubmitPollVoteScreen'], components: ['SettingsSection'] },
  'resident.documents': { screens: ['DocumentVaultHomeScreen', 'DocumentDetailScreen'], components: ['DocumentReadinessPanel'] },
  'resident.nocAndMoveOut': { screens: ['NocRequestListScreen', 'MoveOutRequestScreen'], components: ['DocumentReadinessPanel'] },
  'resident.parking': { screens: ['ParkingHomeScreen', 'MyVehiclesScreen'], components: ['VisitorPassReviewCard'] },
  'resident.facilities': { screens: ['FacilityHomeScreen', 'FacilityBookingDetailScreen'], components: ['FacilityCard'] },
  'resident.chat': { screens: ['ChatThreadListScreen', 'ChatConversationScreen'], components: ['ChatMessageBubble'] },
  'resident.residentConnect': { screens: ['ResidentConnectHomeScreen', 'ResidentDirectConversationScreen'], components: ['ChatConversationListItem'] },
  'resident.domesticHelp': { routes: ['DomesticHelpHome', 'DomesticHelpDetail', 'DomesticHelpAttendance', 'DomesticHelpAccess', 'DomesticHelpServiceControls'], screens: ['ResidentDomesticHelpHomeScreen', 'ResidentDomesticHelpDetailScreen', 'ResidentDomesticHelpAttendanceScreen', 'ResidentDomesticHelpAccessScreen', 'ResidentDomesticHelpServiceControlsScreen'], components: ['DomesticHelpProfileCard'] },
  'resident.emergency': { screens: ['EmergencySafetyHomeScreen', 'EmergencySosScreen'], components: ['EmergencyActionCard'] },
  'resident.community': { screens: ['CommunityHomeScreen', 'MarketplaceHomeScreen'], components: ['CommunityServiceMatrix'] },
  'resident.settings': { screens: ['ProfileScreen', 'SettingsScreen'], components: ['SettingsSection'] },
  'resident.notifications': { screens: ['NotificationSettingsScreen'], components: ['SettingsSection'] },
};

const sharedRuntimeVerification = [
  'physical Android device',
  'physical iOS device',
  'route-specific accessibility pass',
  'route-specific dark-mode pass',
  'route-specific offline pass',
  'route-specific large-font pass',
] as const;

export const residentBlueprintVersion = '2.0';

export const residentReleaseRegistry: readonly ResidentReleaseCapability[] = residentCapabilityRegistry.map((capability) => {
  const evidence = evidenceByCapability[capability.id];
  return {
    id: capability.id,
    featureArea: capability.featureArea,
    roles: capability.allowedRoles,
    featureFlag: capability.requiredFeatureFlag,
    routes: evidence.routes ?? [capability.route],
    screens: evidence.screens,
    components: evidence.components,
    repository: capability.repository,
    mockScenarios: capability.requiredTests,
    supportedStates: capability.supportedStates,
    supportedActions: capability.supportedActions,
    tests: capability.requiredTests,
    implementationStatus: 'partial',
    remainingVerification: sharedRuntimeVerification,
  };
});
