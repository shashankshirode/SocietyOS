

export type HardwareDeviceType =
  | 'RFID_READER'
  | 'ANPR_CAMERA'
  | 'BOOM_BARRIER'
  | 'CCTV_CAMERA'
  | 'BIOMETRIC_DEVICE'
  | 'SMART_ELECTRICITY_METER'
  | 'SMART_WATER_METER'
  | 'SMART_GAS_METER'
  | 'EV_CHARGER'
  | 'IOT_SENSOR'
  | 'OTHER';

export type HardwareDeviceStatus =
  | 'ONLINE'
  | 'OFFLINE'
  | 'ERROR'
  | 'MAINTENANCE'
  | 'NOT_CONFIGURED'
  | 'DISABLED'
  | 'UNKNOWN';

export type HardwareConnectionType =
  | 'API_CONNECTOR'
  | 'LOCAL_AGENT'
  | 'FILE_IMPORT'
  | 'CLOUD_VENDOR'
  | 'MANUAL_PLACEHOLDER'
  | 'MQTT_PLACEHOLDER';

export type HardwareLinkedModule =
  | 'GATE'
  | 'PARKING'
  | 'CCTV'
  | 'ATTENDANCE'
  | 'BILLING'
  | 'EV_CHARGING'
  | 'COMPLIANCE'
  | 'SECURITY'
  | 'OTHER';

export type HardwareSyncStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'CANCELLED';

export type HardwareEventType =
  | 'RFID_SCAN'
  | 'ANPR_CAPTURE'
  | 'BOOM_BARRIER_STATUS'
  | 'CCTV_ACCESS_REQUEST'
  | 'METER_READING'
  | 'EV_CHARGING_SESSION'
  | 'BIOMETRIC_PUNCH'
  | 'DEVICE_HEARTBEAT'
  | 'DEVICE_ERROR'
  | 'MANUAL_OVERRIDE_PLACEHOLDER';

export type HardwareEventStatus =
  | 'RECEIVED'
  | 'MATCHED'
  | 'UNMATCHED'
  | 'IGNORED'
  | 'FAILED'
  | 'REVIEW_REQUIRED';

export type HardwareErrorType =
  | 'DEVICE_OFFLINE'
  | 'AUTHENTICATION_FAILED'
  | 'INVALID_PAYLOAD'
  | 'UNKNOWN_DEVICE'
  | 'UNKNOWN_TAG'
  | 'UNMATCHED_VEHICLE'
  | 'DUPLICATE_EVENT'
  | 'METER_READING_INVALID'
  | 'EV_SESSION_ERROR'
  | 'TIME_DRIFT'
  | 'VENDOR_API_ERROR'
  | 'PERMISSION_DENIED';

export type HardwareErrorStatus =
  | 'OPEN'
  | 'REVIEWED'
  | 'RESOLVED'
  | 'IGNORED'
  | 'ESCALATED';

export type IntegrationHealthStatus =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'DOWN'
  | 'NOT_CONFIGURED'
  | 'DISABLED'
  | 'FUTURE_PLACEHOLDER';

export type HardwareRiskLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export interface HardwareDevice {
  id: string;
  name: string;
  type: HardwareDeviceType;
  deviceCode: string;
  vendor: string;
  location: string;
  status: HardwareDeviceStatus;
  lastHeartbeat?: string;
  lastSync?: string;
  linkedModule: HardwareLinkedModule;
  connectionType?: HardwareConnectionType;
}

export interface DeviceLocationMapping {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  accessZone: string;
  responsibleRole: string;
  visibilityRules: string;
}

export interface HardwareSyncJob {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: HardwareDeviceType;
  startedAt: string;
  completedAt?: string;
  status: HardwareSyncStatus;
  totalRecords: number;
  importedRecords: number;
  failedRecords: number;
  duplicateRecords: number;
  triggeredBy: string;
}

export interface HardwareEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  eventType: HardwareEventType;
  moduleLinked: HardwareLinkedModule;
  timestamp: string;
  status: HardwareEventStatus;
  matchedEntityReference?: string;
  riskLevel: HardwareRiskLevel;
  safeMetadata: Record<string, string>;
}

export interface HardwareErrorRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  errorType: HardwareErrorType;
  message: string;
  createdAt: string;
  status: HardwareErrorStatus;
  suggestedAction: string;
}

export interface IntegrationHealthRow {
  category: string;
  status: IntegrationHealthStatus;
  deviceCount: number;
  onlineCount: number;
  errorCount: number;
  lastSync?: string;
  riskLevel: HardwareRiskLevel;
  recommendedAction: string;
}

export interface DevicePermissionRow {
  functionName: string;
  roles: string[];
}

export interface HardwarePrivacyRule {
  section: string;
  ruleDescription: string;
}

export interface HardwareAuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  event: string;
  deviceId?: string;
  deviceName?: string;
  moduleLinked?: HardwareLinkedModule;
  entityReference: string;
  correlationId: string;
  safeMetadata: Record<string, string>;
}

export interface HardwareSettingGroup {
  groupName: string;
  settings: HardwareSettingItem[];
}

export interface HardwareSettingItem {
  key: string;
  label: string;
  value: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  description: string;
}

export interface HardwareHomeData {
  societyName: string;
  currentRole: string;
  readinessScore: number;
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  errorDevices: number;
  lastSyncTime?: string;
}
