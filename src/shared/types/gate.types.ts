

export type GateEntryType =
  | 'GUEST'
  | 'DELIVERY'
  | 'CAB'
  | 'VENDOR'
  | 'MATERIAL'
  | 'STAFF'
  | 'DOMESTIC_HELP';

export type GatePassStatus =
  | 'EXPECTED'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type EntrySource = 'QR' | 'OTP' | 'MANUAL' | 'OFFLINE';

export type ApprovalSource =
  | 'RESIDENT'
  | 'PRE_APPROVED'
  | 'GUARD'
  | 'SUPERVISOR'
  | 'SYSTEM';

export type OfflineSyncStatus =
  | 'PENDING_SYNC'
  | 'SYNCING'
  | 'SYNCED'
  | 'FAILED';

export type EmergencySeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export interface GatePass {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  visitorType: GateEntryType;
  visitingFlat: string;
  residentName: string;
  residentPhone?: string;
  expectedTime: string;
  expectedDate: string;
  validityWindow: string;
  otp: string;
  approvalStatus: GatePassStatus;
  approvalSource: ApprovalSource;
  vehicleNumber?: string;
  purpose?: string;
  peopleCount?: number;
  specialInstructions?: string;
  watchlistWarning?: boolean;
  previousVisitCount?: number;
  actualEntryTime?: string;
  actualExitTime?: string;
}

export interface GateActivityLog {
  id: string;
  activityType: GateEntryType;
  personName: string;
  flatOrCommon: string;
  gateName: string;
  time: string;
  guardName: string;
  status: GatePassStatus;
  entrySource: EntrySource;
  approvalSource: ApprovalSource;
  vehicleNumber?: string;
  passCode?: string;
}

export interface OfflineQueueItem {
  id: string;
  entryType: GateEntryType;
  personName: string;
  flatNumber: string;
  createdTime: string;
  retryCount: number;
  syncStatus: OfflineSyncStatus;
  errorMessage?: string;
}

export interface EmergencyAlertPayload {
  id: string;
  type: string;
  location: string;
  description?: string;
  severity: EmergencySeverity;
  timestamp: string;
  incidentNumber: string;
}
