import { BiometricIntegrationService } from '../services/biometricIntegrationService';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import { normalizeAttendanceStatus, normalizePunchSource, normalizePunchType } from '../data/staffAttendance.mapper';
import { biometricApiSource } from '../../biometricAttendance/data/biometricAttendance.apiSource';
import { staffAttendanceApiSource } from '../data/staffAttendance.apiSource';

describe('Biometric Integration & Sync Invariants', () => {
  const adminActor: StaffOperationsActor = {
    userId: 'usr-admin-01',
    societyId: 'soc-green-valley',
    role: 'HR_ADMIN',
    displayName: 'Admin User',
  };

  it('Invariant 26: ZERO raw biometric templates or fingerprint images are stored in Society OS', () => {
    const service = new BiometricIntegrationService();
    const dev = service.registerDevice(adminActor, 'soc-green-valley', {
      deviceCode: 'BIO-TERM-01',
      deviceName: 'Main Gate Terminal',
      vendorName: 'ZKTeco Bio',
      location: 'Main Gate',
    });

    service.createMapping(adminActor, 'soc-green-valley', {
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      deviceName: dev.deviceName,
      biometricEmployeeCode: '1001',
      staffId: 'stf-001',
      staffName: 'Ramesh Pawar',
      staffCode: 'STF-001',
      effectiveFrom: '2026-01-01',
    });

    const syncResult = service.syncDeviceBatch(dev.id, 'soc-green-valley', [
      { employeeCode: '1001', punchTime: '2026-06-15T08:00:00Z', punchType: 'IN' },
      { employeeCode: '1001', punchTime: '2026-06-15T16:00:00Z', punchType: 'OUT' },
    ]);

    const json = JSON.stringify(syncResult);
    expect(json).not.toContain('fingerprint');
    expect(json).not.toContain('template');
    expect(json).not.toContain('embedding');
    expect(json).not.toContain('biometricBlob');
    expect(json).not.toContain('image');
  });

  it('Invariant 21 & 22: Duplicate batch or repeated event sync does not produce duplicate punches or double attendance', () => {
    const service = new BiometricIntegrationService();
    const dev = service.registerDevice(adminActor, 'soc-green-valley', {
      deviceCode: 'BIO-TERM-02',
      deviceName: 'Clubhouse Terminal',
      vendorName: 'Hikvision',
      location: 'Clubhouse',
    });

    service.createMapping(adminActor, 'soc-green-valley', {
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      deviceName: dev.deviceName,
      biometricEmployeeCode: '1002',
      staffId: 'stf-002',
      staffName: 'Suresh Patil',
      staffCode: 'STF-002',
      effectiveFrom: '2026-01-01',
    });

    const batch = [
      { employeeCode: '1002', punchTime: '2026-06-15T09:00:00Z', punchType: 'IN' as const },
      { employeeCode: '1002', punchTime: '2026-06-15T18:00:00Z', punchType: 'OUT' as const },
    ];

    const firstSync = service.syncDeviceBatch(dev.id, 'soc-green-valley', batch);
    expect(firstSync.importedPunches).toBe(2);
    expect(firstSync.duplicatePunches).toBe(0);
    expect(firstSync.acceptedPunches.length).toBe(2);

    const replaySync = service.syncDeviceBatch(dev.id, 'soc-green-valley', batch);
    expect(replaySync.importedPunches).toBe(0);
    expect(replaySync.duplicatePunches).toBe(2);
    expect(replaySync.acceptedPunches.length).toBe(0);
  });

  it('Invariant 23: Unknown employee code is retained as exception rather than discarded', () => {
    const service = new BiometricIntegrationService();
    const dev = service.registerDevice(adminActor, 'soc-green-valley', {
      deviceCode: 'BIO-TERM-03',
      deviceName: 'Tower Gate Terminal',
      vendorName: 'Anviz',
      location: 'Tower Gate',
    });

    const result = service.syncDeviceBatch(dev.id, 'soc-green-valley', [
      { employeeCode: 'E999', punchTime: '2026-06-15T08:30:00Z', punchType: 'IN' },
    ]);

    expect(result.unmappedEmployeeCodes).toBe(1);
    expect(result.acceptedPunches.length).toBe(0);

    const unknownList = service.getUnknownEmployeeCodes();
    expect(unknownList.length).toBe(1);
    expect(unknownList[0]?.employeeCode).toBe('E999');
    expect(unknownList[0]?.resolutionStatus).toBe('OPEN');

    const syncErrors = service.getSyncErrors(dev.id);
    expect(syncErrors.some(e => e.errorType === 'UNKNOWN_EMPLOYEE_CODE')).toBe(true);

    service.createMapping(adminActor, 'soc-green-valley', {
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      deviceName: dev.deviceName,
      biometricEmployeeCode: 'E999',
      staffId: 'stf-999',
      staffName: 'Newly Mapped Worker',
      staffCode: 'STF-999',
      effectiveFrom: '2026-06-01',
    });

    const updatedUnknown = service.getUnknownEmployeeCodes().find(u => u.employeeCode === 'E999');
    expect(updatedUnknown?.resolutionStatus).toBe('MAPPED');
    expect(updatedUnknown?.mappedStaffId).toBe('stf-999');
  });

  it('Invariant 24 & 25: Effective-dated mapping handles employee code reuse without corrupting historical attendance', () => {
    const service = new BiometricIntegrationService();
    const dev = service.registerDevice(adminActor, 'soc-green-valley', {
      deviceCode: 'BIO-TERM-04',
      deviceName: 'Basement Terminal',
      vendorName: 'Suprema',
      location: 'Basement',
    });

    service.createMapping(adminActor, 'soc-green-valley', {
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      deviceName: dev.deviceName,
      biometricEmployeeCode: 'CODE-555',
      staffId: 'stf-worker-2025',
      staffName: 'Old Guard 2025',
      staffCode: 'STF-OLD',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
    });

    service.createMapping(adminActor, 'soc-green-valley', {
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      deviceName: dev.deviceName,
      biometricEmployeeCode: 'CODE-555',
      staffId: 'stf-worker-2026',
      staffName: 'New Guard 2026',
      staffCode: 'STF-NEW',
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-12-31',
    });

    const mappingMay2025 = service.getMappingForPunch(dev.id, 'CODE-555', '2025-05-10T08:00:00Z');
    expect(mappingMay2025?.staffId).toBe('stf-worker-2025');

    const mappingMay2026 = service.getMappingForPunch(dev.id, 'CODE-555', '2026-05-10T08:00:00Z');
    expect(mappingMay2026?.staffId).toBe('stf-worker-2026');
  });

  it('Invariant 29: Clock drift is tracked and surfaced as warning rather than silently rewritten', () => {
    const service = new BiometricIntegrationService();
    const dev = service.registerDevice(adminActor, 'soc-green-valley', {
      deviceCode: 'BIO-TERM-05',
      deviceName: 'Pool Terminal',
      vendorName: 'Matrix',
      location: 'Pool Area',
    });

    service.createMapping(adminActor, 'soc-green-valley', {
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      deviceName: dev.deviceName,
      biometricEmployeeCode: '1005',
      staffId: 'stf-005',
      staffName: 'Pool Lifeguard',
      staffCode: 'STF-005',
      effectiveFrom: '2026-01-01',
    });

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const result = service.syncDeviceBatch(dev.id, 'soc-green-valley', [
      {
        employeeCode: '1005',
        punchTime: '2026-06-15T08:00:00Z',
        punchType: 'IN',
        deviceTimestamp: twoHoursAgo,
      },
    ]);

    expect(result.clockDriftWarnings).toBe(1);
    const errors = service.getSyncErrors(dev.id);
    expect(errors.some(e => e.errorType === 'DEVICE_TIME_MISMATCH')).toBe(true);
  });

  it('Invariant 33: Boundary normalizers safely handle unknown API enums without unsafe casts', () => {
    expect(normalizeAttendanceStatus('PRESENT')).toBe('PRESENT');
    expect(normalizeAttendanceStatus('CORRUPT_STATUS')).toBe('ABSENT');
    expect(normalizeAttendanceStatus(undefined)).toBe('ABSENT');

    expect(normalizePunchSource('BIOMETRIC_DEVICE')).toBe('BIOMETRIC_DEVICE');
    expect(normalizePunchSource('ALIEN_DEVICE')).toBe('MANUAL');

    expect(normalizePunchType('IN')).toBe('IN');
    expect(normalizePunchType('OUT')).toBe('OUT');
    expect(normalizePunchType('UNKNOWN_PUNCH')).toBe('UNKNOWN');
  });

  it('Invariant 34: Biometric production API does NOT return NOT_IMPLEMENTED', async () => {
    jest.spyOn(staffAttendanceApiSource, 'getBiometricDevices').mockResolvedValue([]);
    jest.spyOn(staffAttendanceApiSource, 'getAttendancePunches').mockResolvedValue([]);
    jest.spyOn(staffAttendanceApiSource, 'getBiometricSyncErrors').mockResolvedValue([]);
    jest.spyOn(staffAttendanceApiSource, 'getMonthlyAttendanceReport').mockResolvedValue([]);
    jest.spyOn(staffAttendanceApiSource, 'getVendorAttendanceReport').mockResolvedValue([]);

    const devicesResult = await biometricApiSource.getBiometricDevices();
    expect(devicesResult.ok).toBe(true);
    if (devicesResult.ok) {
      expect(Array.isArray(devicesResult.data)).toBe(true);
    }

    const logsResult = await biometricApiSource.listBiometricPunchSyncLogs();
    expect(logsResult.ok).toBe(true);

    const unknownResult = await biometricApiSource.listUnknownEmployeeCodes();
    expect(unknownResult.ok).toBe(true);

    const reportResult = await biometricApiSource.getMonthlyBiometricReport();
    expect(reportResult.ok).toBe(true);

    const vendorSummary = await biometricApiSource.getVendorBillingAttendanceSummary();
    expect(vendorSummary.ok).toBe(true);
  });
});

