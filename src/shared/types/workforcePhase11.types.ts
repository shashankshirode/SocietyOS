import type { ResidentScopedEntity } from './residentScope.types';
import type { JsonObject } from '../../core/api/api.types';
import type { StaffCategory, StaffEmploymentStatus, StaffVerificationStatus, RegisterStaffInput } from './staff.types';
export type { StaffCategory, StaffEmploymentStatus, StaffVerificationStatus, RegisterStaffInput };
export type {
  BiometricDevice,
  BiometricDeviceStatus,
  BiometricSyncType,
  BiometricMappingStatus,
  BiometricSyncJobStatus,
  BiometricSyncErrorType,
  SyncErrorStatus,
  BiometricMapping,
  BiometricSyncJob,
  BiometricSyncError,
  DuplicatePunchCandidate,
  MissingCheckoutRecord,
  AttendanceSettings,
} from './biometric.types';


export type StaffEmploymentType =
  | 'DIRECT_EMPLOYEE'
  | 'VENDOR_EMPLOYEE'
  | 'CONTRACT_WORKER'
  | 'TEMPORARY_WORKER'
  | 'OTHER';

export type StaffStatus =
  | 'DRAFT'
  | 'INVITED'
  | 'VERIFICATION_PENDING'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'INACTIVE'
  | 'EXIT_REQUESTED'
  | 'EXITED'
  | 'BLOCKED'
  | 'REJECTED';

export type ShiftType =
  | 'MORNING'
  | 'AFTERNOON'
  | 'NIGHT'
  | 'CUSTOM'
  | 'SPLIT';

export type ShiftStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'ARCHIVED';

export type RosterStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'PUBLISHED'
  | 'CANCELLED';

export type RosterEntryStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'SWAPPED'
  | 'CANCELLED'
  | 'ABSENT';

export type SwapRequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED';

export type AttendanceSource =
  | 'BIOMETRIC_DEVICE'
  | 'MANUAL'
  | 'GUARD_APP'
  | 'IMPORT_FILE'
  | 'API_CONNECTOR'
  | 'OFFLINE_SYNC';

export type PunchType =
  | 'IN'
  | 'OUT'
  | 'BREAK_IN'
  | 'BREAK_OUT'
  | 'UNKNOWN';

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

export type MonthlyAttendanceStatus =
  | 'OPEN'
  | 'FINALIZING'
  | 'FINALIZED'
  | 'LOCKED';

export type PayrollPeriodStatus =
  | 'DRAFT'
  | 'CALCULATING'
  | 'REVIEW'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'FINALIZED'
  | 'PAID'
  | 'RECONCILED'
  | 'CANCELLED'
  | 'FAILED'
  | 'CORRECTION_REQUIRED';

export type SalaryComponentType =
  | 'BASIC'
  | 'ALLOWANCE'
  | 'SPECIAL_ALLOWANCE'
  | 'OVERTIME'
  | 'BONUS'
  | 'DEDUCTION'
  | 'ADVANCE_RECOVERY'
  | 'OTHER';

export type PayrollPaymentStatus =
  | 'PAYMENT_PENDING'
  | 'PAYMENT_INITIATED'
  | 'PAID'
  | 'FAILED'
  | 'RECONCILIATION_REQUIRED';

export type PayrollAdjustmentType =
  | 'SALARY_CORRECTION'
  | 'OVERTIME_ADJUSTMENT'
  | 'DEDUCTION_ADJUSTMENT'
  | 'BONUS_ADJUSTMENT'
  | 'ADVANCE_RECOVERY'
  | 'SUPPLEMENTARY'
  | 'REVERSAL'
  | 'OTHER';

export type VendorAttendanceVerificationStatus =
  | 'NOT_REVIEWED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'DISPUTED'
  | 'LOCKED';

export type LeaveType =
  | 'SICK_LEAVE'
  | 'CASUAL_LEAVE'
  | 'PRIVILEGE_LEAVE'
  | 'MATERNITY_LEAVE'
  | 'PATERNITY_LEAVE'
  | 'UNPAID_LEAVE'
  | 'OTHER';

