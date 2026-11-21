import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'dashboard-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.dashboard.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.dashboard.restricted.desc',
    data: null
  },
  {
    id: 'dashboard-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.dashboard.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.dashboard.disabled.desc',
    data: null
  }
];
