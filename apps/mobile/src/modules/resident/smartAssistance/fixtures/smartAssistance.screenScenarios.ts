import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'smartAssistance-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.smartAssistance.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.smartAssistance.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'smartAssistance-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.smartAssistance.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.smartAssistance.loading.desc',
    data: null
  },
  {
    id: 'smartAssistance-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.smartAssistance.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.smartAssistance.empty.desc',
    data: { items: [] }
  },
  {
    id: 'smartAssistance-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.smartAssistance.error.title',
    descriptionMessageKey: 'resident.mockScenarios.smartAssistance.error.desc',
    data: null,
    errorCode: 'ERR_SMARTASSISTANCE_FAIL'
  },
  {
    id: 'smartAssistance-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.smartAssistance.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.smartAssistance.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'smartAssistance-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.smartAssistance.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.smartAssistance.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
