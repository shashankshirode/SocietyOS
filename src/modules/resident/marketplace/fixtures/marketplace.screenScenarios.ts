import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'marketplace-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.marketplace.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.marketplace.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'marketplace-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.marketplace.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.marketplace.loading.desc',
    data: null
  },
  {
    id: 'marketplace-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.marketplace.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.marketplace.empty.desc',
    data: { items: [] }
  },
  {
    id: 'marketplace-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.marketplace.error.title',
    descriptionMessageKey: 'resident.mockScenarios.marketplace.error.desc',
    data: null,
    errorCode: 'ERR_MARKETPLACE_FAIL'
  },
  {
    id: 'marketplace-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.marketplace.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.marketplace.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'marketplace-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.marketplace.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.marketplace.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
