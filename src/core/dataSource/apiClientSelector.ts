import { apiClient } from '../api/apiClient';
import type { AppModuleKey } from './dataSource.types';
import { resolveDataSource } from './dataSourceResolver';

export function getApiClientForModule(moduleKey: AppModuleKey): typeof apiClient | null {
  return resolveDataSource(moduleKey).isApi ? apiClient : null;
}

