import { useMemo } from 'react';
import { useDataSourceConfig } from './dataSourceProvider';
import { resolveDataSource } from './dataSourceResolver';
import type { AppModuleKey, ResolvedDataSource } from './dataSource.types';

export function useDataSourceMode(moduleKey: AppModuleKey): ResolvedDataSource {
  const config = useDataSourceConfig();
  return useMemo(() => resolveDataSource(moduleKey, config), [config, moduleKey]);
}

