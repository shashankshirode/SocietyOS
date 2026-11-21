export const residentNotificationsMessages = {
  visitorExitAlertTitle: 'Visitor exit not confirmed',
  visitorExitAlertBody: (name: string) => `Security has not marked ${name} as exited.`,
  permissionUnavailable: 'Notification permission is unavailable in mock mode.',
} as const;
