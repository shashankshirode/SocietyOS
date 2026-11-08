import { repositorySuccess, withMockDelay } from '../../../../core/repositories/repository.types';
import { getResidentMockRecords } from '../../mock/residentMockRegistry';
import type { ResidentNotificationsRepository } from './residentNotifications.repository.types';
import type {
  ResidentNotification,
  ResidentNotificationCategory,
  ResidentNotificationPreferences,
} from './residentNotifications.types';

const defaultPreferences: ResidentNotificationPreferences = {
  pushEnabled: true,
  inAppEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  criticalAlertsOverride: true,
  categories: {
    security: true,
    billing: true,
    complaints: true,
    notices: true,
    community: true,
  },
};

let userPreferences = { ...defaultPreferences };
const notificationStatusOverrides = new Map<string, 'read' | 'unread'>();
const dynamicNotifications: ResidentNotification[] = [];

const categoryMetadata: Record<
  number,
  {
    category: ResidentNotificationCategory;
    title: string;
    description: string;
    deepLink?: string;
    entityType?: ResidentNotification['entityType'];
    entityId?: string;
  }
> = {
  0: {
    category: 'SECURITY',
    title: 'Visitor Arrived at Gate 1',
    description: 'Ramesh Kumar is waiting for entry confirmation for your unit.',
    deepLink: 'VisitorList',
    entityType: 'visitor',
    entityId: 'vis-101',
  },
  1: {
    category: 'BILLING',
    title: 'Monthly Maintenance Invoice Generated',
    description: 'Maintenance bill for the upcoming cycle is due in 7 days.',
    deepLink: 'BillList',
    entityType: 'bill',
    entityId: 'bill-201',
  },
  2: {
    category: 'COMPLAINTS',
    title: 'Plumbing Service Request Updated',
    description: 'Assigned to technician Rajesh Sharma. Expected visit today between 3-5 PM.',
    deepLink: 'ComplaintList',
    entityType: 'complaint',
    entityId: 'comp-301',
  },
  3: {
    category: 'NOTICES',
    title: 'Overhead Water Tank Cleaning Notice',
    description: 'Scheduled maintenance this Thursday from 10:00 AM to 02:00 PM. Water supply restricted.',
    deepLink: 'NoticeListFromHome',
    entityType: 'notice',
    entityId: 'notice-401',
  },
  4: {
    category: 'COMMUNITY',
    title: 'Community Poll: Lobby Renovation Colors',
    description: 'Cast your vote on the selected lobby color schemes before July 8th.',
    deepLink: 'CommunityHome',
    entityType: 'poll',
    entityId: 'poll-101',
  },
  5: {
    category: 'SECURITY',
    title: 'Delivery Package Received at Security',
    description: 'Amazon courier parcel logged by Gate Guard Vikram Singh.',
    deepLink: 'VisitorList',
    entityType: 'visitor',
    entityId: 'vis-102',
  },
  6: {
    category: 'COMMUNITY',
    title: 'Upcoming Monsoon Tree Plantation Drive',
    description: 'Join society garden committee this Saturday at 9:00 AM at the central lawn.',
    deepLink: 'CommunityHome',
    entityType: 'event',
    entityId: 'event-501',
  },
};

export function emitInAppNotification(notification: ResidentNotification): void {
  dynamicNotifications.unshift(notification);
}

export function getEmittedNotifications(): ResidentNotification[] {
  return [...dynamicNotifications];
}

export function resetNotificationMockState(): void {
  notificationStatusOverrides.clear();
  dynamicNotifications.length = 0;
  userPreferences = { ...defaultPreferences };
}

export const residentNotificationsMockSource: ResidentNotificationsRepository = {
  async list(context) {
    await withMockDelay();
    const staticRecords = getResidentMockRecords(context, 'notifications').map(
      (record) => {
        const meta = categoryMetadata[record.ordinal % 7] ?? categoryMetadata[0]!;
        const status =
          notificationStatusOverrides.get(record.id) ??
          (record.status === 'unread' ? 'unread' : 'read');

        return {
          id: record.id,
          homeContextId: record.homeContextId,
          societyId: record.societyId,
          unitId: record.unitId,
          dataScopeKey: record.dataScopeKey,
          titleMessageKey: record.titleMessageKey,
          descriptionMessageKey: record.descriptionMessageKey,
          title: meta.title,
          description: meta.description,
          category: meta.category,
          status,
          priority:
            record.ordinal % 10 === 0
              ? 'critical'
              : record.ordinal % 4 === 0
              ? 'important'
              : 'normal',
          actionable: record.ordinal % 3 === 0,
          createdAtIso: record.createdAtIso,
          deepLink: meta.deepLink,
          entityType: meta.entityType,
          entityId: meta.entityId,
        };
      }
    );

    const scopedDynamics = dynamicNotifications.filter((n) => {
      const status = notificationStatusOverrides.get(n.id) ?? n.status;
      n.status = status;
      return (
        !context ||
        n.societyId === context.activeHome.societyId ||
        n.homeContextId === context.activeHome.homeContextId
      );
    });

    return repositorySuccess([...scopedDynamics, ...staticRecords]);
  },

  async markAsRead(notificationId) {
    await withMockDelay();
    notificationStatusOverrides.set(notificationId, 'read');
    const dynamicItem = dynamicNotifications.find((n) => n.id === notificationId);
    if (dynamicItem) {
      dynamicItem.status = 'read';
    }
    return repositorySuccess({ success: true, notificationId });
  },

  async markAllAsRead(context) {
    await withMockDelay();
    const staticRecords = getResidentMockRecords(context, 'notifications');
    staticRecords.forEach((record) => {
      notificationStatusOverrides.set(record.id, 'read');
    });
    dynamicNotifications.forEach((item) => {
      if (
        !context ||
        item.societyId === context.activeHome.societyId ||
        item.homeContextId === context.activeHome.homeContextId
      ) {
        item.status = 'read';
        notificationStatusOverrides.set(item.id, 'read');
      }
    });
    return repositorySuccess({
      success: true,
      count: staticRecords.length + dynamicNotifications.length,
    });
  },

  async getPreferences() {
    await withMockDelay();
    return repositorySuccess({ ...userPreferences });
  },

  async updatePreferences(preferences) {
    await withMockDelay();
    userPreferences = { ...userPreferences, ...preferences };
    return repositorySuccess({ ...userPreferences });
  },
};
