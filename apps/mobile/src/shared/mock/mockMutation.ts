import { simulateMockNetworkDelay } from './mockNetwork';
import { mockSuccess, type MockResult } from './mockResult';

export async function runMockMutation<TOutput>(
  mutate: () => TOutput,
  delayMs = 250
): Promise<MockResult<TOutput>> {
  await simulateMockNetworkDelay(delayMs);
  return mockSuccess(mutate());
}

