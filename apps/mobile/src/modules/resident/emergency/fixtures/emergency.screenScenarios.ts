import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'emergency-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.emergency.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.emergency.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'emergency-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.emergency.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.emergency.loading.desc',
    data: null
  },
  {
    id: 'emergency-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.emergency.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.emergency.empty.desc',
    data: { items: [] }
  },
  {
    id: 'emergency-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.emergency.error.title',
    descriptionMessageKey: 'resident.mockScenarios.emergency.error.desc',
    data: null,
    errorCode: 'ERR_EMERGENCY_FAIL'
  },
  {
    id: 'emergency-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.emergency.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.emergency.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'emergency-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.emergency.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.emergency.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
