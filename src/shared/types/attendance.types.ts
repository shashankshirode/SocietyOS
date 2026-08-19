



export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'HALF_DAY'
  | 'ON_LEAVE'
  | 'WEEKLY_OFF'
  | 'HOLIDAY'
  | 'MISSING_CHECKOUT'
  | 'PENDING_CORRECTION';

export type PunchType =
  | 'IN'
  | 'OUT'
  | 'BREAK_IN'
  | 'BREAK_OUT'
  | 'UNKNOWN';

export type PunchSource =
  | 'BIOMETRIC_DEVICE'
  | 'MANUAL'
  | 'GUARD_APP'
  | 'IMPORT_FILE'
  | 'API_CONNECTOR';

export type CorrectionType =
  | 'MISSED_CHECK_IN'
  | 'MISSED_CHECK_OUT'
  | 'WRONG_PUNCH_TIME'
  | 'WRONG_PUNCH_TYPE'
  | 'DUPLICATE_PUNCH'
  | 'SHIFT_MAPPING_ERROR'
  | 'LEAVE_ADJUSTMENT'
  | 'OTHER';

export type CorrectionStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type VendorAttendanceVerificationStatus =
  | 'NOT_REVIEWED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'DISPUTED'
  | 'LOCKED';



export interface AttendancePunch {
  id: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  biometricEmployeeCode?: string;
  punchTime: string;
  punchType: PunchType;
  source: PunchSource;
  deviceId?: string;
  deviceName?: string;
  location: string;
  syncJobId?: string;
  isDuplicate: boolean;
  duplicateKey?: string;
  isMapped: boolean;
  mappingStatus?: string;
  notes?: string;
  createdAt: string;
}

export interface DailyAttendanceSummary {
  date: string;
  totalExpected: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  onLeave: number;
  weeklyOff: number;
  missingCheckout: number;
  manualEntries: number;
  biometricEntries: number;
  correctionsPending: number;
  attendancePercentage: number;
}

export interface AttendanceDashboard {
  date: string;
  summary: DailyAttendanceSummary;
  byCategory: {
    category: string;
    total: number;
    present: number;
    absent: number;
    late: number;
  }[];
  byVendor: {
    vendorName: string;
    total: number;
    present: number;
    absent: number;
  }[];
  byLocation: {
    location: string;
    total: number;
    present: number;
    absent: number;
  }[];
  recentPunches: AttendancePunch[];
  lateArrivals: { staffName: string; staffCode: string; punchTime: string; minutesLate: number }[];
  missingCheckouts: { staffName: string; staffCode: string; lastPunchTime: string; shiftEndTime: string }[];
}

export interface CorrectionRequest {
  id: string;
  requestNumber: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  attendanceDate: string;
  correctionType: CorrectionType;
  existingValue?: string;
  requestedCorrection: string;
  reason: string;
  requestedBy: string;
  requestedByRole: string;
  status: CorrectionStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  auditNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyAttendanceRow {
  staffId: string;
  staffName: string;
  staffCode: string;
  category: string;
  vendorName?: string;
  expectedDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  missingCheckoutCount: number;
  correctionsCount: number;
  attendancePercentage: number;
}

export interface VendorAttendanceRow {
  vendorId: string;
  vendorName: string;
  staffCount: number;
  expectedManDays: number;
  presentManDays: number;
  absentDays: number;
  lateCount: number;
  correctionsCount: number;
  verificationStatus: VendorAttendanceVerificationStatus;
  invoiceMonth: string;
  lockedAt?: string;
}

export interface StaffMonthlyAttendance {
  staffId: string;
  staffName: string;
  staffCode: string;
  month: string;
  year: number;
  summary: MonthlyAttendanceRow;
  dailyRecords: {
    date: string;
    status: AttendanceStatus;
    checkInTime?: string;
    checkOutTime?: string;
    minutesLate?: number;
    source: PunchSource;
    correctionApplied: boolean;
  }[];
  corrections: CorrectionRequest[];
}



export interface ManualAttendanceInput {
  staffId: string;
  date: string;
  punchType: PunchType;
  punchTime: string;
  reason: string;
  notes?: string;
  confirmationChecked: boolean;
}

export interface CorrectionRequestInput {
  staffId: string;
  attendanceDate: string;
  correctionType: CorrectionType;
  existingValue?: string;
  requestedCorrection: string;
  reason: string;
  confirmationChecked: boolean;
}

export interface ApproveCorrectionInput {
  auditNote?: string;
  confirmationChecked: boolean;
}

export interface RejectCorrectionInput {
  rejectionReason: string;
  confirmationChecked: boolean;
}
