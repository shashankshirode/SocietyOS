import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'moveInMoveOut-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.moveInMoveOut.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.moveInMoveOut.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'moveInMoveOut-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.moveInMoveOut.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.moveInMoveOut.loading.desc',
    data: null
  },
  {
    id: 'moveInMoveOut-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.moveInMoveOut.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.moveInMoveOut.empty.desc',
    data: { items: [] }
  },
  {
    id: 'moveInMoveOut-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.moveInMoveOut.error.title',
    descriptionMessageKey: 'resident.mockScenarios.moveInMoveOut.error.desc',
    data: null,
    errorCode: 'ERR_MOVEINMOVEOUT_FAIL'
  },
  {
    id: 'moveInMoveOut-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.moveInMoveOut.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.moveInMoveOut.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'moveInMoveOut-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.moveInMoveOut.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.moveInMoveOut.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
