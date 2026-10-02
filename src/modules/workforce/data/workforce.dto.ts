import type {
  StaffProfile,
  StaffDocument,
  StaffAssignment,
  StaffVerificationRecord,
  StaffExitRecord,
  StaffOnboardingRecord,
  StaffTransferRecord,
  StaffSuspensionRecord,
  StaffPerformanceRecord,
  ShiftDefinition,
  ShiftAssignment,
  RosterDefinition,
  RosterEntry,
  SwapRequest,
  AttendancePunch,
  DailyAttendanceSummary,
  StaffDailyAttendance,
  AttendanceCorrectionRequest,
  MonthlyAttendanceRecord,
  LeaveRecord,
  OvertimeRecord,
  SalaryStructure,
  SalaryComponent,
  PayrollPeriod,
  PayrollRecord,
  PayrollEarning,
  PayrollDeduction,
  PayrollAdjustment,
  Payslip,
  PayslipEarning,
  PayslipDeduction,
  StaffAdvance,
  AdvanceRecovery,
  StaffSalaryAdvanceRequest,
  BiometricDevice,
  BiometricMapping,
  BiometricSyncJob,
  BiometricSyncError,
  DuplicatePunchCandidate,
  MissingCheckoutRecord,
  AttendanceSettings,
  VendorAttendanceVerification,
} from '../../../shared/types/workforcePhase11.types';
import type { Absent } from '../../../shared/types/absence.types';

