import { mockMemberships } from "./membership.mockSource";
import type {
  AcceptResidentInvitationInput,
  RegisterResidentInput,
  ResidentAuthRepository,
  ResidentCountryCode,
  ResidentGlobalProfile,
  ResidentMembership,
  ResidentOtpPurpose,
  ResidentOtpRequestInput,
  ResidentOtpRequestResult,
  ResidentOtpVerificationInput,
  ResidentOtpVerificationResult,
} from "./residentAuth.types";

type OtpChallenge = {
  challengeId: string;
  mobileNumber: string;
  countryCode: ResidentCountryCode;
  purpose: ResidentOtpPurpose;
  expiresAtEpochMs: number;
  resendAvailableAtEpochMs: number;
  attemptsRemaining: number;
};

const challengeStore = new Map<string, OtpChallenge>();
const profileStore = new Map<string, ResidentGlobalProfile>();

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

let memberships: ResidentMembership[] = [...mockMemberships];

function purposeForMobile(mobileNumber: string): ResidentOtpPurpose {
  if (mobileNumber === "8888888888") return "invitation";
  if (profileStore.has(mobileNumber)) return "existingUser";
  return "newRegistration";
}

function createChallenge(
  input: ResidentOtpRequestInput,
): ResidentOtpRequestResult {
  const now = Date.now();
  const challenge: OtpChallenge = {
    challengeId: `resident-otp-${now}`,
    mobileNumber: input.mobileNumber,
    countryCode: input.countryCode,
    purpose: purposeForMobile(input.mobileNumber),
    expiresAtEpochMs: now + 5 * 60 * 1000,
    resendAvailableAtEpochMs: now + 30 * 1000,
    attemptsRemaining: 3,
  };
  challengeStore.set(challenge.challengeId, challenge);
  return {
    status: "sent",
    challengeId: challenge.challengeId,
    purpose: challenge.purpose,
    expiresAt: new Date(challenge.expiresAtEpochMs).toISOString(),
    retryAfterSeconds: 30,
  };
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

export const residentAuthMockSource: ResidentAuthRepository = {
  async requestOtp(input) {
    if (input.mobileNumber === "7777777777") {
      return { status: "rateLimited", retryAfterSeconds: 60 };
    }
    return createChallenge(input);
  },

  async resendOtp(challengeId) {
    const challenge = challengeStore.get(challengeId);
    if (!challenge) return { status: "rateLimited", retryAfterSeconds: 30 };
    const now = Date.now();
    if (now < challenge.resendAvailableAtEpochMs) {
      return {
        status: "rateLimited",
        retryAfterSeconds: Math.ceil(
          (challenge.resendAvailableAtEpochMs - now) / 1000,
        ),
      };
    }
    challengeStore.delete(challengeId);
    return createChallenge({
      countryCode: challenge.countryCode,
      mobileNumber: challenge.mobileNumber,
    });
  },

  async verifyOtp(
    input: ResidentOtpVerificationInput,
  ): Promise<ResidentOtpVerificationResult> {
    const challenge = challengeStore.get(input.challengeId);
    if (!challenge) return { status: "challengeNotFound" };
    if (input.otp === "000000" || Date.now() > challenge.expiresAtEpochMs)
      return { status: "expiredOtp" };
    if (input.otp !== "123456") {
      challenge.attemptsRemaining = Math.max(
        0,
        challenge.attemptsRemaining - 1,
      );
      return {
        status: "incorrectOtp",
        attemptsRemaining: challenge.attemptsRemaining,
      };
    }
    const profile = profileForChallenge(challenge);
    if (challenge.purpose !== "newRegistration")
      profileStore.set(profile.mobileNumber, profile);
    return {
      status: "verified",
      purpose: challenge.purpose,
      profile,
      memberships,
    };
  },

  async registerResident(
    input: RegisterResidentInput,
  ): Promise<ResidentOtpVerificationResult> {
    const challenge = challengeStore.get(input.challengeId);
    if (!challenge) return { status: "challengeNotFound" };
    const profile: ResidentGlobalProfile = {
      ...profileForChallenge(challenge),
      fullName: input.fullName.trim(),
    };
    profileStore.set(profile.mobileNumber, profile);
    return {
      status: "verified",
      purpose: "newRegistration",
      profile,
      memberships: [],
    };
  },

  async acceptInvitation(
    input: AcceptResidentInvitationInput,
  ): Promise<ResidentMembership> {
    const membership = memberships.find(
      (entry) => entry.membershipId === input.membershipId,
    );
    if (!membership) throw new Error("Invitation is no longer available.");
    if (membership.status === "expired")
      throw new Error("Invitation has expired.");
    const accepted: ResidentMembership = {
      ...membership,
      status: "active",
    };
    memberships = memberships.map((entry) =>
      entry.membershipId === accepted.membershipId ? accepted : entry,
    );
    return accepted;
  },
};

export function resetResidentAuthMockState(): void {
  challengeStore.clear();
  profileStore.clear();
  profileStore.set(defaultProfile.mobileNumber, defaultProfile);
  memberships = [...mockMemberships];
}
