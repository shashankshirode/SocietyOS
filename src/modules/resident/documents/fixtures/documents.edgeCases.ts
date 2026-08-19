import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'documents-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.documents.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.documents.restricted.desc',
    data: null
  },
  {
    id: 'documents-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.documents.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.documents.disabled.desc',
    data: null
  }
];
