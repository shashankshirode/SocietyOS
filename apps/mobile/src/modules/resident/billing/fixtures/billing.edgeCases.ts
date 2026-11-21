import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'billing-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.billing.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.billing.restricted.desc',
    data: null
  },
  {
    id: 'billing-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.billing.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.billing.disabled.desc',
    data: null
  }
];
