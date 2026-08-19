import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'complaints-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.complaints.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.complaints.restricted.desc',
    data: null
  },
  {
    id: 'complaints-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.complaints.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.complaints.disabled.desc',
    data: null
  }
];
