import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'parking-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.parking.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.parking.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'parking-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.parking.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.parking.loading.desc',
    data: null
  },
  {
    id: 'parking-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.parking.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.parking.empty.desc',
    data: { items: [] }
  },
  {
    id: 'parking-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.parking.error.title',
    descriptionMessageKey: 'resident.mockScenarios.parking.error.desc',
    data: null,
    errorCode: 'ERR_PARKING_FAIL'
  },
  {
    id: 'parking-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.parking.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.parking.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'parking-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.parking.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.parking.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
