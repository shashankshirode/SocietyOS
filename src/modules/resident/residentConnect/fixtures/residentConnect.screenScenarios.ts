import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'residentConnect-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.residentConnect.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.residentConnect.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'residentConnect-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.residentConnect.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.residentConnect.loading.desc',
    data: null
  },
  {
    id: 'residentConnect-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.residentConnect.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.residentConnect.empty.desc',
    data: { items: [] }
  },
  {
    id: 'residentConnect-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.residentConnect.error.title',
    descriptionMessageKey: 'resident.mockScenarios.residentConnect.error.desc',
    data: null,
    errorCode: 'ERR_RESIDENTCONNECT_FAIL'
  },
  {
    id: 'residentConnect-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.residentConnect.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.residentConnect.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'residentConnect-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.residentConnect.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.residentConnect.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
