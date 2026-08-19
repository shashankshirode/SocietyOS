import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'noc-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.noc.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.noc.restricted.desc',
    data: null
  },
  {
    id: 'noc-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.noc.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.noc.disabled.desc',
    data: null
  }
];
