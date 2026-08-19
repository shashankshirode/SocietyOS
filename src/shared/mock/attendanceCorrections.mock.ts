import type { CorrectionRequest } from '../types/attendance.types';

export const mockCorrectionRequests: CorrectionRequest[] = [
  {
    id: 'cr-001', requestNumber: 'CR-2026-001', staffId: 'stf-003', staffName: 'Suresh Kamble', staffCode: 'STF-SEC-003',
    attendanceDate: '2026-06-28', correctionType: 'WRONG_PUNCH_TIME', existingValue: '07:35 AM', requestedCorrection: '06:55 AM',
    reason: 'Punch machine was not syncing when I checked in. Logged entry at main gate register at 06:55 AM.',
    requestedBy: 'Dinesh Yadav', requestedByRole: 'SECURITY_SUPERVISOR', status: 'PENDING',
    createdAt: '2026-06-29T08:00:00Z', updatedAt: '2026-06-29T08:00:00Z',
  },
  {
    id: 'cr-002', requestNumber: 'CR-2026-002', staffId: 'stf-022', staffName: 'Leela Deshpande', staffCode: 'STF-HK-006',
    attendanceDate: '2026-06-29', correctionType: 'MISSED_CHECK_OUT', existingValue: 'No Check-out', requestedCorrection: '16:00 PM',
    reason: 'Power failure at B Wing lobby reader during checkout time. Supervisor verified exit.',
    requestedBy: 'Rajesh Gaikwad', requestedByRole: 'FACILITY_MANAGER', status: 'PENDING',
    createdAt: '2026-06-29T18:30:00Z', updatedAt: '2026-06-29T18:30:00Z',
  },
  {
    id: 'cr-003', requestNumber: 'CR-2026-003', staffId: 'stf-008', staffName: 'Sunita Bansode', staffCode: 'STF-HK-002',
    attendanceDate: '2026-06-25', correctionType: 'LEAVE_ADJUSTMENT', existingValue: 'ABSENT', requestedCorrection: 'ON_LEAVE',
    reason: 'Approved sick leave. Medical certificate uploaded in document vault.',
    requestedBy: 'Rajesh Gaikwad', requestedByRole: 'FACILITY_MANAGER', status: 'APPROVED',
    reviewedBy: 'Anil Deshmukh', reviewedAt: '2026-06-26T10:00:00Z', auditNote: 'Leave approved in system.',
    createdAt: '2026-06-25T11:00:00Z', updatedAt: '2026-06-26T10:00:00Z',
  },
  {
    id: 'cr-004', requestNumber: 'CR-2026-004', staffId: 'stf-013', staffName: 'Vijay Kumar', staffCode: 'STF-FAC-003',
    attendanceDate: '2026-06-24', correctionType: 'SHIFT_MAPPING_ERROR', existingValue: 'LATE', requestedCorrection: 'PRESENT',
    reason: 'Shift was changed to afternoon on-call by management, but not updated in system. Punched at 13:00.',
    requestedBy: 'Rajesh Gaikwad', requestedByRole: 'FACILITY_MANAGER', status: 'UNDER_REVIEW',
    createdAt: '2026-06-25T09:00:00Z', updatedAt: '2026-06-26T12:00:00Z',
  },
  {
    id: 'cr-005', requestNumber: 'CR-2026-005', staffId: 'stf-005', staffName: 'Manoj Shinde', staffCode: 'STF-SEC-005',
    attendanceDate: '2026-06-23', correctionType: 'DUPLICATE_PUNCH', existingValue: 'Multiple IN punches', requestedCorrection: 'IN at 14:01',
    reason: 'Accidentally punched fingerprint twice within 2 minutes. Clean up duplicate logs.',
    requestedBy: 'Dinesh Yadav', requestedByRole: 'SECURITY_SUPERVISOR', status: 'APPROVED',
    reviewedBy: 'Anil Deshmukh', reviewedAt: '2026-06-24T09:30:00Z', auditNote: 'Duplicate punch resolved.',
    createdAt: '2026-06-23T15:30:00Z', updatedAt: '2026-06-24T09:30:00Z',
  },
  {
    id: 'cr-006', requestNumber: 'CR-2026-006', staffId: 'stf-010', staffName: 'Kavita Patil', staffCode: 'STF-HK-004',
    attendanceDate: '2026-06-22', correctionType: 'WRONG_PUNCH_TYPE', existingValue: 'OUT at 12:00', requestedCorrection: 'BREAK_OUT at 12:00',
    reason: 'Punched OUT instead of Break OUT. Returned to work at 13:00.',
    requestedBy: 'Rajesh Gaikwad', requestedByRole: 'FACILITY_MANAGER', status: 'REJECTED',
    reviewedBy: 'Anil Deshmukh', reviewedAt: '2026-06-23T11:00:00Z', rejectionReason: 'No proof of return punch or supervisor physical confirmation.',
    createdAt: '2026-06-22T17:00:00Z', updatedAt: '2026-06-23T11:00:00Z',
  },
  ...Array.from({ length: 6 }).map((_, idx) => {
    const idNum = idx + 7;
    return {
      id: `cr-0${idNum}`,
      requestNumber: `CR-2026-0${idNum}`,
      staffId: `stf-0${idNum}`,
      staffName: `Staff Member ${idNum}`,
      staffCode: `STF-FAC-0${idNum}`,
      attendanceDate: `2026-06-${29 - idx}`,
      correctionType: 'MISSED_CHECK_IN' as const,
      requestedCorrection: '09:00 AM',
      reason: `Missed check in punch due to device issue. Verification completed by supervisor.`,
      requestedBy: 'Rajesh Gaikwad',
      requestedByRole: 'FACILITY_MANAGER',
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }),
];
