import type { AppModuleKey, DataSourceMode } from './dataSource.types';

export const DEFAULT_DATA_SOURCE_MODE: DataSourceMode = 'mock';

export const DATA_SOURCE_ENV_KEY = 'EXPO_PUBLIC_DATA_SOURCE_MODE';

export const RESIDENT_MODULE_KEYS: AppModuleKey[] = [
  'residentDashboard',
  'residentProfile',
  'residentHousehold',
  'residentFamily',
  'residentVisitors',
  'residentBilling',
  'residentComplaints',
  'residentNotices',
  'residentDocuments',
  'residentNoc',
  'residentMoveInMoveOut',
  'residentConnect',
  'residentInterFlatIssues',
  'residentFacilityBooking',
  'residentParking',
  'residentParcelHandover',
  'residentGovernance',
  'residentEmergency',
  'residentMarketplace',
  'residentSettings',
  'residentSmartAssistance',
  'chat',
];
