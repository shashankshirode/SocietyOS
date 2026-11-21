import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'noc-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.noc.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.noc.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'noc-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.noc.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.noc.loading.desc',
    data: null
  },
  {
    id: 'noc-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.noc.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.noc.empty.desc',
    data: { items: [] }
  },
  {
    id: 'noc-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.noc.error.title',
    descriptionMessageKey: 'resident.mockScenarios.noc.error.desc',
    data: null,
    errorCode: 'ERR_NOC_FAIL'
  },
  {
    id: 'noc-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.noc.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.noc.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'noc-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.noc.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.noc.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
