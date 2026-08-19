import {
  residentAuthMockSource,
  resetResidentAuthMockState,
} from "../data/residentAuth.mockSource";

describe("residentAuthMockSource", () => {
  beforeEach(() => resetResidentAuthMockState());

  it("detects an existing user and returns linked memberships after OTP verification", async () => {
    const request = await residentAuthMockSource.requestOtp({
      countryCode: "+91",
      mobileNumber: "7276834907",
    });
    expect(request.status).toBe("sent");
    if (request.status !== "sent") return;
    expect(request.purpose).toBe("existingUser");

    const verification = await residentAuthMockSource.verifyOtp({
      challengeId: request.challengeId,
      otp: "123456",
    });
    expect(verification.status).toBe("verified");
    if (verification.status !== "verified") return;
    expect(verification.profile.timezone).toBe("Asia/Kolkata");
    expect(verification.memberships).toHaveLength(8);
    expect(
      verification.memberships.some(
        (membership) => membership.status === "societyApprovalPending",
      ),
    ).toBe(true);
    expect(
      verification.memberships.some(
        (membership) => membership.status === "suspended",
      ),
    ).toBe(true);
  });

  it("handles incorrect, expired, and rate-limited OTP scenarios", async () => {
    const limited = await residentAuthMockSource.requestOtp({
      countryCode: "+91",
      mobileNumber: "7777777777",
    });
    expect(limited.status).toBe("rateLimited");

    const request = await residentAuthMockSource.requestOtp({
      countryCode: "+91",
      mobileNumber: "9999999999",
    });
    if (request.status !== "sent")
      throw new Error("Expected an OTP challenge.");
    await expect(
      residentAuthMockSource.verifyOtp({
        challengeId: request.challengeId,
        otp: "654321",
      }),
    ).resolves.toEqual({ status: "incorrectOtp", attemptsRemaining: 2 });
    await expect(
      residentAuthMockSource.verifyOtp({
        challengeId: request.challengeId,
        otp: "000000",
      }),
    ).resolves.toEqual({ status: "expiredOtp" });
  });

  it("registers a new global profile without inventing a residence membership", async () => {
    const request = await residentAuthMockSource.requestOtp({
      countryCode: "+91",
      mobileNumber: "9999999999",
    });
    if (request.status !== "sent")
      throw new Error("Expected an OTP challenge.");
    const verification = await residentAuthMockSource.verifyOtp({
      challengeId: request.challengeId,
      otp: "123456",
    });
    expect(verification.status).toBe("verified");
    const registration = await residentAuthMockSource.registerResident({
      challengeId: request.challengeId,
      fullName: "Meera Kulkarni",
    });
    expect(registration.status).toBe("verified");
    if (registration.status !== "verified") return;
    expect(registration.profile.fullName).toBe("Meera Kulkarni");
    expect(registration.memberships).toEqual([]);
  });
});
