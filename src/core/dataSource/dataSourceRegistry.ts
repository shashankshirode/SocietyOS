import { dataSourceConfig } from './dataSource.config';
import { apiConfig } from '../api/apiConfig';

export type AppDataSourceMode = 'mock' | 'api';

export type ModuleDataSourceKey =
  | 'residentHomeContext'
  | 'residentDashboard'
  | 'residentVisitors'
  | 'residentBilling'
  | 'residentComplaints'
  | 'residentDocuments'
  | 'residentNoc'
  | 'residentHousehold'
  | 'residentFacilityBooking'
  | 'residentParking'
  | 'residentConnect'
  | 'residentNotices'
  | 'residentGovernance'
  | 'residentMarketplace'
  | 'residentEmergency'
  | 'residentContextualInsights'
  | 'residentNotifications'
  | 'residentDomesticHelp'
  | 'chat';

export type CentralDataSourceConfigType = {
  defaultMode: AppDataSourceMode;
  moduleOverrides: Partial<Record<ModuleDataSourceKey, AppDataSourceMode>>;
  apiBaseUrl: string;
  timeoutMs: number;
};


export const centralDataSourceConfig: CentralDataSourceConfigType = {
  defaultMode: dataSourceConfig.globalMode === 'api' ? 'api' : 'mock',
  moduleOverrides: Object.fromEntries(
    Object.entries(dataSourceConfig.moduleOverrides).map(([k, v]) => [
      k,
      v === 'api' ? 'api' : 'mock',
    ])
  ) as Partial<Record<ModuleDataSourceKey, AppDataSourceMode>>,
  apiBaseUrl: apiConfig.baseUrl,
  timeoutMs: apiConfig.timeoutMs,
};

export const getDataSourceRegistry = () => {
  return centralDataSourceConfig;
};
