import type { BiometricMapping } from '../types/biometric.types';

export const mockBiometricMappings: BiometricMapping[] = [
  { id: 'map-001', deviceId: 'bio-device-001', deviceName: 'Main Entry Biometric', deviceCode: 'BIO-GATE-01', biometricEmployeeCode: 'BIO-1001', staffId: 'stf-001', staffName: 'Ramesh Pawar', staffCode: 'STF-SEC-001', status: 'ACTIVE', effectiveFrom: '2022-01-15', createdBy: 'Suresh Patil', createdAt: '2022-01-15T09:00:00Z', updatedAt: '2022-01-15T09:00:00Z' },
  { id: 'map-002', deviceId: 'bio-device-001', deviceName: 'Main Entry Biometric', deviceCode: 'BIO-GATE-01', biometricEmployeeCode: 'BIO-1002', staffId: 'stf-002', staffName: 'Vikas Thorat', staffCode: 'STF-SEC-002', status: 'ACTIVE', effectiveFrom: '2022-03-01', createdBy: 'Suresh Patil', createdAt: '2022-03-01T09:00:00Z', updatedAt: '2022-03-01T09:00:00Z' },
  { id: 'map-003', deviceId: 'bio-device-002', deviceName: 'B Wing Gate Fingerprint', deviceCode: 'BIO-GATE-02', biometricEmployeeCode: 'BIO-1003', staffId: 'stf-003', staffName: 'Suresh Kamble', staffCode: 'STF-SEC-003', status: 'ACTIVE', effectiveFrom: '2023-06-01', createdBy: 'Suresh Patil', createdAt: '2023-06-01T09:00:00Z', updatedAt: '2023-06-01T09:00:00Z' },
  { id: 'map-004', deviceId: 'bio-device-001', deviceName: 'Main Entry Biometric', deviceCode: 'BIO-GATE-01', biometricEmployeeCode: 'BIO-1004', staffId: 'stf-004', staffName: 'Dinesh Yadav', staffCode: 'STF-SEC-004', status: 'ACTIVE', effectiveFrom: '2021-07-20', createdBy: 'Suresh Patil', createdAt: '2021-07-20T09:00:00Z', updatedAt: '2021-07-20T09:00:00Z' },
  { id: 'map-005', deviceId: 'bio-device-005', deviceName: 'Clubhouse Entrance Reader', deviceCode: 'BIO-CLUB-01', biometricEmployeeCode: 'BIO-1005', staffId: 'stf-005', staffName: 'Manoj Shinde', staffCode: 'STF-SEC-005', status: 'PENDING_REVIEW', effectiveFrom: '2025-01-10', createdBy: 'Suresh Patil', createdAt: '2025-01-10T09:00:00Z', updatedAt: '2025-01-10T09:00:00Z', notes: 'Awaiting supervisor confirmation.' },
  { id: 'map-006', deviceId: 'bio-device-001', deviceName: 'Main Entry Biometric', deviceCode: 'BIO-GATE-01', biometricEmployeeCode: 'BIO-1006', staffId: 'stf-006', staffName: 'Pradeep Raut', staffCode: 'STF-SEC-006', status: 'ACTIVE', effectiveFrom: '2022-11-01', createdBy: 'Suresh Patil', createdAt: '2022-11-01T09:00:00Z', updatedAt: '2022-11-01T09:00:00Z' },
  { id: 'map-007', deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', deviceCode: 'BIO-OFFICE-01', biometricEmployeeCode: 'BIO-2001', staffId: 'stf-007', staffName: 'Meena Jadhav', staffCode: 'STF-HK-001', status: 'ACTIVE', effectiveFrom: '2023-01-01', createdBy: 'Suresh Patil', createdAt: '2023-01-01T09:00:00Z', updatedAt: '2023-01-01T09:00:00Z' },
  { id: 'map-008', deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', deviceCode: 'BIO-OFFICE-01', biometricEmployeeCode: 'BIO-2002', staffId: 'stf-008', staffName: 'Sunita Bansode', staffCode: 'STF-HK-002', status: 'ACTIVE', effectiveFrom: '2023-03-15', createdBy: 'Suresh Patil', createdAt: '2023-03-15T09:00:00Z', updatedAt: '2023-03-15T09:00:00Z' },
  { id: 'map-009', deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', deviceCode: 'BIO-OFFICE-01', biometricEmployeeCode: 'BIO-2003', staffId: 'stf-009', staffName: 'Rekha Shinde', staffCode: 'STF-HK-003', status: 'ACTIVE', effectiveFrom: '2022-08-01', createdBy: 'Suresh Patil', createdAt: '2022-08-01T09:00:00Z', updatedAt: '2022-08-01T09:00:00Z' },
  { id: 'map-010', deviceId: 'bio-device-003', deviceName: 'Society Office Attendance Reader', deviceCode: 'BIO-OFFICE-01', biometricEmployeeCode: 'BIO-3001', staffId: 'stf-011', staffName: 'Rajesh Gaikwad', staffCode: 'STF-FAC-001', status: 'ACTIVE', effectiveFrom: '2020-06-01', createdBy: 'Suresh Patil', createdAt: '2020-06-01T09:00:00Z', updatedAt: '2020-06-01T09:00:00Z' },
  
  ...Array.from({ length: 30 }).map((_, idx) => {
    const idNum = idx + 11;
    return {
      id: `map-0${idNum}`,
      deviceId: 'bio-device-003',
      deviceName: 'Society Office Attendance Reader',
      deviceCode: 'BIO-OFFICE-01',
      biometricEmployeeCode: `BIO-30${idNum}`,
      staffId: `stf-0${idNum}`,
      staffName: `Staff Member ${idNum}`,
      staffCode: `STF-FAC-0${idNum}`,
      status: 'ACTIVE' as const,
      effectiveFrom: '2026-01-01',
      createdBy: 'Suresh Patil',
      createdAt: '2026-01-01T09:00:00Z',
      updatedAt: '2026-01-01T09:00:00Z',
    };
  }),
];
