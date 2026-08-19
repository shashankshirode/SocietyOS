import type { PageScenario } from '../../../../shared/mock/mockScenario.types';

export const screenScenarios: PageScenario<JsonObject | null>[] = [
  {
    id: 'profile-scenario-normal',
    kind: 'normal',
    titleMessageKey: 'resident.mockScenarios.profile.normal.title',
    descriptionMessageKey: 'resident.mockScenarios.profile.normal.desc',
    data: { isLoaded: true, items: [] }
  },
  {
    id: 'profile-scenario-loading',
    kind: 'loading',
    titleMessageKey: 'resident.mockScenarios.profile.loading.title',
    descriptionMessageKey: 'resident.mockScenarios.profile.loading.desc',
    data: null
  },
  {
    id: 'profile-scenario-empty',
    kind: 'empty',
    titleMessageKey: 'resident.mockScenarios.profile.empty.title',
    descriptionMessageKey: 'resident.mockScenarios.profile.empty.desc',
    data: { items: [] }
  },
  {
    id: 'profile-scenario-error',
    kind: 'error',
    titleMessageKey: 'resident.mockScenarios.profile.error.title',
    descriptionMessageKey: 'resident.mockScenarios.profile.error.desc',
    data: null,
    errorCode: 'ERR_PROFILE_FAIL'
  },
  {
    id: 'profile-scenario-longContent',
    kind: 'longContent',
    titleMessageKey: 'resident.mockScenarios.profile.longContent.title',
    descriptionMessageKey: 'resident.mockScenarios.profile.longContent.desc',
    data: {
      isLoaded: true,
      items: [],
      longLabel: 'Green Valley Heights Phase 2 Cooperative Housing Society A-1204 / Tower B / East Wing / Basement Parking P2-184 Maintenance Bill July 2026 with Previous Month Adjustment'
    }
  },
  {
    id: 'profile-scenario-tablet',
    kind: 'tablet',
    titleMessageKey: 'resident.mockScenarios.profile.tablet.title',
    descriptionMessageKey: 'resident.mockScenarios.profile.tablet.desc',
    data: { isLoaded: true, isTablet: true, items: [] }
  }
];
