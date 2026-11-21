import type { DuplicatePunchCandidate, MissingCheckoutRecord } from '../types/biometric.types';

export const mockDuplicatePunches: DuplicatePunchCandidate[] = [
  {
    id: 'dp-001', staffId: 'stf-001', staffName: 'Ramesh Pawar', staffCode: 'STF-SEC-001', biometricEmployeeCode: 'BIO-1001',
    deviceId: 'bio-device-001', deviceCode: 'BIO-GATE-01', punchTime: '2026-06-29T06:58:12Z', punchType: 'IN',
    duplicateKey: 'stf-001_2026-06-29_IN', existingPunchId: 'pn-001', newPunchId: 'pn-new-001',
    suggestedAction: 'KEEP_EXISTING', status: 'OPEN', createdAt: '2026-06-29T23:45:00Z',
  },
  {
    id: 'dp-002', staffId: 'stf-005', staffName: 'Manoj Shinde', staffCode: 'STF-SEC-005', biometricEmployeeCode: 'BIO-1005',
    deviceId: 'bio-device-005', deviceCode: 'BIO-CLUB-01', punchTime: '2026-06-29T14:01:45Z', punchType: 'IN',
    duplicateKey: 'stf-005_2026-06-29_IN', existingPunchId: 'pn-005', newPunchId: 'pn-new-002',
    suggestedAction: 'KEEP_EXISTING', status: 'RESOLVED_KEEP_EXISTING', createdAt: '2026-06-29T23:45:00Z',
  },
  ...Array.from({ length: 10 }).map((_, idx) => {
    const idNum = idx + 3;
    return {
      id: `dp-0${idNum}`,
      staffId: `stf-0${idNum}`,
      staffName: `Staff Member ${idNum}`,
      staffCode: `STF-FAC-0${idNum}`,
      biometricEmployeeCode: `BIO-30${idNum}`,
      deviceId: 'bio-device-003',
      deviceCode: 'BIO-OFFICE-01',
      punchTime: `2026-06-29T09:05:${String(idNum).padStart(2, '0')}Z`,
      punchType: 'IN',
      duplicateKey: `stf-0${idNum}_2026-06-29_IN`,
      existingPunchId: `pn-0${idNum}`,
      newPunchId: `pn-new-0${idNum}`,
      suggestedAction: 'KEEP_EXISTING' as const,
      status: 'OPEN' as const,
      createdAt: new Date().toISOString(),
    };
  }),
];

export const mockMissingCheckouts: MissingCheckoutRecord[] = [
  {
    id: 'mc-001', staffId: 'stf-022', staffName: 'Leela Deshpande', staffCode: 'STF-HK-006',
    date: '2026-06-29', firstCheckInTime: '08:05 AM', shiftEndTime: '16:00 PM', shiftName: 'Housekeeping Morning',
    hoursWorkedEstimate: 7.9, correctionStatus: 'OPEN', createdAt: '2026-06-29T23:45:00Z',
  },
  {
    id: 'mc-002', staffId: 'stf-003', staffName: 'Suresh Kamble', staffCode: 'STF-SEC-003',
    date: '2026-06-28', firstCheckInTime: '07:18 AM', shiftEndTime: '15:00 PM', shiftName: 'Morning Security',
    hoursWorkedEstimate: 7.7, correctionStatus: 'CORRECTION_CREATED', correctionRequestId: 'cr-001', createdAt: '2026-06-28T23:45:00Z',
  },
  ...Array.from({ length: 8 }).map((_, idx) => {
    const idNum = idx + 3;
    return {
      id: `mc-0${idNum}`,
      staffId: `stf-0${idNum}`,
      staffName: `Staff Member ${idNum}`,
      staffCode: `STF-FAC-0${idNum}`,
      date: `2026-06-${29 - idx}`,
      firstCheckInTime: '09:00 AM',
      shiftEndTime: '17:00 PM',
      shiftName: 'Facility General Shift',
      hoursWorkedEstimate: 8,
      correctionStatus: 'OPEN' as const,
      createdAt: new Date().toISOString(),
    };
  }),
];
