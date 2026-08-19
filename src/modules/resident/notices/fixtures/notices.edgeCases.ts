import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'notices-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.notices.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.notices.restricted.desc',
    data: null
  },
  {
    id: 'notices-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.notices.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.notices.disabled.desc',
    data: null
  }
];
