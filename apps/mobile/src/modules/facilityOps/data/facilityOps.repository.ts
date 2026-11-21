import { appConfig } from '../../../core/config/appConfig';
import { facilityOpsApiSource } from './facilityOps.apiSource';
import { facilityOpsMockSource } from './facilityOps.mockSource';

export const facilityOpsRepository =
  appConfig.dataSourceMode === 'api' ? facilityOpsApiSource : facilityOpsMockSource;
