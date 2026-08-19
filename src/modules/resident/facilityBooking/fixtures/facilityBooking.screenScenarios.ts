import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'facilityBooking-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.facilityBooking.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.facilityBooking.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'facilityBooking-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.facilityBooking.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.facilityBooking.loading.desc',
    data: null
  },
  {
    id: 'facilityBooking-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.facilityBooking.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.facilityBooking.empty.desc',
    data: { items: [] }
  },
  {
    id: 'facilityBooking-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.facilityBooking.error.title',
    descriptionMessageKey: 'resident.mockScenarios.facilityBooking.error.desc',
    data: null,
    errorCode: 'ERR_FACILITYBOOKING_FAIL'
  },
  {
    id: 'facilityBooking-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.facilityBooking.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.facilityBooking.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'facilityBooking-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.facilityBooking.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.facilityBooking.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
