import { dataSourceConfig } from '../../core/dataSource/dataSource.config';

export async function simulateMockNetworkDelay(ms = 250): Promise<void> {
  if (!dataSourceConfig.enableMockLatency) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, ms));
}

