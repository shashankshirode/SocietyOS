import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const edgeCases: PageScenario<JsonObject | null>[] = [
  {
    id: 'facilityBooking-edge-permissionRestricted',
    kind: 'permissionRestricted',
    titleMessageKey: 'resident.mockScenarios.facilityBooking.restricted.title',
    descriptionMessageKey: 'resident.mockScenarios.facilityBooking.restricted.desc',
    data: null
  },
  {
    id: 'facilityBooking-edge-featureDisabled',
    kind: 'featureDisabled',
    titleMessageKey: 'resident.mockScenarios.facilityBooking.disabled.title',
    descriptionMessageKey: 'resident.mockScenarios.facilityBooking.disabled.desc',
    data: null
  }
];
