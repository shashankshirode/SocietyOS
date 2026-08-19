export type ResidentFeatureStatus =
  | 'implemented'
  | 'missing'
  | 'partial'
  | 'notResidentScope'
  | 'frontendReadyBackendRequired'
  | 'frontendReadyIntegrationRequired';

export type ResidentRole = 'RESIDENT_OWNER' | 'RESIDENT_TENANT' | 'RESIDENT_FAMILY';

export type ResidentFeaturePhase = 'MVP' | 'PHASE_1A' | 'PHASE_2' | 'PHASE_3' | 'PHASE_4';

export type ResidentFeatureRegistryItem = {
  id: string;
  titleMessageKey: string;
  descriptionMessageKey: string;
  residentRoles: ResidentRole[];
  phase: ResidentFeaturePhase;
  featureFlag: string;
  permission?: string;
  routeNames: string[];
  screenNames: string[];
  hookNames: string[];
  repositoryMethods: string[];
  mockDataKeys: string[];
  messageKeyGroups: string[];
  loadingStateKeys: string[];
  modalKeys: string[];
  requiredActions: string[];
  testNames: string[];
  status: ResidentFeatureStatus;
};

export type ResidentCoverageGap = {
  featureId: string;
  featureTitleMessageKey: string;
  key: string;
};

export type ResidentFeatureCoverageSummary = {
  total: number;
  implemented: number;
  partial: number;
  missing: number;
  frontendReadyBackendRequired: number;
  frontendReadyIntegrationRequired: number;
  notResidentScope: number;
  missingRoutes: ResidentCoverageGap[];
  missingScreens: ResidentCoverageGap[];
  missingActions: ResidentCoverageGap[];
  missingMessages: ResidentCoverageGap[];
  missingLoadingStates: ResidentCoverageGap[];
  missingMockDataKeys: ResidentCoverageGap[];
  missingTests: ResidentCoverageGap[];
  percentage: number;
};

