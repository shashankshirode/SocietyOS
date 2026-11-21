import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'billing-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.billing.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.billing.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'billing-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.billing.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.billing.loading.desc',
    data: null
  },
  {
    id: 'billing-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.billing.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.billing.empty.desc',
    data: { items: [] }
  },
  {
    id: 'billing-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.billing.error.title',
    descriptionMessageKey: 'resident.mockScenarios.billing.error.desc',
    data: null,
    errorCode: 'ERR_BILLING_FAIL'
  },
  {
    id: 'billing-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.billing.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.billing.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'billing-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.billing.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.billing.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
