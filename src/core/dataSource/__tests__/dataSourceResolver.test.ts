import { resolveDataSource } from '../dataSourceResolver';
import type { DataSourceConfig } from '../dataSource.types';

const baseConfig: DataSourceConfig = {
  globalMode: 'mock',
  moduleOverrides: {},
  allowApiFallbackToMock: true,
  enableMockLatency: false,
  enableMockErrors: false,
};

describe('resolveDataSource', () => {
  it('defaults resident modules to mock mode', () => {
    const resolved = resolveDataSource('residentVisitors', baseConfig);

    expect(resolved).toMatchObject({
      moduleKey: 'residentVisitors',
      mode: 'mock',
      isMock: true,
      isApi: false,
    });
  });

  it('uses API mode when global mode is API', () => {
    const resolved = resolveDataSource('residentBilling', {
      ...baseConfig,
      globalMode: 'api',
    });

    expect(resolved.mode).toBe('api');
    expect(resolved.isApi).toBe(true);
  });

  it('uses module overrides for hybrid migration', () => {
    const resolved = resolveDataSource('residentComplaints', {
      ...baseConfig,
      globalMode: 'hybrid',
      moduleOverrides: {
        residentComplaints: 'api',
      },
    });

    expect(resolved.mode).toBe('api');
  });
});

