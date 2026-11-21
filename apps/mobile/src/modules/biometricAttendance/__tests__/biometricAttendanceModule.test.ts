import { biometricRepository } from '../data/biometricAttendance.repository';

describe('Biometric Attendance Module Harmonization', () => {
  it('biometricRepository lists devices successfully', async () => {
    const result = await biometricRepository.getBiometricDevices();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Array.isArray(result.data)).toBe(true);
    }
  });

  it('biometricRepository lists punch sync logs successfully', async () => {
    const result = await biometricRepository.listBiometricPunchSyncLogs();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Array.isArray(result.data)).toBe(true);
    }
  });

  it('biometricRepository lists unknown employee codes successfully', async () => {
    const result = await biometricRepository.listUnknownEmployeeCodes();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Array.isArray(result.data)).toBe(true);
    }
  });

  it('biometricRepository gets monthly biometric report successfully', async () => {
    const result = await biometricRepository.getMonthlyBiometricReport();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Array.isArray(result.data)).toBe(true);
    }
  });

  it('biometricRepository gets vendor billing summary successfully', async () => {
    const result = await biometricRepository.getVendorBillingAttendanceSummary();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Array.isArray(result.data)).toBe(true);
    }
  });
});
