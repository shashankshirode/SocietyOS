import { mockResidentHomeContexts } from '../homeContext/data/residentHomeContext.mockData';
import { buildResidentMockScenario } from './residentMockBuilders';

export const residentMockSeed = mockResidentHomeContexts.map(buildResidentMockScenario);
