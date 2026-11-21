export type DevicePermissionStatus = 'granted' | 'denied' | 'undetermined' | 'unavailable';

export interface DevicePermissionResult {
  status: DevicePermissionStatus;
  canAskAgain: boolean;
}
