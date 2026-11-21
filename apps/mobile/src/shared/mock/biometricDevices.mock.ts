import type { BiometricDevice } from '../types/biometric.types';

export const mockBiometricDevices: BiometricDevice[] = [
  {
    id: 'bio-device-001', deviceCode: 'BIO-GATE-01', deviceName: 'Main Entry Biometric Face/Finger',
    vendorName: 'Spectra Biometrics', vendorModel: 'BioXS-500', location: 'Main Gate Security Room', gate: 'Gate 1',
    syncType: 'API_CONNECTOR', status: 'ACTIVE', lastSyncTime: '2026-06-29T23:45:00Z',
    lastSyncJobId: 'job-012', lastSyncStatus: 'COMPLETED', lastSyncPunchCount: 38,
    mappedStaffCount: 18, unmappedEmployeeCodes: 2, recentErrorCount: 0,
    ipAddressMasked: '192.168.1.***', installedAt: '2023-04-10', lastMaintenanceAt: '2026-05-15',
  },
  {
    id: 'bio-device-002', deviceCode: 'BIO-GATE-02', deviceName: 'B Wing Gate Fingerprint',
    vendorName: 'Spectra Biometrics', vendorModel: 'BioXS-300', location: 'B Wing Gate', gate: 'Gate 2',
    syncType: 'API_CONNECTOR', status: 'ACTIVE', lastSyncTime: '2026-06-29T23:40:00Z',
    lastSyncJobId: 'job-011', lastSyncStatus: 'COMPLETED', lastSyncPunchCount: 12,
    mappedStaffCount: 10, unmappedEmployeeCodes: 0, recentErrorCount: 1,
    ipAddressMasked: '192.168.1.***', installedAt: '2023-04-12', lastMaintenanceAt: '2026-05-15',
  },
  {
    id: 'bio-device-003', deviceCode: 'BIO-OFFICE-01', deviceName: 'Society Office Attendance Reader',
    vendorName: 'Matrix COSEC', vendorModel: 'COSEC PATH V2', location: 'Society Office lobby',
    syncType: 'LOCAL_AGENT', status: 'ACTIVE', lastSyncTime: '2026-06-29T23:30:00Z',
    lastSyncJobId: 'job-010', lastSyncStatus: 'COMPLETED_WITH_ERRORS', lastSyncPunchCount: 45,
    mappedStaffCount: 12, unmappedEmployeeCodes: 5, recentErrorCount: 4,
    ipAddressMasked: '192.168.2.***', installedAt: '2022-09-01', lastMaintenanceAt: '2026-06-10',
  },
  {
    id: 'bio-device-004', deviceCode: 'BIO-BASEMENT-01', deviceName: 'Basement B2 Security Punch',
    vendorName: 'Matrix COSEC', vendorModel: 'COSEC PATH V2', location: 'Basement B2 Lift Lobby',
    syncType: 'LOCAL_AGENT', status: 'OFFLINE', lastSyncTime: '2026-06-29T18:00:00Z',
    lastSyncJobId: 'job-008', lastSyncStatus: 'FAILED', lastSyncPunchCount: 0,
    mappedStaffCount: 4, unmappedEmployeeCodes: 1, recentErrorCount: 12,
    ipAddressMasked: '192.168.2.***', installedAt: '2024-03-20', lastMaintenanceAt: '2026-03-20',
    notes: 'Device connection timed out repeatedly. Network switch issue suspected in basement B2.',
  },
  {
    id: 'bio-device-005', deviceCode: 'BIO-CLUB-01', deviceName: 'Clubhouse Entrance Reader',
    vendorName: 'Spectra Biometrics', vendorModel: 'BioXS-300', location: 'Clubhouse Main Desk',
    syncType: 'FILE_IMPORT', status: 'MAINTENANCE', lastSyncTime: '2026-06-28T22:00:00Z',
    lastSyncJobId: 'job-005', lastSyncStatus: 'COMPLETED', lastSyncPunchCount: 15,
    mappedStaffCount: 6, unmappedEmployeeCodes: 0, recentErrorCount: 0,
    ipAddressMasked: '10.0.0.***', installedAt: '2024-01-15', lastMaintenanceAt: '2026-06-28',
    notes: 'Scheduled screen replacement and fingerprint sensor calibration.',
  },
  {
    id: 'bio-device-006', deviceCode: 'BIO-GATE-03', deviceName: 'C Wing Entry Reader',
    vendorName: 'Spectra Biometrics', vendorModel: 'BioXS-300', location: 'C Wing lobby',
    syncType: 'API_CONNECTOR', status: 'NOT_CONFIGURED',
    mappedStaffCount: 0, unmappedEmployeeCodes: 0, recentErrorCount: 0,
    installedAt: '2026-06-25',
    notes: 'Installed recently. Awaiting network cabling and IP configuration.',
  },
];
