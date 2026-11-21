import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'moveInMoveOut-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.moveInMoveOut.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.moveInMoveOut.restricted.desc',
    data: null
  },
  {
    id: 'moveInMoveOut-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.moveInMoveOut.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.moveInMoveOut.disabled.desc',
    data: null
  }
];
