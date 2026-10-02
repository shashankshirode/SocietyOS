

import { resolveHardwareIntegrationSourceMode } from './hardwareIntegrationSourceGuard';
import { hardwareIntegrationMockSource } from './hardwareIntegration.mockSource';
import { hardwareIntegrationApiSource } from './hardwareIntegration.apiSource';

export const hardwareIntegrationRepository = new Proxy(
  {} as typeof hardwareIntegrationApiSource,
  {
    get(_target, prop: keyof typeof hardwareIntegrationApiSource) {
      const mode = resolveHardwareIntegrationSourceMode();
      const delegate = mode === 'api' ? hardwareIntegrationApiSource : hardwareIntegrationMockSource;
      return delegate[prop];
    },
  }
);

