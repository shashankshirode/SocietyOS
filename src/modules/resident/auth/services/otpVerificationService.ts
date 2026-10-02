import { mockStore } from '../../../../core/mockStore/mockStore';
import type {
  ResidentOtpRequestInput,
  ResidentOtpRequestResult,
  ResidentOtpVerificationInput,
  ResidentOtpVerificationResult,
  ResidentOtpPurpose,
  ResidentCountryCode,
  ResidentGlobalProfile,
} from '../data/residentAuth.types';
import type { ResidentAuthRepository } from '../data/residentAuth.types';
import { createIdempotencyKey } from '../../../../core/api/idempotency';

type OtpChallenge = {
  challengeId: string;
  mobileNumber: string;
  countryCode: ResidentCountryCode;
  purpose: ResidentOtpPurpose;
  expiresAtEpochMs: number;
  resendAvailableAtEpochMs: number;
  attemptsRemaining: number;
  verified: boolean;
  idempotencyKey: string;
  createdAt: string;
};

type RateLimitBucket = {
  count: number;
  windowStart: number;
  blockedUntil?: number;
};

const challengeStore = new Map<string, OtpChallenge>();
const profileStore = new Map<string, ResidentGlobalProfile>();
const rateLimitStore = new Map<string, RateLimitBucket>();
const verificationAttemptStore = new Map<string, RateLimitBucket>();

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_VERIFY_ATTEMPTS = 3;
const MAX_REQUESTS_PER_WINDOW = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const VERIFY_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_VERIFY_REQUESTS_PER_WINDOW = 10;

const defaultProfile: ResidentGlobalProfile = {
  userId: "resident-001",
  fullName: "Aarav Mehta",
  mobileNumber: "7276834907",
  countryCode: "+91",
  country: "India",
  timezone: "Asia/Kolkata",
  locale: "en-IN",
};

profileStore.set(defaultProfile.mobileNumber, defaultProfile);

function purposeForMobile(mobileNumber: string): ResidentOtpPurpose {
  if (mobileNumber === "8888888888") return "invitation";
  if (profileStore.has(mobileNumber)) return "existingUser";
  return "newRegistration";
}

function profileForChallenge(challenge: OtpChallenge): ResidentGlobalProfile {
  return (
    profileStore.get(challenge.mobileNumber) ?? {
      userId: `resident-${challenge.mobileNumber.slice(-4)}`,
      fullName:
        challenge.purpose === "invitation"
          ? "Invited Resident"
          : "New Resident",
      mobileNumber: challenge.mobileNumber,
      countryCode: challenge.countryCode,
      country: "India",
      timezone: "Asia/Kolkata",
      locale: "en-IN",
    }
  );
}

