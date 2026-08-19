import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export function registerNotificationListeners(): () => void {
  const receiveSubscription = Notifications.addNotificationReceivedListener((notification) => {});

  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {});

  return () => {
    receiveSubscription.remove();
    responseSubscription.remove();
  };
}
