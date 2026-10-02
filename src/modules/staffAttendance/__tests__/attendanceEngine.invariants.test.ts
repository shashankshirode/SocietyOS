import { AttendanceEngineService } from '../services/attendanceEngineService';
import type { ShiftDefinition } from '../../../shared/types/staff.types';
import type { AttendancePunch } from '../../../shared/types/attendance.types';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';

describe('Attendance Engine Invariants', () => {
  const supervisorActor: StaffOperationsActor = {
    userId: 'usr-sup-01',
    societyId: 'soc-green-valley',
    role: 'SECURITY_SUPERVISOR',
    displayName: 'Supervisor Jagtap',
  };

  const sampleShift: ShiftDefinition = {
    id: 'sh-morning',
    shiftName: 'Morning Shift',
    startTime: '08:00',
    endTime: '16:00',
    gracePeriodMinutes: 15,
    location: 'Main Gate',
    assignedStaffCount: 5,
    weeklyOffDays: ['SUNDAY'],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
  };

  it('Invariant 17 & 18: AttendancePunch is immutable source evidence and distinct from derived AttendanceDay', () => {
    const engine = new AttendanceEngineService();

    const punchIn: AttendancePunch = {
      id: 'pn-001',
      staffId: 'stf-001',
      staffName: 'Ramesh Pawar',
      staffCode: 'STF-001',
      punchTime: '2026-06-15T07:55:00Z',
      punchType: 'IN',
      source: 'BIOMETRIC_DEVICE',
      location: 'Main Gate',
      isDuplicate: false,
      isMapped: true,
      createdAt: '2026-06-15T07:55:01Z',
    };

    const punchOut: AttendancePunch = {
      id: 'pn-002',
      staffId: 'stf-001',
      staffName: 'Ramesh Pawar',
      staffCode: 'STF-001',
      punchTime: '2026-06-15T16:05:00Z',
      punchType: 'OUT',
      source: 'BIOMETRIC_DEVICE',
      location: 'Main Gate',
      isDuplicate: false,
      isMapped: true,
      createdAt: '2026-06-15T16:05:02Z',
    };

    engine.ingestPunch(punchIn);
    engine.ingestPunch(punchOut);

    const derivedDay = engine.deriveAttendanceForStaffDay(
      'stf-001',
      'Ramesh Pawar',
      'STF-001',
      '2026-06-15',
      sampleShift
    );

    expect(derivedDay.status).toBe('PRESENT');
    expect(derivedDay.firstPunchIn).toBe('2026-06-15T07:55:00Z');
    expect(derivedDay.lastPunchOut).toBe('2026-06-15T16:05:00Z');
    expect(derivedDay.totalWorkingMinutes).toBe(490);

    const storedPunches = engine.getAllPunches();
    expect(storedPunches.length).toBe(2);
    expect(storedPunches[0]?.punchTime).toBe('2026-06-15T07:55:00Z');
    expect(storedPunches[1]?.punchTime).toBe('2026-06-15T16:05:00Z');
  });

  it('Invariant 20: Manual attendance is clearly recorded with source=MANUAL and does not fake biometric origin', () => {
    const engine = new AttendanceEngineService();

    const manualPunch = engine.recordManualAttendance(supervisorActor, 'soc-green-valley', {
      staffId: 'stf-002',
      staffName: 'Kailash Guard',
      staffCode: 'STF-002',
      location: 'Back Gate',
      date: '2026-06-15',
      punchTime: '08:05',
      punchType: 'IN',
      reason: 'Biometric terminal power cut at gate',
      confirmationChecked: true,
    });

    expect(manualPunch.source).toBe('MANUAL');
    expect(manualPunch.notes).toContain('Biometric terminal power cut');

    const derivedDay = engine.deriveAttendanceForStaffDay(
      'stf-002',
      'Kailash Guard',
      'STF-002',
      '2026-06-15',
      sampleShift
    );

    expect(derivedDay.isManual).toBe(true);
  });

  it('Late arrival is derived correctly with grace period (CD, CE, CF)', () => {
    const engine = new AttendanceEngineService();

    engine.ingestPunch({
      id: 'pn-on-time',
      staffId: 'stf-003',
      staffName: 'Punctual Guard',
      staffCode: 'STF-003',
      punchTime: '2026-06-15T08:14:00Z',
      punchType: 'IN',
      source: 'BIOMETRIC_DEVICE',
      location: 'Main Gate',
      isDuplicate: false,
      isMapped: true,
      createdAt: '2026-06-15T08:14:00Z',
    });
    engine.ingestPunch({
      id: 'pn-on-time-out',
      staffId: 'stf-003',
      staffName: 'Punctual Guard',
      staffCode: 'STF-003',
      punchTime: '2026-06-15T16:00:00Z',
      punchType: 'OUT',
      source: 'BIOMETRIC_DEVICE',
      location: 'Main Gate',
      isDuplicate: false,
      isMapped: true,
      createdAt: '2026-06-15T16:00:00Z',
    });

    const onTimeDay = engine.deriveAttendanceForStaffDay(
      'stf-003',
      'Punctual Guard',
      'STF-003',
      '2026-06-15',
      sampleShift
    );
    expect(onTimeDay.status).toBe('PRESENT');
    expect(onTimeDay.minutesLate).toBeUndefined();

    engine.ingestPunch({
      id: 'pn-late',
      staffId: 'stf-004',
      staffName: 'Late Guard',
      staffCode: 'STF-004',
      punchTime: '2026-06-15T08:25:00Z',
      punchType: 'IN',
      source: 'BIOMETRIC_DEVICE',
      location: 'Main Gate',
      isDuplicate: false,
      isMapped: true,
      createdAt: '2026-06-15T08:25:00Z',
    });
    engine.ingestPunch({
      id: 'pn-late-out',
      staffId: 'stf-004',
      staffName: 'Late Guard',
      staffCode: 'STF-004',
      punchTime: '2026-06-15T16:00:00Z',
      punchType: 'OUT',
      source: 'BIOMETRIC_DEVICE',
      location: 'Main Gate',
      isDuplicate: false,
      isMapped: true,
      createdAt: '2026-06-15T16:00:00Z',
    });

    const lateDay = engine.deriveAttendanceForStaffDay(
      'stf-004',
      'Late Guard',
      'STF-004',
      '2026-06-15',
      sampleShift
    );
    expect(lateDay.status).toBe('LATE');
    expect(lateDay.minutesLate).toBe(25);
  });

  it('Invariant 30 & 31: Missing checkout is created explicitly; late offline punch arrival reconciles it without fake manual punch', () => {
    const engine = new AttendanceEngineService();

    engine.ingestPunch({
      id: 'pn-in-only',
      staffId: 'stf-005',
      staffName: 'Offline Device Worker',
      staffCode: 'STF-005',
      punchTime: '2026-06-15T08:00:00Z',
      punchType: 'IN',
      source: 'BIOMETRIC_DEVICE',
      location: 'Main Gate',
      isDuplicate: false,
      isMapped: true,
      createdAt: '2026-06-15T08:00:00Z',
    });

    const dayInitial = engine.deriveAttendanceForStaffDay(
      'stf-005',
      'Offline Device Worker',
      'STF-005',
      '2026-06-15',
      sampleShift
    );
    expect(dayInitial.status).toBe('MISSING_CHECKOUT');
    expect(dayInitial.firstPunchIn).toBe('2026-06-15T08:00:00Z');
    expect(dayInitial.lastPunchOut).toBeUndefined();

    const lateArrivedOutPunch: AttendancePunch = {
      id: 'pn-delayed-out',
      staffId: 'stf-005',
      staffName: 'Offline Device Worker',
      staffCode: 'STF-005',
      punchTime: '2026-06-15T16:05:00Z',
      punchType: 'OUT',
      source: 'BIOMETRIC_DEVICE',
      location: 'Main Gate',
      isDuplicate: false,
      isMapped: true,
      notes: 'Uploaded after device reconnected next morning',
      createdAt: '2026-06-16T06:30:00Z',
    };

    const reconciledDay = engine.reconcileDelayedOfflinePunch(lateArrivedOutPunch);
    expect(reconciledDay?.status).toBe('PRESENT');
    expect(reconciledDay?.lastPunchOut).toBe('2026-06-15T16:05:00Z');
    expect(reconciledDay?.totalWorkingMinutes).toBe(485);
  });

  it('Approved leave and weekly off do not become absence (CK, CL)', () => {
    const engine = new AttendanceEngineService();

    const leaveDay = engine.deriveAttendanceForStaffDay(
      'stf-006',
      'Vacation Staff',
      'STF-006',
      '2026-06-15',
      sampleShift,
      { isOnLeave: true }
    );
    expect(leaveDay.status).toBe('ON_LEAVE');

    const offDay = engine.deriveAttendanceForStaffDay(
      'stf-007',
      'Resting Staff',
      'STF-007',
      '2026-06-15',
      sampleShift,
      { isWeeklyOff: true }
    );
    expect(offDay.status).toBe('WEEKLY_OFF');
  });
});
