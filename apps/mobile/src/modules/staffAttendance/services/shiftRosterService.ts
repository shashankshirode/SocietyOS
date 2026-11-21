import type {
  ShiftDefinition,
  ShiftAssignment,
  ShiftAssignmentInput,
  ShiftStatus,
} from '../../../shared/types/staff.types';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import { assertSocietyContext, canManageShifts } from '../data/staffAttendanceActor';
import { generateOperationId } from '../../../core/api/idempotency';

export interface CreateShiftInput {
  shiftName: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  location: string;
  weeklyOffDays: string[];
  notes?: string;
}

export interface RosterOccurrence {
  id: string;
  societyId: string;
  date: string;
  shiftId: string;
  shiftName: string;
  scheduledStaffId: string;
  actualStaffId: string;
  isTemporaryReplacement: boolean;
  isWeeklyOff: boolean;
  isHoliday: boolean;
  leaveStatus?: string;
  location: string;
  notes?: string;
}

export class ShiftRosterService {
  private shifts = new Map<string, ShiftDefinition>();
  private assignments = new Map<string, ShiftAssignment>();
  private rosterOccurrences = new Map<string, RosterOccurrence>();
  private holidays = new Set<string>();

  constructor(initialShifts?: ShiftDefinition[]) {
    if (initialShifts) {
      for (const s of initialShifts) {
        this.shifts.set(s.id, { ...s });
      }
    }
  }

  public createShift(
    actor: StaffOperationsActor,
    societyId: string,
    input: CreateShiftInput
  ): ShiftDefinition {
    assertSocietyContext(actor, societyId);
    if (!canManageShifts(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to create shifts');
    }

    const shiftId = `sh-${generateOperationId('sh')}`;
    const newShift: ShiftDefinition = {
      id: shiftId,
      shiftName: input.shiftName.trim(),
      startTime: input.startTime,
      endTime: input.endTime,
      gracePeriodMinutes: input.gracePeriodMinutes,
      location: input.location,
      assignedStaffCount: 0,
      weeklyOffDays: input.weeklyOffDays,
      status: 'ACTIVE',
      ...(input.notes ? { notes: input.notes } : {}),
      createdAt: new Date().toISOString(),
    };

    this.shifts.set(shiftId, newShift);
    return newShift;
  }

  public assignShift(
    actor: StaffOperationsActor,
    societyId: string,
    input: ShiftAssignmentInput & { staffName: string; staffCode: string }
  ): ShiftAssignment {
    assertSocietyContext(actor, societyId);
    if (!canManageShifts(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to assign shifts');
    }

    const shift = this.shifts.get(input.shiftId);
    if (!shift || shift.status !== 'ACTIVE') {
      throw new Error('SHIFT_NOT_FOUND: Active shift does not exist');
    }

    const existingActiveAssignments = Array.from(this.assignments.values()).filter(
      a => a.staffId === input.staffId && a.isActive
    );

    for (const existing of existingActiveAssignments) {
      const fromA = existing.effectiveFrom;
      const toA = existing.effectiveTo ?? '9999-12-31';
      const fromB = input.effectiveFrom;
      const toB = input.effectiveTo ?? '9999-12-31';

      if (fromA <= toB && fromB <= toA) {
        throw new Error('SHIFT_ASSIGNMENT_CONFLICT: Overlapping effective shift assignment detected');
      }
    }

    const assignmentId = `asg-${generateOperationId('asg')}`;
    const assignment: ShiftAssignment = {
      id: assignmentId,
      staffId: input.staffId,
      staffName: input.staffName,
      staffCode: input.staffCode,
      shiftId: input.shiftId,
      shiftName: shift.shiftName,
      location: input.location,
      effectiveFrom: input.effectiveFrom,
      ...(input.effectiveTo ? { effectiveTo: input.effectiveTo } : {}),
      weeklyOffDays: input.weeklyOffDays,
      ...(input.notes ? { notes: input.notes } : {}),
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    this.assignments.set(assignmentId, assignment);

    this.shifts.set(shift.id, {
      ...shift,
      assignedStaffCount: shift.assignedStaffCount + 1,
    });

    return assignment;
  }

  public getEffectiveShiftForStaff(staffId: string, workDate: string): ShiftDefinition | undefined {
    const matchingAssignment = Array.from(this.assignments.values()).find(a => {
      if (a.staffId !== staffId || !a.isActive) return false;
      const from = a.effectiveFrom;
      const to = a.effectiveTo ?? '9999-12-31';
      return workDate >= from && workDate <= to;
    });

    if (!matchingAssignment) {
      return undefined;
    }
    return this.shifts.get(matchingAssignment.shiftId);
  }

  public isOvernightShift(shift: ShiftDefinition): boolean {
    const [startH, startM] = shift.startTime.split(':').map(Number);
    const [endH, endM] = shift.endTime.split(':').map(Number);
    const startMins = (startH ?? 0) * 60 + (startM ?? 0);
    const endMins = (endH ?? 0) * 60 + (endM ?? 0);
    return endMins <= startMins;
  }

  public addHoliday(date: string): void {
    this.holidays.add(date);
  }

  public isHoliday(date: string): boolean {
    return this.holidays.has(date);
  }

  public isWeeklyOff(shift: ShiftDefinition, date: string): boolean {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    return shift.weeklyOffDays.map(d => d.toUpperCase()).includes(dayOfWeek);
  }

  public assignTemporaryReplacement(
    actor: StaffOperationsActor,
    societyId: string,
    params: {
      date: string;
      shiftId: string;
      originalStaffId: string;
      replacementStaffId: string;
      location: string;
      reason: string;
    }
  ): RosterOccurrence {
    assertSocietyContext(actor, societyId);
    if (!canManageShifts(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to modify roster');
    }

    const shift = this.shifts.get(params.shiftId);
    if (!shift) {
      throw new Error('SHIFT_NOT_FOUND: Shift definition not found');
    }

    const occurrenceId = `rst-${generateOperationId('rst')}`;
    const occurrence: RosterOccurrence = {
      id: occurrenceId,
      societyId,
      date: params.date,
      shiftId: params.shiftId,
      shiftName: shift.shiftName,
      scheduledStaffId: params.originalStaffId,
      actualStaffId: params.replacementStaffId,
      isTemporaryReplacement: true,
      isWeeklyOff: false,
      isHoliday: this.isHoliday(params.date),
      location: params.location,
      notes: `Temporary replacement: ${params.reason}`,
    };

    this.rosterOccurrences.set(occurrenceId, occurrence);
    return occurrence;
  }

  public getShift(shiftId: string): ShiftDefinition | undefined {
    return this.shifts.get(shiftId);
  }

  public getAllShifts(): ShiftDefinition[] {
    return Array.from(this.shifts.values());
  }

  public getAssignmentsForStaff(staffId: string): ShiftAssignment[] {
    return Array.from(this.assignments.values()).filter(a => a.staffId === staffId);
  }

  public getRosterOccurrences(date: string): RosterOccurrence[] {
    return Array.from(this.rosterOccurrences.values()).filter(r => r.date === date);
  }
}
