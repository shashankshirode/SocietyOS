import type {
  ResidentHomeFeatureCoverage,
  ResidentHomeRole,
  ResidentHomeStatus,
} from '../homeContext/data/residentHomeContext.types';

export const residentMockFeatureKeys = [
  'homeContext',
  'dashboard',
  'todaysPriority',
  'residencePulse',
  'dailyInsights',
  'notifications',
  'visitors',
  'visitorExitAssurance',
  'gateEntry',
  'billing',
  'complaints',
  'documents',
  'noc',
  'family',
  'tenant',
  'ownerTenantHistory',
  'moveInMoveOut',
  'parking',
  'facilityBooking',
  'facilitySlots',
  'residentConnect',
  'chat',
  'notices',
  'governance',
  'communityHub',
  'marketplace',
  'borrowLend',
  'lostFound',
  'skillDirectory',
  'verifiedVendors',
  'emergency',
  'seniorCare',
  'childSafety',
  'petCommunity',
  'knowledgeBase',
  'communityServices',
  'interFlatIssues',
  'rules',
  'domesticHelp',
  'contextualInsights',
  'recentActivity',
  'profileSettings',
] as const;

export type ResidentMockFeatureKey = (typeof residentMockFeatureKeys)[number];

export type ResidentMockScenarioState =
  | 'normal'
  | 'empty'
  | 'single'
  | 'large'
  | 'loading'
  | 'error'
  | 'stale'
  | 'restricted'
  | 'pendingApproval'
  | 'featureDisabled'
  | 'missingOptionalData'
  | 'invalidSourceData';

export type ResidentMockRecordStatus =
  | 'active'
  | 'upcoming'
  | 'inside'
  | 'completed'
  | 'expired'
  | 'cancelled'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'failed'
  | 'restricted'
  | 'missing'
  | 'verified'
  | 'overdue'
  | 'partial'
  | 'resolved'
  | 'reopened'
  | 'closed'
  | 'assigned'
  | 'inProgress'
  | 'read'
  | 'unread'
  | 'available'
  | 'limited'
  | 'full'
  | 'maintenance'
  | 'sold'
  | 'reserved'
  | 'underReview';

export type ResidentMockRecord = {
  id: string;
  feature: ResidentMockFeatureKey;
  homeContextId: string;
  societyId: string;
  unitId: string;
  residentRole: ResidentHomeRole;
  dataScopeKey: string;
  featureFlagScopeId: string;
  permissionScopeId: string;
  ordinal: number;
  status: ResidentMockRecordStatus;
  titleMessageKey: 'resident.mockData.recordTitle';
  descriptionMessageKey: 'resident.mockData.recordDescription';
  createdAtIso: string;
  updatedAtIso: string;
  amount?: number;
  dueAtIso?: string;
  optionalValue?: string;
};

export type ResidentMockFeatureDataset = Readonly<
  Record<ResidentMockFeatureKey, readonly ResidentMockRecord[]>
>;

export type ResidentMockEdgeCase = {
  id: string;
  feature: ResidentMockFeatureKey;
  state: ResidentMockScenarioState;
  titleMessageKey: 'resident.mockData.edgeCaseTitle';
  enabled: boolean;
};

export type ResidentMockScenario = {
  homeContextId: string;
  societyId: string;
  unitId: string;
  residentRole: ResidentHomeRole;
  homeStatus: ResidentHomeStatus;
  featureCoverage: ResidentHomeFeatureCoverage;
  dataScopeKey: string;
  featureFlagScopeId: string;
  permissionScopeId: string;
  enabledFeatures: readonly ResidentMockFeatureKey[];
  records: ResidentMockFeatureDataset;
  edgeCases: readonly ResidentMockEdgeCase[];
};

export type ResidentMockScenarioMatrixEntry = {
  homeContextId: string;
  feature: ResidentMockFeatureKey;
  enabled: boolean;
  recordCount: number;
  supportedStates: readonly ResidentMockScenarioState[];
};