export type LeaveStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export interface StaffProfile extends ResidentScopedEntity {
  id: string;
  staffCode: string;
  name: string;
  category: StaffCategory;
  employmentType: StaffEmploymentType;
  employmentStatus: StaffStatus;
  verificationStatus: StaffVerificationStatus;
  societyId: string;
  vendorId?: string;
  vendorName?: string;
  mobile: string;
  emergencyContact?: string;
  assignedLocation: string;
  assignedAreas: string[];
  shiftId?: string;
  shiftName?: string;
  joiningDate: string;
  effectiveFrom: string;
  effectiveTo?: string;
  exitDate?: string;
  verificationExpiryDate?: string;
  biometricEmployeeCode?: string;
  biometricDeviceId?: string;
  documents: StaffDocument[];
  assignments: StaffAssignment[];
  verificationRecord?: StaffVerificationRecord;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  metadata?: JsonObject;
}

export interface StaffDocument extends ResidentScopedEntity {
  id: string;
  staffId: string;
  type: string;
  name: string;
  fileUrl?: string;
  expiryDate?: string;
  status: 'VALID' | 'EXPIRED' | 'PENDING' | 'REJECTED';
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface StaffAssignment extends ResidentScopedEntity {
  id: string;
  staffId: string;
  type: 'DEPARTMENT' | 'LOCATION' | 'GATE' | 'FACILITY' | 'SHIFT' | 'VENDOR_CONTEXT';
  referenceId: string;
  referenceName: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isPrimary: boolean;
  notes?: string;
}

export interface StaffVerificationRecord extends ResidentScopedEntity {
  id: string;
  staffId: string;
  status: 'NOT_STARTED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  documentsVerified: string[];
  notes?: string;
}

export interface StaffExitRecord extends ResidentScopedEntity {
  id: string;
  staffId: string;
  exitType: 'RESIGNATION' | 'TERMINATION' | 'RETIREMENT' | 'CONTRACT_END' | 'OTHER';
  exitDate: string;
  noticeDate?: string;
  reason: string;
  clearanceStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'WAIVED';
  pendingObligations: string[];
  clearanceCompletedAt?: string;
  clearanceCompletedBy?: string;
  accessRevoked: boolean;
  accessRevokedAt?: string;
  finalSettlementAmount?: number;
  finalSettlementDate?: string;
  exitInterviewCompleted: boolean;
  notes?: string;
}

export interface ShiftDefinition extends ResidentScopedEntity {
  id: string;
  name: string;
  code: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  breakDurationMinutes: number;
  crossMidnight: boolean;
  applicableDays: number[];
  location: string;
  overtimeThresholdMinutes: number;
  allowedLateMinutes: number;
  allowedEarlyMinutes: number;
  status: ShiftStatus;
  notes?: string;
  assignedStaffCount?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ShiftAssignmentInput = {
  shiftId: string;
  staffId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  location: string;
  weeklyOffDays: number[];
  isTemporary?: boolean;
  temporaryReason?: string;
  originalAssignmentId?: string;
  notes?: string;
};

export interface ShiftAssignment extends ResidentScopedEntity {
  id: string;
  shiftId: string;
  shiftName: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  effectiveFrom: string;
  effectiveTo?: string;
  location: string;
  weeklyOffDays: number[];
  isTemporary: boolean;
  temporaryReason?: string;
  originalAssignmentId?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SWAPPED' | 'EXPIRED';
  assignedBy: string;
  assignedAt: string;
  notes?: string;
}

export interface RosterDefinition extends ResidentScopedEntity {
  id: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  status: RosterStatus;
  location: string;
  shiftAssignments: RosterEntry[];
  publishedAt?: string;
  publishedBy?: string;
  version: number;
  previousVersionId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RosterEntry extends ResidentScopedEntity {
  id: string;
  rosterId: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  shiftId: string;
  shiftName: string;
  date: string;
  status: RosterEntryStatus;
  swapRequestId?: string;
  notes?: string;
}

export interface SwapRequest extends ResidentScopedEntity {
  id: string;
  rosterId: string;
  requesterStaffId: string;
  requesterStaffName: string;
  targetStaffId: string;
  targetStaffName: string;
  date: string;
  requesterShiftId: string;
  targetShiftId: string;
  status: SwapRequestStatus;
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface AttendancePunch extends ResidentScopedEntity {
  id: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  biometricEmployeeCode?: string;
  punchTime: string;
  punchType: PunchType;
  source: AttendanceSource;
  deviceId?: string;
  deviceName?: string;
  location: string;
  syncJobId?: string;
  isDuplicate: boolean;
  duplicateKey?: string;
  isMapped: boolean;
  mappingStatus?: string;
  attendanceStatus: AttendanceStatus;
  notes?: string;
  clientEventId?: string;
  idempotencyKey?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface DailyAttendanceSummary extends ResidentScopedEntity {
  id: string;
  date: string;
  totalExpected: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  onLeave: number;
  weeklyOff: number;
  holiday: number;
  missingCheckout: number;
  manualEntries: number;
  biometricEntries: number;
  correctionsPending: number;
  attendancePercentage: number;
  byCategory: Record<string, { total: number; present: number; absent: number; late: number }>;
  byVendor: Record<string, { total: number; present: number; absent: number }>;
  byLocation: Record<string, { total: number; present: number; absent: number }>;
}

export interface StaffDailyAttendance extends ResidentScopedEntity {
  id: string;
  staffId: string;
  date: string;
  shiftId?: string;
  shiftName?: string;
  rosterEntryId?: string;
  rosterShiftId?: string;
  expectedInTime?: string;
  expectedOutTime?: string;
  actualInTime?: string;
  actualOutTime?: string;
  breakInTime?: string;
  breakOutTime?: string;
  status: AttendanceStatus;
  minutesLate: number;
  minutesEarly: number;
  overtimeMinutes: number;
  missingCheckout: boolean;
  punches: AttendancePunch[];
  source: AttendanceSource;
  notes?: string;
}

export interface AttendanceCorrectionRequest extends ResidentScopedEntity {
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
  originalPunchId?: string;
  proposedPunchTime?: string;
  proposedPunchType?: PunchType;
  createdAt?: string;
  updatedAt?: string;
}


export interface MonthlyAttendanceRecord extends ResidentScopedEntity {
  id: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  month: string;
  year: number;
  status: MonthlyAttendanceStatus;
  expectedDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  missingCheckoutCount: number;
  correctionsCount: number;
  attendancePercentage: number;
  dailyRecords: StaffDailyAttendance[];
  corrections: AttendanceCorrectionRequest[];
  finalizedAt?: string;
  finalizedBy?: string;
  lockedAt?: string;
  lockedBy?: string;
}

export interface LeaveRecord extends ResidentScopedEntity {
  id: string;
  staffId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  supportingDocumentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OvertimeRecord extends ResidentScopedEntity {
  id: string;
  staffId: string;
  date: string;
  shiftId?: string;
  scheduledMinutes: number;
  actualMinutes: number;
  overtimeMinutes: number;
  approvedMinutes: number;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  reason?: string;
  source: AttendanceSource;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalaryStructure extends ResidentScopedEntity {
  id: string;
  name: string;
  code: string;
  staffId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  components: SalaryComponent[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryComponent extends ResidentScopedEntity {
  id: string;
  salaryStructureId: string;
  type: SalaryComponentType;
  name: string;
  amount: number;
  isTaxable: boolean;
  isFixed: boolean;
  calculationRule?: string;
  conditions?: JsonObject;
  order: number;
  isActive: boolean;
}

export interface PayrollPeriod extends ResidentScopedEntity {
  id: string;
  name: string;
  code: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  status: PayrollPeriodStatus;
  eligibleStaffCount: number;
  processedStaffCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  approvedBy?: string;
  approvedAt?: string;
  finalizedAt?: string;
  finalizedBy?: string;
  paidAt?: string;
  paidBy?: string;
  reconciledAt?: string;
  reconciledBy?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollRecord extends ResidentScopedEntity {
  id: string;
  payrollPeriodId: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  salaryStructureId: string;
  earnings: PayrollEarning[];
  deductions: PayrollDeduction[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  attendanceDays: number;
  presentDays: number;
  absentDays: number;
  overtimeHours: number;
  overtimePay: number;
  leaveDays: number;
  advanceRecovery: number;
  paymentStatus: PayrollPaymentStatus;
  paymentReference?: string;
  paymentDate?: string;
  payslipId?: string;
  payslipGeneratedAt?: string;
  isFinalized: boolean;
  finalizedAt?: string;
  finalizedBy?: string;
  adjustmentNotes?: string;
  metadata?: JsonObject;
}

export interface PayrollEarning extends ResidentScopedEntity {
  id: string;
  payrollRecordId: string;
  type: SalaryComponentType;
  componentName: string;
  amount: number;
  isTaxable: boolean;
  calculationBasis: string;
}

export interface PayrollDeduction extends ResidentScopedEntity {
  id: string;
  payrollRecordId: string;
  type: 'STATUTORY' | 'VOLUNTARY' | 'ADVANCE_RECOVERY' | 'OTHER';
  componentName: string;
  amount: number;
  isTaxable: boolean;
  calculationBasis: string;
}

export interface PayrollAdjustment extends ResidentScopedEntity {
  id: string;
  payrollRecordId?: string;
  staffId: string;
  type: PayrollAdjustmentType;
  amount: number;
  reason: string;
  approvedBy: string;
  approvedAt: string;
  isProcessed: boolean;
  processedAt?: string;
  metadata?: JsonObject;
}

export interface Payslip extends ResidentScopedEntity {
  id: string;
  payrollRecordId: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  payrollPeriodId: string;
  periodName: string;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  earnings: PayslipEarning[];
  deductions: PayslipDeduction[];
  paymentStatus: PayrollPaymentStatus;
  paymentReference?: string;
  paymentDate?: string;
  generatedAt: string;
  generatedBy: string;
  documentId?: string;
}

export interface PayslipEarning extends ResidentScopedEntity {
  id: string;
  payslipId: string;
  type: SalaryComponentType;
  componentName: string;
  amount: number;
  isTaxable: boolean;
}

export interface PayslipDeduction extends ResidentScopedEntity {
  id: string;
  payslipId: string;
  type: 'STATUTORY' | 'VOLUNTARY' | 'ADVANCE_RECOVERY' | 'OTHER';
  componentName: string;
  amount: number;
  isTaxable: boolean;
}

export interface VendorAttendanceVerification extends ResidentScopedEntity {
  id: string;
  vendorId: string;
  vendorName: string;
  month: string;
  year: number;
  status: VendorAttendanceVerificationStatus;
  staffCount: number;
  expectedManDays: number;
  presentManDays: number;
  absentDays: number;
  lateCount: number;
  correctionsCount: number;
  verifiedAt?: string;
  verifiedBy?: string;
  disputedAt?: string;
  disputedBy?: string;
  disputeReason?: string;
  lockedAt?: string;
  lockedBy?: string;
  invoiceReference?: string;
}

export interface StaffAdvance extends ResidentScopedEntity {
  id: string;
  staffId: string;
  amount: number;
  reason: string;
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  disbursedAt?: string;
  disbursedBy?: string;
  recoverySchedule: AdvanceRecovery[];
  totalRecovered: number;
  balance: number;
  status: 'PENDING' | 'APPROVED' | 'DISBURSED' | 'RECOVERING' | 'CLOSED' | 'REJECTED';
  rejectionReason?: string;
}

export interface AdvanceRecovery extends ResidentScopedEntity {
  id: string;
  advanceId: string;
  payrollPeriodId?: string;
  amount: number;
  recoveredAt: string;
  recoveredBy: string;
  payrollRecordId?: string;
}

export interface StaffSalaryAdvanceRequest extends ResidentScopedEntity {
  id: string;
  staffId: string;
  amount: number;
  reason: string;
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  disbursedAt?: string;
  disbursedBy?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  rejectionReason?: string;
}

export interface StaffTransferRecord extends ResidentScopedEntity {
  id: string;
  staffId: string;
  fromAssignmentId?: string;
  toAssignmentId?: string;
  fromLocation?: string;
  toLocation?: string;
  fromShiftId?: string;
  toShiftId?: string;
  effectiveFrom: string;
  reason: string;
  approvedBy: string;
  approvedAt: string;
  isTemporary: boolean;
  temporaryEndDate?: string;
  originalAssignmentId?: string;
}

export interface StaffSuspensionRecord extends ResidentScopedEntity {
  id: string;
  staffId: string;
  reason: string;
  suspendedAt: string;
  suspendedBy: string;
  affectedCapabilities: string[];
  expectedReactivationDate?: string;
  reactivatedAt?: string;
  reactivatedBy?: string;
  reactivationReason?: string;
  status: 'ACTIVE' | 'LIFTED';
}

export interface StaffOnboardingRecord extends ResidentScopedEntity {
  id: string;
  staffId: string;
  step: 'CREATED' | 'DOCUMENTS_UPLOADED' | 'VERIFICATION_SUBMITTED' | 'VERIFICATION_COMPLETED' | 'APPROVED' | 'ACTIVATED';
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface StaffPerformanceRecord extends ResidentScopedEntity {
  id: string;
  staffId: string;
  period: string;
  rating: number;
  feedback: string;
  reviewedBy: string;
  reviewedAt: string;
}

export const STAFF_STATUS_TRANSITIONS: Record<StaffStatus, StaffStatus[]> = {
  DRAFT: ['INVITED', 'EXITED'],
  INVITED: ['VERIFICATION_PENDING', 'EXITED'],
  VERIFICATION_PENDING: ['ACTIVE', 'REJECTED', 'EXITED'],
  ACTIVE: ['SUSPENDED', 'INACTIVE', 'EXIT_REQUESTED', 'EXITED'],
  SUSPENDED: ['ACTIVE', 'INACTIVE', 'EXITED'],
  INACTIVE: ['ACTIVE', 'EXITED'],
  EXIT_REQUESTED: ['EXITED', 'ACTIVE'],
  EXITED: ['ACTIVE'],
  BLOCKED: ['ACTIVE'],
  REJECTED: ['VERIFICATION_PENDING', 'EXITED'],
};

export const ROSTER_STATUS_TRANSITIONS: Record<RosterStatus, RosterStatus[]> = {
  DRAFT: ['REVIEW', 'CANCELLED'],
  REVIEW: ['PUBLISHED', 'DRAFT', 'CANCELLED'],
  PUBLISHED: ['CANCELLED'],
  CANCELLED: [],
};

export const PAYROLL_STATUS_TRANSITIONS: Record<PayrollPeriodStatus, PayrollPeriodStatus[]> = {
  DRAFT: ['CALCULATING', 'CANCELLED'],
  CALCULATING: ['REVIEW', 'DRAFT', 'CANCELLED'],
  REVIEW: ['APPROVAL_PENDING', 'DRAFT', 'CANCELLED'],
  APPROVAL_PENDING: ['APPROVED', 'REVIEW', 'CANCELLED'],
  APPROVED: ['FINALIZED', 'APPROVAL_PENDING'],
  FINALIZED: ['PAID', 'CORRECTION_REQUIRED'],
  PAID: ['RECONCILED'],
  RECONCILED: [],
  CANCELLED: ['DRAFT'],
  FAILED: ['DRAFT'],
  CORRECTION_REQUIRED: ['DRAFT', 'REVIEW'],
};

export function canTransitionStaffStatus(from: StaffStatus, to: StaffStatus): boolean {
  return STAFF_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionRosterStatus(from: RosterStatus, to: RosterStatus): boolean {
  return ROSTER_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionPayrollStatus(from: PayrollPeriodStatus, to: PayrollPeriodStatus): boolean {
  return PAYROLL_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isStaffStatusActive(status: StaffStatus): boolean {
  return ['ACTIVE', 'SUSPENDED'].includes(status);
}

export function isStaffStatusFinal(status: StaffStatus): boolean {
  return ['EXITED', 'BLOCKED'].includes(status);
}

export function isRosterStatusFinal(status: RosterStatus): boolean {
  return ['CANCELLED'].includes(status);
}

export function isPayrollStatusFinal(status: PayrollPeriodStatus): boolean {
  return ['PAID', 'RECONCILED', 'CANCELLED'].includes(status);
}

export function getStaffStatusOrder(status: StaffStatus): number {
  const order: Record<StaffStatus, number> = {
    DRAFT: 1,
    INVITED: 2,
    VERIFICATION_PENDING: 3,
    ACTIVE: 4,
    SUSPENDED: 5,
    INACTIVE: 6,
    EXIT_REQUESTED: 7,
    EXITED: 8,
    BLOCKED: 9,
    REJECTED: 10,
  };
  return order[status] ?? 0;
}

export function getPayrollStatusOrder(status: PayrollPeriodStatus): number {
  const order: Record<PayrollPeriodStatus, number> = {
    DRAFT: 1,
    CALCULATING: 2,
    REVIEW: 3,
    APPROVAL_PENDING: 4,
    APPROVED: 4,
    FINALIZED: 5,
    PAID: 6,
    RECONCILED: 7,
    CANCELLED: 8,
    FAILED: 9,
    CORRECTION_REQUIRED: 10,
  };
  return order[status] ?? 0;
}

export type ShiftSwapRequest = SwapRequest;