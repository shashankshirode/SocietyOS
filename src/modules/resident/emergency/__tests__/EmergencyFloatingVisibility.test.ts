import { isSosFloatingVisible } from '../data/emergencyFloatingVisibility';

describe('EmergencyFloatingVisibility', () => {
  it('should return true for default dashboard, notices, profiles', () => {
    expect(isSosFloatingVisible('ResidentHome')).toBe(true);
    expect(isSosFloatingVisible('NoticeListFromHome')).toBe(true);
    expect(isSosFloatingVisible('Profile')).toBe(true);
  });

  it('should return false for deep multi-step checkout and forms', () => {
    expect(isSosFloatingVisible('MockPaymentConfirmation')).toBe(false);
    expect(isSosFloatingVisible('AddFamilyMember')).toBe(false);
    expect(isSosFloatingVisible('AddTenantStart')).toBe(false);
    expect(isSosFloatingVisible('UploadDocument')).toBe(false);
  });

  it('should default to true if route name is empty or undefined', () => {
    expect(isSosFloatingVisible('')).toBe(true);
  });
});
