import type { ResidentMockScenarioState } from './residentMockScenario.types';

export type ResidentMockEdgeCaseFixture = {
  id: string;
  state: ResidentMockScenarioState;
  sourceDate?: string | null;
  amount?: number | null;
  rawStatus?: string;
  isBlocked: boolean;
  titleMessageKey: 'resident.mockData.edgeCaseTitle';
};

export const residentMockEdgeCaseFixtures: readonly ResidentMockEdgeCaseFixture[] = [
  {
    id: 'edge-empty-list',
    state: 'empty',
    isBlocked: false,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
  {
    id: 'edge-single-item',
    state: 'single',
    isBlocked: false,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
  {
    id: 'edge-missing-date',
    state: 'missingOptionalData',
    sourceDate: null,
    isBlocked: false,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
  {
    id: 'edge-invalid-date',
    state: 'invalidSourceData',
    sourceDate: 'not-a-date',
    isBlocked: true,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
  {
    id: 'edge-missing-amount',
    state: 'missingOptionalData',
    amount: null,
    isBlocked: false,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
  {
    id: 'edge-zero-amount',
    state: 'normal',
    amount: 0,
    isBlocked: false,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
  {
    id: 'edge-negative-amount',
    state: 'invalidSourceData',
    amount: -500,
    isBlocked: true,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
  {
    id: 'edge-unrecognized-status',
    state: 'invalidSourceData',
    rawStatus: 'UNRECOGNIZED_SOURCE_STATUS',
    isBlocked: true,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
  {
    id: 'edge-network-error',
    state: 'error',
    isBlocked: false,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
  {
    id: 'edge-stale-context',
    state: 'stale',
    isBlocked: true,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
  {
    id: 'edge-context-switch',
    state: 'loading',
    isBlocked: true,
    titleMessageKey: 'resident.mockData.edgeCaseTitle',
  },
];
