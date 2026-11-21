import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'visitors-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.visitors.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.visitors.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'visitors-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.visitors.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.visitors.loading.desc',
    data: null
  },
  {
    id: 'visitors-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.visitors.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.visitors.empty.desc',
    data: { items: [] }
  },
  {
    id: 'visitors-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.visitors.error.title',
    descriptionMessageKey: 'resident.mockScenarios.visitors.error.desc',
    data: null,
    errorCode: 'ERR_VISITORS_FAIL'
  },
  {
    id: 'visitors-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.visitors.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.visitors.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'visitors-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.visitors.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.visitors.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
