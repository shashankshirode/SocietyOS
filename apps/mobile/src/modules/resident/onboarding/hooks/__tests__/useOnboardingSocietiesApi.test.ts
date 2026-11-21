import { renderHook, waitFor } from '@testing-library/react-native';
import { useOnboardingSocietiesApi } from '../useOnboardingSocietiesApi';

// Mock the dataSourceConfig to test mock mode
jest.mock('../../../../../core/dataSource/dataSource.config', () => ({
  dataSourceConfig: {
    globalMode: 'mock',
    moduleOverrides: {},
    allowApiFallbackToMock: false,
    enableMockLatency: false,
    enableMockErrors: false,
  },
}));

describe('useOnboardingSocietiesApi — mock mode', () => {
  it('returns mock societies when globalMode is mock', async () => {
    const { result } = await renderHook(() => useOnboardingSocietiesApi(''));
    expect(result.current.isMockMode).toBe(true);
    expect(result.current.societies.length).toBeGreaterThan(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('filters mock societies by name', async () => {
    const { result } = await renderHook(() => useOnboardingSocietiesApi('Greenwood'));
    expect(
      result.current.societies.every(
        (s: any) =>
          s.name.toLowerCase().includes('greenwood') ||
          s.city.toLowerCase().includes('greenwood') ||
          s.state.toLowerCase().includes('greenwood'),
      ),
    ).toBe(true);
  });

  it('returns empty list when no mock societies match', async () => {
    const { result } = await renderHook(() => useOnboardingSocietiesApi('xyznonexistent123'));
    expect(result.current.societies).toHaveLength(0);
  });
});
