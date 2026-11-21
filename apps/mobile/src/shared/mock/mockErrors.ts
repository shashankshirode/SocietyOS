import { dataSourceConfig } from '../../core/dataSource/dataSource.config';
import { mockFailure, type MockResult } from './mockResult';

export type MockScenarioState = 'normal' | 'empty' | 'error';

export function maybeMockScenarioError<TData>(
  scenario: MockScenarioState,
  code: string,
  message: string
): MockResult<TData> | null {
  if (scenario !== 'error' || !dataSourceConfig.enableMockErrors) {
    return null;
  }

  return mockFailure(code, message);
}

