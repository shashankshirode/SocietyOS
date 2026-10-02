import {
  isExplicitDemoMode,
  isJestRun,
  mockStaffAttendancePermitted,
  resolveStaffAttendanceSourceMode,
} from '../staffAttendanceSourceGuard';

describe('staffAttendanceSourceGuard', () => {
  const originalEnvMode = process.env.EXPO_PUBLIC_DATA_SOURCE_MODE;

  afterEach(() => {
    if (originalEnvMode === undefined) {
      delete process.env.EXPO_PUBLIC_DATA_SOURCE_MODE;
    } else {
      process.env.EXPO_PUBLIC_DATA_SOURCE_MODE = originalEnvMode;
    }
  });

  it('correctly detects explicit demo mode from env', () => {
    process.env.EXPO_PUBLIC_DATA_SOURCE_MODE = 'mock';
    expect(isExplicitDemoMode()).toBe(true);

    process.env.EXPO_PUBLIC_DATA_SOURCE_MODE = 'hybrid';
    expect(isExplicitDemoMode()).toBe(true);

    process.env.EXPO_PUBLIC_DATA_SOURCE_MODE = 'api';
    expect(isExplicitDemoMode()).toBe(false);
  });

  it('permits mocks under jest execution', () => {
    expect(isJestRun()).toBe(true);
    expect(mockStaffAttendancePermitted()).toBe(true);
  });

  it('resolves source mode to mock in test/demo environment', () => {
    expect(resolveStaffAttendanceSourceMode()).toBe('mock');
  });
});
