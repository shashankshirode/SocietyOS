import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'governance-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.governance.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.governance.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'governance-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.governance.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.governance.loading.desc',
    data: null
  },
  {
    id: 'governance-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.governance.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.governance.empty.desc',
    data: { items: [] }
  },
  {
    id: 'governance-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.governance.error.title',
    descriptionMessageKey: 'resident.mockScenarios.governance.error.desc',
    data: null,
    errorCode: 'ERR_GOVERNANCE_FAIL'
  },
  {
    id: 'governance-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.governance.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.governance.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'governance-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.governance.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.governance.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
