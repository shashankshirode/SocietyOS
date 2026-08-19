import { appConfig } from '../../../core/config/appConfig';
import { complianceApiSource } from './compliance.apiSource';
import { complianceMockSource } from './compliance.mockSource';

export const complianceRepository =
  appConfig.dataSourceMode === 'api' ? complianceApiSource : complianceMockSource;
export default complianceRepository;
