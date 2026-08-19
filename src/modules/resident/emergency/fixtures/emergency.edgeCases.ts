import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'emergency-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.emergency.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.emergency.restricted.desc',
    data: null
  },
  {
    id: 'emergency-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.emergency.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.emergency.disabled.desc',
    data: null
  }
];
