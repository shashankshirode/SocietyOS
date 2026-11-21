import { mapVisitorExitAlertToNotification } from '../notifications/visitorExitNotificationMapper';

describe('visitorExitNotificationMapper', () => {
  it('maps alert identity and priority into notification metadata', () => {
    expect(
      mapVisitorExitAlertToNotification({
        id: 'exit-alert-vis-1',
        visitorPassId: 'vis-1',
        visitorName: 'Amazon Delivery',
        visitorCategory: 'delivery',
        priority: 'high',
        expectedExitAtIso: '2026-07-09T11:50:00.000Z',
        alertDueAtIso: '2026-07-09T12:00:00.000Z',
        elapsedMinutes: 42,
        status: 'sent',
      })
    ).toEqual({
      id: 'notification-exit-alert-vis-1',
      titleKey: 'resident.notifications.visitorExitAlertTitle',
      bodyMessageKey: 'resident.notifications.visitorExitAlertBody',
      visitorName: 'Amazon Delivery',
      priority: 'high',
      visitorPassId: 'vis-1',
    });
  });
});
