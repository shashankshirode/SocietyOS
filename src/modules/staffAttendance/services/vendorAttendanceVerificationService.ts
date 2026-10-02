import type {
  VendorAttendanceVerification,
  VendorAttendanceRow,
  VendorAttendanceVerificationStatus,
  AttendanceDay,
} from '../../../shared/types/attendance.types';
import type { StaffEngagement } from '../../../shared/types/staff.types';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import { assertSocietyContext, canVerifyVendorAttendance } from '../data/staffAttendanceActor';
import { generateOperationId } from '../../../core/api/idempotency';

export interface VerifyVendorPeriodInput {
  societyId: string;
  vendorId: string;
  vendorName: string;
  billingPeriodMonth: string;
  invoicedManDaysClaimed: number;
  auditNotes?: string;
}

export class VendorAttendanceVerificationService {
  private verifications = new Map<string, VendorAttendanceVerification>();
  private auditLogs: { action: string; entityId: string; actorId: string; timestamp: string; details?: string }[] = [];

  constructor(initialVerifications?: VendorAttendanceVerification[]) {
    if (initialVerifications) {
      for (const v of initialVerifications) {
        this.verifications.set(v.id, { ...v });
      }
    }
  }

  public calculateVendorAttendancePeriod(
    actor: StaffOperationsActor,
    input: VerifyVendorPeriodInput,
    engagements: StaffEngagement[],
    attendanceDays: AttendanceDay[]
  ): VendorAttendanceVerification {
    assertSocietyContext(actor, input.societyId);
    if (!canVerifyVendorAttendance(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to verify vendor attendance');
    }

    const verificationId = `vav-${generateOperationId('vav')}`;
    const nowIso = new Date().toISOString();

    const vendorWorkers = engagements.filter(e => {
      if (e.vendorId !== input.vendorId || e.status === 'SUSPENDED') return false;
      const from = e.effectiveFrom.slice(0, 7);
      const to = (e.effectiveTo ?? '9999-12-31').slice(0, 7);
      return input.billingPeriodMonth >= from && input.billingPeriodMonth <= to;
    });

    const vendorStaffIds = new Set(vendorWorkers.map(w => w.staffId));

    const monthDays = attendanceDays.filter(d => {
      const dayMonth = d.date.slice(0, 7);
      return dayMonth === input.billingPeriodMonth && vendorStaffIds.has(d.staffId);
    });

    let presentManDays = 0;
    let absentDays = 0;
    let lateArrivals = 0;
    let missingPunchDays = 0;

    for (const d of monthDays) {
      if (d.status === 'PRESENT') {
        presentManDays++;
      } else if (d.status === 'LATE') {
        presentManDays++;
        lateArrivals++;
      } else if (d.status === 'HALF_DAY') {
        presentManDays += 0.5;
      } else if (d.status === 'ABSENT') {
        absentDays++;
      } else if (d.status === 'MISSING_CHECKOUT') {
        missingPunchDays++;
      }
    }

    const expectedDays = monthDays.length;
    const discrepancy = input.invoicedManDaysClaimed - presentManDays;
    const status: VendorAttendanceVerificationStatus = discrepancy > 0 ? 'DISPUTED' : 'VERIFIED';

    const verification: VendorAttendanceVerification = {
      id: verificationId,
      societyId: input.societyId,
      vendorId: input.vendorId,
      vendorName: input.vendorName,
      billingPeriodMonth: input.billingPeriodMonth,
      totalWorkersAssigned: vendorStaffIds.size,
      expectedManDays: expectedDays,
      verifiedPresentManDays: presentManDays,
      disputedDays: discrepancy > 0 ? discrepancy : 0,
      absentDays,
      lateArrivalsCount: lateArrivals,
      missingPunchDays,
      status,
      verifiedBy: actor.displayName ?? actor.userId,
      verifiedAt: nowIso,
      ...(input.auditNotes ? { auditNotes: input.auditNotes } : {}),
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.verifications.set(verificationId, verification);

    this.auditLogs.push({
      action: 'VENDOR_ATTENDANCE_VERIFIED',
      entityId: verificationId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Calculated attendance for ${input.vendorName} (${input.billingPeriodMonth}): ${presentManDays} verified vs ${input.invoicedManDaysClaimed} claimed`,
    });

    return verification;
  }

  public lockVendorAttendancePeriod(
    actor: StaffOperationsActor,
    societyId: string,
    verificationId: string
  ): VendorAttendanceVerification {
    assertSocietyContext(actor, societyId);
    if (!canVerifyVendorAttendance(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to lock vendor attendance');
    }

    const verification = this.verifications.get(verificationId);
    if (!verification) {
      throw new Error('VENDOR_ATTENDANCE_NOT_FOUND: Record not found');
    }

    const nowIso = new Date().toISOString();
    const locked: VendorAttendanceVerification = {
      ...verification,
      status: 'LOCKED',
      lockedAt: nowIso,
      lockHash: `lock-${verification.id}-${Date.now().toString(36)}`,
      updatedAt: nowIso,
    };

    this.verifications.set(verificationId, locked);

    this.auditLogs.push({
      action: 'VENDOR_ATTENDANCE_LOCKED',
      entityId: verificationId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Locked vendor attendance period ${verification.billingPeriodMonth} for ${verification.vendorName}`,
    });

    return locked;
  }

  public isPeriodLocked(vendorId: string, month: string): boolean {
    return Array.from(this.verifications.values()).some(
      v => v.vendorId === vendorId && v.billingPeriodMonth === month && v.status === 'LOCKED'
    );
  }

  public getVerification(id: string): VendorAttendanceVerification | undefined {
    return this.verifications.get(id);
  }

  public getAuditLogs() {
    return [...this.auditLogs];
  }
}
