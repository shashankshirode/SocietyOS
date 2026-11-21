import { enMessages } from '../../../../messages/en';
import { residentDashboardMockData } from '../data/dashboard.mockData';
import { createResidentDashboardPersonalization } from '../hooks/useResidentDashboardPersonalization';

describe('ResidentDashboard refined experience model', () => {
  it('derives priority, pulse, command and shelf data without null labels', () => {
    const result = createResidentDashboardPersonalization({
      dashboard: residentDashboardMockData,
      messages: enMessages,
      role: 'RESIDENT_OWNER',
    });

    expect(result.priorities.every((item) => item.title && item.actionLabel)).toBe(true);
    expect(result.pulse.items.every((item) => item.label && item.value)).toBe(true);
    expect(result.commandActions.every((item) => item.label && item.accessibilityLabel)).toBe(true);
    expect(result.moduleShelfItems.every((item) => item.label && item.description)).toBe(true);
  });
});
