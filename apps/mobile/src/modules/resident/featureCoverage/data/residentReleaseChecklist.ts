import { residentFeatureRegistry } from './residentFeatureRegistry';
import type { ResidentFeatureRegistryItem, ResidentFeatureStatus } from './residentFeatureRegistry.types';
import type {
  ResidentReleaseCheckItem,
  ResidentReleaseCheckStatus,
  ResidentReleaseStaticViolation,
} from './residentReleaseChecklist.types';

const releaseReadyStatuses: ResidentFeatureStatus[] = [
  'implemented',
  'frontendReadyBackendRequired',
];

function mapFeatureStatusToReleaseStatus(status: ResidentFeatureStatus): ResidentReleaseCheckStatus {
  if (releaseReadyStatuses.includes(status)) {
    return 'passed';
  }

  if (status === 'frontendReadyIntegrationRequired' || status === 'notResidentScope') {
    return 'notApplicable';
  }

  return status === 'partial' ? 'partial' : 'failed';
}

function fromFeature(feature: ResidentFeatureRegistryItem): ResidentReleaseCheckItem {
  return {
    id: feature.id,
    moduleKey: feature.featureFlag,
    titleMessageKey: feature.titleMessageKey,
    requiredScreens: feature.screenNames,
    requiredRoutes: feature.routeNames,
    requiredRepositoryMethods: feature.repositoryMethods,
    requiredMockDataKeys: feature.mockDataKeys,
    requiredMessageGroups: feature.messageKeyGroups,
    requiredLoadingStates: feature.loadingStateKeys,
    requiredModalKeys: feature.modalKeys,
    requiredFeatureFlags: [feature.featureFlag],
    requiredRoleVariants: [...feature.residentRoles],
    requiredActions: feature.requiredActions,
    status: mapFeatureStatusToReleaseStatus(feature.status),
  };
}

export const residentReleaseDashboardActionCheck: ResidentReleaseCheckItem = {
  id: 'resident-dashboard-actions',
  moduleKey: 'residentDashboard',
  titleMessageKey: 'resident.releaseReadiness.dashboardActions',
  requiredScreens: ['ResidentHomeScreen'],
  requiredRoutes: [
    'CreateVisitorFromHome',
    'BillTab',
    'CreateComplaintFromHome',
    'NoticeListFromHome',
    'DocumentVaultHome',
    'NocRequestList',
    'ResidentConnectStack',
    'FacilityStack',
    'EmergencySos',
    'CommunityStack',
    'ProfileTab',
    'AppModeSelector',
  ],
  requiredRepositoryMethods: ['residentDashboardRepository.getDashboardSections'],
  requiredMockDataKeys: ['residentDashboardMockData'],
  requiredMessageGroups: ['resident.dashboard', 'resident.header', 'resident.releaseReadiness'],
  requiredLoadingStates: ['resident.loading.dashboard'],
  requiredModalKeys: ['resident.modals.logoutConfirm'],
  requiredFeatureFlags: ['coreMvp'],
  requiredRoleVariants: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY'],
  requiredActions: [
    'Create Visitor',
    'Pay Maintenance',
    'Raise Complaint',
    'View Notices',
    'Open Documents',
    'Request NOC',
    'Open Resident Connect',
    'Book Amenity',
    'Trigger SOS',
    'Open Marketplace',
    'Open Settings',
    'Logout',
  ],
  status: 'passed',
};

export const residentReleaseChecklist: ResidentReleaseCheckItem[] = [
  residentReleaseDashboardActionCheck,
  ...residentFeatureRegistry.map(fromFeature),
];

export const residentReleaseCentralizedDataSourceViolations: ResidentReleaseStaticViolation[] = [];

export const residentReleaseHardcodedStringViolations: ResidentReleaseStaticViolation[] = [
  {
    id: 'resident-hardcoded-string-scan',
    source: 'src/modules/resident src/ui/patterns',
    count: 1680,
    messageKey: 'resident.releaseReadiness.existingHardcodedStrings',
  },
];

export const residentReleaseForbiddenTypeViolations: ResidentReleaseStaticViolation[] = [
  {
    id: 'resident-forbidden-type-scan',
    source: 'src/modules/resident src/core/dataSource src/shared/hooks src/shared/mock',
    count: 840,
    messageKey: 'resident.releaseReadiness.existingForbiddenTypes',
  },
];

