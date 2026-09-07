import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { NotificationSetupResult } from './notification.types';
import { getErrorMessage } from '../errors/getErrorMessage';

const isExpoGo = Constants.appOwnership === 'expo';

export async function configureAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

export async function requestNotificationPermission(): Promise<NotificationSetupResult> {
  if (!Device.isDevice) {
    return {
      status: 'unavailable',
      expoPushToken: 'ExponentPushToken[mock_simulator_token]',
      message: 'Push notifications are not available on virtual devices/simulators.',
    };
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return {
        status: 'denied',
        message: 'Notification permission was denied by the user.',
      };
    }

    await configureAndroidNotificationChannel();

    if (isExpoGo) {
      return {
        status: 'granted',
        expoPushToken: 'ExponentPushToken[expo-go-local-only]',
        message: 'Permission granted. Push notifications require a development build. Local notifications will work.',
      };
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      return {
        status: 'granted',
        expoPushToken: 'ExponentPushToken[mock_missing_project_id_token]',
        message: 'Permission granted, but EAS project ID is missing in expo config.',
      };
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return {
      status: 'granted',
      expoPushToken: tokenData.data,
      message: 'Push notification service configured successfully.',
    };
  } catch (error) {
    return {
      status: 'error',
      message: getErrorMessage(error, 'An error occurred during push notification setup.'),
    };
  }
}

export async function scheduleLocalTestNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'SocietyOS System Test',
      body: 'This is a local test notification verifying your device capabilities.',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
}
