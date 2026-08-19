import { DATA_SOURCE_MODE } from '../../../core/config/dataSourceMode';
import { adminMockSource } from './admin.mockSource';
import { adminApiSource } from './admin.apiSource';

export const adminRepository = DATA_SOURCE_MODE === 'mock' ? adminMockSource : adminApiSource;
