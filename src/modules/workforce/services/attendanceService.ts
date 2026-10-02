import { mockStore } from '../../../core/mockStore/mockStore';
import type {
    AttendancePunch,
    DailyAttendanceSummary,
    StaffDailyAttendance,
    AttendanceCorrectionRequest,
    MonthlyAttendanceRecord,
    LeaveRecord,
    OvertimeRecord,
    AttendanceSource,
    PunchType,
    AttendanceStatus,
    CorrectionType,
    CorrectionStatus,
    MonthlyAttendanceStatus,
    StaffProfile,
} from '../../../shared/types/workforcePhase11.types';
import type { BiometricSyncError, BiometricSyncErrorType } from '../../../shared/types/biometric.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';

function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const attendanceService = {
    async recordPunch(
        input: Omit<AttendancePunch, 'id' | 'isDuplicate' | 'isMapped' | 'attendanceStatus' | 'createdAt'>,
        idempotencyKey?: string
    ): Promise<AttendancePunch> {
        const now = new Date().toISOString();
        if (idempotencyKey) {
            const existing = mockStore.getState().attendancePunches?.find(p => p.idempotencyKey === idempotencyKey);
            if (existing) return existing;
        }
        const staff = mockStore.getState().staff?.find(s => s.id === input.staffId);
        if (!staff) throw new Error('Staff not found');

        const duplicateKey = `${input.staffId}-${input.punchTime}-${input.punchType}`;
        const existingDuplicate = mockStore.getState().attendancePunches?.find(
            p => p.duplicateKey === duplicateKey && p.societyId === input.societyId
        );
        const isDuplicate = !!existingDuplicate;

        const punch: AttendancePunch = {
            id: generateId('punch'),
            staffId: input.staffId,
            staffName: input.staffName,
            staffCode: input.staffCode || staff.staffCode || '',
            punchTime: input.punchTime,
            punchType: input.punchType,
            source: input.source,
            location: input.location || staff.assignedLocation || 'OFFICE',
            isDuplicate,
            duplicateKey,
            isMapped: !!staff.biometricEmployeeCode,
            mappingStatus: staff.biometricEmployeeCode ? 'MAPPED' : 'UNMAPPED',
            attendanceStatus: 'PRESENT',
            idempotencyKey: idempotencyKey || generateId('idem'),
            createdAt: now,
            ...(input.societyId || staff.societyId ? { societyId: input.societyId || staff.societyId } : {}),
            ...(input.biometricEmployeeCode ? { biometricEmployeeCode: input.biometricEmployeeCode } : {}),
            ...(input.deviceId ? { deviceId: input.deviceId } : {}),
            ...(input.deviceName ? { deviceName: input.deviceName } : {}),
            ...(input.notes ? { notes: input.notes } : {}),
            ...(input.homeContextId ? { homeContextId: input.homeContextId } : {}),
            ...(input.unitId ? { unitId: input.unitId } : {}),
            ...(input.dataScopeKey ? { dataScopeKey: input.dataScopeKey } : {}),
        };

        const punches = mockStore.getState().attendancePunches;
        if (punches) {
            punches.push(punch);
        } else {
            mockStore.getState().attendancePunches = [punch];
        }
        mockStore.notify();

        const punchActionMap: Record<PunchType, 'ATTENDANCE_PUNCH_IN' | 'ATTENDANCE_PUNCH_OUT' | 'ATTENDANCE_PUNCH_BREAK_IN' | 'ATTENDANCE_PUNCH_BREAK_OUT' | 'ATTENDANCE_PUNCH_UNKNOWN'> = {
            IN: 'ATTENDANCE_PUNCH_IN',
            OUT: 'ATTENDANCE_PUNCH_OUT',
            BREAK_IN: 'ATTENDANCE_PUNCH_BREAK_IN',
            BREAK_OUT: 'ATTENDANCE_PUNCH_BREAK_OUT',
            UNKNOWN: 'ATTENDANCE_PUNCH_UNKNOWN',
        };

        createAuditEntry({
            actorUserId: input.staffId,
            actorType: 'STAFF',
            societyId: punch.societyId || '',
            action: punchActionMap[input.punchType] || 'ATTENDANCE_PUNCH_UNKNOWN',
            entityType: 'ATTENDANCE_PUNCH',
            entityId: punch.id,
            newState: { punchType: input.punchType, source: input.source, isDuplicate },
            ...(punch.idempotencyKey ? { idempotencyKey: punch.idempotencyKey } : {}),
            source: input.source === 'BIOMETRIC_DEVICE' ? 'BIOMETRIC_DEVICE' : 'MOBILE',
            outcome: 'SUCCESS',
        });

        await this.updateDailyAttendance(input.staffId, punch.societyId || '', new Date(input.punchTime).toISOString().split('T')[0] ?? '');
        return punch;
    },

    async recordManualPunch(input: {
        staffId: string;
        date: string;
        punchType: PunchType;
        punchTime: string;
        reason: string;
        source: AttendanceSource;
        recordedBy: string;
        societyId: string;
        idempotencyKey?: string;
        location?: string;
    }): Promise<AttendancePunch> {
        const staff = mockStore.getState().staff?.find(s => s.id === input.staffId);
        if (!staff) throw new Error('Staff not found');

        return this.recordPunch({
            staffId: input.staffId,
            staffName: staff.name,
            staffCode: staff.staffCode || '',
            punchTime: `${input.date}T${input.punchTime}:00.000Z`,
            punchType: input.punchType,
            source: 'MANUAL',
            location: input.location || staff.assignedLocation || 'OFFICE',
            notes: `Manual entry: ${input.reason}`,
            societyId: input.societyId,
        }, input.idempotencyKey);
    },

    async recordBiometricPunch(input: {
        biometricEmployeeCode: string;
        punchTime: string;
        punchType: PunchType;
        deviceId: string;
        deviceName: string;
        location: string;
        societyId: string;
        idempotencyKey?: string;
    }): Promise<AttendancePunch | null> {
        const mapping = mockStore.getState().biometricMappings?.find(m => m.biometricEmployeeCode === input.biometricEmployeeCode && m.status === 'ACTIVE');
        if (!mapping || !mapping.staffId) {
            await this.logSyncError({
                syncJobId: 'manual',
                deviceId: input.deviceId,
                deviceCode: '',
                errorType: 'UNKNOWN_EMPLOYEE_CODE',
                biometricEmployeeCode: input.biometricEmployeeCode,
                punchTime: input.punchTime,
                punchType: input.punchType,
                errorMessage: 'Unknown biometric employee code',
                suggestedAction: 'REVIEW_MANUALLY',
            });
            return null;
        }

        return this.recordPunch({
            staffId: mapping.staffId,
            staffName: mapping.staffName ?? '',
            staffCode: mapping.staffCode || '',
            biometricEmployeeCode: input.biometricEmployeeCode,
            punchTime: input.punchTime,
            punchType: input.punchType,
            source: 'BIOMETRIC_DEVICE',
            deviceId: input.deviceId,
            deviceName: input.deviceName,
            location: input.location,
            societyId: input.societyId,
        }, input.idempotencyKey);
    },

    async updateDailyAttendance(staffId: string, societyId: string, date: string): Promise<DailyAttendanceSummary> {
        mockStore.notify();
        return {
            id: 'summary-' + date,
            date,
            societyId,
            totalExpected: 0,
            present: 0,
            absent: 0,
            late: 0,
            halfDay: 0,
            onLeave: 0,
            weeklyOff: 0,
            holiday: 0,
            missingCheckout: 0,
            manualEntries: 0,
            biometricEntries: 0,
            correctionsPending: 0,
            attendancePercentage: 0,
            byCategory: {},
            byVendor: {},
            byLocation: {},
        };
    },

    async getStaffDailyAttendance(staffId: string, date: string): Promise<StaffDailyAttendance | null> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) return null;

        const punches = mockStore.getState().attendancePunches?.filter(p => p.staffId === staffId && p.punchTime.startsWith(date)) || [];
        const inPunch = punches.find(p => p.punchType === 'IN');
        const outPunch = punches.find(p => p.punchType === 'OUT');
        const breakIn = punches.find(p => p.punchType === 'BREAK_IN');
        const breakOut = punches.find(p => p.punchType === 'BREAK_OUT');
        const todayIso = new Date().toISOString().split('T')[0] ?? date;

        const roster = mockStore.getState().rosters?.find(r => r.shiftAssignments.some(e => e.staffId === staffId && e.date === todayIso));
        const rosterEntry = roster?.shiftAssignments.find(e => e.staffId === staffId);
        const shift = rosterEntry ? mockStore.getState().shifts?.find(s => s.id === rosterEntry.shiftId) : null;
        const expectedIn = shift?.startTime ? `${todayIso}T${shift.startTime}:00.000Z` : undefined;
        const expectedOut = shift?.endTime ? `${todayIso}T${shift.endTime}:00.000Z` : undefined;
        const inTime = inPunch?.punchTime;
        const outTime = outPunch?.punchTime;

        let status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE' | 'WEEKLY_OFF' | 'HOLIDAY' | 'MISSING_CHECKOUT' | 'PENDING_CORRECTION' = 'ABSENT';
        let minutesLate = 0;
        let minutesEarly = 0;
        let overtimeMinutes = 0;
        let missingCheckout = false;

        if (inPunch) {
            if (outPunch) {
                status = 'PRESENT';
            } else {
                status = 'MISSING_CHECKOUT';
                missingCheckout = true;
            }
            if (expectedIn) {
                const expectedInTime = new Date(expectedIn).getTime();
                const actualInTime = new Date(inPunch.punchTime).getTime();
                if (actualInTime > expectedInTime) {
                    minutesLate = Math.floor((actualInTime - expectedInTime) / 60000);
                    if (minutesLate > 0) status = 'LATE';
                }
            }
        }

        if (outPunch && expectedOut) {
            const expectedOutTime = new Date(expectedOut).getTime();
            const actualOutTime = new Date(outPunch.punchTime).getTime();
            if (actualOutTime < expectedOutTime) {
                minutesEarly = Math.floor((expectedOutTime - actualOutTime) / 60000);
            }
            if (actualOutTime > expectedOutTime) {
                overtimeMinutes = Math.floor((actualOutTime - expectedOutTime) / 60000);
            }
        }

        const result: StaffDailyAttendance = {
            id: generateId('daily'),
            staffId,
            date: todayIso,
            status,
            minutesLate,
            minutesEarly,
            overtimeMinutes,
            missingCheckout,
            punches: mockStore.getState().attendancePunches?.filter(p => p.staffId === staffId && p.punchTime.startsWith(todayIso)) || [],
            source: 'BIOMETRIC_DEVICE',
            societyId: staff.societyId ?? '',
            ...(rosterEntry?.shiftId ? { shiftId: rosterEntry.shiftId, rosterShiftId: rosterEntry.shiftId } : {}),
            ...(rosterEntry?.shiftName ? { shiftName: rosterEntry.shiftName } : {}),
            ...(rosterEntry?.id ? { rosterEntryId: rosterEntry.id } : {}),
            ...(expectedIn ? { expectedInTime: expectedIn } : {}),
            ...(expectedOut ? { expectedOutTime: expectedOut } : {}),
            ...(inTime ? { actualInTime: inTime } : {}),
            ...(outTime ? { actualOutTime: outTime } : {}),
            ...(breakIn?.punchTime ? { breakInTime: breakIn.punchTime } : {}),
            ...(breakOut?.punchTime ? { breakOutTime: breakOut.punchTime } : {}),
        };
        return result;
    },

    async createCorrectionRequest(
        input: Omit<AttendanceCorrectionRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt' | 'status'> & { requestedByRole?: string }
    ): Promise<AttendanceCorrectionRequest> {
        const now = new Date().toISOString();
        const request: AttendanceCorrectionRequest = {
            id: generateId('corr'),
            requestNumber: `CORR-${Date.now()}`,
            ...input,
            status: 'PENDING',
            createdAt: now,
            updatedAt: now,
            societyId: input.societyId ?? '',
        };

        const corrections = mockStore.getState().attendanceCorrections;
        if (corrections) {
            corrections.push(request);
        } else {
            mockStore.getState().attendanceCorrections = [request];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: input.requestedBy,
            actorType: input.requestedByRole === 'WORKFORCE_ADMIN' ? 'WORKFORCE_ADMIN' : 'STAFF',
            societyId: input.societyId ?? '',
            action: 'ATTENDANCE_CORRECTION_REQUESTED',
            entityType: 'ATTENDANCE_CORRECTION',
            entityId: request.id,
            newState: { type: input.correctionType, correction: input.requestedCorrection },
            idempotencyKey: createIdempotencyKey(`att_corr_${request.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return request;
    },

    async reviewCorrectionRequest(
        requestId: string,
        reviewedBy: string,
        action: 'APPROVE' | 'REJECT',
        rejectionReason?: string
    ): Promise<AttendanceCorrectionRequest | null> {
        const corrections = mockStore.getState().attendanceCorrections;
        if (!corrections) return null;
        const index = corrections.findIndex(c => c.id === requestId);
        if (index === -1) return null;
        const correction = corrections[index];
        if (!correction) return null;

        if (correction.status !== 'PENDING') {
            throw new Error('Correction already processed');
        }

        const now = new Date().toISOString();
        const updated: AttendanceCorrectionRequest = {
            ...correction,
            status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
            reviewedBy,
            reviewedAt: now,
            updatedAt: now,
            ...(action === 'REJECT' && rejectionReason ? { rejectionReason } : {}),
        };
        corrections[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: reviewedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: correction.societyId ?? '',
            action: action === 'APPROVE' ? 'ATTENDANCE_CORRECTION_APPROVED' : 'ATTENDANCE_CORRECTION_REJECTED',
            entityType: 'ATTENDANCE_CORRECTION',
            entityId: requestId,
            previousState: { status: 'PENDING' },
            newState: { status: updated.status, ...(rejectionReason ? { rejectionReason } : {}) },
            idempotencyKey: createIdempotencyKey(`att_corr_${action}_${requestId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async applyCorrection(requestId: string, appliedBy: string): Promise<AttendancePunch | null> {
        const corrections = mockStore.getState().attendanceCorrections;
        if (!corrections) return null;
        const index = corrections.findIndex(c => c.id === requestId);
        if (index === -1) return null;
        const correction = corrections[index];
        if (!correction) return null;

        if (correction.status !== 'APPROVED') {
            throw new Error('Correction not approved');
        }

        const punches = mockStore.getState().attendancePunches;
        if (!punches) return null;
        const punchIndex = punches.findIndex(p => p.id === correction.originalPunchId);
        if (punchIndex === -1) return null;
        const punch = punches[punchIndex];
        if (!punch) return null;

        const updatedPunch: AttendancePunch = {
            ...punch,
            punchTime: correction.proposedPunchTime || punch.punchTime,
            punchType: correction.proposedPunchType || punch.punchType,
            notes: `${punch.notes || ''} | Corrected: ${correction.reason}`,
        };
        punches[punchIndex] = updatedPunch;
        mockStore.notify();

        createAuditEntry({
            actorUserId: appliedBy || 'SYSTEM',
            actorType: 'SYSTEM',
            societyId: correction.societyId ?? '',
            action: 'ATTENDANCE_CORRECTION_APPLIED',
            entityType: 'ATTENDANCE_PUNCH',
            entityId: punch.id,
            previousState: { punchTime: punch.punchTime, punchType: punch.punchType },
            newState: { punchTime: updatedPunch.punchTime, punchType: updatedPunch.punchType },
            idempotencyKey: createIdempotencyKey(`att_corr_apply_${requestId}`),
            source: 'SYSTEM_JOB',
            outcome: 'SUCCESS',
        });
        return updatedPunch;
    },

    async requestLeave(input: Omit<LeaveRecord, 'id' | 'status' | 'appliedAt' | 'createdAt' | 'updatedAt'>): Promise<LeaveRecord> {
        const now = new Date().toISOString();
        const leave: LeaveRecord = {
            id: generateId('leave'),
            ...input,
            status: 'PENDING',
            appliedAt: now,
            createdAt: now,
            updatedAt: now,
            societyId: input.societyId ?? '',
        };

        const leaveRecords = mockStore.getState().leaveRecords;
        if (leaveRecords) {
            leaveRecords.push(leave);
        } else {
            mockStore.getState().leaveRecords = [leave];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: input.staffId,
            actorType: 'STAFF',
            societyId: input.societyId ?? '',
            action: 'LEAVE_REQUESTED',
            entityType: 'LEAVE_RECORD',
            entityId: leave.id,
            newState: { type: input.leaveType, days: input.totalDays },
            idempotencyKey: createIdempotencyKey(`leave_${leave.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return leave;
    },

    async approveLeave(leaveId: string, approvedBy: string): Promise<LeaveRecord | null> {
        const leaveRecords = mockStore.getState().leaveRecords;
        if (!leaveRecords) return null;
        const index = leaveRecords.findIndex(l => l.id === leaveId);
        if (index === -1) return null;
        const leave = leaveRecords[index];
        if (!leave || leave.status !== 'PENDING') return null;

        const now = new Date().toISOString();
        const updated: LeaveRecord = {
            ...leave,
            status: 'APPROVED',
            approvedBy,
            approvedAt: now,
            updatedAt: now,
        };
        leaveRecords[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: approvedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: leave.societyId ?? '',
            action: 'LEAVE_APPROVED',
            entityType: 'LEAVE_RECORD',
            entityId: leaveId,
            previousState: { status: 'PENDING' },
            newState: { status: 'APPROVED' },
            idempotencyKey: generateId('leave_approve'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async recordOvertime(input: Omit<OvertimeRecord, 'id' | 'approvedMinutes' | 'approvalStatus' | 'createdAt' | 'updatedAt'>): Promise<OvertimeRecord> {
        const now = new Date().toISOString();
        const overtime: OvertimeRecord = {
            id: generateId('ot'),
            ...input,
            approvedMinutes: 0,
            approvalStatus: 'PENDING',
            createdAt: now,
            updatedAt: now,
            societyId: input.societyId ?? '',
        };

        const overtimeRecords = mockStore.getState().overtimeRecords;
        if (overtimeRecords) {
            overtimeRecords.push(overtime);
        } else {
            mockStore.getState().overtimeRecords = [overtime];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: input.staffId,
            actorType: 'STAFF',
            societyId: input.societyId ?? '',
            action: 'OVERTIME_RECORDED',
            entityType: 'OVERTIME_RECORD',
            entityId: overtime.id,
            newState: { date: input.date, overtimeMinutes: input.overtimeMinutes },
            idempotencyKey: generateId('ot_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return overtime;
    },

    async approveOvertime(overtimeId: string, approvedMinutes: number, approvedBy: string): Promise<OvertimeRecord | null> {
        const overtimeRecords = mockStore.getState().overtimeRecords;
        if (!overtimeRecords) return null;
        const index = overtimeRecords.findIndex(o => o.id === overtimeId);
        if (index === -1) return null;
        const overtime = overtimeRecords[index];
        if (!overtime) return null;

        const now = new Date().toISOString();
        const updated: OvertimeRecord = {
            ...overtime,
            approvedMinutes,
            approvalStatus: 'APPROVED',
            approvedBy,
            approvedAt: now,
            updatedAt: now,
        };
        overtimeRecords[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: approvedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: overtime.societyId ?? '',
            action: 'OVERTIME_APPROVED',
            entityType: 'OVERTIME_RECORD',
            entityId: overtimeId,
            previousState: { approvalStatus: 'PENDING' },
            newState: { approvalStatus: 'APPROVED', approvedMinutes },
            idempotencyKey: generateId('ot_approve_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async getDailyAttendanceSummary(societyId: string, date: string): Promise<DailyAttendanceSummary | null> {
        return {
            id: `summary-${date}`,
            societyId,
            date,
            totalExpected: 0,
            present: 0,
            absent: 0,
            late: 0,
            halfDay: 0,
            onLeave: 0,
            weeklyOff: 0,
            holiday: 0,
            missingCheckout: 0,
            manualEntries: 0,
            biometricEntries: 0,
            correctionsPending: 0,
            attendancePercentage: 0,
            byCategory: {},
            byVendor: {},
            byLocation: {},
        };
    },

    async getMonthlyAttendance(staffId: string, month: string, year: number): Promise<MonthlyAttendanceRecord | null> {
        return null;
    },

    async getAttendanceDashboard(societyId: string, date: string): Promise<{
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
        lateArrivals: {
            staffName: string;
            staffCode: string;
            punchTime: string;
            minutesLate: number;
        }[];
        missingCheckouts: {
            staffName: string;
            staffCode: string;
            lastPunchTime: string;
            shiftEndTime: string;
        }[];
    }> {
        const summary = (await this.getDailyAttendanceSummary(societyId, date)) ?? {
            id: `summary-${date}`,
            societyId,
            date,
            totalExpected: 0,
            present: 0,
            absent: 0,
            late: 0,
            halfDay: 0,
            onLeave: 0,
            weeklyOff: 0,
            holiday: 0,
            missingCheckout: 0,
            manualEntries: 0,
            biometricEntries: 0,
            correctionsPending: 0,
            attendancePercentage: 0,
            byCategory: {},
            byVendor: {},
            byLocation: {},
        };
        return {
            summary,
            byCategory: [],
            byVendor: [],
            byLocation: [],
            recentPunches: [],
            lateArrivals: [],
            missingCheckouts: [],
        };
    },

    async logSyncError(input: {
        syncJobId: string;
        deviceId: string;
        deviceCode: string;
        errorType: BiometricSyncErrorType;
        biometricEmployeeCode?: string;
        punchTime?: string;
        punchType?: string;
        errorMessage: string;
        suggestedAction: string;
    }): Promise<void> {
        const error: BiometricSyncError = {
            id: generateId('sync_err'),
            syncJobId: input.syncJobId,
            deviceId: input.deviceId,
            deviceCode: input.deviceCode,
            errorType: input.errorType,
            errorMessage: input.errorMessage,
            suggestedAction: input.suggestedAction,
            status: 'OPEN',
            createdAt: new Date().toISOString(),
            ...(input.biometricEmployeeCode ? { biometricEmployeeCode: input.biometricEmployeeCode } : {}),
            ...(input.punchTime ? { punchTime: input.punchTime } : {}),
            ...(input.punchType ? { punchType: input.punchType } : {}),
        };
        const errors = mockStore.getState().biometricSyncErrors;
        if (errors) {
            errors.push(error);
        } else {
            mockStore.getState().biometricSyncErrors = [error];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: 'SYSTEM',
            actorType: 'SYSTEM',
            societyId: '',
            action: 'BIOMETRIC_SYNC_ERROR',
            entityType: 'BIOMETRIC_SYNC_ERROR',
            entityId: error.id,
            newState: { errorType: input.errorType, deviceId: input.deviceId },
            idempotencyKey: generateId('sync_err_'),
            source: 'SYSTEM_JOB',
            outcome: 'PARTIAL',
        });
    },
};

export default attendanceService;