export type StaffProfileDto = Partial<StaffProfile> & Pick<StaffProfile, 'id'>;
export type ShiftDefinitionDto = Partial<ShiftDefinition> & Pick<ShiftDefinition, 'id'>;
export type ShiftAssignmentDto = Partial<ShiftAssignment> & Pick<ShiftAssignment, 'id'>;
export type RosterDefinitionDto = Partial<RosterDefinition> & Pick<RosterDefinition, 'id'>;
export type RosterEntryDto = Partial<RosterEntry> & Pick<RosterEntry, 'id'>;
export type SwapRequestDto = Partial<SwapRequest> & Pick<SwapRequest, 'id'>;
export type AttendancePunchDto = Partial<AttendancePunch> & Pick<AttendancePunch, 'id'>;
export type DailyAttendanceSummaryDto = Partial<DailyAttendanceSummary> & Pick<DailyAttendanceSummary, 'id'>;
export type StaffDailyAttendanceDto = Partial<StaffDailyAttendance> & Pick<StaffDailyAttendance, 'id'>;
export type AttendanceCorrectionRequestDto = Partial<AttendanceCorrectionRequest> & Pick<AttendanceCorrectionRequest, 'id'>;
export type MonthlyAttendanceRecordDto = Partial<MonthlyAttendanceRecord> & Pick<MonthlyAttendanceRecord, 'id'>;
export type LeaveRecordDto = Partial<LeaveRecord> & Pick<LeaveRecord, 'id'>;
export type OvertimeRecordDto = Partial<OvertimeRecord> & Pick<OvertimeRecord, 'id'>;
export type SalaryStructureDto = Partial<SalaryStructure> & Pick<SalaryStructure, 'id'>;
export type SalaryComponentDto = Partial<SalaryComponent> & Pick<SalaryComponent, 'id'>;
export type PayrollPeriodDto = Partial<PayrollPeriod> & Pick<PayrollPeriod, 'id'>;
export type PayrollRecordDto = Partial<PayrollRecord> & Pick<PayrollRecord, 'id'>;
export type PayrollEarningDto = Partial<PayrollEarning> & Pick<PayrollEarning, 'id'>;
export type PayrollDeductionDto = Partial<PayrollDeduction> & Pick<PayrollDeduction, 'id'>;
export type PayrollAdjustmentDto = Partial<PayrollAdjustment> & Pick<PayrollAdjustment, 'id'>;
export type PayslipDto = Partial<Payslip> & Pick<Payslip, 'id'>;
export type PayslipEarningDto = Partial<PayslipEarning> & Pick<PayslipEarning, 'id'>;
export type PayslipDeductionDto = Partial<PayslipDeduction> & Pick<PayslipDeduction, 'id'>;
export type StaffAdvanceDto = Partial<StaffAdvance> & Pick<StaffAdvance, 'id'>;
export type AdvanceRecoveryDto = Partial<AdvanceRecovery> & Pick<AdvanceRecovery, 'id'>;
export type StaffSalaryAdvanceRequestDto = Partial<StaffSalaryAdvanceRequest> & Pick<StaffSalaryAdvanceRequest, 'id'>;
export type StaffTransferRecordDto = Partial<StaffTransferRecord> & Pick<StaffTransferRecord, 'id'>;
export type StaffSuspensionRecordDto = Partial<StaffSuspensionRecord> & Pick<StaffSuspensionRecord, 'id'>;
export type StaffOnboardingRecordDto = Partial<StaffOnboardingRecord> & Pick<StaffOnboardingRecord, 'id'>;
export type StaffPerformanceRecordDto = Partial<StaffPerformanceRecord> & Pick<StaffPerformanceRecord, 'id'>;
export type BiometricDeviceDto = Partial<BiometricDevice> & Pick<BiometricDevice, 'id'>;
export type BiometricMappingDto = Partial<BiometricMapping> & Pick<BiometricMapping, 'id'>;
export type BiometricSyncJobDto = Partial<BiometricSyncJob> & Pick<BiometricSyncJob, 'id'>;
export type BiometricSyncErrorDto = Partial<BiometricSyncError> & Pick<BiometricSyncError, 'id'>;
export type DuplicatePunchCandidateDto = Partial<DuplicatePunchCandidate> & Pick<DuplicatePunchCandidate, 'id'>;
export type MissingCheckoutRecordDto = Partial<MissingCheckoutRecord> & Pick<MissingCheckoutRecord, 'id'>;
export type AttendanceSettingsDto = Partial<AttendanceSettings>;
export type VendorAttendanceVerificationDto = Partial<VendorAttendanceVerification> & Pick<VendorAttendanceVerification, 'id'>;
export type StaffProfileCreateDto = Partial<StaffProfile> & Pick<StaffProfile, 'staffCode' | 'name' | 'category' | 'employmentType' | 'mobile' | 'assignedLocation' | 'joiningDate' | 'effectiveFrom'>;
export type ShiftDefinitionCreateDto = Partial<ShiftDefinition> & Pick<ShiftDefinition, 'name' | 'code' | 'type' | 'startTime' | 'endTime' | 'location' | 'applicableDays'>;
export type ShiftAssignmentCreateDto = Partial<ShiftAssignment> & Pick<ShiftAssignment, 'staffId' | 'shiftId' | 'effectiveFrom' | 'location' | 'weeklyOffDays'>;
export type RosterDefinitionCreateDto = Partial<RosterDefinition> & Pick<RosterDefinition, 'name' | 'periodStart' | 'periodEnd' | 'location'>;
export type RosterEntryCreateDto = Partial<RosterEntry> & Pick<RosterEntry, 'staffId' | 'shiftId' | 'date'>;
export type SwapRequestCreateDto = Partial<SwapRequest> & Pick<SwapRequest, 'rosterId' | 'requesterStaffId' | 'targetStaffId' | 'date' | 'requesterShiftId' | 'targetShiftId'>;
export type AttendancePunchCreateDto = Partial<AttendancePunch> & Pick<AttendancePunch, 'staffId' | 'punchTime' | 'punchType' | 'source' | 'location' | 'societyId'>;
export type AttendanceCorrectionCreateDto = Partial<AttendanceCorrectionRequest> & Pick<AttendanceCorrectionRequest, 'staffId' | 'attendanceDate' | 'correctionType' | 'requestedCorrection' | 'reason' | 'requestedBy' | 'requestedByRole' | 'societyId'>;
export type LeaveRecordCreateDto = Partial<LeaveRecord> & Pick<LeaveRecord, 'staffId' | 'leaveType' | 'startDate' | 'endDate' | 'totalDays' | 'reason' | 'societyId'>;
export type OvertimeRecordCreateDto = Partial<OvertimeRecord> & Pick<OvertimeRecord, 'staffId' | 'date' | 'overtimeMinutes' | 'source' | 'societyId'>;
export type SalaryStructureCreateDto = Partial<SalaryStructure> & Pick<SalaryStructure, 'staffId' | 'name' | 'code' | 'effectiveFrom' | 'components'>;
export type PayrollPeriodCreateDto = Partial<PayrollPeriod> & Pick<PayrollPeriod, 'name' | 'code' | 'periodStart' | 'periodEnd' | 'payDate'>;
export type PayrollAdjustmentCreateDto = Partial<PayrollAdjustment> & Pick<PayrollAdjustment, 'payrollRecordId' | 'staffId' | 'type' | 'amount' | 'reason' | 'approvedBy'>;
export type StaffAdvanceCreateDto = Partial<StaffAdvance> & Pick<StaffAdvance, 'staffId' | 'amount' | 'reason' | 'requestedAt'>;
export type BiometricDeviceCreateDto = Partial<BiometricDevice> & Pick<BiometricDevice, 'deviceCode' | 'deviceName' | 'vendorName' | 'location' | 'syncType'>;
export type BiometricMappingCreateDto = Partial<BiometricMapping> & Pick<BiometricMapping, 'deviceId' | 'biometricEmployeeCode' | 'staffId' | 'effectiveFrom'>;
export type AttendanceSettingsUpdateDto = Partial<AttendanceSettings>;

export type StaffDashboardMetrics = {
  totalStaff: number;
  activeStaff: number;
  verificationPending: number;
  suspended: number;
  inactive: number;
  exited: number;
  byCategory: Record<string, number>;
  byEmploymentType: Record<string, number>;
  onboardingProgress: Record<string, number>;
};

export type ShiftCoverage = {
  byShift: Record<string, { expected: number; assigned: number; present: number }>;
  totalExpected: number;
  totalAssigned: number;
  totalPresent: number;
};

export type PayrollDashboard = {
  currentPeriod: PayrollPeriodDto | null;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  advanceBalance: number;
  byStatus: Record<string, number>;
};

export type AttendanceDashboard = {
  summary: DailyAttendanceSummary;
  byCategory: { category: string; total: number; present: number; absent: number; late: number }[];
  byVendor: { vendorName: string; total: number; present: number; absent: number }[];
  byLocation: { location: string; total: number; present: number; absent: number }[];
  recentPunches: AttendancePunchDto[];
  lateArrivals: { staffName: string; staffCode: string; punchTime: string; minutesLate: number }[];
  missingCheckouts: { staffName: string; staffCode: string; lastPunchTime: string; shiftEndTime: string }[];
};