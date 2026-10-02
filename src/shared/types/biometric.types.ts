import type { ResidentScopedEntity } from './residentScope.types';

export type BiometricDeviceStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'OFFLINE'
  | 'ERROR'
  | 'MAINTENANCE'
  | 'NOT_CONFIGURED';

export type BiometricSyncType =
  | 'API_CONNECTOR'
  | 'FILE_IMPORT'
  | 'LOCAL_AGENT'
  | 'MANUAL_UPLOAD'
  | 'VENDOR_PORTAL_EXPORT';

export type BiometricMappingStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING_REVIEW'
  | 'CONFLICT'
  | 'EXPIRED';

export type BiometricSyncJobStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'CANCELLED';

export type BiometricSyncErrorType =
  | 'UNKNOWN_EMPLOYEE_CODE'
  | 'DUPLICATE_PUNCH'
  | 'INVALID_PUNCH_TYPE'
  | 'DEVICE_TIME_MISMATCH'
  | 'STAFF_MAPPING_MISSING'
  | 'SHIFT_NOT_FOUND'
  | 'OUT_OF_ORDER_PUNCH'
  | 'IMPORT_FILE_INVALID'
  | 'API_CONNECTOR_ERROR';

export type SyncErrorStatus =
  | 'OPEN'
  | 'REVIEWED'
  | 'RESOLVED'
  | 'IGNORED';

export type BiometricDeviceHealth =
  | 'ONLINE'
  | 'OFFLINE'
  | 'DEGRADED'
  | 'DISCONNECTED'
  | 'UNKNOWN';

export interface BiometricDevice extends ResidentScopedEntity {
  id: string;
  deviceCode: string;
  deviceName: string;
  vendorName: string;
  vendorModel?: string;
  location: string;
  gate?: string;
  syncType: BiometricSyncType;
  status: BiometricDeviceStatus;
  health?: BiometricDeviceHealth;
  lastSyncTime?: string;
  lastSyncJobId?: string;
  lastSyncStatus?: BiometricSyncJobStatus;
  lastSyncPunchCount?: number;
  mappedStaffCount: number;
  unmappedEmployeeCodes: number;
  recentErrorCount: number;
  ipAddressMasked?: string;
  notes?: string;
  installedAt?: string;
  lastMaintenanceAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BiometricMapping extends ResidentScopedEntity {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceCode: string;
  biometricEmployeeCode: string;  
  staffId?: string;
  staffName?: string;
  staffCode?: string;
  status: BiometricMappingStatus;
  conflictNote?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface BiometricSyncJob extends ResidentScopedEntity {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceCode: string;
  startedAt: string;
  completedAt?: string;
  status: BiometricSyncJobStatus;
  totalPunchesFromDevice: number;
  importedPunches: number;
  duplicatePunches: number;
  failedPunches: number;
  unmappedEmployeeCodes: number;
  errorCount: number;
  triggeredBy: string;
  syncType: BiometricSyncType;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BiometricSyncError extends ResidentScopedEntity {
  id: string;
  syncJobId: string;
  deviceId: string;
  deviceCode: string;
  errorType: BiometricSyncErrorType;
  biometricEmployeeCode?: string;
  punchTime?: string;
  punchType?: string;
  errorMessage: string;
  suggestedAction: string;
  status: SyncErrorStatus;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DuplicatePunchCandidate extends ResidentScopedEntity {
  id: string;
  staffId?: string;
  staffName?: string;
  staffCode?: string;
  biometricEmployeeCode?: string;
  deviceId: string;
  deviceCode: string;
  punchTime: string;
  punchType: string;
  duplicateKey: string;
  existingPunchId: string;
  newPunchId: string;
  suggestedAction: 'KEEP_EXISTING' | 'KEEP_NEWER' | 'REVIEW_MANUALLY';
  status: 'OPEN' | 'RESOLVED_KEEP_EXISTING' | 'RESOLVED_KEEP_NEWER' | 'IGNORED';
  createdAt: string;
}

export interface MissingCheckoutRecord extends ResidentScopedEntity {
  id: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  date: string;
  firstCheckInTime: string;
  shiftEndTime: string;
  shiftName: string;
  hoursWorkedEstimate?: number;
  correctionStatus: 'OPEN' | 'CORRECTION_CREATED' | 'RESOLVED' | 'IGNORED';
  correctionRequestId?: string;
  createdAt: string;
}

export interface CreateBiometricMappingInput {
  deviceId: string;
  biometricEmployeeCode: string;  
  staffId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  notes?: string;
}

export interface ResolveSyncErrorInput {
  resolutionNote: string;
  action: 'RESOLVE' | 'IGNORE';
  resolvedBy: string;
}

export interface AttendanceSettings extends ResidentScopedEntity {
  id?: string;
  shiftGracePeriodMinutes: number;
  lateMarkingThresholdMinutes: number;
  missingCheckoutWindowHours: number;
  autoDuplicateWindowMinutes: number;
  correctionApprovalRequired: boolean;
  correctionApprovalRoles: string[];
  vendorReportLockDayOfMonth: number;
  biometricSyncSchedule?: string;
  dataRetentionMonths: number;
}

export interface UnknownEmployeeCodeRecord extends ResidentScopedEntity {
  id: string;
  deviceId: string;
  deviceCode: string;
  employeeCode: string;
  firstSeenAt: string;
  lastSeenAt: string;
  punchCount: number;
  resolutionStatus: 'OPEN' | 'MAPPED' | 'IGNORED';
  mappedStaffId?: string;
  mappedStaffName?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}
