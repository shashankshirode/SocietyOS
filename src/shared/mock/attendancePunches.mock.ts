import type { AttendancePunch, PunchType, PunchSource } from '../types/attendance.types';


const basePunches: AttendancePunch[] = [
  { id: 'pn-001', staffId: 'stf-001', staffName: 'Ramesh Pawar', staffCode: 'STF-SEC-001', biometricEmployeeCode: 'BIO-1001', punchTime: '2026-06-29T06:58:00Z', punchType: 'IN' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-001', deviceName: 'Main Entry Biometric', location: 'Main Gate', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-002', staffId: 'stf-003', staffName: 'Suresh Kamble', staffCode: 'STF-SEC-003', biometricEmployeeCode: 'BIO-1003', punchTime: '2026-06-29T07:18:00Z', punchType: 'IN' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-002', deviceName: 'B Wing Gate Fingerprint', location: 'B Wing Gate', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-003', staffId: 'stf-004', staffName: 'Dinesh Yadav', staffCode: 'STF-SEC-004', biometricEmployeeCode: 'BIO-1004', punchTime: '2026-06-29T07:01:00Z', punchType: 'IN' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-001', deviceName: 'Main Entry Biometric', location: 'Main Gate', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-004', staffId: 'stf-007', staffName: 'Meena Jadhav', staffCode: 'STF-HK-001', biometricEmployeeCode: 'BIO-2001', punchTime: '2026-06-29T08:03:00Z', punchType: 'IN' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'A Wing Lobby', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-005', staffId: 'stf-009', staffName: 'Rekha Shinde', staffCode: 'STF-HK-003', biometricEmployeeCode: 'BIO-2003', punchTime: '2026-06-29T08:10:00Z', punchType: 'IN' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'C Wing Lobby', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-006', staffId: 'stf-011', staffName: 'Rajesh Gaikwad', staffCode: 'STF-FAC-001', biometricEmployeeCode: 'BIO-3001', punchTime: '2026-06-29T09:05:00Z', punchType: 'IN' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'Society Office', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-007', staffId: 'stf-012', staffName: 'Santosh More', staffCode: 'STF-FAC-002', biometricEmployeeCode: 'BIO-3002', punchTime: '2026-06-29T08:55:00Z', punchType: 'IN' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'Garden Areas', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-008', staffId: 'stf-014', staffName: 'Mohammad Ali', staffCode: 'STF-FAC-004', biometricEmployeeCode: 'BIO-3004', punchTime: '2026-06-29T09:15:00Z', punchType: 'IN' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'Society Office', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-009', staffId: 'stf-015', staffName: 'Deepak Salve', staffCode: 'STF-FAC-005', biometricEmployeeCode: 'BIO-3005', punchTime: '2026-06-29T06:55:00Z', punchType: 'IN' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'A Wing Lift', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-010', staffId: 'stf-017', staffName: 'Anita Kulkarni', staffCode: 'STF-OFF-001', biometricEmployeeCode: 'BIO-4002', punchTime: '2026-06-29T09:58:00Z', punchType: 'IN' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'Society Office', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-011', staffId: 'stf-001', staffName: 'Ramesh Pawar', staffCode: 'STF-SEC-001', biometricEmployeeCode: 'BIO-1001', punchTime: '2026-06-29T15:02:00Z', punchType: 'OUT' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-001', deviceName: 'Main Entry Biometric', location: 'Main Gate', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-012', staffId: 'stf-003', staffName: 'Suresh Kamble', staffCode: 'STF-SEC-003', biometricEmployeeCode: 'BIO-1003', punchTime: '2026-06-29T15:05:00Z', punchType: 'OUT' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-002', deviceName: 'B Wing Gate Fingerprint', location: 'B Wing Gate', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-013', staffId: 'stf-004', staffName: 'Dinesh Yadav', staffCode: 'STF-SEC-004', biometricEmployeeCode: 'BIO-1004', punchTime: '2026-06-29T15:01:00Z', punchType: 'OUT' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-001', deviceName: 'Main Entry Biometric', location: 'Main Gate', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-014', staffId: 'stf-007', staffName: 'Meena Jadhav', staffCode: 'STF-HK-001', biometricEmployeeCode: 'BIO-2001', punchTime: '2026-06-29T16:01:00Z', punchType: 'OUT' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'A Wing Lobby', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-015', staffId: 'stf-009', staffName: 'Rekha Shinde', staffCode: 'STF-HK-003', biometricEmployeeCode: 'BIO-2003', punchTime: '2026-06-29T16:05:00Z', punchType: 'OUT' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'C Wing Lobby', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-016', staffId: 'stf-011', staffName: 'Rajesh Gaikwad', staffCode: 'STF-FAC-001', biometricEmployeeCode: 'BIO-3001', punchTime: '2026-06-29T17:02:00Z', punchType: 'OUT' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'Society Office', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-017', staffId: 'stf-012', staffName: 'Santosh More', staffCode: 'STF-FAC-002', biometricEmployeeCode: 'BIO-3002', punchTime: '2026-06-29T17:00:00Z', punchType: 'OUT' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'Garden Areas', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-018', staffId: 'stf-014', staffName: 'Mohammad Ali', staffCode: 'STF-FAC-004', biometricEmployeeCode: 'BIO-3004', punchTime: '2026-06-29T17:05:00Z', punchType: 'OUT' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'Society Office', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-019', staffId: 'stf-015', staffName: 'Deepak Salve', staffCode: 'STF-FAC-005', biometricEmployeeCode: 'BIO-3005', punchTime: '2026-06-29T15:00:00Z', punchType: 'OUT' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'A Wing Lift', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
  { id: 'pn-020', staffId: 'stf-017', staffName: 'Anita Kulkarni', staffCode: 'STF-OFF-001', biometricEmployeeCode: 'BIO-4002', punchTime: '2026-06-29T17:00:00Z', punchType: 'OUT' as PunchType, source: 'BIOMETRIC_DEVICE' as PunchSource, deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', location: 'Society Office', syncJobId: 'job-012', isDuplicate: false, isMapped: true, createdAt: new Date().toISOString() },
];


export const mockAttendancePunches: AttendancePunch[] = [...basePunches];

for (let i = 21; i <= 100; i++) {
  const staffIdx = (i % 28) + 1;
  const isOdd = i % 2 !== 0;
  const dayOffset = Math.floor(i / 15);
  const hour = isOdd ? '07' : '15';
  const min = (i * 3) % 60;
  const dateStr = `2026-06-${String(29 - dayOffset).padStart(2, '0')}`;
  
  mockAttendancePunches.push({
    id: `pn-0${i}`,
    staffId: `stf-0${String(staffIdx).padStart(2, '0')}`,
    staffName: `Staff Member ${staffIdx}`,
    staffCode: `STF-FAC-0${String(staffIdx).padStart(2, '0')}`,
    biometricEmployeeCode: `BIO-30${String(staffIdx).padStart(2, '0')}`,
    punchTime: `${dateStr}T${hour}:${String(min).padStart(2, '0')}:00Z`,
    punchType: isOdd ? 'IN' as const : 'OUT' as const,
    source: i % 10 === 0 ? 'MANUAL' as const : 'BIOMETRIC_DEVICE' as const,
    deviceId: 'bio-device-003',
    deviceName: 'Society Office Attendance Reader',
    location: 'Society Office',
    syncJobId: `job-0${String(12 - dayOffset).padStart(2, '0')}`,
    isDuplicate: i % 15 === 0,
    isMapped: true,
    createdAt: new Date().toISOString(),
  });
}
