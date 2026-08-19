import { enMessages } from '../../../../messages/en';
import { residentDashboardMockData } from '../data/dashboard.mockData';
import { createResidentDashboardPersonalization } from '../hooks/useResidentDashboardPersonalization';

describe('ResidentDashboard assurance alerts', () => {
  it('promotes unresolved assurance work to the first owner priority', () => {
    const result = createResidentDashboardPersonalization({
      dashboard: residentDashboardMockData,
      messages: enMessages,
      role: 'RESIDENT_OWNER',
    });

    expect(result.priorities[0]).toMatchObject({
      id: 'visitor-exit-vis-2',
      title: enMessages.visitor.exitAssurance.exitNotConfirmed,
      actionLabel: enMessages.visitor.exitAssurance.confirmLeft,
      iconName: 'shield-half-outline',
      tone: 'warning',
    });
  });
});
