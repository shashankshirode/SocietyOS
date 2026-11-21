

export type ResidentFeatureStatus =
  | 'implemented'
  | 'missing'
  | 'partial'
  | 'frontendReadyBackendRequired'
  | 'frontendReadyIntegrationRequired';

export interface ResidentFeatureEntry {
  
  id: string;
  
  name: string;
  
  module: string;
  
  routeName: string;
  
  screenName: string;
  
  featureFlag: string;
  
  permission: string;
  
  messageKey: string;
  
  accessibilityKey: string;
  
  loadingStateKey: string;
  
  emptyStateKey: string;
  
  primaryActionKey: string;
  
  status: ResidentFeatureStatus;
}

export interface ResidentFeatureCoverage {
  total: number;
  implemented: number;
  partial: number;
  missing: number;
  frontendReady: number;
  integrationReady: number;
  percentage: number;
}
