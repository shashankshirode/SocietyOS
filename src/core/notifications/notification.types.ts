import type { DevicePermissionStatus } from '../device/devicePermission.types';

export type AppNotificationType =
  | 'VISITOR_APPROVED'
  | 'VISITOR_ARRIVED'
  | 'GATE_ENTRY_RECORDED'
  | 'COMPLAINT_CREATED'
  | 'COMPLAINT_UPDATED'
  | 'BILL_GENERATED'
  | 'PAYMENT_SUCCESS'
  | 'NOTICE_PUBLISHED'
  | 'DOCUMENT_UPDATED'
  | 'NOC_STATUS_UPDATED'
  | 'ATTENDANCE_UPDATED'
  | 'EMERGENCY_ALERT'
  | 'SYSTEM_TEST';

export interface NotificationPreference {
  key: string;
  label: string;
  enabled: boolean;
  important?: boolean;
}

export interface NotificationPermissionResult {
  status: DevicePermissionStatus;
  canAskAgain: boolean;
}

export type NotificationPermissionStatus =
  | 'unknown'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'error';

export type NotificationSetupResult = {
  status: NotificationPermissionStatus;
  expoPushToken?: string;
  message: string;
};

