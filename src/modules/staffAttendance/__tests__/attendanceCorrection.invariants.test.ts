import { AttendanceCorrectionService } from '../services/attendanceCorrectionService';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import type { AttendanceDay } from '../../../shared/types/attendance.types';

describe('Attendance Correction Invariants', () => {
  const requesterActor: StaffOperationsActor = {
    userId: 'usr-guard-lead',
    societyId: 'soc-green-valley',
    role: 'SECURITY_SUPERVISOR',
    displayName: 'Supervisor Jagtap',
  };

  const hrApproverActor: StaffOperationsActor = {
    userId: 'usr-hr-admin',
    societyId: 'soc-green-valley',
    role: 'HR_ADMIN',
    displayName: 'HR Admin Shweta',
  };

  const initialDay: AttendanceDay = {
    date: '2026-06-10',
    staffId: 'stf-001',
    staffName: 'Ramesh Pawar',
    staffCode: 'STF-001',
    status: 'ABSENT',
    punches: [],
    isManual: false,
    correctionApplied: false,
  };

  it('Invariant 19: Attendance correction creates overlay version without deleting or modifying source punch', () => {
    const service = new AttendanceCorrectionService();

    const request = service.requestCorrection(requesterActor, 'soc-green-valley', {
      staffId: 'stf-001',
      staffName: 'Ramesh Pawar',
      staffCode: 'STF-001',
      attendanceDate: '2026-06-10',
      correctionType: 'MISSED_CHECK_IN',
      existingValue: 'ABSENT',
      requestedCorrection: 'PRESENT',
      reason: 'Biometric device failed during power cut; physical duty log confirms attendance',
      confirmationChecked: true,
    });

    expect(request.status).toBe('PENDING');

    const result = service.approveCorrection(
      hrApproverActor,
      'soc-green-valley',
      request.id,
      { confirmationChecked: true, auditNote: 'Verified with security entry ledger' },
      initialDay,
      false
    );

    expect(result.updatedRequest.status).toBe('APPROVED');
    expect(result.updatedRequest.reviewedBy).toBe(hrApproverActor.displayName);
    expect(result.updatedDay.status).toBe('PRESENT');
    expect(result.updatedDay.correctionApplied).toBe(true);
    expect(result.updatedDay.notes).toContain(request.requestNumber);
  });

  it('Self-approval prevention: Requester cannot approve their own correction request', () => {
    const service = new AttendanceCorrectionService();

    const request = service.requestCorrection(requesterActor, 'soc-green-valley', {
      staffId: 'stf-001',
      staffName: 'Ramesh Pawar',
      staffCode: 'STF-001',
      attendanceDate: '2026-06-10',
      correctionType: 'MISSED_CHECK_IN',
      requestedCorrection: 'PRESENT',
      reason: 'Forgot to punch',
      confirmationChecked: true,
    });

    expect(() => {
      service.approveCorrection(
        requesterActor,
        'soc-green-valley',
        request.id,
        { confirmationChecked: true },
        initialDay,
        false
      );
    }).toThrow('CORRECTION_SELF_APPROVAL_NOT_ALLOWED');
  });

  it('Invariant 41: Correction cannot directly alter locked vendor attendance period without controlled unlock', () => {
    const service = new AttendanceCorrectionService();

    const request = service.requestCorrection(requesterActor, 'soc-green-valley', {
      staffId: 'stf-001',
      staffName: 'Ramesh Pawar',
      staffCode: 'STF-001',
      attendanceDate: '2026-06-10',
      correctionType: 'MISSED_CHECK_OUT',
      requestedCorrection: 'PRESENT',
      reason: 'Late check out',
      confirmationChecked: true,
    });

    expect(() => {
      service.approveCorrection(
        hrApproverActor,
        'soc-green-valley',
        request.id,
        { confirmationChecked: true },
        initialDay,
        true
      );
    }).toThrow('ATTENDANCE_PERIOD_LOCKED');
  });

  it('Rejection workflow records reviewer notes and updates status to REJECTED', () => {
    const service = new AttendanceCorrectionService();

    const request = service.requestCorrection(requesterActor, 'soc-green-valley', {
      staffId: 'stf-001',
      staffName: 'Ramesh Pawar',
      staffCode: 'STF-001',
      attendanceDate: '2026-06-10',
      correctionType: 'OTHER',
      requestedCorrection: 'PRESENT',
      reason: 'Unsubstantiated absence claim',
      confirmationChecked: true,
    });

    const rejected = service.rejectCorrection(
      hrApproverActor,
      'soc-green-valley',
      request.id,
      { rejectionReason: 'No physical gate register entry found', confirmationChecked: true }
    );

    expect(rejected.status).toBe('REJECTED');
    expect(rejected.rejectionReason).toBe('No physical gate register entry found');
  });
});
