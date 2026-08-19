

import { DATA_SOURCE_MODE } from '../../../core/config/dataSourceMode';
import { hardwareIntegrationMockSource } from './hardwareIntegration.mockSource';
import { hardwareIntegrationApiSource } from './hardwareIntegration.apiSource';

const source = DATA_SOURCE_MODE === 'mock' ? hardwareIntegrationMockSource : hardwareIntegrationApiSource;

export const hardwareIntegrationRepository = source;
