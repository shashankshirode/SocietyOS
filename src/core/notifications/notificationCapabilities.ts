import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import { isRunningInExpoGo } from 'expo';

function resolveIsExpoGo(): boolean {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return true;
  }
  if (typeof isRunningInExpoGo === 'function' && isRunningInExpoGo()) {
    return true;
  }
  if (Constants.appOwnership === 'expo') {
    return true;
  }
  return false;
}

export const isExpoGo: boolean = resolveIsExpoGo();

export const canUseRemotePushNotifications: boolean = !isExpoGo && Device.isDevice;

export const canUseLocalNotifications: boolean = true;

export function logRemotePushUnavailableReason(): void {
  if (isExpoGo) {
    console.info('[Notifications] Remote push notifications disabled in Expo Go. Use a development build for push tokens.');
  } else if (!Device.isDevice) {
    console.info('[Notifications] Remote push notifications are not available on simulators or virtual devices.');
  }
}
