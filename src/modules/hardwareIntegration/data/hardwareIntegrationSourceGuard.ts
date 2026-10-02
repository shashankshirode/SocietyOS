import { resolveDataSource } from '../../../core/dataSource/dataSourceResolver';
import { DATA_SOURCE_ENV_KEY } from '../../../core/dataSource/dataSource.constants';
import { isDevelopmentMode } from '../../../shared/utils/isDevelopmentMode';

export function isExplicitDemoMode(): boolean {
  const configured =
    process.env.EXPO_PUBLIC_DATA_SOURCE_MODE ??
    process.env[DATA_SOURCE_ENV_KEY];
  return configured === 'mock' || configured === 'hybrid';
}

export function isJestRun(): boolean {
  return process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
}

export function mockHardwareIntegrationPermitted(): boolean {
  return isJestRun() || isDevelopmentMode() || isExplicitDemoMode();
}

export function resolveHardwareIntegrationSourceMode(): 'api' | 'mock' {
  const resolution = resolveDataSource('hardwareIntegration');
  if (resolution.isApi) {
    return 'api';
  }
  if (!mockHardwareIntegrationPermitted()) {
    throw new Error('PRODUCTION_INTEGRITY_VIOLATION: Hardware integration cannot silently use mocks in production without explicit demo configuration.');
  }
  return 'mock';
}
