import { appConfig } from '../../../core/config/appConfig';
import { automationApiSource } from './automation.apiSource';
import { automationMockSource } from './automation.mockSource';

export const automationRepository = appConfig.dataSourceMode === 'api' ? automationApiSource : automationMockSource;
