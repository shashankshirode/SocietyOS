

import { DATA_SOURCE_MODE } from '../../../core/config/dataSourceMode';
import { superAdminMockSource } from './superAdmin.mockSource';
import { superAdminApiSource } from './superAdmin.apiSource';

const source = DATA_SOURCE_MODE === 'mock' ? superAdminMockSource : superAdminApiSource;

export const superAdminRepository = source;
