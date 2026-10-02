import { residentAuthService, resetResidentAuthServiceState, setExistingProfileForTesting } from '../services/otpVerificationService';
import { registrationService } from '../services/registrationService';
import { mockStore } from '../../../../core/mockStore/mockStore';

describe('OTP Verification Service', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockStore.getState().residentProfiles = new Map();
    mockStore.getState().residentMemberships = [];
    resetResidentAuthServiceState();
  });

  afterEach(() => {
    jest.useRealTimers();
    resetResidentAuthServiceState();
  });

  describe('requestOtp', () => {
    it('should send OTP for new registration', async () => {
      const result = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      expect(result.status).toBe('sent');
      expect(result.challengeId).toBeDefined();
      expect(result.purpose).toBe('newRegistration');
      expect(result.retryAfterSeconds).toBe(30);
    });

    it('should send OTP for existing user', async () => {
      setExistingProfileForTesting('9876543210', { 
        userId: 'user-1', 
        fullName: 'Existing User',
        mobileNumber: '9876543210',
        countryCode: '+91',
        country: 'India',
        timezone: 'Asia/Kolkata',
        locale: 'en-IN',
      });
      const result = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      expect(result.purpose).toBe('existingUser');
    });

    it('should send OTP for invitation', async () => {
      const result = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '8888888888' });
      expect(result.purpose).toBe('invitation');
    });

    it('should reuse existing challenge for repeated requests', async () => {
      const result1 = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      expect(result1.status).toBe('sent');
      const result2 = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      expect(result2.status).toBe('sent');
      expect(result2.challengeId).toBe(result1.challengeId);
    });

    it('should rate limit specific number 7777777777', async () => {
      const result = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '7777777777' });
      expect(result.status).toBe('rateLimited');
    });
  });

  describe('resendOtp', () => {
    it('should resend OTP after cooldown', async () => {
      const requestResult = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      expect(requestResult.status).toBe('sent');
      
      jest.advanceTimersByTime(35000);
      
      const resendResult = await residentAuthService.resendOtp(requestResult.challengeId);
      expect(resendResult.status).toBe('sent');
    });

    it('should rate limit resend before cooldown', async () => {
      const requestResult = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      const resendResult = await residentAuthService.resendOtp(requestResult.challengeId);
      expect(resendResult.status).toBe('rateLimited');
    });

    it('should return rate limited for invalid challenge', async () => {
      const result = await residentAuthService.resendOtp('invalid-challenge');
      expect(result.status).toBe('rateLimited');
    });
  });

  describe('verifyOtp', () => {
    it('should verify correct OTP', async () => {
      const requestResult = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      const result = await residentAuthService.verifyOtp({ challengeId: requestResult.challengeId, otp: '123456' });
      expect(result.status).toBe('verified');
      expect(result.profile).toBeDefined();
    });

    it('should reject incorrect OTP', async () => {
      const requestResult = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      const result = await residentAuthService.verifyOtp({ challengeId: requestResult.challengeId, otp: '000000' });
      expect(result.status).toBe('incorrectOtp');
      expect(result.attemptsRemaining).toBe(2);
    });

    it('should expire OTP after time', async () => {
      const requestResult = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      jest.advanceTimersByTime(6 * 60 * 1000);
      const result = await residentAuthService.verifyOtp({ challengeId: requestResult.challengeId, otp: '123456' });
      expect(result.status).toBe('expiredOtp');
    });

    it('should handle idempotent verification', async () => {
      const requestResult = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      const result1 = await residentAuthService.verifyOtp({ challengeId: requestResult.challengeId, otp: '123456' });
      const result2 = await residentAuthService.verifyOtp({ challengeId: requestResult.challengeId, otp: '123456' });
      expect(result1.status).toBe('verified');
      expect(result2.status).toBe('verified');
    });

    it('should return challengeNotFound for invalid challenge', async () => {
      const result = await residentAuthService.verifyOtp({ challengeId: 'invalid', otp: '123456' });
      expect(result.status).toBe('challengeNotFound');
    });

    it('should lock after max attempts', async () => {
      const requestResult = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      await residentAuthService.verifyOtp({ challengeId: requestResult.challengeId, otp: '000000' });
      await residentAuthService.verifyOtp({ challengeId: requestResult.challengeId, otp: '000000' });
      const result = await residentAuthService.verifyOtp({ challengeId: requestResult.challengeId, otp: '000000' });
      expect(result.status).toBe('incorrectOtp');
      expect(result.attemptsRemaining).toBe(0);
    });
  });

  describe('registerResident', () => {
    it('should register resident after verified OTP', async () => {
      const requestResult = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      await residentAuthService.verifyOtp({ challengeId: requestResult.challengeId, otp: '123456' });
      const result = await residentAuthService.registerResident({ challengeId: requestResult.challengeId, fullName: 'Test User' });
      expect(result.status).toBe('verified');
      expect(result.profile.fullName).toBe('Test User');
    });

    it('should reject registration without verified OTP', async () => {
      const requestResult = await residentAuthService.requestOtp({ countryCode: '+91', mobileNumber: '9876543210' });
      const result = await residentAuthService.registerResident({ challengeId: requestResult.challengeId, fullName: 'Test User' });
      expect(result.status).toBe('incorrectOtp');
    });
  });
});