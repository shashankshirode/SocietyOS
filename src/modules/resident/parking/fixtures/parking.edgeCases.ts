import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'parking-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.parking.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.parking.restricted.desc',
    data: null
  },
  {
    id: 'parking-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.parking.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.parking.disabled.desc',
    data: null
  }
];
