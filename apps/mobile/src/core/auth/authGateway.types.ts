import type { AuthSession } from './authSession.types';

export interface AuthOtpRequest {
  mobileNumber: string;
  countryCode?: string;
}

export interface AuthOtpRequestResult {
  success: boolean;
  challengeId?: string;
  retryAfterSeconds?: number;
  demoOtp?: string;
  error?: string;
  errorCode?: string;
}

export interface AuthOtpVerifyRequest {
  challengeId?: string;
  mobileNumber: string;
  otp: string;
}

export interface AuthVerificationResult {
  success: boolean;
  session?: AuthSession;
  isNewUser?: boolean;
  error?: string;
  errorCode?: string;
}

export interface CurrentIdentityResult {
  success: boolean;
  identity?: AuthSession;
  error?: string;
  errorCode?: string;
}

export interface RefreshSessionResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
  errorCode?: string;
}

export interface AuthGateway {
  requestOtp(req: AuthOtpRequest): Promise<AuthOtpRequestResult>;
  verifyOtp(req: AuthOtpVerifyRequest): Promise<AuthVerificationResult>;
  refreshSession(refreshToken: string): Promise<RefreshSessionResult>;
  getCurrentIdentity(): Promise<CurrentIdentityResult>;
  logout(): Promise<void>;
}
