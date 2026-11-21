import { residentMockSeed } from './residentMockSeed';
import type { ResidentMockScenario } from './residentMockScenario.types';

export const residentMockContextIndex: ReadonlyMap<string, ResidentMockScenario> = new Map(
  residentMockSeed.map((scenario) => [scenario.homeContextId, scenario])
);
