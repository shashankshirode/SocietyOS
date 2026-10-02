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

export function mockStaffAttendancePermitted(): boolean {
  return isJestRun() || isDevelopmentMode() || isExplicitDemoMode();
}

export function resolveStaffAttendanceSourceMode(): 'api' | 'mock' {
  const resolution = resolveDataSource('staffAttendance');
  if (resolution.isApi) {
    return 'api';
  }
  if (!mockStaffAttendancePermitted()) {
    throw new Error('PRODUCTION_INTEGRITY_VIOLATION: Staff attendance cannot silently use mocks in production without explicit demo configuration.');
  }
  return 'mock';
}
