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
import type { JsonObject } from '../api/api.types';

export class RestAuthGateway implements AuthGateway {
  public async requestOtp(req: AuthOtpRequest): Promise<AuthOtpRequestResult> {
    try {
      const response = await apiClient.post<AuthOtpRequestResult>(
        apiEndpoints.auth.requestOtp,
        req as unknown as JsonObject,
        {
          idempotencyKey: createIdempotencyKey(`otp-req-${req.mobileNumber}`),
        }
      );
      return response;
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
        req as unknown as JsonObject,
        {
          idempotencyKey: createIdempotencyKey(`otp-verify-${req.mobileNumber}-${Date.now()}`),
        }
      );
      return response;
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
        apiEndpoints.auth.refreshToken,
        { refreshToken } as JsonObject,
        {
          idempotencyKey: createIdempotencyKey(`session-refresh-${Date.now()}`),
        }
      );
      return response;
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
      return response;
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
