import * as Notifications from 'expo-notifications';
import type { NotificationPermissionResult } from './notification.types';
import { configureAndroidNotificationChannel } from './notificationService';

export async function getNotificationPermissionStatus(): Promise<NotificationPermissionResult> {
  const settings = await Notifications.getPermissionsAsync();
  return {
    status: settings.status === 'granted' ? 'granted' : settings.status === 'denied' ? 'denied' : 'undetermined',
    canAskAgain: settings.canAskAgain,
  };
}

export async function requestSystemNotificationPermission(): Promise<NotificationPermissionResult> {
  await configureAndroidNotificationChannel();

  const settings = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  return {
    status: settings.status === 'granted' ? 'granted' : settings.status === 'denied' ? 'denied' : 'undetermined',
    canAskAgain: settings.canAskAgain,
  };
}

export const requestNotificationPermission = requestSystemNotificationPermission;
