import type { ResidentNotification } from '../data/residentNotifications.types';
import type { RootTabParamList } from '../../../../app/navigation/navigation.types';

export interface NotificationDestination {
  tabName: keyof RootTabParamList;
  screenName: string;
  params?: Record<string, unknown>;
}

export function resolveNotificationDestination(notification: ResidentNotification): NotificationDestination | null {
  const { category, entityType, entityId, deepLink } = notification;

  if (deepLink && entityType && entityId) {
    switch (entityType) {
      case 'visitor':
        return {
          tabName: 'VisitorTab',
          screenName: 'VisitorDetail',
          params: { visitorId: entityId },
        };
      case 'bill':
        return {
          tabName: 'BillTab',
          screenName: 'BillDetail',
          params: { billId: entityId },
        };
      case 'complaint':
        return {
          tabName: 'ComplaintTab',
          screenName: 'ComplaintDetail',
          params: { complaintId: entityId },
        };
      case 'notice':
        return {
          tabName: 'HomeTab',
          screenName: 'NoticeDetailFromHome',
          params: { noticeId: entityId },
        };
      case 'poll':
      case 'event':
        return {
          tabName: 'CommunityTab',
          screenName: 'CommunityHome',
          params: { entityId, entityType },
        };
    }
  }

  if (deepLink) {
    switch (category) {
      case 'SECURITY':
        return {
          tabName: 'VisitorTab',
          screenName: 'VisitorList',
          params: {},
        };
      case 'BILLING':
        return {
          tabName: 'BillTab',
          screenName: 'BillList',
          params: {},
        };
      case 'COMPLAINTS':
        return {
          tabName: 'ComplaintTab',
          screenName: 'ComplaintList',
          params: {},
        };
      case 'NOTICES':
        return {
          tabName: 'HomeTab',
          screenName: 'NoticeListFromHome',
          params: {},
        };
      case 'COMMUNITY':
        return {
          tabName: 'CommunityTab',
          screenName: 'CommunityHome',
          params: {},
        };
    }
  }

  switch (category) {
    case 'SECURITY':
      return { tabName: 'VisitorTab', screenName: 'VisitorList', params: {} };
    case 'BILLING':
      return { tabName: 'BillTab', screenName: 'BillList', params: {} };
    case 'COMPLAINTS':
      return { tabName: 'ComplaintTab', screenName: 'ComplaintList', params: {} };
    case 'NOTICES':
      return { tabName: 'HomeTab', screenName: 'NoticeListFromHome', params: {} };
    case 'COMMUNITY':
      return { tabName: 'CommunityTab', screenName: 'CommunityHome', params: {} };
    default:
      return null;
  }
}

export default resolveNotificationDestination;