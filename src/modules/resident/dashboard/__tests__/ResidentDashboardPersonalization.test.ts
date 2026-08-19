import { enMessages } from '../../../../messages/en';
import { residentDashboardMockData } from '../data/dashboard.mockData';
import { createResidentDashboardPersonalization } from '../hooks/useResidentDashboardPersonalization';

describe('ResidentDashboardPersonalization', () => {
  it('shows assurance work before owner priorities when an alert exists', () => {
    const result = createResidentDashboardPersonalization({
      dashboard: residentDashboardMockData,
      messages: enMessages,
      role: 'RESIDENT_OWNER',
    });

    expect(result.priorities).toHaveLength(4);
    expect(result.priorities.map((priority) => priority.id)).toEqual([
      'visitor-exit-vis-2',
      'act-visitor',
      'act-pay',
      'act-documents',
    ]);
  });

  it('shows assurance work before tenant priorities when an alert exists', () => {
    const result = createResidentDashboardPersonalization({
      dashboard: residentDashboardMockData,
      messages: enMessages,
      role: 'RESIDENT_TENANT',
    });

    expect(result.priorities).toHaveLength(4);
    expect(result.priorities.map((priority) => priority.id)).toEqual([
      'visitor-exit-vis-2',
      'act-visitor',
      'act-pay',
      'act-documents',
    ]);
  });

  it('hides owner-sensitive actions for family members', () => {
    const result = createResidentDashboardPersonalization({
      dashboard: residentDashboardMockData,
      messages: enMessages,
      role: 'RESIDENT_FAMILY',
    });

    expect(result.commandActions.map((action) => action.id)).not.toContain('act-pay');
    expect(result.commandActions.map((action) => action.id)).not.toContain('act-noc');
  });
});