function checkRateLimit(bucket: RateLimitBucket | undefined, maxRequests: number, windowMs: number): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  if (!bucket) return { allowed: true };
  
  if (bucket.blockedUntil && now < bucket.blockedUntil) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.blockedUntil - now) / 1000) };
  }
  
  if (now - bucket.windowStart > windowMs) {
    return { allowed: true };
  }
  
  if (bucket.count >= maxRequests) {
    const retryAfter = Math.ceil((bucket.windowStart + windowMs - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }
  
  return { allowed: true };
}

function incrementRateLimit(key: string, windowMs: number): RateLimitBucket {
  const now = Date.now();
  const existing = rateLimitStore.get(key);
  
  if (!existing || now - existing.windowStart > windowMs) {
    const newBucket: RateLimitBucket = { count: 1, windowStart: now };
    rateLimitStore.set(key, newBucket);
    return newBucket;
  }
  
  existing.count += 1;
  rateLimitStore.set(key, existing);
  return existing;
}

function getRateLimitKey(input: ResidentOtpRequestInput): string {
  return `request:${input.countryCode}:${input.mobileNumber}`;
}

function getVerifyRateLimitKey(challengeId: string): string {
  return `verify:${challengeId}`;
}

export const residentAuthService: ResidentAuthRepository = {
  async requestOtp(input: ResidentOtpRequestInput): Promise<ResidentOtpRequestResult> {
    if (input.mobileNumber === "7777777777") {
      return { status: "rateLimited", retryAfterSeconds: 60 };
    }
    
    const rateLimitKey = getRateLimitKey(input);
    const rateLimit = checkRateLimit(rateLimitStore.get(rateLimitKey), MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS);
    
    if (!rateLimit.allowed) {
      return { status: 'rateLimited', retryAfterSeconds: rateLimit.retryAfterSeconds ?? 60 };
    }

    const idempotencyKey = createIdempotencyKey(`resident-otp-request-${input.countryCode}-${input.mobileNumber}`);
    
    const existingChallenge = Array.from(challengeStore.values()).find(
      (c) => c.mobileNumber === input.mobileNumber && 
             c.countryCode === input.countryCode && 
             !c.verified &&
             c.expiresAtEpochMs > Date.now()
    );

    if (existingChallenge) {
      const resendRateLimit = checkRateLimit(
        rateLimitStore.get(`resend:${existingChallenge.challengeId}`),
        1,
        RESEND_COOLDOWN_MS
      );
      
      if (!resendRateLimit.allowed) {
        return { status: 'rateLimited', retryAfterSeconds: resendRateLimit.retryAfterSeconds ?? 30 };
      }
      
      incrementRateLimit(`resend:${existingChallenge.challengeId}`, RESEND_COOLDOWN_MS);
      
      return {
        status: 'sent',
        challengeId: existingChallenge.challengeId,
        purpose: existingChallenge.purpose,
        expiresAt: new Date(existingChallenge.expiresAtEpochMs).toISOString(),
        retryAfterSeconds: 30,
      };
    }

    const now = Date.now();
    const challenge: OtpChallenge = {
      challengeId: `resident-otp-${now}`,
      mobileNumber: input.mobileNumber,
      countryCode: input.countryCode,
      purpose: purposeForMobile(input.mobileNumber),
      expiresAtEpochMs: now + OTP_EXPIRY_MS,
      resendAvailableAtEpochMs: now + RESEND_COOLDOWN_MS,
      attemptsRemaining: MAX_VERIFY_ATTEMPTS,
      verified: false,
      idempotencyKey,
      createdAt: new Date(now).toISOString(),
    };

    challengeStore.set(challenge.challengeId, challenge);
    incrementRateLimit(rateLimitKey, RATE_LIMIT_WINDOW_MS);

    return {
      status: 'sent',
      challengeId: challenge.challengeId,
      purpose: challenge.purpose,
      expiresAt: new Date(challenge.expiresAtEpochMs).toISOString(),
      retryAfterSeconds: 30,
    };
  },

  async resendOtp(challengeId: string): Promise<ResidentOtpRequestResult> {
    const challenge = challengeStore.get(challengeId);
    if (!challenge) {
      return { status: 'rateLimited', retryAfterSeconds: 30 };
    }

    if (challenge.verified) {
      return { status: 'rateLimited', retryAfterSeconds: 30 };
    }

    const now = Date.now();
    if (now < challenge.resendAvailableAtEpochMs) {
      return {
        status: 'rateLimited',
        retryAfterSeconds: Math.ceil((challenge.resendAvailableAtEpochMs - now) / 1000),
      };
    }

    const newChallenge: OtpChallenge = {
      ...challenge,
      challengeId: `resident-otp-${now}`,
      expiresAtEpochMs: now + OTP_EXPIRY_MS,
      resendAvailableAtEpochMs: now + RESEND_COOLDOWN_MS,
      attemptsRemaining: MAX_VERIFY_ATTEMPTS,
      idempotencyKey: createIdempotencyKey(`resident-otp-resend-${challengeId}`),
      createdAt: new Date(now).toISOString(),
    };

    challengeStore.delete(challengeId);
    challengeStore.set(newChallenge.challengeId, newChallenge);

    return {
      status: 'sent',
      challengeId: newChallenge.challengeId,
      purpose: newChallenge.purpose,
      expiresAt: new Date(newChallenge.expiresAtEpochMs).toISOString(),
      retryAfterSeconds: 30,
    };
  },

  async verifyOtp(input: ResidentOtpVerificationInput): Promise<ResidentOtpVerificationResult> {
    const challenge = challengeStore.get(input.challengeId);
    if (!challenge) {
      return { status: 'challengeNotFound' };
    }

    if (challenge.verified) {
      return {
        status: 'verified',
        purpose: challenge.purpose,
        profile: profileStore.get(challenge.mobileNumber) || {
          userId: `resident-${challenge.mobileNumber.slice(-4)}`,
          fullName: 'Resident',
          mobileNumber: challenge.mobileNumber,
          countryCode: challenge.countryCode,
          country: 'India',
          timezone: 'Asia/Kolkata',
          locale: 'en-IN',
        },
        memberships: [],
      };
    }

    const verifyRateLimit = checkRateLimit(
      verificationAttemptStore.get(getVerifyRateLimitKey(input.challengeId)),
      MAX_VERIFY_REQUESTS_PER_WINDOW,
      VERIFY_RATE_LIMIT_WINDOW_MS
    );

    if (!verifyRateLimit.allowed) {
      return { status: 'rateLimited', retryAfterSeconds: verifyRateLimit.retryAfterSeconds ?? 60 };
    }

    incrementRateLimit(getVerifyRateLimitKey(input.challengeId), VERIFY_RATE_LIMIT_WINDOW_MS);

    if (Date.now() > challenge.expiresAtEpochMs) {
      return { status: 'expiredOtp' };
    }

    if (input.otp !== '123456') {
      challenge.attemptsRemaining = Math.max(0, challenge.attemptsRemaining - 1);
      challengeStore.set(input.challengeId, challenge);
      
      return {
        status: 'incorrectOtp',
        attemptsRemaining: challenge.attemptsRemaining,
      };
    }

    challenge.verified = true;
    challengeStore.set(input.challengeId, challenge);

    let profile = profileStore.get(challenge.mobileNumber);
    
    if (!profile) {
      profile = {
        userId: `resident-${challenge.mobileNumber.slice(-4)}`,
        fullName: challenge.purpose === 'invitation' ? 'Invited Resident' : 'New Resident',
        mobileNumber: challenge.mobileNumber,
        countryCode: challenge.countryCode,
        country: 'India',
        timezone: 'Asia/Kolkata',
        locale: 'en-IN',
      };
      profileStore.set(challenge.mobileNumber, profile);
    }

    const memberships = mockStore.getState().residentMemberships || [];

    return {
      status: 'verified',
      purpose: challenge.purpose,
      profile,
      memberships,
    };
  },

  async registerResident(input: { challengeId: string; fullName: string }): Promise<ResidentOtpVerificationResult> {
    const challenge = challengeStore.get(input.challengeId);
    if (!challenge) {
      return { status: 'challengeNotFound' };
    }

    if (!challenge.verified) {
      return { status: 'incorrectOtp', attemptsRemaining: challenge.attemptsRemaining };
    }

    const profile: ResidentGlobalProfile = {
      userId: `resident-${challenge.mobileNumber.slice(-4)}`,
      fullName: input.fullName.trim(),
      mobileNumber: challenge.mobileNumber,
      countryCode: challenge.countryCode,
      country: 'India',
      timezone: 'Asia/Kolkata',
      locale: 'en-IN',
    };

    profileStore.set(challenge.mobileNumber, profile);

    return {
      status: 'verified',
      purpose: 'newRegistration',
      profile,
      memberships: [],
    };
  },

  async acceptInvitation(input: { membershipId: string }): Promise<{ membershipId: string; status: string }> {
    const memberships = mockStore.getState().residentMemberships || [];
    const membership = memberships.find((m) => m.membershipId === input.membershipId);
    
    if (!membership) {
      throw new Error('Invitation is no longer available.');
    }
    
    if (membership.status === 'expired') {
      throw new Error('Invitation has expired.');
    }
    
    const accepted = { ...membership, status: 'active' as const };
    mockStore.getState().residentMemberships = memberships.map((m) =>
      m.membershipId === accepted.membershipId ? accepted : m
    );
    
    return accepted;
  },
};

export function resetResidentAuthServiceState(): void {
  challengeStore.clear();
  profileStore.clear();
  profileStore.set(defaultProfile.mobileNumber, defaultProfile);
  rateLimitStore.clear();
  verificationAttemptStore.clear();
}

export function setExistingProfileForTesting(mobileNumber: string, profile: ResidentGlobalProfile): void {
  profileStore.set(mobileNumber, profile);
}

export function getChallengeForTesting(challengeId: string): OtpChallenge | undefined {
  return challengeStore.get(challengeId);
}