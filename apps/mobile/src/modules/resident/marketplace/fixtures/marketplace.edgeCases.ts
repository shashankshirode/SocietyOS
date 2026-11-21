import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'marketplace-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.marketplace.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.marketplace.restricted.desc',
    data: null
  },
  {
    id: 'marketplace-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.marketplace.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.marketplace.disabled.desc',
    data: null
  }
];
