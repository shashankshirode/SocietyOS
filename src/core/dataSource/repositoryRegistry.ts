import type { AppModuleKey, ResolvedDataSource } from './dataSource.types';
import { RESIDENT_MODULE_KEYS } from './dataSource.constants';
import { resolveDataSource } from './dataSourceResolver';

export function getRepositoryResolutionRegistry(): Record<AppModuleKey, ResolvedDataSource> {
  const entries = RESIDENT_MODULE_KEYS.map((moduleKey) => [moduleKey, resolveDataSource(moduleKey)] as const);
  return Object.fromEntries(entries) as Record<AppModuleKey, ResolvedDataSource>;
}

