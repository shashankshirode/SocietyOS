import type { VisitorExitAlert } from '../../../../shared/types/visitor.types';

export type VisitorExitNotification = {
  id: string;
  titleKey: 'resident.notifications.visitorExitAlertTitle';
  bodyMessageKey: 'resident.notifications.visitorExitAlertBody';
  visitorName: string;
  priority: VisitorExitAlert['priority'];
  visitorPassId: string;
};

export type VisitorExitNotificationPermissionState = 'granted' | 'denied' | 'unavailable';
