import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'settings-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.settings.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.settings.restricted.desc',
    data: null
  },
  {
    id: 'settings-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.settings.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.settings.disabled.desc',
    data: null
  }
];
