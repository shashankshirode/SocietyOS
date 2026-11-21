import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'smartAssistance-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.smartAssistance.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.smartAssistance.restricted.desc',
    data: null
  },
  {
    id: 'smartAssistance-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.smartAssistance.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.smartAssistance.disabled.desc',
    data: null
  }
];
