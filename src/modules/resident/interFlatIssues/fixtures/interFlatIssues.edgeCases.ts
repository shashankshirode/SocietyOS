import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'interFlatIssues-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.interFlatIssues.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.interFlatIssues.restricted.desc',
    data: null
  },
  {
    id: 'interFlatIssues-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.interFlatIssues.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.interFlatIssues.disabled.desc',
    data: null
  }
];
