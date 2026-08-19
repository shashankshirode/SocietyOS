import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'complaints-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.complaints.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.complaints.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'complaints-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.complaints.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.complaints.loading.desc',
    data: null
  },
  {
    id: 'complaints-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.complaints.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.complaints.empty.desc',
    data: { items: [] }
  },
  {
    id: 'complaints-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.complaints.error.title',
    descriptionMessageKey: 'resident.mockScenarios.complaints.error.desc',
    data: null,
    errorCode: 'ERR_COMPLAINTS_FAIL'
  },
  {
    id: 'complaints-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.complaints.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.complaints.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'complaints-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.complaints.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.complaints.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
