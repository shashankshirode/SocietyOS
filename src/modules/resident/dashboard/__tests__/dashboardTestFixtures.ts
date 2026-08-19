import { enMessages } from '../../../../messages/en';
import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import { mapContextToActive } from '../../homeContext/state/residentHomeContext.store';
import { getScopedDashboardData } from '../data/dashboard.mockSource';
import type { ResidentDashboardData } from '../data/dashboard.types';
import { createResidentDashboardPersonalization } from '../hooks/useResidentDashboardPersonalization';

export function getDashboardFixture(contextId = 'context-001'): ResidentDashboardData {
  const home = mockResidentHomeContexts.find((item) => item.homeContextId === contextId);
  if (!home) throw new Error(`Missing dashboard test context: ${contextId}`);
  const activeHome = mapContextToActive(home);
  return getScopedDashboardData({ activeHome, dataScopeKey: activeHome.dataScopeKey });
}

export function getDashboardExperience(contextId = 'context-001') {
  return createResidentDashboardPersonalization({
    dashboard: getDashboardFixture(contextId),
    messages: enMessages,
    role: contextId === 'context-003' ? 'RESIDENT_TENANT' : 'RESIDENT_OWNER',
  });
}

export const dashboardNoop = () => undefined;
