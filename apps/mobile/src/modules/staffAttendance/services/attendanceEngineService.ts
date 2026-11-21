import type {
  AttendancePunch,
  AttendanceDay,
  AttendanceStatus,
  PunchType,
  PunchSource,
  ManualAttendanceInput,
  DailyAttendanceSummary,
} from '../../../shared/types/attendance.types';
import type { ShiftDefinition } from '../../../shared/types/staff.types';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import { assertSocietyContext, canRecordManualAttendance } from '../data/staffAttendanceActor';
import { generateOperationId } from '../../../core/api/idempotency';

export interface AttendancePolicy {
  gracePeriodMinutes: number;
  halfDayThresholdMinutes: number;
  fullDayThresholdMinutes: number;
  missingCheckoutWindowHours: number;
}

const DEFAULT_POLICY: AttendancePolicy = {
  gracePeriodMinutes: 15,
  halfDayThresholdMinutes: 240,
  fullDayThresholdMinutes: 480,
  missingCheckoutWindowHours: 12,
};

export class AttendanceEngineService {
  private punches: AttendancePunch[] = [];
  private attendanceDays = new Map<string, AttendanceDay>();
  private policy: AttendancePolicy = { ...DEFAULT_POLICY };

  constructor(policy?: Partial<AttendancePolicy>) {
    if (policy) {
      this.policy = { ...DEFAULT_POLICY, ...policy };
    }
  }

  public ingestPunch(punch: AttendancePunch): void {
    this.punches.push({ ...punch });
  }

