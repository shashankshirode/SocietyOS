import * as Notifications from 'expo-notifications';

const mockGetPermissionsAsync = jest.fn();
const mockRequestPermissionsAsync = jest.fn();
const mockSetNotificationChannelAsync = jest.fn();
const mockGetExpoPushTokenAsync = jest.fn();
const mockScheduleNotificationAsync = jest.fn();

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: () => mockGetPermissionsAsync(),
  requestPermissionsAsync: () => mockRequestPermissionsAsync(),
  setNotificationChannelAsync: (...args: readonly [string, Notifications.NotificationChannelInput]) =>
    mockSetNotificationChannelAsync(...args),
  getExpoPushTokenAsync: (...args: readonly [Notifications.ExpoPushTokenOptions]) =>
    mockGetExpoPushTokenAsync(...args),
  scheduleNotificationAsync: (...args: readonly [Notifications.NotificationRequestInput]) =>
    mockScheduleNotificationAsync(...args),
  AndroidImportance: { MAX: 5 },
  AndroidNotificationPriority: { HIGH: 'high' },
}));

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
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

    it('grants permission for local notifications and gracefully skips remote push token in Expo Go', async () => {
      mockGetPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
      mockSetNotificationChannelAsync.mockResolvedValueOnce({});

      const { requestNotificationPermission } = require('../notificationService');
      const result = await requestNotificationPermission();

      expect(result.status).toBe('granted');
      expect(result.expoPushToken).toBe('ExponentPushToken[expo-go-local-only]');
      expect(mockGetExpoPushTokenAsync).not.toHaveBeenCalled();
    });

    it('handles permission denial gracefully in Expo Go', async () => {
      mockGetPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
      mockRequestPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });

      const { requestNotificationPermission } = require('../notificationService');
      const result = await requestNotificationPermission();

      expect(result.status).toBe('denied');
      expect(mockGetExpoPushTokenAsync).not.toHaveBeenCalled();
    });

    it('getExpoPushTokenSafely returns null in Expo Go without invoking getExpoPushTokenAsync', async () => {
      const { getExpoPushTokenSafely } = require('../notificationService');
      const token = await getExpoPushTokenSafely();

      expect(token).toBeNull();
      expect(mockGetExpoPushTokenAsync).not.toHaveBeenCalled();
    });

    it('scheduleLocalTestNotification triggers local notification in Expo Go', async () => {
      mockScheduleNotificationAsync.mockResolvedValueOnce('test-notif-id');

      const { scheduleLocalTestNotification } = require('../notificationService');
      await scheduleLocalTestNotification();

      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'SocietyOS System Test',
          }),
        })
      );
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
      jest.doMock('expo-constants', () => ({
        __esModule: true,
        default: {
          expoConfig: {
            extra: {
              eas: {
                projectId: 'test-project-id',
              },
            },
          },
        },
      }));
    });

    it('retrieves remote push token in development build', async () => {
      mockGetPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
      mockSetNotificationChannelAsync.mockResolvedValueOnce({});
      mockGetExpoPushTokenAsync.mockResolvedValueOnce({ data: 'ExponentPushToken[real_token_123]' });

      const { requestNotificationPermission } = require('../notificationService');
      const result = await requestNotificationPermission();

      expect(result.status).toBe('granted');
      expect(result.expoPushToken).toBe('ExponentPushToken[real_token_123]');
      expect(mockGetExpoPushTokenAsync).toHaveBeenCalledWith({ projectId: 'test-project-id' });
    });
  });
});
