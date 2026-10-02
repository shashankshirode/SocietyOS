import { hardwareIntegrationApiSource } from '../data/hardwareIntegration.apiSource';
import {
  isJestRun,
  mockHardwareIntegrationPermitted,
  resolveHardwareIntegrationSourceMode,
} from '../data/hardwareIntegrationSourceGuard';

describe('Hardware Module Adapter & Guard Tests', () => {
  test('canonical hardwareIntegrationApiSource provides implemented production methods', async () => {
    const home = await hardwareIntegrationApiSource.getHardwareHome();
    expect(home.ok).toBe(true);
    if (home.ok) {
      expect(home.data.societyName).toBeDefined();
    }

    const barriers = await hardwareIntegrationApiSource.getBoomBarriers();
    expect(barriers.ok).toBe(true);

    const cctv = await hardwareIntegrationApiSource.getCctvCameras();
    expect(cctv.ok).toBe(true);

    const meters = await hardwareIntegrationApiSource.getSmartMeters();
    expect(meters.ok).toBe(true);

    const chargers = await hardwareIntegrationApiSource.getEvChargers();
    expect(chargers.ok).toBe(true);

    const health = await hardwareIntegrationApiSource.getIntegrationHealth();
    expect(health.ok).toBe(true);
  });

  test('hardware integration source guard permits mocks only in test/demo mode', () => {
    expect(isJestRun()).toBe(true);
    expect(mockHardwareIntegrationPermitted()).toBe(true);
    expect(resolveHardwareIntegrationSourceMode()).toBe('mock');
  });
});