import { appConfig } from '../../../core/config/appConfig';
import { accountingApiSource } from './accounting.apiSource';
import { accountingMockSource } from './accounting.mockSource';

export const accountingRepository =
  appConfig.dataSourceMode === 'api' ? accountingApiSource : accountingMockSource;
