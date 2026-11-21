import type { NotificationPreference } from './notification.types';

const PREFERENCE_SEEDS: NotificationPreference[] = [
  { key: 'visitorAlerts', label: 'Visitor alerts', enabled: true },
  { key: 'complaintUpdates', label: 'Complaint updates', enabled: true },
  { key: 'billingReminders', label: 'Billing reminders', enabled: true },
  { key: 'noticeAnnouncements', label: 'Notice announcements', enabled: true },
  { key: 'emergencyAlerts', label: 'Emergency alerts', enabled: true, important: true },
  { key: 'gateEntryAlerts', label: 'Gate entry alerts', enabled: true },
  { key: 'documentNocUpdates', label: 'Document/NOC updates', enabled: true },
  { key: 'staffAttendanceAlerts', label: 'Staff attendance alerts', enabled: true },
];

let cachedPreferences = [...PREFERENCE_SEEDS];

export function getCachedNotificationPreferences(): NotificationPreference[] {
  return cachedPreferences;
}

export function updateNotificationPreference(key: string, enabled: boolean): void {
  cachedPreferences = cachedPreferences.map((pref) => {
    if (pref.key === key) {
      
      if (pref.important && !enabled) {
        return pref;
      }
      return { ...pref, enabled };
    }
    return pref;
  });
}
