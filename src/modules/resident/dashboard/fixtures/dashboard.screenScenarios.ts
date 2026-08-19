import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'dashboard-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.dashboard.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.dashboard.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'dashboard-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.dashboard.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.dashboard.loading.desc',
    data: null
  },
  {
    id: 'dashboard-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.dashboard.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.dashboard.empty.desc',
    data: { items: [] }
  },
  {
    id: 'dashboard-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.dashboard.error.title',
    descriptionMessageKey: 'resident.mockScenarios.dashboard.error.desc',
    data: null,
    errorCode: 'ERR_DASHBOARD_FAIL'
  },
  {
    id: 'dashboard-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.dashboard.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.dashboard.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'dashboard-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.dashboard.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.dashboard.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
