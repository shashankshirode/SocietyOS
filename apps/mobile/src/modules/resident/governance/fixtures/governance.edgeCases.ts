import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'governance-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.governance.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.governance.restricted.desc',
    data: null
  },
  {
    id: 'governance-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.governance.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.governance.disabled.desc',
    data: null
  }
];
