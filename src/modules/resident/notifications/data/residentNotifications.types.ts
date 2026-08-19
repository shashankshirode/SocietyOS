export type ResidentNotificationStatus = 'unread' | 'read';
export type ResidentNotificationPriority = 'normal' | 'important' | 'critical';

export type ResidentNotification = {
  id: string;
  homeContextId: string;
  societyId: string;
  unitId: string;
  dataScopeKey: string;
  titleMessageKey: 'resident.mockData.recordTitle';
  descriptionMessageKey: 'resident.mockData.recordDescription';
  status: ResidentNotificationStatus;
  priority: ResidentNotificationPriority;
  actionable: boolean;
  createdAtIso: string;
};
