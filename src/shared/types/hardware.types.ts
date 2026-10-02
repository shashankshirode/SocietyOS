

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

export type HardwareLifecycleState =
  | 'REGISTERED'
  | 'CONFIGURING'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'DECOMMISSIONED';

export type HardwareHealthState =
  | 'ONLINE'
  | 'DEGRADED'
  | 'OFFLINE'
  | 'ERROR'
  | 'UNKNOWN';

export type HardwareCapability =
  | 'READ_RFID'
  | 'CAPTURE_PLATE'
  | 'OPEN_BARRIER'
  | 'CLOSE_BARRIER'
  | 'QUERY_BARRIER_STATUS'
  | 'CCTV_LIVE_VIEW'
  | 'CCTV_EVIDENCE_RETRIEVAL'
  | 'INGEST_METER_READING'
  | 'EV_SESSION_LIFECYCLE'
  | 'BIOMETRIC_PUNCH_INGESTION'
  | 'FIRMWARE_MANAGEMENT';

export type BarrierCommandState =
  | 'REQUESTED'
  | 'AUTHORIZED'
  | 'SENT'
  | 'ACKNOWLEDGED'
  | 'CONFIRMED'
  | 'TIMED_OUT'
  | 'FAILED'
  | 'RECONCILIATION_REQUIRED';

export type CircuitState =
  | 'CLOSED'
  | 'OPEN'
  | 'HALF_OPEN';

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

export interface HardwareReadinessRecord {
  id: string;
  title: string;
  readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED' | 'FRONTEND_READY_BACKEND_REQUIRED';
  summary: string;
  nextStep: string;
}

export interface IntegrationHealthLogRecord {
  id: string;
  integrationName: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  timestamp: string;
  detail: string;
}

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
  societyId?: string;
  lifecycleState?: HardwareLifecycleState;
  healthState?: HardwareHealthState;
  capabilities?: HardwareCapability[];
  configurationVersion?: string;
  serialNumber?: string;
  credentialReference?: string;
  locationId?: string;
  replacedDeviceId?: string;
  decommissionedAt?: string;
  createdAt?: string;
  updatedAt?: string;
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
  connectorId?: string;
  schemaVersion?: string;
  correlationId?: string;
  reviewRequiredRecords?: number;
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
  sourceEventId?: string;
  correlationId?: string;
  receivedAt?: string;
  deduplicationKey?: string;
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
  occurrences?: number;
  lastOccurredAt?: string;
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  correctiveWorkOrderId?: string;
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

export interface DeadLetterRecord {
  id: string;
  deviceId: string;
  eventType: string;
  payload: Record<string, string>;
  errorReason: string;
  failedAt: string;
  retryCount: number;
  replayStatus: 'PENDING' | 'REPLAYED' | 'DISCARDED';
  replayedAt?: string;
  replayedBy?: string;
}

export interface HardwareCommandAttempt {
  attemptId: string;
  commandId: string;
  sentAt: string;
  responseCode?: number;
  errorMessage?: string;
  durationMs: number;
  success: boolean;
}

export interface HardwareCommandAcknowledgement {
  ackId: string;
  commandId: string;
  deviceId: string;
  receivedAt: string;
  status: 'ACCEPTED' | 'REJECTED' | 'EXECUTED';
  hardwareDetail?: string;
}

export interface RegisterHardwareDeviceCommand {
  name: string;
  type: HardwareDeviceType;
  deviceCode: string;
  vendor: string;
  location: string;
  locationId?: string;
  linkedModule: HardwareLinkedModule;
  connectionType?: HardwareConnectionType;
  credentialReference?: string;
  configurationVersion?: string;
  serialNumber?: string;
  capabilities?: HardwareCapability[];
}

export interface UpdateHardwareDeviceCommand {
  name?: string;
  location?: string;
  locationId?: string;
  status?: HardwareDeviceStatus;
  connectionType?: HardwareConnectionType;
  configurationVersion?: string;
}

export interface MapDeviceLocationCommand {
  deviceId: string;
  deviceName: string;
  location: string;
  accessZone: string;
  responsibleRole: string;
  visibilityRules: string;
}

export interface CreateRfidTagMappingCommand {
  tagCode: string;
  vehicleId?: string;
  vehicleNumber?: string;
  unitId?: string;
  unitNumber?: string;
  residentName?: string;
  staffCredentialId?: string;
  validFrom: string;
  validUntil: string;
  accessZone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOST' | 'EXPIRED' | 'BLOCKED' | 'PENDING_MAPPING';
  notes?: string;
}

export interface UpdateRfidTagMappingCommand {
  status?: 'ACTIVE' | 'INACTIVE' | 'LOST' | 'EXPIRED' | 'BLOCKED' | 'PENDING_MAPPING';
  validUntil?: string;
  notes?: string;
  accessZone?: string;
}

export interface ReviewAnprMatchCommand {
  eventId: string;
  reviewerDecision: 'MATCH_TO_VEHICLE' | 'MARK_UNKNOWN' | 'MARK_VISITOR' | 'MARK_FALSE_READ' | 'BLOCKED_REVIEW' | 'ESCALATE_TO_SECURITY';
  notes: string;
  matchedVehicleId?: string;
  suggestedVehicleNumber?: string;
}

export interface RequestBarrierOverrideCommand {
  barrierId: string;
  reason: string;
  overrideType: 'MANUAL_SUPERVISOR' | 'EMERGENCY_AMBULANCE' | 'EMERGENCY_FIRE' | 'MAINTENANCE';
  emergencyIncidentId?: string;
  operatorNotes?: string;
}

export interface RequestCctvAccessCommand {
  cameraId: string;
  reason: string;
  purpose: 'SECURITY_INCIDENT' | 'SAFETY_INVESTIGATION' | 'GATE_INCIDENT' | 'COMPLAINT_VERIFICATION';
  durationMinutes: number;
  incidentReferenceId?: string;
}

export interface ImportMeterReadingsCommand {
  readings: Array<{
    meterCode: string;
    readingValue: number;
    readingDate: string;
    source: 'AUTOMATIC' | 'MANUAL' | 'IMPORT';
  }>;
  batchId?: string;
}

export interface ResolveHardwareErrorCommand {
  errorId: string;
  resolutionAction: string;
  notes: string;
  correctiveWorkOrderId?: string;
}

export interface IgnoreHardwareErrorCommand {
  errorId: string;
  reason: string;
}

export interface EscalateHardwareErrorCommand {
  errorId: string;
  targetDepartment: 'FACILITY' | 'SECURITY' | 'VENDOR_AMC';
  escalationNotes: string;
  createWorkOrder?: boolean;
}

export interface UpdateHardwareSettingsCommand {
  settings: Array<{ key: string; value: string }>;
}
