import type { VisitorExitAlert } from '../../../../shared/types/visitor.types';
import type { VisitorExitNotification } from './visitorExitNotification.types';

export function mapVisitorExitAlertToNotification(alert: VisitorExitAlert): VisitorExitNotification {
  return {
    id: `notification-${alert.id}`,
    titleKey: 'resident.notifications.visitorExitAlertTitle',
    bodyMessageKey: 'resident.notifications.visitorExitAlertBody',
    visitorName: alert.visitorName,
    priority: alert.priority,
    visitorPassId: alert.visitorPassId,
  };
}

export function mapVisitorExitAlertsToNotifications(alerts: VisitorExitAlert[]): VisitorExitNotification[] {
  return alerts.map(mapVisitorExitAlertToNotification);
}
