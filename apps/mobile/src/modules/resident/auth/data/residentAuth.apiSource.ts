import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import type { ResidentAuthRepository } from './residentAuth.types';

export const residentAuthApiSource: ResidentAuthRepository = {
  requestOtp: (input) => apiClient.post(apiEndpoints.auth.requestOtp, input, {
    idempotencyKey: createIdempotencyKey(`resident-otp-request-${input.countryCode}-${input.mobileNumber}`),
  }),
  resendOtp: (challengeId) => apiClient.post(apiEndpoints.auth.resendOtp, { challengeId }, {
    idempotencyKey: createIdempotencyKey(`resident-otp-resend-${challengeId}`),
  }),
  verifyOtp: (input) => apiClient.post(apiEndpoints.auth.verifyOtp, input, {
    idempotencyKey: createIdempotencyKey(`resident-otp-verify-${input.challengeId}`),
  }),
  registerResident: (input) => apiClient.post(apiEndpoints.auth.registerResident, input, {
    idempotencyKey: createIdempotencyKey(`resident-register-${input.challengeId}`),
  }),
  acceptInvitation: (input) => apiClient.post(apiEndpoints.auth.acceptResidentInvitation, input, {
    idempotencyKey: createIdempotencyKey(`resident-invitation-${input.membershipId}`),
  }),
};
