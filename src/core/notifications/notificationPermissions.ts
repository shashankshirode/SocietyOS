import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { NotificationPermissionResult } from './notification.types';

export async function getNotificationPermissionStatus(): Promise<NotificationPermissionResult> {
  const settings = await Notifications.getPermissionsAsync();
  return {
    status: settings.status === 'granted' ? 'granted' : settings.status === 'denied' ? 'denied' : 'undetermined',
    canAskAgain: settings.canAskAgain,
  };
}

export async function requestNotificationPermission(): Promise<NotificationPermissionResult> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

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
