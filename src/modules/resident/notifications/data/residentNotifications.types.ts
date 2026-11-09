export type ResidentNotificationStatus = 'unread' | 'read';
export type ResidentNotificationPriority = 'normal' | 'important' | 'critical';
export type ResidentNotificationCategory =
  | 'ALL'
  | 'SECURITY'
  | 'BILLING'
  | 'COMPLAINTS'
  | 'NOTICES'
  | 'COMMUNITY'
  | 'SYSTEM';

export type ResidentNotification = {
  id: string;
  homeContextId: string;
  societyId: string;
  unitId: string;
  dataScopeKey: string;
  titleMessageKey?: 'resident.mockData.recordTitle' | string;
  descriptionMessageKey?: 'resident.mockData.recordDescription' | string;
  title?: string;
  description?: string;
  category?: ResidentNotificationCategory;
  status: ResidentNotificationStatus;
  priority: ResidentNotificationPriority;
  actionable: boolean;
  createdAtIso: string;
  deepLink?: string;
  entityType?: 'visitor' | 'bill' | 'complaint' | 'notice' | 'poll' | 'event' | 'message';
  entityId?: string;
};

export type NotificationFilterCategory = 'ALL' | 'SECURITY' | 'BILLING' | 'COMPLAINTS' | 'NOTICES' | 'COMMUNITY';

export type ResidentNotificationPreferences = {
  pushEnabled: boolean;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  criticalAlertsOverride: boolean;
  categories: {
    security: boolean;
    billing: boolean;
    complaints: boolean;
    notices: boolean;
    community: boolean;
  };
};
