import { enMessages } from '../../../../messages/en';
import { dashboardResidenceProfiles } from '../data/dashboard.residenceProfiles';
import { createResidentDashboardPersonalization } from '../hooks/useResidentDashboardPersonalization';
import { getScopedDashboardData } from '../data/dashboard.mockSource';
import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import { mapContextToActive } from '../../homeContext/state/residentHomeContext.store';

describe('TodayCommandCentreDuplicateKeys', () => {
  it('ensures that all mock profiles have unique reminder and priority action IDs', () => {
    Object.entries(dashboardResidenceProfiles).forEach(([key, profile]) => {
      const reminderIds = profile.reminders.map((r) => r.id);
      const uniqueReminderIds = new Set(reminderIds);
      expect(reminderIds.length).toBe(uniqueReminderIds.size);

      const actionIds = profile.priorityActions.map((a) => a.id);
      const uniqueActionIds = new Set(actionIds);
      expect(actionIds.length).toBe(uniqueActionIds.size);
    });
  });

  it('ensures that personalization does not generate priority items with duplicate IDs for any context', () => {
    mockResidentHomeContexts.forEach((home) => {
      const activeHome = mapContextToActive(home);
      const dashboard = getScopedDashboardData({ activeHome, dataScopeKey: activeHome.dataScopeKey });

      const roles = ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY'] as const;
      roles.forEach((role) => {
        const personalization = createResidentDashboardPersonalization({
          dashboard,
          messages: enMessages,
          role,
        });

        const priorityIds = personalization.priorities.map((p) => p.id);
        const uniquePriorityIds = new Set(priorityIds);

        
        expect(priorityIds.length).toBe(uniquePriorityIds.size);
      });
    });
  });
});
