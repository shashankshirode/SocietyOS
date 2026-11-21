import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'profile-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.profile.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.profile.restricted.desc',
    data: null
  },
  {
    id: 'profile-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.profile.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.profile.disabled.desc',
    data: null
  }
];
