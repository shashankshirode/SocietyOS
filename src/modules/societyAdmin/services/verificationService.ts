import { mockStore } from '../../../core/mockStore/mockStore';
import type { VerificationChannel, VerificationCodeRequest, VerificationCodeResult, VerifyCodeRequest, VerifyCodeResult } from '../data/residentRegistration.types';
import type { Absent } from '../../../shared/types/absence.types';

const withMockDelay = <T>(data: T, ms = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

const MOCK_OTP = '123456';
const OTP_EXPIRY_MINUTES = 5;

interface PendingVerification {
  id: string;
  contact: string;
  channel: VerificationChannel;
  code: string;
  purpose: string;
  expiresAt: string;
  attempts: number;
  verified: boolean;
}

function generateVerificationId(): string {
  return `ver-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getPendingVerifications(): PendingVerification[] {
  return (mockStore.getState() as any).pendingVerifications || [];
}

function setPendingVerifications(verifications: PendingVerification[]) {
  (mockStore.getState() as any).pendingVerifications = verifications;
  mockStore.notify();
}

export const verificationService = {
  async sendCode(request: VerificationCodeRequest): Promise<VerificationCodeResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const verifications = getPendingVerifications();
        const existing = verifications.find(
          (v) => v.contact === request.contact && v.channel === request.channel && !v.verified
        );

        if (existing && new Date(existing.expiresAt) > new Date()) {
          resolve({
            success: false,
            error: 'A verification code was recently sent. Please wait before requesting another.',
          });
          return;
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

        const verification: PendingVerification = {
          id: generateVerificationId(),
          contact: request.contact,
          channel: request.channel,
          code: MOCK_OTP,
          purpose: request.purpose,
          expiresAt,
          attempts: 0,
          verified: false,
        };

        setPendingVerifications([...verifications, verification]);

        console.log(`[MOCK] Verification code sent to ${request.contact} via ${request.channel}: ${MOCK_OTP}`);

        resolve({
          success: true,
          codeId: verification.id,
          expiresAt,
        });
      }, 500);
    });
  },

  async verifyCode(request: VerifyCodeRequest): Promise<VerifyCodeResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const verifications = getPendingVerifications();
        const index = verifications.findIndex((v) => v.id === request.codeId);

        if (index === -1) {
          resolve({ success: false, verified: false, error: 'Invalid verification session' });
          return;
        }

        const verification = verifications[index];

        if (verification.verified) {
          resolve({ success: false, verified: false, error: 'This code has already been used' });
          return;
        }

        if (new Date(verification.expiresAt) < new Date()) {
          resolve({ success: false, verified: false, error: 'Verification code has expired' });
          return;
        }

        if (verification.attempts >= 3) {
          resolve({ success: false, verified: false, error: 'Too many failed attempts. Please request a new code.' });
          return;
        }

        if (verification.code !== request.code) {
          verification.attempts += 1;
          setPendingVerifications(verifications);
          resolve({ success: false, verified: false, error: 'Invalid verification code' });
          return;
        }

        verification.verified = true;
        setPendingVerifications(verifications);

        resolve({ success: true, verified: true });
      }, 500);
    });
  },

  async resendCode(codeId: string): Promise<VerificationCodeResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const verifications = getPendingVerifications();
        const index = verifications.findIndex((v) => v.id === codeId);

        if (index === -1) {
          resolve({ success: false, error: 'Invalid verification session' });
          return;
        }

        const verification = verifications[index];
        const now = new Date();
        const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

        verification.code = MOCK_OTP;
        verification.expiresAt = expiresAt;
        verification.attempts = 0;
        verification.verified = false;

        setPendingVerifications(verifications);

        console.log(`[MOCK] Verification code resent to ${verification.contact} via ${verification.channel}: ${MOCK_OTP}`);

        resolve({
          success: true,
          codeId: verification.id,
          expiresAt,
        });
      }, 500);
    });
  },

  async getVerificationStatus(codeId: string): Promise<Absent | { verified: boolean; expiresAt: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const verifications = getPendingVerifications();
        const verification = verifications.find((v) => v.id === codeId);
        if (!verification) {
          resolve(undefined);
          return;
        }
        resolve({ verified: verification.verified, expiresAt: verification.expiresAt });
      }, 300);
    });
  },
};