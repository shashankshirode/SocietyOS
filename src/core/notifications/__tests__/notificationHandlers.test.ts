type NotificationHandlerInput = {
  handleNotification: () => Promise<{
    shouldShowAlert: boolean;
    shouldPlaySound: boolean;
    shouldSetBadge: boolean;
    shouldShowBanner: boolean;
    shouldShowList: boolean;
  }>;
};

type GenericCallback = (data: { readonly type?: string; readonly data?: string }) => void;

const mockAddNotificationReceivedListener = jest.fn();
const mockAddNotificationResponseReceivedListener = jest.fn();
const mockAddPushTokenListener = jest.fn();
const mockSetNotificationHandler = jest.fn();

jest.mock('expo-notifications', () => ({
  setNotificationHandler: (handler: NotificationHandlerInput) => mockSetNotificationHandler(handler),
  addNotificationReceivedListener: (cb: GenericCallback) => mockAddNotificationReceivedListener(cb),
  addNotificationResponseReceivedListener: (cb: GenericCallback) => mockAddNotificationResponseReceivedListener(cb),
  addPushTokenListener: (cb: GenericCallback) => mockAddPushTokenListener(cb),
}));

describe('notificationHandlers', () => {
  const receiveRemoveMock = jest.fn();
  const responseRemoveMock = jest.fn();
  const pushTokenRemoveMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockAddNotificationReceivedListener.mockReturnValue({ remove: receiveRemoveMock });
    mockAddNotificationResponseReceivedListener.mockReturnValue({ remove: responseRemoveMock });
    mockAddPushTokenListener.mockReturnValue({ remove: pushTokenRemoveMock });
  });

  describe('Expo Go environment', () => {
    beforeEach(() => {
      jest.doMock('../notificationCapabilities', () => ({
        __esModule: true,
        isExpoGo: true,
        canUseRemotePushNotifications: false,
        canUseLocalNotifications: true,
        logRemotePushUnavailableReason: jest.fn(),
      }));
    });

    it('registers only local notification listeners and skips addPushTokenListener in Expo Go', () => {
      const { registerNotificationListeners } = require('../notificationHandlers');
      const unsubscribe = registerNotificationListeners();

      expect(mockAddNotificationReceivedListener).toHaveBeenCalledTimes(1);
      expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledTimes(1);
      expect(mockAddPushTokenListener).not.toHaveBeenCalled();

      unsubscribe();

      expect(receiveRemoveMock).toHaveBeenCalledTimes(1);
      expect(responseRemoveMock).toHaveBeenCalledTimes(1);
      expect(pushTokenRemoveMock).not.toHaveBeenCalled();
    });

    it('registerPushTokenListener returns null in Expo Go and does not call addPushTokenListener', () => {
      const { registerPushTokenListener } = require('../notificationHandlers');
      const unsubscribe = registerPushTokenListener(jest.fn());

      expect(unsubscribe).toBeNull();
      expect(mockAddPushTokenListener).not.toHaveBeenCalled();
    });
  });

  describe('Development and Production builds', () => {
    beforeEach(() => {
      jest.doMock('../notificationCapabilities', () => ({
        __esModule: true,
        isExpoGo: false,
        canUseRemotePushNotifications: true,
        canUseLocalNotifications: true,
        logRemotePushUnavailableReason: jest.fn(),
      }));
    });

    it('registers push token listener along with received/response listeners in dev build', () => {
      const { registerNotificationListeners } = require('../notificationHandlers');
      const unsubscribe = registerNotificationListeners();

      expect(mockAddNotificationReceivedListener).toHaveBeenCalledTimes(1);
      expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledTimes(1);
      expect(mockAddPushTokenListener).toHaveBeenCalledTimes(1);

      unsubscribe();

      expect(receiveRemoveMock).toHaveBeenCalledTimes(1);
      expect(responseRemoveMock).toHaveBeenCalledTimes(1);
      expect(pushTokenRemoveMock).toHaveBeenCalledTimes(1);
    });

    it('registerPushTokenListener registers listener and returns unsubscribe function in dev build', () => {
      const { registerPushTokenListener } = require('../notificationHandlers');
      const callback = jest.fn();
      const unsubscribe = registerPushTokenListener(callback);

      expect(mockAddPushTokenListener).toHaveBeenCalledWith(callback);
      expect(typeof unsubscribe).toBe('function');

      unsubscribe();
      expect(pushTokenRemoveMock).toHaveBeenCalledTimes(1);
    });
  });
});
