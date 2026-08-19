import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'interFlatIssues-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.interFlatIssues.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.interFlatIssues.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'interFlatIssues-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.interFlatIssues.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.interFlatIssues.loading.desc',
    data: null
  },
  {
    id: 'interFlatIssues-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.interFlatIssues.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.interFlatIssues.empty.desc',
    data: { items: [] }
  },
  {
    id: 'interFlatIssues-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.interFlatIssues.error.title',
    descriptionMessageKey: 'resident.mockScenarios.interFlatIssues.error.desc',
    data: null,
    errorCode: 'ERR_INTERFLATISSUES_FAIL'
  },
  {
    id: 'interFlatIssues-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.interFlatIssues.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.interFlatIssues.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'interFlatIssues-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.interFlatIssues.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.interFlatIssues.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
