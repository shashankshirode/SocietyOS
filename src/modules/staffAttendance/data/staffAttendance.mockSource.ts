import type { StaffProfile, ShiftDefinition, ShiftAssignment, StaffAttendanceHomeSummary, RegisterStaffInput, ShiftAssignmentInput, } from '../../../shared/types/staff.types';
import type { DomesticHelp, VerifyDomesticHelpInput, BlockDomesticHelpInput, } from '../../../shared/types/domesticHelp.types';
import type { AttendancePunch, AttendanceDashboard, CorrectionRequest, MonthlyAttendanceRow, VendorAttendanceRow, StaffMonthlyAttendance, ManualAttendanceInput, CorrectionRequestInput, ApproveCorrectionInput, RejectCorrectionInput, } from '../../../shared/types/attendance.types';
import type { BiometricDevice, BiometricMapping, BiometricSyncJob, BiometricSyncError, DuplicatePunchCandidate, MissingCheckoutRecord, CreateBiometricMappingInput, ResolveSyncErrorInput, ResolveDuplicatePunchInput, AttendanceSettings, } from '../../../shared/types/biometric.types';
import { mockStaffProfiles } from '../../../shared/mock/staff.mock';
import { mockDomesticHelpProfiles } from '../../../shared/mock/domesticHelp.mock';
import { mockShifts, mockShiftAssignments } from '../../../shared/mock/shifts.mock';
import { mockAttendancePunches } from '../../../shared/mock/attendancePunches.mock';
import { mockAttendanceDashboard } from '../../../shared/mock/attendanceSummaries.mock';
import { mockCorrectionRequests } from '../../../shared/mock/attendanceCorrections.mock';
import { mockMonthlyAttendanceReport, mockVendorAttendanceReport } from '../../../shared/mock/attendanceReports.mock';
import { mockBiometricDevices } from '../../../shared/mock/biometricDevices.mock';
import { mockBiometricMappings } from '../../../shared/mock/biometricMappings.mock';
import { mockBiometricSyncJobs } from '../../../shared/mock/biometricSyncJobs.mock';
import { mockBiometricSyncErrors } from '../../../shared/mock/biometricSyncErrors.mock';
import { mockDuplicatePunches, mockMissingCheckouts } from '../../../shared/mock/attendanceReview.mock';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
const withMockDelay = <T>(data: T, ms = 500): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), ms));
export const staffAttendanceMockSource = {
    getStaffAttendanceHome: (): Promise<StaffAttendanceHomeSummary> => withMockDelay({
        societyName: 'Green Valley Heights',
        date: '2026-06-29',
        totalStaff: mockStaffProfiles.length,
        present: mockStaffProfiles.filter(s => s.todayStatus === 'PRESENT' || s.todayStatus === 'LATE').length,
        absent: mockStaffProfiles.filter(s => s.todayStatus === 'ABSENT').length,
        late: mockStaffProfiles.filter(s => s.todayStatus === 'LATE').length,
        onLeave: mockStaffProfiles.filter(s => s.todayStatus === 'ON_LEAVE').length,
        missingCheckout: mockStaffProfiles.filter(s => s.todayStatus === 'MISSING_CHECKOUT').length,
        pendingCorrections: mockCorrectionRequests.filter(c => c.status === 'PENDING').length,
        biometricSyncStatus: 'OK',
        lastSyncTime: '2026-06-29T23:45:00Z',
        vendorSummary: [
            { vendorName: 'SafeGuard Security Services', totalStaff: 10, present: 9, absent: 0 },
            { vendorName: 'CleanPro Housekeeping', totalStaff: 8, present: 7, absent: 1 },
        ],
        recentPunches: mockAttendancePunches.slice(0, 5).map(p => ({
            staffName: p.staffName,
            staffCode: p.staffCode,
            punchTime: p.punchTime,
            punchType: p.punchType,
            location: p.location
        }))
    }),
    getStaffDirectory: (params?: Record<string, string>): Promise<StaffProfile[]> => {
        let list = [...mockStaffProfiles];
        if (params?.category) {
            list = list.filter(s => s.category === params.category);
        }
        if (params?.status) {
            list = list.filter(s => s.employmentStatus === params.status);
        }
        if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter(s => s.name.toLowerCase().includes(q) || s.staffCode.toLowerCase().includes(q));
        }
        return withMockDelay(list);
    },
    getStaffDetail: (staffId: string): Promise<StaffProfile> => withMockDelay(mockStaffProfiles.find(s => s.id === staffId) || getRequiredItem(mockStaffProfiles, 0, "staffAttendance.mockSource.ts")),
    registerStaff: (input: RegisterStaffInput): Promise<StaffProfile> => {
        const newStaff: StaffProfile = {
            id: `stf-0${mockStaffProfiles.length + 1}`,
            staffCode: input.staffCode,
            name: input.name,
            category: input.category,
            employmentStatus: 'ACTIVE',
            verificationStatus: input.verificationStatus,
            policeVerificationStatus: 'NOT_SUBMITTED',
            idDocumentStatus: 'NOT_COLLECTED',
            isVendorWorker: !!input.vendorId,
            ...includeWhenPresent("vendorName", input.vendorId ? 'Registered Vendor' : undefined),
            assignedLocation: input.assignedLocation,
            assignedAreas: [input.assignedLocation],
            shiftId: input.shiftId,
            shiftName: mockShifts.find(s => s.id === input.shiftId)?.shiftName || 'General Shift',
            mobileMasked: input.mobile.replace(/.(?=.{4})/g, '*'),
            joiningDate: input.joiningDate,
            ...includeWhenPresent("photoPlaceholder", undefined),
            ...includeWhenPresent("notes", input.notes),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockStaffProfiles.push(newStaff);
        return withMockDelay(newStaff);
    },
    markStaffInactive: (staffId: string): Promise<{
        success: boolean;
    }> => {
        const staff = mockStaffProfiles.find(s => s.id === staffId);
        if (staff) {
            staff.employmentStatus = 'INACTIVE';
        }
        return withMockDelay({ success: true });
    },
    getDomesticHelpDirectory: (params?: Record<string, string>): Promise<DomesticHelp[]> => {
        let list = [...mockDomesticHelpProfiles];
        if (params?.type) {
            list = list.filter(d => d.helpType === params.type);
        }
        if (params?.status) {
            list = list.filter(d => d.accessStatus === params.status);
        }
        if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter(d => d.name.toLowerCase().includes(q));
        }
        return withMockDelay(list);
    },
    getDomesticHelpDetail: (domesticHelpId: string): Promise<DomesticHelp> => withMockDelay(mockDomesticHelpProfiles.find(d => d.id === domesticHelpId) || getRequiredItem(mockDomesticHelpProfiles, 0, "staffAttendance.mockSource.ts")),
    verifyDomesticHelp: (domesticHelpId: string, input: VerifyDomesticHelpInput): Promise<{
        success: boolean;
    }> => {
        const help = mockDomesticHelpProfiles.find(d => d.id === domesticHelpId);
        if (help) {
            if (input.checklistItemKey === 'police_verification') {
                help.policeVerificationStatus = input.status === 'VERIFIED' ? 'VERIFIED' : 'REJECTED';
            }
            if (input.checklistItemKey === 'id_proof') {
                help.idDocumentStatus = input.status === 'VERIFIED' ? 'VERIFIED' : 'REJECTED';
            }
            help.verificationStatus = 'VERIFIED';
        }
        return withMockDelay({ success: true });
    },
    blockDomesticHelpAccess: (domesticHelpId: string, input: BlockDomesticHelpInput): Promise<{
        success: boolean;
    }> => {
        const help = mockDomesticHelpProfiles.find(d => d.id === domesticHelpId);
        if (help) {
            help.accessStatus = 'BLOCKED';
            help.notes = input.reason;
        }
        return withMockDelay({ success: true });
    },
    getShifts: (params?: Record<string, string>): Promise<ShiftDefinition[]> => {
        let list = [...mockShifts];
        if (params?.status) {
            list = list.filter(s => s.status === params.status);
        }
        return withMockDelay(list);
    },
    assignShift: (input: ShiftAssignmentInput): Promise<ShiftAssignment> => {
        const newAsg: ShiftAssignment = {
            id: `asg-0${mockShiftAssignments.length + 1}`,
            staffId: input.staffId,
            staffName: mockStaffProfiles.find(s => s.id === input.staffId)?.name || 'Unknown',
            staffCode: mockStaffProfiles.find(s => s.id === input.staffId)?.staffCode || 'STF-UNKNOWN',
            shiftId: input.shiftId,
            shiftName: mockShifts.find(s => s.id === input.shiftId)?.shiftName || 'Unknown',
            location: input.location,
            effectiveFrom: input.effectiveFrom,
            ...includeWhenPresent("effectiveTo", input.effectiveTo),
            weeklyOffDays: input.weeklyOffDays,
            ...includeWhenPresent("notes", input.notes),
            createdAt: new Date().toISOString(),
            isActive: true
        };
        mockShiftAssignments.push(newAsg);
        return withMockDelay(newAsg);
    },
    getDailyAttendanceDashboard: (params?: Record<string, string>): Promise<AttendanceDashboard> => withMockDelay(mockAttendanceDashboard),
    getAttendancePunches: (params?: Record<string, string>): Promise<AttendancePunch[]> => {
        let list = [...mockAttendancePunches];
        if (params?.source) {
            list = list.filter(p => p.source === params.source);
        }
        if (params?.punchType) {
            list = list.filter(p => p.punchType === params.punchType);
        }
        return withMockDelay(list);
    },
    createManualAttendance: (input: ManualAttendanceInput): Promise<AttendancePunch> => {
        const staff = mockStaffProfiles.find(s => s.id === input.staffId);
        const newPunch: AttendancePunch = {
            id: `pn-manual-${mockAttendancePunches.length + 1}`,
            staffId: input.staffId,
            staffName: staff?.name || 'Unknown',
            staffCode: staff?.staffCode || 'STF-UNKNOWN',
            punchTime: `${input.date}T${input.punchTime}:00Z`,
            punchType: input.punchType,
            source: 'MANUAL',
            location: 'Manual Entry',
            isDuplicate: false,
            isMapped: true,
            notes: input.reason,
            createdAt: new Date().toISOString()
        };
        mockAttendancePunches.unshift(newPunch);
        return withMockDelay(newPunch);
    },
    getCorrectionRequests: (params?: Record<string, string>): Promise<CorrectionRequest[]> => {
        let list = [...mockCorrectionRequests];
        if (params?.status) {
            list = list.filter(c => c.status === params.status);
        }
        return withMockDelay(list);
    },
    createCorrectionRequest: (input: CorrectionRequestInput): Promise<CorrectionRequest> => {
        const staff = mockStaffProfiles.find(s => s.id === input.staffId);
        const newRequest: CorrectionRequest = {
            id: `cr-0${mockCorrectionRequests.length + 1}`,
            requestNumber: `CR-2026-0${mockCorrectionRequests.length + 1}`,
            staffId: input.staffId,
            staffName: staff?.name || 'Unknown',
            staffCode: staff?.staffCode || 'STF-UNKNOWN',
            attendanceDate: input.attendanceDate,
            correctionType: input.correctionType,
            ...includeWhenPresent("existingValue", input.existingValue),
            requestedCorrection: input.requestedCorrection,
            reason: input.reason,
            requestedBy: 'Suresh Patil',
            requestedByRole: 'FACILITY_MANAGER',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockCorrectionRequests.unshift(newRequest);
        return withMockDelay(newRequest);
    },
    approveCorrectionRequest: (correctionRequestId: string, input: ApproveCorrectionInput): Promise<{
        success: boolean;
    }> => {
        const req = mockCorrectionRequests.find(c => c.id === correctionRequestId);
        if (req) {
            req.status = 'APPROVED';
            req.reviewedBy = 'Suresh Patil';
            req.reviewedAt = new Date().toISOString();
            if (input.auditNote !== undefined) {
                req.auditNote = input.auditNote;
            }
        }
        return withMockDelay({ success: true });
    },
    rejectCorrectionRequest: (correctionRequestId: string, input: RejectCorrectionInput): Promise<{
        success: boolean;
    }> => {
        const req = mockCorrectionRequests.find(c => c.id === correctionRequestId);
        if (req) {
            req.status = 'REJECTED';
            req.reviewedBy = 'Suresh Patil';
            req.reviewedAt = new Date().toISOString();
            req.rejectionReason = input.rejectionReason;
        }
        return withMockDelay({ success: true });
    },
    getMonthlyAttendanceReport: (params?: Record<string, string>): Promise<MonthlyAttendanceRow[]> => withMockDelay(mockMonthlyAttendanceReport),
    getVendorAttendanceReport: (params?: Record<string, string>): Promise<VendorAttendanceRow[]> => withMockDelay(mockVendorAttendanceReport),
    getStaffAttendanceDetail: (staffId: string, params?: Record<string, string>): Promise<StaffMonthlyAttendance> => {
        const staff = mockStaffProfiles.find(s => s.id === staffId);
        const summary = mockMonthlyAttendanceReport.find(r => r.staffId === staffId) || {
            staffId, staffName: staff?.name || 'Unknown', staffCode: staff?.staffCode || 'STF-UNKNOWN',
            category: staff?.category || 'OTHER', expectedDays: 26, presentDays: 24, absentDays: 2,
            lateDays: 1, halfDays: 0, missingCheckoutCount: 0, correctionsCount: 0, attendancePercentage: 92
        };
        return withMockDelay({
            staffId,
            staffName: staff?.name || 'Unknown',
            staffCode: staff?.staffCode || 'STF-UNKNOWN',
            month: 'June',
            year: 2026,
            summary,
            dailyRecords: Array.from({ length: 30 }).map((_, idx) => ({
                date: `2026-06-${String(idx + 1).padStart(2, '0')}`,
                status: idx % 7 === 6 ? 'WEEKLY_OFF' as const : (idx % 10 === 0 ? 'ABSENT' as const : 'PRESENT' as const),
                ...includeWhenPresent("checkInTime", idx % 7 === 6 || idx % 10 === 0 ? undefined : '09:02 AM'),
                ...includeWhenPresent("checkOutTime", idx % 7 === 6 || idx % 10 === 0 ? undefined : '17:05 PM'),
                source: 'BIOMETRIC_DEVICE',
                correctionApplied: false
            })),
            corrections: mockCorrectionRequests.filter(c => c.staffId === staffId)
        });
    },
    getBiometricDevices: (params?: Record<string, string>): Promise<BiometricDevice[]> => {
        let list = [...mockBiometricDevices];
        if (params?.status) {
            list = list.filter(d => d.status === params.status);
        }
        return withMockDelay(list);
    },
    getBiometricDeviceDetail: (deviceId: string): Promise<BiometricDevice> => withMockDelay(mockBiometricDevices.find(d => d.id === deviceId) || getRequiredItem(mockBiometricDevices, 0, "staffAttendance.mockSource.ts")),
    getBiometricMappings: (deviceId: string): Promise<BiometricMapping[]> => withMockDelay(mockBiometricMappings.filter(m => m.deviceId === deviceId)),
    createBiometricMapping: (input: CreateBiometricMappingInput): Promise<BiometricMapping> => {
        const dev = mockBiometricDevices.find(d => d.id === input.deviceId);
        const staff = mockStaffProfiles.find(s => s.id === input.staffId);
        const newMapping: BiometricMapping = {
            id: `map-0${mockBiometricMappings.length + 1}`,
            deviceId: input.deviceId,
            deviceName: dev?.deviceName || 'Reader',
            deviceCode: dev?.deviceCode || 'BIO-DEV',
            biometricEmployeeCode: input.biometricEmployeeCode,
            staffId: input.staffId,
            ...includeWhenPresent("staffName", staff?.name),
            ...includeWhenPresent("staffCode", staff?.staffCode),
            status: 'ACTIVE',
            effectiveFrom: input.effectiveFrom,
            createdBy: 'Suresh Patil',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...includeWhenPresent("notes", input.notes)
        };
        mockBiometricMappings.push(newMapping);
        return withMockDelay(newMapping);
    },
    getBiometricSyncJobs: (params?: Record<string, string>): Promise<BiometricSyncJob[]> => withMockDelay(mockBiometricSyncJobs),
    getBiometricSyncErrors: (syncJobId: string): Promise<BiometricSyncError[]> => withMockDelay(mockBiometricSyncErrors.filter(e => e.syncJobId === syncJobId)),
    resolveSyncError: (syncErrorId: string, input: ResolveSyncErrorInput): Promise<{
        success: boolean;
    }> => {
        const err = mockBiometricSyncErrors.find(e => e.id === syncErrorId);
        if (err) {
            err.status = input.action === 'RESOLVE' ? 'RESOLVED' : 'IGNORED';
            err.resolvedBy = 'Suresh Patil';
            err.resolvedAt = new Date().toISOString();
            err.resolutionNote = input.resolutionNote;
        }
        return withMockDelay({ success: true });
    },
    ignoreSyncError: (syncErrorId: string, input: ResolveSyncErrorInput): Promise<{
        success: boolean;
    }> => staffAttendanceMockSource.resolveSyncError(syncErrorId, { ...input, action: 'IGNORE' }),
    getDuplicatePunches: (params?: Record<string, string>): Promise<DuplicatePunchCandidate[]> => withMockDelay(mockDuplicatePunches.filter(d => d.status === 'OPEN')),
    resolveDuplicatePunch: (duplicateId: string, input: ResolveDuplicatePunchInput): Promise<{
        success: boolean;
    }> => {
        const dup = mockDuplicatePunches.find(d => d.id === duplicateId);
        if (dup) {
            dup.status = input.action === 'KEEP_EXISTING' ? 'RESOLVED_KEEP_EXISTING' : (input.action === 'KEEP_NEWER' ? 'RESOLVED_KEEP_NEWER' : 'IGNORED');
        }
        return withMockDelay({ success: true });
    },
    getMissingCheckout: (params?: Record<string, string>): Promise<MissingCheckoutRecord[]> => withMockDelay(mockMissingCheckouts.filter(m => m.correctionStatus === 'OPEN')),
    createMissingCheckoutCorrection: (missingCheckoutId: string, input: {
        requestedCorrection: string;
        reason: string;
    }): Promise<{
        success: boolean;
    }> => {
        const rec = mockMissingCheckouts.find(m => m.id === missingCheckoutId);
        if (rec) {
            rec.correctionStatus = 'CORRECTION_CREATED';
        }
        return withMockDelay({ success: true });
    },
    getAttendanceSettings: (): Promise<AttendanceSettings> => withMockDelay({
        shiftGracePeriodMinutes: 15,
        lateMarkingThresholdMinutes: 30,
        missingCheckoutWindowHours: 12,
        autoDuplicateWindowMinutes: 2,
        correctionApprovalRequired: true,
        correctionApprovalRoles: ['SECRETARY', 'CHAIRPERSON', 'FACILITY_MANAGER'],
        vendorReportLockDayOfMonth: 5,
        biometricSyncSchedule: 'Every 30 minutes',
        dataRetentionMonths: 24
    })
};
export type StaffAttendanceRepository = typeof staffAttendanceMockSource;

