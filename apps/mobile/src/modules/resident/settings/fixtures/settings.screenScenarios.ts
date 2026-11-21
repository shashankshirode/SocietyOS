import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'settings-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.settings.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.settings.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'settings-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.settings.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.settings.loading.desc',
    data: null
  },
  {
    id: 'settings-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.settings.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.settings.empty.desc',
    data: { items: [] }
  },
  {
    id: 'settings-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.settings.error.title',
    descriptionMessageKey: 'resident.mockScenarios.settings.error.desc',
    data: null,
    errorCode: 'ERR_SETTINGS_FAIL'
  },
  {
    id: 'settings-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.settings.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.settings.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'settings-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.settings.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.settings.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
