import type {
  AuthGateway,
  AuthOtpRequest,
  AuthOtpRequestResult,
  AuthOtpVerifyRequest,
  AuthVerificationResult,
  CurrentIdentityResult,
  RefreshSessionResult,
} from './authGateway.types';
import type { AuthSession } from './authSession.types';
import { runtimePolicy } from '../config/runtimePolicy';
import { getCurrentSession } from './sessionStore';
import { lookupIdentityByPhone } from '../identity/identityResolver';

export class MockAuthGateway implements AuthGateway {
  public async requestOtp(req: AuthOtpRequest): Promise<AuthOtpRequestResult> {
    runtimePolicy.assertDemoAllowed('MockAuthGateway.requestOtp');

    const cleanNumber = req.mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanNumber.length !== 10) {
      return {
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number.',
        errorCode: 'INVALID_MOBILE_NUMBER',
      };
    }

    if (cleanNumber === '9999999999' || cleanNumber === '0000000000') {
      return {
        success: false,
        error: 'Your account has been suspended by the society administration.',
        errorCode: 'ACCOUNT_SUSPENDED',
      };
    }

    const challengeId = `otp-challenge-${Date.now()}`;
    return {
      success: true,
      challengeId,
      retryAfterSeconds: 30,
      demoOtp: '123456',
    };
  }

  public async verifyOtp(req: AuthOtpVerifyRequest): Promise<AuthVerificationResult> {
    runtimePolicy.assertDemoAllowed('MockAuthGateway.verifyOtp');

    const cleanNumber = req.mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanNumber.length !== 10) {
      return {
        success: false,
        error: 'Please enter a valid 10-digit mobile number.',
        errorCode: 'INVALID_MOBILE_NUMBER',
      };
    }

    if (req.otp !== '123456') {
      return {
        success: false,
        error: 'Invalid verification code. Please enter the valid 6-digit code (Demo: 123456).',
        errorCode: 'INVALID_OTP',
      };
    }

    const lookup = lookupIdentityByPhone(cleanNumber);

    if (lookup.status === 'SUSPENDED') {
      return {
        success: false,
        error: 'Your account is suspended. Please contact your society administrator.',
        errorCode: 'ACCOUNT_SUSPENDED',
      };
    }

    if (lookup.status === 'REGISTERED' && lookup.identity) {
      const p = lookup.identity;
      const displayName = p.person.preferredName ?? `${p.person.firstName} ${p.person.lastName}`;
      const session: AuthSession = {
        userId: p.user.id,
        name: displayName,
        role: p.activeRole,
        personaKey: p.personaKey,
        ...(p.membership?.societyId ? { societyId: p.membership.societyId } : {}),
        ...(p.membership?.societyName ? { societyName: p.membership.societyName } : {}),
        ...(p.unitRelationship?.unitId ? { unitId: p.unitRelationship.unitId } : {}),
        ...(p.unitRelationship?.unitNumber ? { unitLabel: p.unitRelationship.unitNumber } : {}),
        isHouseholdAdmin: p.isHouseholdAdmin,
        token: `mock-token-${p.user.id}`,
        refreshToken: `mock-refresh-${p.user.id}`,
        isMockSession: true,
      };
      return { success: true, session };
    }

    return {
      success: true,
      isNewUser: true,
    };
  }

  public async refreshSession(refreshToken: string): Promise<RefreshSessionResult> {
    runtimePolicy.assertDemoAllowed('MockAuthGateway.refreshSession');
    if (!refreshToken.startsWith('mock-refresh-')) {
      return {
        success: false,
        error: 'Invalid mock refresh token.',
        errorCode: 'INVALID_REFRESH_TOKEN',
      };
    }
    const current = getCurrentSession();
    if (!current) {
      return {
        success: false,
        error: 'No active session to refresh.',
        errorCode: 'SESSION_NOT_FOUND',
      };
    }
    return {
      success: true,
      session: {
        ...current,
        token: `mock-token-${current.userId}-${Date.now()}`,
      },
    };
  }

  public async getCurrentIdentity(): Promise<CurrentIdentityResult> {
    runtimePolicy.assertDemoAllowed('MockAuthGateway.getCurrentIdentity');
    const current = getCurrentSession();
    if (!current) {
      return {
        success: false,
        error: 'Unauthenticated mock session.',
        errorCode: 'UNAUTHENTICATED',
      };
    }
    return {
      success: true,
      identity: current,
    };
  }

  public async logout(): Promise<void> {
    // In mock mode, session clearing is handled locally
  }
}

export const mockAuthGateway = new MockAuthGateway();
