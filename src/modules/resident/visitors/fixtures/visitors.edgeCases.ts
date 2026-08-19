import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'visitors-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.visitors.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.visitors.restricted.desc',
    data: null
  },
  {
    id: 'visitors-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.visitors.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.visitors.disabled.desc',
    data: null
  }
];
