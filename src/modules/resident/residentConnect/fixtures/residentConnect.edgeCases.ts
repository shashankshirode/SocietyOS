import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'residentConnect-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.residentConnect.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.residentConnect.restricted.desc',
    data: null
  },
  {
    id: 'residentConnect-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.residentConnect.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.residentConnect.disabled.desc',
    data: null
  }
];
