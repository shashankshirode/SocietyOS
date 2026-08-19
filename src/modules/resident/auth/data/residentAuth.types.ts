import type { ResidenceMembership as Membership, SupportedCallingCode } from './membership.types';
import type { AuthenticationMessageKey } from '../messages/auth.messages';

export type ResidentCountryCode = SupportedCallingCode;

export type ResidentOtpPurpose = 'existingUser' | 'newRegistration' | 'invitation';

export type ResidentOtpRequestInput = {
  countryCode: ResidentCountryCode;
  mobileNumber: string;
};

export type ResidentOtpRequestResult =
  | { status: 'sent'; challengeId: string; purpose: ResidentOtpPurpose; expiresAt: string; retryAfterSeconds: number }
  | { status: 'rateLimited'; retryAfterSeconds: number };

export type ResidentOtpVerificationInput = {
  challengeId: string;
  otp: string;
};

export type ResidentGlobalProfile = {
  userId: string;
  fullName: string;
  mobileNumber: string;
  countryCode: ResidentCountryCode;
  country: 'India';
  timezone: 'Asia/Kolkata';
  locale: 'en-IN';
};

export type ResidentMembership = Membership;


export type ResidentOtpVerificationResult =
  | { status: 'verified'; purpose: ResidentOtpPurpose; profile: ResidentGlobalProfile; memberships: readonly ResidentMembership[] }
  | { status: 'incorrectOtp'; attemptsRemaining: number }
  | { status: 'expiredOtp' }
  | { status: 'challengeNotFound' };

export type RegisterResidentInput = {
  challengeId: string;
  fullName: string;
};

export type AcceptResidentInvitationInput = {
  membershipId: string;
};

export type ResidentAuthRepository = {
  requestOtp(input: ResidentOtpRequestInput): Promise<ResidentOtpRequestResult>;
  resendOtp(challengeId: string): Promise<ResidentOtpRequestResult>;
  verifyOtp(input: ResidentOtpVerificationInput): Promise<ResidentOtpVerificationResult>;
  registerResident(input: RegisterResidentInput): Promise<ResidentOtpVerificationResult>;
  acceptInvitation(input: AcceptResidentInvitationInput): Promise<ResidentMembership>;
};

export type AuthenticationStage =
  | 'phoneVerification'
  | 'residenceSelection'
  | 'residenceEntry';

export type PhoneFieldStatus =
  | 'idle'
  | 'focused'
  | 'partial'
  | 'valid'
  | 'invalid'
  | 'submitting'
  | 'disabled'
  | 'offline';

export type ResidenceActivityType =
  | 'visitor'
  | 'maintenance'
  | 'parcel'
  | 'complaint'
  | 'notice'
  | 'family'
  | 'emergency'
  | 'noc';

export interface ResidenceActivityPreview {
  readonly id: string;
  readonly type: ResidenceActivityType;
  readonly messageKey: AuthenticationMessageKey;
  readonly status: 'success' | 'information' | 'attention';
}
