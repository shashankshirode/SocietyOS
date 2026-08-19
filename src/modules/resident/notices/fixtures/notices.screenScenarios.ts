import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'notices-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.notices.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.notices.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'notices-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.notices.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.notices.loading.desc',
    data: null
  },
  {
    id: 'notices-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.notices.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.notices.empty.desc',
    data: { items: [] }
  },
  {
    id: 'notices-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.notices.error.title',
    descriptionMessageKey: 'resident.mockScenarios.notices.error.desc',
    data: null,
    errorCode: 'ERR_NOTICES_FAIL'
  },
  {
    id: 'notices-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.notices.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.notices.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'notices-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.notices.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.notices.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
