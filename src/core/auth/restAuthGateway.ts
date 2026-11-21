import type {
  AuthGateway,
  AuthOtpRequest,
  AuthOtpRequestResult,
  AuthOtpVerifyRequest,
  AuthVerificationResult,
  CurrentIdentityResult,
  RefreshSessionResult,
} from './authGateway.types';
import { apiClient } from '../api/apiClient';
import { apiEndpoints } from '../api/apiEndpoints';
import { createIdempotencyKey } from '../api/idempotency';

export class RestAuthGateway implements AuthGateway {
  public async requestOtp(req: AuthOtpRequest): Promise<AuthOtpRequestResult> {
    try {
      const response = await apiClient.post<AuthOtpRequestResult>(
        apiEndpoints.auth.requestOtp,
        req,
        {
          idempotencyKey: createIdempotencyKey(`otp-req-${req.mobileNumber}`),
        }
      );
      if (response.success && response.data) {
        return response.data;
      }
      return {
        success: false,
        error: response.error?.message ?? 'Failed to request OTP from authentication server.',
        errorCode: response.error?.code ?? 'BACKEND_UNAVAILABLE',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication service is unreachable.';
      return {
        success: false,
        error: message,
        errorCode: 'BACKEND_UNAVAILABLE',
      };
    }
  }

  public async verifyOtp(req: AuthOtpVerifyRequest): Promise<AuthVerificationResult> {
    try {
      const response = await apiClient.post<AuthVerificationResult>(
        apiEndpoints.auth.verifyOtp,
        req,
        {
          idempotencyKey: createIdempotencyKey(`otp-verify-${req.mobileNumber}-${Date.now()}`),
        }
      );
      if (response.success && response.data) {
        return response.data;
      }
      return {
        success: false,
        error: response.error?.message ?? 'Failed to verify OTP with authentication server.',
        errorCode: response.error?.code ?? 'BACKEND_UNAVAILABLE',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication service is unreachable.';
      return {
        success: false,
        error: message,
        errorCode: 'BACKEND_UNAVAILABLE',
      };
    }
  }

  public async refreshSession(refreshToken: string): Promise<RefreshSessionResult> {
    try {
      const response = await apiClient.post<RefreshSessionResult>(
        apiEndpoints.auth.refreshSession,
        { refreshToken },
        {
          idempotencyKey: createIdempotencyKey(`session-refresh-${Date.now()}`),
        }
      );
      if (response.success && response.data) {
        return response.data;
      }
      return {
        success: false,
        error: response.error?.message ?? 'Failed to refresh authentication session.',
        errorCode: response.error?.code ?? 'SESSION_REFRESH_FAILED',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Session refresh service is unreachable.';
      return {
        success: false,
        error: message,
        errorCode: 'BACKEND_UNAVAILABLE',
      };
    }
  }

  public async getCurrentIdentity(): Promise<CurrentIdentityResult> {
    try {
      const response = await apiClient.get<CurrentIdentityResult>(
        apiEndpoints.auth.me
      );
      if (response.success && response.data) {
        return response.data;
      }
      return {
        success: false,
        error: response.error?.message ?? 'Failed to fetch authoritative user identity.',
        errorCode: response.error?.code ?? 'IDENTITY_LOOKUP_FAILED',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Identity service is unreachable.';
      return {
        success: false,
        error: message,
        errorCode: 'BACKEND_UNAVAILABLE',
      };
    }
  }

  public async logout(): Promise<void> {
    try {
      await apiClient.post(apiEndpoints.auth.logout, {});
    } catch {
      // Best-effort remote revocation; client session is always wiped
    }
  }
}

export const restAuthGateway = new RestAuthGateway();
