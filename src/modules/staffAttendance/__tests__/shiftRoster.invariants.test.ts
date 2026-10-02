import { ShiftRosterService } from '../services/shiftRosterService';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';

describe('Shift and Roster Invariants', () => {
  const facilityManager: StaffOperationsActor = {
    userId: 'usr-fm-01',
    societyId: 'soc-green-valley',
    role: 'FACILITY_MANAGER',
    displayName: 'FM Rajesh',
  };

  it('Invariant 12 & 36: ShiftDefinition != ShiftAssignment != RosterOccurrence (No hardcoded shift-001)', () => {
    const service = new ShiftRosterService();

    const morningShift = service.createShift(facilityManager, 'soc-green-valley', {
      shiftName: 'Morning Security Patrol',
      startTime: '06:00',
      endTime: '14:00',
      gracePeriodMinutes: 15,
      location: 'Main Gate',
      weeklyOffDays: ['SUNDAY'],
    });

    expect(morningShift.id).not.toBe('shift-001');
    expect(morningShift.assignedStaffCount).toBe(0);

    const assignment = service.assignShift(facilityManager, 'soc-green-valley', {
      staffId: 'stf-001',
      staffName: 'Ramesh Pawar',
      staffCode: 'STF-SEC-001',
      shiftId: morningShift.id,
      location: 'Main Gate',
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-06-30',
      weeklyOffDays: ['SUNDAY'],
    });

    expect(assignment.shiftId).toBe(morningShift.id);
    expect(assignment.staffId).toBe('stf-001');

    const replacement = service.assignTemporaryReplacement(facilityManager, 'soc-green-valley', {
      date: '2026-03-10',
      shiftId: morningShift.id,
      originalStaffId: 'stf-001',
      replacementStaffId: 'stf-002',
      location: 'Main Gate',
      reason: 'Ramesh sick leave coverage',
    });

    expect(replacement.isTemporaryReplacement).toBe(true);
    expect(replacement.scheduledStaffId).toBe('stf-001');
    expect(replacement.actualStaffId).toBe('stf-002');

    const baseAssignments = service.getAssignmentsForStaff('stf-002');
    expect(baseAssignments.length).toBe(0);
  });

  it('Invariant 13 & 39: Shift assignments are effective-dated and overlapping assignments are rejected', () => {
    const service = new ShiftRosterService();

    const shiftA = service.createShift(facilityManager, 'soc-green-valley', {
      shiftName: 'Shift A',
      startTime: '08:00',
      endTime: '16:00',
      gracePeriodMinutes: 10,
      location: 'North Gate',
      weeklyOffDays: ['MONDAY'],
    });

    const shiftB = service.createShift(facilityManager, 'soc-green-valley', {
      shiftName: 'Shift B',
      startTime: '16:00',
      endTime: '00:00',
      gracePeriodMinutes: 10,
      location: 'North Gate',
      weeklyOffDays: ['TUESDAY'],
    });

    service.assignShift(facilityManager, 'soc-green-valley', {
      staffId: 'stf-003',
      staffName: 'Suresh Guard',
      staffCode: 'STF-003',
      shiftId: shiftA.id,
      location: 'North Gate',
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-03-31',
      weeklyOffDays: ['MONDAY'],
    });

    expect(() => {
      service.assignShift(facilityManager, 'soc-green-valley', {
        staffId: 'stf-003',
        staffName: 'Suresh Guard',
        staffCode: 'STF-003',
        shiftId: shiftB.id,
        location: 'North Gate',
        effectiveFrom: '2026-03-15',
        effectiveTo: '2026-06-30',
        weeklyOffDays: ['TUESDAY'],
      });
    }).toThrow('SHIFT_ASSIGNMENT_CONFLICT');

    const nonOverlapping = service.assignShift(facilityManager, 'soc-green-valley', {
      staffId: 'stf-003',
      staffName: 'Suresh Guard',
      staffCode: 'STF-003',
      shiftId: shiftB.id,
      location: 'North Gate',
      effectiveFrom: '2026-04-01',
      effectiveTo: '2026-06-30',
      weeklyOffDays: ['TUESDAY'],
    });
    expect(nonOverlapping.effectiveFrom).toBe('2026-04-01');

    const marchShift = service.getEffectiveShiftForStaff('stf-003', '2026-03-20');
    expect(marchShift?.shiftName).toBe('Shift A');

    const aprilShift = service.getEffectiveShiftForStaff('stf-003', '2026-04-20');
    expect(aprilShift?.shiftName).toBe('Shift B');
  });

  it('Invariant 14: Overnight shifts across local midnight are recognized correctly', () => {
    const service = new ShiftRosterService();

    const nightShift = service.createShift(facilityManager, 'soc-green-valley', {
      shiftName: 'Night Security Watch',
      startTime: '22:00',
      endTime: '06:00',
      gracePeriodMinutes: 15,
      location: 'All Gates',
      weeklyOffDays: ['MONDAY'],
    });

    const regularDayShift = service.createShift(facilityManager, 'soc-green-valley', {
      shiftName: 'Day Operations',
      startTime: '09:00',
      endTime: '17:00',
      gracePeriodMinutes: 15,
      location: 'Office',
      weeklyOffDays: ['SUNDAY'],
    });

    expect(service.isOvernightShift(nightShift)).toBe(true);
    expect(service.isOvernightShift(regularDayShift)).toBe(false);
  });

  it('Invariant 15 & 16: Weekly off and holidays are distinguished from absence', () => {
    const service = new ShiftRosterService();
    const shift = service.createShift(facilityManager, 'soc-green-valley', {
      shiftName: 'Standard Operations',
      startTime: '09:00',
      endTime: '18:00',
      gracePeriodMinutes: 15,
      location: 'Lobby',
      weeklyOffDays: ['SUNDAY'],
    });

    service.addHoliday('2026-01-26');

    expect(service.isWeeklyOff(shift, '2026-01-25')).toBe(true);
    expect(service.isWeeklyOff(shift, '2026-01-26')).toBe(false);
    expect(service.isHoliday('2026-01-26')).toBe(true);
    expect(service.isHoliday('2026-01-27')).toBe(false);
  });
});
