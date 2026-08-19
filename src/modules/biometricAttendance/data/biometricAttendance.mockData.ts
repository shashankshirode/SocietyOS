import type { BiometricDevice, BiometricPunchSyncLog, MonthlyBiometricReportRow, UnknownEmployeeCode, VendorBillingAttendanceSummary } from './biometricAttendance.types';

export const mockBiometricDevices: BiometricDevice[] = [
  { id: 'bio-1', deviceName: 'Gate 1 Fingerprint Reader', location: 'Main Entry Security Gate', status: 'ONLINE', lastSyncTime: '2026-07-05 18:00' },
  { id: 'bio-2', deviceName: 'Clubhouse Facial Scanner', location: 'Clubhouse Entrance Lobby', status: 'OFFLINE', lastSyncTime: '2026-07-04 22:00' },
];

export const biometricDeviceMockData = mockBiometricDevices;
export const biometricPunchSyncLogMockData: BiometricPunchSyncLog[] = [
  { id: 'bps-1', deviceName: 'Gate 1 Fingerprint Reader', employeeCode: 'EMP-102', staffName: 'Ramesh Pawar', status: 'SUCCESS', punchTime: '2026-07-05 09:02' },
  { id: 'bps-2', deviceName: 'Gate 1 Fingerprint Reader', employeeCode: 'EMP-102', staffName: 'Ramesh Pawar', status: 'DUPLICATE', punchTime: '2026-07-05 09:03' },
  { id: 'bps-3', deviceName: 'Clubhouse Facial Scanner', employeeCode: 'EMP-999', status: 'UNKNOWN_EMPLOYEE', punchTime: '2026-07-05 10:14' },
];
export const unknownEmployeeCodeMockData: UnknownEmployeeCode[] = [
  { id: 'uec-1', deviceName: 'Clubhouse Facial Scanner', employeeCode: 'EMP-999', firstSeenAt: '2026-07-05 10:14', resolutionStatus: 'OPEN' },
];
export const monthlyBiometricReportMockData: MonthlyBiometricReportRow[] = [
  { id: 'mbr-1', staffName: 'Ramesh Pawar', vendorName: 'SecureGate Services', location: 'Main Gate', presentDays: 25, missingPunches: 1 },
  { id: 'mbr-2', staffName: 'Meena Salve', vendorName: 'CleanWell Facility', location: 'Tower B', presentDays: 23, missingPunches: 3 },
];
export const vendorBillingAttendanceMockData: VendorBillingAttendanceSummary[] = [
  { id: 'vba-1', vendorName: 'SecureGate Services', invoiceMonth: 'July 2026', payableDays: 248, disputedDays: 2, verificationStatus: 'NEEDS_REVIEW' },
  { id: 'vba-2', vendorName: 'CleanWell Facility', invoiceMonth: 'July 2026', payableDays: 186, disputedDays: 0, verificationStatus: 'READY' },
];
