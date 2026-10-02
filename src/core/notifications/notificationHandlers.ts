import * as Notifications from 'expo-notifications';
import {
  canUseRemotePushNotifications,
  isExpoGo,
  logRemotePushUnavailableReason,
} from './notificationCapabilities';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationReceivedListener = (notification: Notifications.Notification) => void;
export type NotificationResponseListener = (response: Notifications.NotificationResponse) => void;
export type DevicePushTokenListener = (token: Notifications.DevicePushToken) => void;

export interface NotificationListenersConfig {
  onNotificationReceived?: NotificationReceivedListener;
  onNotificationResponse?: NotificationResponseListener;
  onPushTokenRefresh?: DevicePushTokenListener;
}

export function registerNotificationListeners(config?: NotificationListenersConfig): () => void {
  const receiveSubscription = Notifications.addNotificationReceivedListener((notification) => {
    config?.onNotificationReceived?.(notification);
  });

  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    config?.onNotificationResponse?.(response);
  });

  const pushTokenSubscription = canUseRemotePushNotifications
    ? Notifications.addPushTokenListener((token) => {
        config?.onPushTokenRefresh?.(token);
      })
    : null;

  if (!canUseRemotePushNotifications && isExpoGo) {
    console.info('[Notifications] Push token listener registration skipped in Expo Go.');
  }

  return () => {
    receiveSubscription.remove();
    responseSubscription.remove();
    pushTokenSubscription?.remove();
  };
}

export function registerPushTokenListener(
  listener: DevicePushTokenListener
): (() => void) | null {
  if (!canUseRemotePushNotifications) {
    logRemotePushUnavailableReason();
    return null;
  }

  const subscription = Notifications.addPushTokenListener(listener);
  return () => {
    subscription.remove();
  };
}
