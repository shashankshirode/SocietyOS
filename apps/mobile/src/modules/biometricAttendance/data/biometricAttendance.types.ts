export interface BiometricDevice {
  id: string;
  deviceName: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE';
  lastSyncTime: string;
}

export type BiometricPunchSyncLog = {
  id: string;
  deviceName: string;
  employeeCode: string;
  staffName?: string;
  status: 'SUCCESS' | 'DUPLICATE' | 'UNKNOWN_EMPLOYEE';
  punchTime: string;
};

export type UnknownEmployeeCode = {
  id: string;
  deviceName: string;
  employeeCode: string;
  firstSeenAt: string;
  resolutionStatus: 'OPEN' | 'MAPPED';
};

export type MonthlyBiometricReportRow = {
  id: string;
  staffName: string;
  vendorName: string;
  location: string;
  presentDays: number;
  missingPunches: number;
};

export type VendorBillingAttendanceSummary = {
  id: string;
  vendorName: string;
  invoiceMonth: string;
  payableDays: number;
  disputedDays: number;
  verificationStatus: 'READY' | 'NEEDS_REVIEW';
};
