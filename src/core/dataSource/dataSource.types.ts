export type DataSourceMode = 'mock' | 'api' | 'hybrid';

export type ModuleDataSourceMode = 'mock' | 'api' | 'inherit';

export type AppModuleKey =
  | 'residentAuth'
  | 'residenceAccess'
  | 'residentDashboard'
  | 'residentHomeContext'
  | 'residentProfile'
  | 'residentHousehold'
  | 'residentLifecycle'
  | 'residentFamily'
  | 'residentVisitors'
  | 'residentBilling'
  | 'residentComplaints'
  | 'residentNotices'
  | 'residentDocuments'
  | 'residentNoc'
  | 'residentMoveInMoveOut'
  | 'residentConnect'
  | 'residentInterFlatIssues'
  | 'residentFacilityBooking'
  | 'residentParking'
  | 'residentParcelHandover'
  | 'residentGovernance'
  | 'residentEmergency'
  | 'residentMarketplace'
  | 'residentSettings'
  | 'residentSmartAssistance'
  | 'residentContextualInsights'
  | 'residentNotifications'
  | 'residentDomesticHelp'
  | 'chat'
  | 'guard'
  | 'admin'
  | 'treasurer'
  | 'facility'
  | 'superAdmin';

export type DataSourceConfig = {
  globalMode: DataSourceMode;
  moduleOverrides: Partial<Record<AppModuleKey, ModuleDataSourceMode>>;
  allowApiFallbackToMock: boolean;
  enableMockLatency: boolean;
  enableMockErrors: boolean;
};

export type ResolvedDataSource = {
  moduleKey: AppModuleKey;
  mode: Exclude<ModuleDataSourceMode, 'inherit'>;
  isMock: boolean;
  isApi: boolean;
  fallbackToMockEnabled: boolean;
};

export type RepositorySourcePair<TMockRepository, TApiRepository = TMockRepository> = {
  moduleKey: AppModuleKey;
  mockRepository: TMockRepository;
  apiRepository: TApiRepository;
};
