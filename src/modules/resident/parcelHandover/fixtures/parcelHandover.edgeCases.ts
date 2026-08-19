import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'parcelHandover-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.parcelHandover.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.parcelHandover.restricted.desc',
    data: null
  },
  {
    id: 'parcelHandover-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.parcelHandover.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.parcelHandover.disabled.desc',
    data: null
  }
];
