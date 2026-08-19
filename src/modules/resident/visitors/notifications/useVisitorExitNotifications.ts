import { useMemo } from 'react';
import { deriveVisitorExitAlerts } from '../utils/contextualVisitorExitStatus';
import { mapVisitorExitAlertsToNotifications } from './visitorExitNotificationMapper';
import type { Visitor } from '../../../../shared/types/visitor.types';
import type { VisitorExitNotificationPermissionState } from './visitorExitNotification.types';

export function useVisitorExitNotifications(visitors: Visitor[]) {
  const permissionState = 'unavailable' satisfies VisitorExitNotificationPermissionState;

  const alerts = useMemo(() => deriveVisitorExitAlerts(visitors), [visitors]);
  const notifications = useMemo(() => mapVisitorExitAlertsToNotifications(alerts), [alerts]);

  return {
    alerts,
    notifications,
    permissionState,
    canScheduleLocalNotification: false,
  };
}
