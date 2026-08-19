import { appConfig } from '../../../core/config/appConfig';
import { reportsApiSource } from './reports.apiSource';
import { reportsMockSource } from './reports.mockSource';

export const reportsRepository =
  appConfig.dataSourceMode === 'api' ? reportsApiSource : reportsMockSource;
export default reportsRepository;
