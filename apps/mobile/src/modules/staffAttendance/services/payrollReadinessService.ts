import type { PayrollInputSnapshot, AttendanceDay } from '../../../shared/types/attendance.types';
import type { StaffProfile } from '../../../shared/types/staff.types';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import { assertSocietyContext, canGeneratePayrollSnapshot } from '../data/staffAttendanceActor';
import { generateOperationId } from '../../../core/api/idempotency';

export interface GeneratePayrollSnapshotInput {
  societyId: string;
  month: string;
  year: number;
  policyVersion?: string;
}

export class PayrollReadinessService {
  private snapshots = new Map<string, PayrollInputSnapshot>();
  private auditLogs: { action: string; entityId: string; actorId: string; timestamp: string; details?: string }[] = [];

  public createSnapshot(
    actor: StaffOperationsActor,
    input: GeneratePayrollSnapshotInput,
    staffProfiles: StaffProfile[],
    attendanceDays: AttendanceDay[]
  ): PayrollInputSnapshot {
    assertSocietyContext(actor, input.societyId);
    if (!canGeneratePayrollSnapshot(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to generate payroll snapshot');
    }

    const monthStr = `${input.year}-${input.month.padStart(2, '0')}`;
    const existingSnapshots = Array.from(this.snapshots.values()).filter(
      s => s.societyId === input.societyId && s.month === input.month && s.year === input.year
    );

    const version = existingSnapshots.length + 1;
    const snapshotId = `prs-${generateOperationId('prs')}`;
    const nowIso = new Date().toISOString();

    let totalExpectedDays = 0;
    let totalPresentDays = 0;
    let totalAbsentDays = 0;
    let totalLateInstances = 0;
    let totalHalfDays = 0;
    let totalApprovedLeaveDays = 0;
    let unresolvedExceptionsCount = 0;

    const records = staffProfiles.map(staff => {
      const daysForStaff = attendanceDays.filter(d => {
        return d.staffId === staff.id && d.date.startsWith(monthStr);
      });

      let presentDays = 0;
      let absentDays = 0;
      let lateInstances = 0;
      let halfDays = 0;
      let approvedLeaveDays = 0;
      let correctionCount = 0;

      for (const d of daysForStaff) {
        if (d.status === 'PRESENT') presentDays++;
        else if (d.status === 'LATE') { presentDays++; lateInstances++; }
        else if (d.status === 'HALF_DAY') halfDays++;
        else if (d.status === 'ABSENT') absentDays++;
        else if (d.status === 'ON_LEAVE') approvedLeaveDays++;
        else if (d.status === 'MISSING_CHECKOUT') unresolvedExceptionsCount++;

        if (d.correctionApplied) correctionCount++;
      }

      const expectedDays = daysForStaff.length;
      totalExpectedDays += expectedDays;
      totalPresentDays += presentDays;
      totalAbsentDays += absentDays;
      totalLateInstances += lateInstances;
      totalHalfDays += halfDays;
      totalApprovedLeaveDays += approvedLeaveDays;

      return {
        staffId: staff.id,
        staffName: staff.name,
        staffCode: staff.staffCode,
        category: staff.category,
        ...(staff.vendorId ? { vendorId: staff.vendorId } : {}),
        expectedDays,
        presentDays,
        absentDays,
        lateInstances,
        halfDays,
        approvedLeaveDays,
        approvedOvertimeHours: 0,
        correctionCount,
      };
    });

    const snapshot: PayrollInputSnapshot = {
      id: snapshotId,
      societyId: input.societyId,
      month: input.month,
      year: input.year,
      version,
      policyVersion: input.policyVersion ?? 'v1.0.0',
      totalStaffCount: staffProfiles.length,
      totalExpectedDays,
      totalPresentDays,
      totalAbsentDays,
      totalLateInstances,
      totalHalfDays,
      totalApprovedLeaveDays,
      totalApprovedOvertimeHours: 0,
      unresolvedExceptionsCount,
      generatedBy: actor.displayName ?? actor.userId,
      generatedAt: nowIso,
      isLocked: true,
      lockedAt: nowIso,
      snapshotDataRevision: `rev-${version}-${Date.now().toString(36)}`,
      records,
    };

    this.snapshots.set(snapshotId, snapshot);

    this.auditLogs.push({
      action: 'PAYROLL_INPUT_SNAPSHOT_CREATED',
      entityId: snapshotId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Generated payroll input snapshot v${version} for ${monthStr} (${staffProfiles.length} staff members)`,
    });

    return snapshot;
  }

  public getSnapshot(snapshotId: string): PayrollInputSnapshot | undefined {
    return this.snapshots.get(snapshotId);
  }

  public getSnapshotsForPeriod(societyId: string, month: string, year: number): PayrollInputSnapshot[] {
    return Array.from(this.snapshots.values()).filter(
      s => s.societyId === societyId && s.month === month && s.year === year
    ).sort((a, b) => b.version - a.version);
  }

  public getAuditLogs() {
    return [...this.auditLogs];
  }
}
