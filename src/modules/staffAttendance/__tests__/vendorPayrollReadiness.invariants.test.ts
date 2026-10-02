import { VendorAttendanceVerificationService } from '../services/vendorAttendanceVerificationService';
import { PayrollReadinessService } from '../services/payrollReadinessService';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import type { StaffEngagement, StaffProfile } from '../../../shared/types/staff.types';
import type { AttendanceDay } from '../../../shared/types/attendance.types';

describe('Vendor Attendance & Payroll Readiness Invariants', () => {
  const hrAdminActor: StaffOperationsActor = {
    userId: 'usr-hr-01',
    societyId: 'soc-green-valley',
    role: 'HR_ADMIN',
    displayName: 'HR Admin Shweta',
  };

  it('Invariant 39 & 40: Vendor attendance derives from historical engagement and surfaces discrepancy without mutating invoice', () => {
    const service = new VendorAttendanceVerificationService();

    const engagements: StaffEngagement[] = [
      {
        id: 'eng-01',
        staffId: 'stf-001',
        societyId: 'soc-green-valley',
        engagementType: 'VENDOR_WORKER',
        vendorId: 'vnd-safeguard',
        vendorName: 'SafeGuard Security',
        roleCategory: 'SECURITY_GUARD',
        effectiveFrom: '2026-05-01',
        effectiveTo: '2026-06-30',
        status: 'ACTIVE',
        assignedLocation: 'Main Gate',
        createdAt: '2026-05-01T00:00:00Z',
        updatedAt: '2026-05-01T00:00:00Z',
      },
    ];

    const days: AttendanceDay[] = [];
    for (let i = 1; i <= 30; i++) {
      const dateStr = `2026-06-${i.toString().padStart(2, '0')}`;
      days.push({
        date: dateStr,
        staffId: 'stf-001',
        staffName: 'Ramesh Pawar',
        staffCode: 'STF-001',
        status: i <= 26 ? 'PRESENT' : 'ABSENT',
        punches: [],
        isManual: false,
        correctionApplied: false,
      });
    }

    const verification = service.calculateVendorAttendancePeriod(
      hrAdminActor,
      {
        societyId: 'soc-green-valley',
        vendorId: 'vnd-safeguard',
        vendorName: 'SafeGuard Security',
        billingPeriodMonth: '2026-06',
        invoicedManDaysClaimed: 30,
        auditNotes: 'Invoice claiming full 30 days',
      },
      engagements,
      days
    );

    expect(verification.verifiedPresentManDays).toBe(26);
    expect(verification.expectedManDays).toBe(30);
    expect(verification.disputedDays).toBe(4);
    expect(verification.status).toBe('DISPUTED');

    const json = JSON.stringify(verification);
    expect(json).not.toContain('ledger');
    expect(json).not.toContain('payableAmount');
  });

  it('Invariant 41: Vendor attendance locking prevents modification of verified baseline', () => {
    const service = new VendorAttendanceVerificationService();
    const verification = service.calculateVendorAttendancePeriod(
      hrAdminActor,
      {
        societyId: 'soc-green-valley',
        vendorId: 'vnd-safeguard',
        vendorName: 'SafeGuard Security',
        billingPeriodMonth: '2026-05',
        invoicedManDaysClaimed: 25,
      },
      [],
      []
    );

    const locked = service.lockVendorAttendancePeriod(hrAdminActor, 'soc-green-valley', verification.id);
    expect(locked.status).toBe('LOCKED');
    expect(locked.lockHash).toBeDefined();
    expect(service.isPeriodLocked('vnd-safeguard', '2026-05')).toBe(true);
  });

  it('Invariant 42: Payroll input snapshot is reproducible and versioned; subsequent corrections generate revised version without mutating original', () => {
    const payrollService = new PayrollReadinessService();

    const staffList: StaffProfile[] = [
      {
        id: 'stf-001',
        staffCode: 'STF-001',
        name: 'Ramesh Pawar',
        category: 'SECURITY_GUARD',
        employmentStatus: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        policeVerificationStatus: 'VERIFIED',
        idDocumentStatus: 'VERIFIED',
        isVendorWorker: false,
        assignedLocation: 'Main Gate',
        assignedAreas: ['Main Gate'],
        mobileMasked: '98******10',
        joiningDate: '2026-01-01',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];

    const initialDays: AttendanceDay[] = [
      {
        date: '2026-09-01',
        staffId: 'stf-001',
        staffName: 'Ramesh Pawar',
        staffCode: 'STF-001',
        status: 'ABSENT',
        punches: [],
        isManual: false,
        correctionApplied: false,
      },
      {
        date: '2026-09-02',
        staffId: 'stf-001',
        staffName: 'Ramesh Pawar',
        staffCode: 'STF-001',
        status: 'PRESENT',
        punches: [],
        isManual: false,
        correctionApplied: false,
      },
    ];

    const snapshotV1 = payrollService.createSnapshot(
      hrAdminActor,
      { societyId: 'soc-green-valley', month: '09', year: 2026 },
      staffList,
      initialDays
    );

    expect(snapshotV1.version).toBe(1);
    expect(snapshotV1.totalPresentDays).toBe(1);
    expect(snapshotV1.totalAbsentDays).toBe(1);

    const correctedDays: AttendanceDay[] = [
      {
        ...initialDays[0]!,
        status: 'PRESENT',
        correctionApplied: true,
      },
      initialDays[1]!,
    ];

    const snapshotV2 = payrollService.createSnapshot(
      hrAdminActor,
      { societyId: 'soc-green-valley', month: '09', year: 2026 },
      staffList,
      correctedDays
    );

    expect(snapshotV2.version).toBe(2);
    expect(snapshotV2.totalPresentDays).toBe(2);
    expect(snapshotV2.totalAbsentDays).toBe(0);

    const originalV1 = payrollService.getSnapshot(snapshotV1.id);
    expect(originalV1?.version).toBe(1);
    expect(originalV1?.totalPresentDays).toBe(1);
    expect(originalV1?.totalAbsentDays).toBe(1);
  });
});
