import { ExecutionEnvironment } from 'expo-constants';

describe('notificationCapabilities', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('detects Expo Go when executionEnvironment is StoreClient', () => {
    jest.doMock('expo-constants', () => ({
      __esModule: true,
      default: {
        executionEnvironment: ExecutionEnvironment.StoreClient,
        appOwnership: null,
      },
      ExecutionEnvironment: {
        Bare: 'bare',
        Standalone: 'standalone',
        StoreClient: 'storeClient',
      },
    }));
    jest.doMock('expo-device', () => ({
      __esModule: true,
      isDevice: true,
    }));
    jest.doMock('expo', () => ({
      __esModule: true,
      isRunningInExpoGo: () => true,
    }));

    const capabilities = require('../notificationCapabilities');
    expect(capabilities.isExpoGo).toBe(true);
    expect(capabilities.canUseRemotePushNotifications).toBe(false);
    expect(capabilities.canUseLocalNotifications).toBe(true);
  });

  it('detects development build or native build on physical device', () => {
    jest.doMock('expo-constants', () => ({
      __esModule: true,
      default: {
        executionEnvironment: ExecutionEnvironment.Bare,
        appOwnership: null,
      },
      ExecutionEnvironment: {
        Bare: 'bare',
        Standalone: 'standalone',
        StoreClient: 'storeClient',
      },
    }));
    jest.doMock('expo-device', () => ({
      __esModule: true,
      isDevice: true,
    }));
    jest.doMock('expo', () => ({
      __esModule: true,
      isRunningInExpoGo: () => false,
    }));

    const capabilities = require('../notificationCapabilities');
    expect(capabilities.isExpoGo).toBe(false);
    expect(capabilities.canUseRemotePushNotifications).toBe(true);
    expect(capabilities.canUseLocalNotifications).toBe(true);
  });

  it('detects simulator/emulator where remote push is not available', () => {
    jest.doMock('expo-constants', () => ({
      __esModule: true,
      default: {
        executionEnvironment: ExecutionEnvironment.Standalone,
        appOwnership: null,
      },
      ExecutionEnvironment: {
        Bare: 'bare',
        Standalone: 'standalone',
        StoreClient: 'storeClient',
      },
    }));
    jest.doMock('expo-device', () => ({
      __esModule: true,
      isDevice: false,
    }));
    jest.doMock('expo', () => ({
      __esModule: true,
      isRunningInExpoGo: () => false,
    }));

    const capabilities = require('../notificationCapabilities');
    expect(capabilities.isExpoGo).toBe(false);
    expect(capabilities.canUseRemotePushNotifications).toBe(false);
    expect(capabilities.canUseLocalNotifications).toBe(true);
  });
});