  public recordManualAttendance(
    actor: StaffOperationsActor,
    societyId: string,
    input: ManualAttendanceInput & { staffName: string; staffCode: string; location: string }
  ): AttendancePunch {
    assertSocietyContext(actor, societyId);
    if (!canRecordManualAttendance(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to record manual attendance');
    }

    const punchId = `pn-man-${generateOperationId('pn')}`;
    const punchTime = `${input.date}T${input.punchTime}:00Z`;

    const punch: AttendancePunch = {
      id: punchId,
      staffId: input.staffId,
      staffName: input.staffName,
      staffCode: input.staffCode,
      punchTime,
      punchType: input.punchType,
      source: 'MANUAL',
      location: input.location,
      isDuplicate: false,
      isMapped: true,
      notes: `Manual attendance: ${input.reason}`,
      createdAt: new Date().toISOString(),
    };

    this.punches.push(punch);
    return punch;
  }

  public deriveAttendanceForStaffDay(
    staffId: string,
    staffName: string,
    staffCode: string,
    date: string,
    shift?: ShiftDefinition,
    context?: { isOnLeave?: boolean; isWeeklyOff?: boolean; isHoliday?: boolean }
  ): AttendanceDay {
    const dayKey = `${staffId}_${date}`;

    if (context?.isOnLeave) {
      const day: AttendanceDay = {
        date,
        staffId,
        staffName,
        staffCode,
        ...(shift ? { shiftId: shift.id, shiftName: shift.shiftName } : {}),
        status: 'ON_LEAVE',
        punches: [],
        isManual: false,
        correctionApplied: false,
      };
      this.attendanceDays.set(dayKey, day);
      return day;
    }

    if (context?.isWeeklyOff) {
      const day: AttendanceDay = {
        date,
        staffId,
        staffName,
        staffCode,
        ...(shift ? { shiftId: shift.id, shiftName: shift.shiftName } : {}),
        status: 'WEEKLY_OFF',
        punches: [],
        isManual: false,
        correctionApplied: false,
      };
      this.attendanceDays.set(dayKey, day);
      return day;
    }

    if (context?.isHoliday) {
      const day: AttendanceDay = {
        date,
        staffId,
        staffName,
        staffCode,
        ...(shift ? { shiftId: shift.id, shiftName: shift.shiftName } : {}),
        status: 'HOLIDAY',
        punches: [],
        isManual: false,
        correctionApplied: false,
      };
      this.attendanceDays.set(dayKey, day);
      return day;
    }

    const isOvernight = shift ? this.isOvernightShift(shift) : false;
    const nextDate = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const relevantPunches = this.punches.filter(p => {
      if (p.staffId !== staffId || p.isDuplicate) return false;
      const punchDate = p.punchTime.split('T')[0];
      if (punchDate === date) return true;
      if (isOvernight && punchDate === nextDate && p.punchType === 'OUT') return true;
      return false;
    }).sort((a, b) => a.punchTime.localeCompare(b.punchTime));

    if (relevantPunches.length === 0) {
      const day: AttendanceDay = {
        date,
        staffId,
        staffName,
        staffCode,
        ...(shift ? { shiftId: shift.id, shiftName: shift.shiftName } : {}),
        status: 'ABSENT',
        punches: [],
        isManual: false,
        correctionApplied: false,
      };
      this.attendanceDays.set(dayKey, day);
      return day;
    }

    const inPunches = relevantPunches.filter(p => p.punchType === 'IN');
    const outPunches = relevantPunches.filter(p => p.punchType === 'OUT');
    const hasManual = relevantPunches.some(p => p.source === 'MANUAL');

    const firstIn = inPunches[0];
    const lastOut = outPunches[outPunches.length - 1];

    let minutesLate = 0;
    if (firstIn && shift) {
      const [shiftH, shiftM] = shift.startTime.split(':').map(Number);
      const shiftStartMins = (shiftH ?? 0) * 60 + (shiftM ?? 0);
      const inTimePart = firstIn.punchTime.split('T')[1]?.slice(0, 5) ?? '00:00';
      const [inH, inM] = inTimePart.split(':').map(Number);
      const inMins = (inH ?? 0) * 60 + (inM ?? 0);

      const grace = shift.gracePeriodMinutes ?? this.policy.gracePeriodMinutes;
      if (inMins > shiftStartMins + grace) {
        minutesLate = inMins - shiftStartMins;
      }
    }

    if (firstIn && !lastOut) {
      const day: AttendanceDay = {
        date,
        staffId,
        staffName,
        staffCode,
        ...(shift ? { shiftId: shift.id, shiftName: shift.shiftName } : {}),
        status: 'MISSING_CHECKOUT',
        firstPunchIn: firstIn.punchTime,
        ...(minutesLate > 0 ? { minutesLate } : {}),
        punches: relevantPunches,
        isManual: hasManual,
        correctionApplied: false,
      };
      this.attendanceDays.set(dayKey, day);
      return day;
    }

    let workingMinutes = 0;
    if (firstIn && lastOut) {
      const inMs = new Date(firstIn.punchTime).getTime();
      const outMs = new Date(lastOut.punchTime).getTime();
      workingMinutes = Math.max(0, Math.floor((outMs - inMs) / (1000 * 60)));
    }

    let status: AttendanceStatus = 'PRESENT';
    if (workingMinutes < this.policy.halfDayThresholdMinutes) {
      status = 'HALF_DAY';
    } else if (minutesLate > 0) {
      status = 'LATE';
    }

    const day: AttendanceDay = {
      date,
      staffId,
      staffName,
      staffCode,
      ...(shift ? { shiftId: shift.id, shiftName: shift.shiftName } : {}),
      status,
      ...(firstIn ? { firstPunchIn: firstIn.punchTime } : {}),
      ...(lastOut ? { lastPunchOut: lastOut.punchTime } : {}),
      totalWorkingMinutes: workingMinutes,
      ...(minutesLate > 0 ? { minutesLate } : {}),
      punches: relevantPunches,
      isManual: hasManual,
      correctionApplied: false,
    };

    this.attendanceDays.set(dayKey, day);
    return day;
  }

  public reconcileDelayedOfflinePunch(outPunch: AttendancePunch): AttendanceDay | undefined {
    this.ingestPunch(outPunch);
    const date = outPunch.punchTime.split('T')[0] ?? '';
    const dayKey = `${outPunch.staffId}_${date}`;
    const existing = this.attendanceDays.get(dayKey);

    if (existing && existing.status === 'MISSING_CHECKOUT') {
      const firstIn = existing.firstPunchIn;
      let workingMinutes = 0;
      if (firstIn) {
        const inMs = new Date(firstIn).getTime();
        const outMs = new Date(outPunch.punchTime).getTime();
        workingMinutes = Math.max(0, Math.floor((outMs - inMs) / (1000 * 60)));
      }

      const reconciled: AttendanceDay = {
        ...existing,
        status: workingMinutes < this.policy.halfDayThresholdMinutes ? 'HALF_DAY' : (existing.minutesLate ? 'LATE' : 'PRESENT'),
        lastPunchOut: outPunch.punchTime,
        totalWorkingMinutes: workingMinutes,
        punches: [...existing.punches, outPunch],
      };
      this.attendanceDays.set(dayKey, reconciled);
      return reconciled;
    }
    return existing;
  }

  public getDerivedDay(staffId: string, date: string): AttendanceDay | undefined {
    return this.attendanceDays.get(`${staffId}_${date}`);
  }

  public getAllPunches(): AttendancePunch[] {
    return [...this.punches];
  }

  public getDailySummary(date: string): DailyAttendanceSummary {
    const daysForDate = Array.from(this.attendanceDays.values()).filter(d => d.date === date);
    const totalExpected = daysForDate.length;
    let present = 0;
    let absent = 0;
    let late = 0;
    let halfDay = 0;
    let onLeave = 0;
    let weeklyOff = 0;
    let missingCheckout = 0;
    let manualEntries = 0;
    let biometricEntries = 0;

    for (const d of daysForDate) {
      if (d.status === 'PRESENT') present++;
      else if (d.status === 'ABSENT') absent++;
      else if (d.status === 'LATE') { late++; present++; }
      else if (d.status === 'HALF_DAY') halfDay++;
      else if (d.status === 'ON_LEAVE') onLeave++;
      else if (d.status === 'WEEKLY_OFF') weeklyOff++;
      else if (d.status === 'MISSING_CHECKOUT') missingCheckout++;

      if (d.isManual) manualEntries++;
      else biometricEntries++;
    }

    const eligibleDays = totalExpected - onLeave - weeklyOff;
    const attendancePercentage = eligibleDays > 0 ? Math.round(((present + halfDay * 0.5) / eligibleDays) * 100) : 100;

    return {
      date,
      totalExpected,
      present,
      absent,
      late,
      halfDay,
      onLeave,
      weeklyOff,
      missingCheckout,
      manualEntries,
      biometricEntries,
      correctionsPending: 0,
      attendancePercentage,
    };
  }

  private isOvernightShift(shift: ShiftDefinition): boolean {
    const [startH, startM] = shift.startTime.split(':').map(Number);
    const [endH, endM] = shift.endTime.split(':').map(Number);
    const startMins = (startH ?? 0) * 60 + (startM ?? 0);
    const endMins = (endH ?? 0) * 60 + (endM ?? 0);
    return endMins <= startMins;
  }
}

