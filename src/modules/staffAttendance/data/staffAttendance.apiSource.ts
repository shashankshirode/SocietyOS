import type { StaffProfile, ShiftDefinition, ShiftAssignment, StaffAttendanceHomeSummary, RegisterStaffInput, ShiftAssignmentInput, } from '../../../shared/types/staff.types';
import type { DomesticHelp, VerifyDomesticHelpInput, BlockDomesticHelpInput, } from '../../../shared/types/domesticHelp.types';
import type { AttendancePunch, AttendanceDashboard, CorrectionRequest, MonthlyAttendanceRow, VendorAttendanceRow, StaffMonthlyAttendance, ManualAttendanceInput, CorrectionRequestInput, ApproveCorrectionInput, RejectCorrectionInput, AttendanceStatus, PunchSource, } from '../../../shared/types/attendance.types';
import type { BiometricDevice, BiometricMapping, BiometricSyncJob, BiometricSyncError, DuplicatePunchCandidate, MissingCheckoutRecord, CreateBiometricMappingInput, ResolveSyncErrorInput, ResolveDuplicatePunchInput, AttendanceSettings, } from '../../../shared/types/biometric.types';
import { apiClient } from '../../../core/api/apiClient';
import { apiEndpoints } from '../../../core/api/apiEndpoints';
import { staffAttendanceMappers } from './staffAttendance.mapper';
import type { StaffProfileDTO, ShiftDefinitionDTO, ShiftAssignmentDTO, DomesticHelpDTO, AttendancePunchDTO, DailyAttendanceSummaryDTO, CorrectionRequestDTO, MonthlyAttendanceRowDTO, VendorAttendanceRowDTO, BiometricDeviceDTO, BiometricMappingDTO, BiometricSyncJobDTO, BiometricSyncErrorDTO, DuplicatePunchCandidateDTO, MissingCheckoutRecordDTO, } from './staffAttendance.dto';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export const staffAttendanceApiSource = {
    getStaffAttendanceHome: async (): Promise<StaffAttendanceHomeSummary> => {
        const res = await apiClient.get<{
            society_name?: string;
            date?: string;
            total_staff?: number;
            present?: number;
            absent?: number;
            late?: number;
            on_leave?: number;
            missing_checkout?: number;
            pending_corrections?: number;
            biometric_sync_status?: 'OK';
            last_sync_time?: string;
            vendor_summary?: {
                vendor_name: string;
                total_staff: number;
                present: number;
                absent: number;
            }[];
            recent_punches?: {
                staff_name: string;
                staff_code: string;
                punch_time: string;
                punch_type: string;
                location: string;
            }[];
        }>(apiEndpoints.staffAttendance.attendanceHome);
        return {
            societyName: res.society_name || 'Society',
            date: res.date || '',
            totalStaff: res.total_staff || 0,
            present: res.present || 0,
            absent: res.absent || 0,
            late: res.late || 0,
            onLeave: res.on_leave || 0,
            missingCheckout: res.missing_checkout || 0,
            pendingCorrections: res.pending_corrections || 0,
            biometricSyncStatus: res.biometric_sync_status || 'OK',
            ...includeWhenPresent("lastSyncTime", res.last_sync_time),
            vendorSummary: (res.vendor_summary || []).map(v => ({
                vendorName: v.vendor_name,
                totalStaff: v.total_staff,
                present: v.present,
                absent: v.absent
            })),
            recentPunches: (res.recent_punches || []).map(p => ({
                staffName: p.staff_name,
                staffCode: p.staff_code,
                punchTime: p.punch_time,
                punchType: p.punch_type,
                location: p.location
            }))
        };
    },
    getStaffDirectory: async (params?: Record<string, string>): Promise<StaffProfile[]> => {
        const dtos = await apiClient.get<StaffProfileDTO[]>(apiEndpoints.staffAttendance.staff, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toStaff);
    },
    getStaffDetail: async (staffId: string): Promise<StaffProfile> => {
        const dto = await apiClient.get<StaffProfileDTO>(apiEndpoints.staffAttendance.staffDetail(staffId));
        return staffAttendanceMappers.toStaff(dto);
    },
    registerStaff: async (input: RegisterStaffInput): Promise<StaffProfile> => {
        const dto = await apiClient.post<StaffProfileDTO>(apiEndpoints.staffAttendance.createStaff, {
            name: input.name,
            category: input.category,
            staff_code: input.staffCode,
            vendor_id: input.vendorId,
            mobile: input.mobile,
            emergency_contact: input.emergencyContact,
            assigned_location: input.assignedLocation,
            shift_id: input.shiftId,
            joining_date: input.joiningDate,
            verification_status: input.verificationStatus,
            notes: input.notes
        });
        return staffAttendanceMappers.toStaff(dto);
    },
    markStaffInactive: async (staffId: string): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.staffAttendance.markStaffInactive(staffId), {});
    },
    getDomesticHelpDirectory: async (params?: Record<string, string>): Promise<DomesticHelp[]> => {
        const dtos = await apiClient.get<DomesticHelpDTO[]>(apiEndpoints.staffAttendance.domesticHelp, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toDomesticHelp);
    },
    getDomesticHelpDetail: async (domesticHelpId: string): Promise<DomesticHelp> => {
        const dto = await apiClient.get<DomesticHelpDTO>(apiEndpoints.staffAttendance.domesticHelpDetail(domesticHelpId));
        return staffAttendanceMappers.toDomesticHelp(dto);
    },
    verifyDomesticHelp: async (domesticHelpId: string, input: VerifyDomesticHelpInput): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.staffAttendance.verifyDomesticHelp(domesticHelpId), {
            checklist_item_key: input.checklistItemKey,
            status: input.status,
            notes: input.notes
        });
    },
    blockDomesticHelpAccess: async (domesticHelpId: string, input: BlockDomesticHelpInput): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.staffAttendance.blockDomesticHelpAccess(domesticHelpId), {
            reason: input.reason,
            confirmation_checked: input.confirmationChecked
        });
    },
    getShifts: async (params?: Record<string, string>): Promise<ShiftDefinition[]> => {
        const dtos = await apiClient.get<ShiftDefinitionDTO[]>(apiEndpoints.staffAttendance.shifts, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toShift);
    },
    assignShift: async (input: ShiftAssignmentInput): Promise<ShiftAssignment> => {
        const dto = await apiClient.post<ShiftAssignmentDTO>(apiEndpoints.staffAttendance.createShiftAssignment, {
            staff_id: input.staffId,
            shift_id: input.shiftId,
            effective_from: input.effectiveFrom,
            effective_to: input.effectiveTo,
            location: input.location,
            weekly_off_days: input.weeklyOffDays,
            notes: input.notes
        });
        return staffAttendanceMappers.toShiftAssignment(dto);
    },
    getDailyAttendanceDashboard: async (params?: Record<string, string>): Promise<AttendanceDashboard> => {
        const res = await apiClient.get<{
            date: string;
            summary: DailyAttendanceSummaryDTO;
            by_category?: {
                category: string;
                total: number;
                present: number;
                absent: number;
                late: number;
            }[];
            by_vendor?: {
                vendor_name: string;
                total: number;
                present: number;
                absent: number;
            }[];
            by_location?: {
                location: string;
                total: number;
                present: number;
                absent: number;
            }[];
            recent_punches?: AttendancePunchDTO[];
            late_arrivals?: {
                staff_name: string;
                staff_code: string;
                punch_time: string;
                minutes_late: number;
            }[];
            missing_checkouts?: {
                staff_name: string;
                staff_code: string;
                last_punch_time: string;
                shift_end_time: string;
            }[];
        }>(apiEndpoints.staffAttendance.attendanceDashboard, { ...includeWhenPresent("query", params) });
        return {
            date: res.date,
            summary: staffAttendanceMappers.toDailySummary(res.summary),
            byCategory: (res.by_category || []).map(c => ({
                category: c.category,
                total: c.total,
                present: c.present,
                absent: c.absent,
                late: c.late
            })),
            byVendor: (res.by_vendor || []).map(v => ({
                vendorName: v.vendor_name,
                total: v.total,
                present: v.present,
                absent: v.absent
            })),
            byLocation: (res.by_location || []).map(l => ({
                location: l.location,
                total: l.total,
                present: l.present,
                absent: l.absent
            })),
            recentPunches: (res.recent_punches || []).map(staffAttendanceMappers.toPunch),
            lateArrivals: (res.late_arrivals || []).map(la => ({
                staffName: la.staff_name,
                staffCode: la.staff_code,
                punchTime: la.punch_time,
                minutesLate: la.minutes_late
            })),
            missingCheckouts: (res.missing_checkouts || []).map(mc => ({
                staffName: mc.staff_name,
                staffCode: mc.staff_code,
                lastPunchTime: mc.last_punch_time,
                shiftEndTime: mc.shift_end_time
            }))
        };
    },
    getAttendancePunches: async (params?: Record<string, string>): Promise<AttendancePunch[]> => {
        const dtos = await apiClient.get<AttendancePunchDTO[]>(apiEndpoints.staffAttendance.attendancePunches, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toPunch);
    },
    createManualAttendance: async (input: ManualAttendanceInput): Promise<AttendancePunch> => {
        const dto = await apiClient.post<AttendancePunchDTO>(apiEndpoints.staffAttendance.createManualPunch, {
            staff_id: input.staffId,
            date: input.date,
            punch_type: input.punchType,
            punch_time: input.punchTime,
            reason: input.reason,
            notes: input.notes,
            confirmation_checked: input.confirmationChecked
        });
        return staffAttendanceMappers.toPunch(dto);
    },
    getCorrectionRequests: async (params?: Record<string, string>): Promise<CorrectionRequest[]> => {
        const dtos = await apiClient.get<CorrectionRequestDTO[]>(apiEndpoints.staffAttendance.correctionRequests, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toCorrectionRequest);
    },
    createCorrectionRequest: async (input: CorrectionRequestInput): Promise<CorrectionRequest> => {
        const dto = await apiClient.post<CorrectionRequestDTO>(apiEndpoints.staffAttendance.createCorrectionRequest, {
            staff_id: input.staffId,
            attendance_date: input.attendanceDate,
            correction_type: input.correctionType,
            existing_value: input.existingValue,
            requested_correction: input.requestedCorrection,
            reason: input.reason,
            confirmation_checked: input.confirmationChecked
        });
        return staffAttendanceMappers.toCorrectionRequest(dto);
    },
    approveCorrectionRequest: async (correctionRequestId: string, input: ApproveCorrectionInput): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.staffAttendance.approveCorrectionRequest(correctionRequestId), {
            audit_note: input.auditNote,
            confirmation_checked: input.confirmationChecked
        });
    },
    rejectCorrectionRequest: async (correctionRequestId: string, input: RejectCorrectionInput): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.staffAttendance.rejectCorrectionRequest(correctionRequestId), {
            rejection_reason: input.rejectionReason,
            confirmation_checked: input.confirmationChecked
        });
    },
    getMonthlyAttendanceReport: async (params?: Record<string, string>): Promise<MonthlyAttendanceRow[]> => {
        const dtos = await apiClient.get<MonthlyAttendanceRowDTO[]>(apiEndpoints.staffAttendance.monthlyAttendanceReport, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toMonthlyAttendanceRow);
    },
    getVendorAttendanceReport: async (params?: Record<string, string>): Promise<VendorAttendanceRow[]> => {
        const dtos = await apiClient.get<VendorAttendanceRowDTO[]>(apiEndpoints.staffAttendance.vendorWiseAttendanceReport, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toVendorAttendanceRow);
    },
    getStaffAttendanceDetail: async (staffId: string, params?: Record<string, string>): Promise<StaffMonthlyAttendance> => {
        const res = await apiClient.get<{
            staff_id: string;
            staff_name: string;
            staff_code: string;
            month: string;
            year: number;
            summary: MonthlyAttendanceRowDTO;
            daily_records: {
                date: string;
                status: string;
                check_in_time?: string;
                check_out_time?: string;
                minutes_late?: number;
                source: string;
                correction_applied: boolean;
            }[];
            corrections: CorrectionRequestDTO[];
        }>(apiEndpoints.staffAttendance.staffMonthlyAttendance(staffId), { ...includeWhenPresent("query", params) });
        return {
            staffId: res.staff_id,
            staffName: res.staff_name,
            staffCode: res.staff_code,
            month: res.month,
            year: res.year,
            summary: staffAttendanceMappers.toMonthlyAttendanceRow(res.summary),
            dailyRecords: (res.daily_records || []).map(r => ({
                date: r.date,
                status: r.status as AttendanceStatus,
                ...includeWhenPresent("checkInTime", r.check_in_time),
                ...includeWhenPresent("checkOutTime", r.check_out_time),
                ...includeWhenPresent("minutesLate", r.minutes_late),
                source: r.source as PunchSource,
                correctionApplied: r.correction_applied
            })),
            corrections: (res.corrections || []).map(staffAttendanceMappers.toCorrectionRequest)
        };
    },
    getBiometricDevices: async (params?: Record<string, string>): Promise<BiometricDevice[]> => {
        const dtos = await apiClient.get<BiometricDeviceDTO[]>(apiEndpoints.biometric.devices, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toBiometricDevice);
    },
    getBiometricDeviceDetail: async (deviceId: string): Promise<BiometricDevice> => {
        const dto = await apiClient.get<BiometricDeviceDTO>(apiEndpoints.biometric.deviceDetail(deviceId));
        return staffAttendanceMappers.toBiometricDevice(dto);
    },
    getBiometricMappings: async (deviceId: string): Promise<BiometricMapping[]> => {
        const dtos = await apiClient.get<BiometricMappingDTO[]>(apiEndpoints.biometric.deviceMappings(deviceId));
        return dtos.map(staffAttendanceMappers.toBiometricMapping);
    },
    createBiometricMapping: async (input: CreateBiometricMappingInput): Promise<BiometricMapping> => {
        const dto = await apiClient.post<BiometricMappingDTO>(apiEndpoints.biometric.createMapping(input.deviceId), {
            biometric_employee_code: input.biometricEmployeeCode,
            staff_id: input.staffId,
            effective_from: input.effectiveFrom,
            effective_to: input.effectiveTo,
            notes: input.notes
        });
        return staffAttendanceMappers.toBiometricMapping(dto);
    },
    getBiometricSyncJobs: async (params?: Record<string, string>): Promise<BiometricSyncJob[]> => {
        const dtos = await apiClient.get<BiometricSyncJobDTO[]>(apiEndpoints.biometric.syncJobs, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toBiometricSyncJob);
    },
    getBiometricSyncErrors: async (syncJobId: string): Promise<BiometricSyncError[]> => {
        const dtos = await apiClient.get<BiometricSyncErrorDTO[]>(apiEndpoints.biometric.syncJobErrors(syncJobId));
        return dtos.map(staffAttendanceMappers.toBiometricSyncError);
    },
    resolveSyncError: async (syncErrorId: string, input: ResolveSyncErrorInput): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.biometric.resolveSyncError(syncErrorId), {
            resolution_note: input.resolutionNote
        });
    },
    ignoreSyncError: async (syncErrorId: string, input: ResolveSyncErrorInput): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.biometric.ignoreSyncError(syncErrorId), {
            resolution_note: input.resolutionNote
        });
    },
    getDuplicatePunches: async (params?: Record<string, string>): Promise<DuplicatePunchCandidate[]> => {
        const dtos = await apiClient.get<DuplicatePunchCandidateDTO[]>(apiEndpoints.staffAttendance.duplicatePunches, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toDuplicatePunch);
    },
    resolveDuplicatePunch: async (duplicateId: string, input: ResolveDuplicatePunchInput): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.staffAttendance.resolveDuplicatePunch(duplicateId), {
            action: input.action,
            notes: input.notes
        });
    },
    getMissingCheckout: async (params?: Record<string, string>): Promise<MissingCheckoutRecord[]> => {
        const dtos = await apiClient.get<MissingCheckoutRecordDTO[]>(apiEndpoints.staffAttendance.missingCheckouts, { ...includeWhenPresent("query", params) });
        return dtos.map(staffAttendanceMappers.toMissingCheckout);
    },
    createMissingCheckoutCorrection: async (missingCheckoutId: string, input: {
        requestedCorrection: string;
        reason: string;
    }): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.staffAttendance.createMissingCheckoutCorrection(missingCheckoutId), {
            requested_correction: input.requestedCorrection,
            reason: input.reason
        });
    },
    getAttendanceSettings: async (): Promise<AttendanceSettings> => {
        const res = await apiClient.get<{
            shift_grace_period_minutes: number;
            late_marking_threshold_minutes: number;
            missing_checkout_window_hours: number;
            auto_duplicate_window_minutes: number;
            correction_approval_required: boolean;
            correction_approval_roles: string[];
            vendor_report_lock_day_of_month: number;
            biometric_sync_schedule?: string;
            data_retention_months: number;
        }>(apiEndpoints.staffAttendance.attendanceSettings);
        return {
            shiftGracePeriodMinutes: res.shift_grace_period_minutes,
            lateMarkingThresholdMinutes: res.late_marking_threshold_minutes,
            missingCheckoutWindowHours: res.missing_checkout_window_hours,
            autoDuplicateWindowMinutes: res.auto_duplicate_window_minutes,
            correctionApprovalRequired: res.correction_approval_required,
            correctionApprovalRoles: res.correction_approval_roles || [],
            vendorReportLockDayOfMonth: res.vendor_report_lock_day_of_month,
            ...includeWhenPresent("biometricSyncSchedule", res.biometric_sync_schedule),
            dataRetentionMonths: res.data_retention_months
        };
    }
};

