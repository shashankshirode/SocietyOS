import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'parcelHandover-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.parcelHandover.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.parcelHandover.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'parcelHandover-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.parcelHandover.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.parcelHandover.loading.desc',
    data: null
  },
  {
    id: 'parcelHandover-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.parcelHandover.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.parcelHandover.empty.desc',
    data: { items: [] }
  },
  {
    id: 'parcelHandover-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.parcelHandover.error.title',
    descriptionMessageKey: 'resident.mockScenarios.parcelHandover.error.desc',
    data: null,
    errorCode: 'ERR_PARCELHANDOVER_FAIL'
  },
  {
    id: 'parcelHandover-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.parcelHandover.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.parcelHandover.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'parcelHandover-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.parcelHandover.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.parcelHandover.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
