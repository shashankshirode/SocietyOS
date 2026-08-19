import { dataSourceConfig } from './dataSource.config';
import type { AppModuleKey, DataSourceConfig, ResolvedDataSource } from './dataSource.types';

export function resolveDataSource(
  moduleKey: AppModuleKey,
  config: DataSourceConfig = dataSourceConfig
): ResolvedDataSource {
  const override = config.moduleOverrides[moduleKey] ?? 'inherit';
  const mode = override === 'inherit'
    ? config.globalMode === 'api'
      ? 'api'
      : 'mock'
    : override;

  return {
    moduleKey,
    mode,
    isMock: mode === 'mock',
    isApi: mode === 'api',
    fallbackToMockEnabled: config.allowApiFallbackToMock,
  };
}

