import { Camera } from 'expo-camera';
import type { DevicePermissionResult } from './devicePermission.types';

export async function checkCameraPermissions(): Promise<DevicePermissionResult> {
  const status = await Camera.getCameraPermissionsAsync();
  return {
    status: status.status === 'granted' ? 'granted' : status.status === 'denied' ? 'denied' : 'undetermined',
    canAskAgain: status.canAskAgain,
  };
}

export async function requestCameraPermissions(): Promise<DevicePermissionResult> {
  const status = await Camera.requestCameraPermissionsAsync();
  return {
    status: status.status === 'granted' ? 'granted' : status.status === 'denied' ? 'denied' : 'undetermined',
    canAskAgain: status.canAskAgain,
  };
}
