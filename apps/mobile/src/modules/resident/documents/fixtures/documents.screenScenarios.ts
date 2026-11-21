import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'documents-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.documents.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.documents.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'documents-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.documents.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.documents.loading.desc',
    data: null
  },
  {
    id: 'documents-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.documents.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.documents.empty.desc',
    data: { items: [] }
  },
  {
    id: 'documents-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.documents.error.title',
    descriptionMessageKey: 'resident.mockScenarios.documents.error.desc',
    data: null,
    errorCode: 'ERR_DOCUMENTS_FAIL'
  },
  {
    id: 'documents-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.documents.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.documents.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'documents-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.documents.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.documents.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
