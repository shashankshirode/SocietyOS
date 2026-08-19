import type { MockScenarioState } from './mockErrors';

let currentMockScenario: MockScenarioState = 'normal';

export function getMockScenario(): MockScenarioState {
  return currentMockScenario;
}

export function setMockScenario(nextScenario: MockScenarioState): MockScenarioState {
  currentMockScenario = nextScenario;
  return currentMockScenario;
}

