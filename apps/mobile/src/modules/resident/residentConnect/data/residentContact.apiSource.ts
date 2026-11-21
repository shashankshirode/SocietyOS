import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryFailure, repositorySuccess } from '../../../../core/repositories/repository.types';
import type {
  ResidentContactRepositoryContract,
  ResidentContactScope,
} from '../domain/residentContact.types';

const apiError = { code: 'RESIDENT_CONTACT_API_ERROR', message: 'Resident contact data is unavailable. Please try again.' };

function scopeQuery(input: ResidentContactScope): Record<string, string> {
  return {
    society_id: input.societyId,
    active_unit_id: input.activeUnitId,
    authenticated_user_id: input.authenticatedUserId,
    resident_profile_id: input.residentProfileId,
  };
}

export const residentContactApiSource: ResidentContactRepositoryContract = {
  async getDirectory(input) {
    try {
      return repositorySuccess(await apiClient.get(apiEndpoints.residentConnect.directoryGroups, { query: scopeQuery(input) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async searchDirectory(input) {
    try {
      return repositorySuccess(await apiClient.get(apiEndpoints.residentConnect.directoryGroups, { query: { ...scopeQuery(input), q: input.query } }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async getResident(input) {
    try {
      return repositorySuccess(await apiClient.get(apiEndpoints.residentConnect.directoryProfile(input.residentProfileIdToFind), { query: scopeQuery(input) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async createRequest(input) {
    try {
      return repositorySuccess(await apiClient.post(apiEndpoints.residentConnect.requests, input, { idempotencyKey: createIdempotencyKey('resident-contact-request') }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async getOutgoingRequests(input) {
    try {
      return repositorySuccess(await apiClient.get(apiEndpoints.residentConnect.outgoingRequests, { query: scopeQuery(input) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async getIncomingRequests(input) {
    try {
      return repositorySuccess(await apiClient.get(apiEndpoints.residentConnect.incomingRequests, { query: scopeQuery(input) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async acceptRequest(input) {
    try {
      return repositorySuccess(await apiClient.post(apiEndpoints.residentConnect.acceptRequest(input.requestId), input, { idempotencyKey: createIdempotencyKey(`accept-${input.requestId}`) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async rejectRequest(input) {
    try {
      return repositorySuccess(await apiClient.post(apiEndpoints.residentConnect.rejectRequest(input.requestId), input, { idempotencyKey: createIdempotencyKey(`reject-${input.requestId}`) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async cancelRequest(input) {
    try {
      return repositorySuccess(await apiClient.post(apiEndpoints.residentConnect.cancelRequest(input.requestId), input, { idempotencyKey: createIdempotencyKey(`cancel-${input.requestId}`) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async blockRequester(input) {
    try {
      return repositorySuccess(await apiClient.post(apiEndpoints.residentConnect.blockRequest(input.requestId), input, { idempotencyKey: createIdempotencyKey(`block-${input.requestId}`) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async reportRequest(input) {
    try {
      return repositorySuccess(await apiClient.post(apiEndpoints.residentConnect.reportRequest(input.requestId), input, { idempotencyKey: createIdempotencyKey(`report-${input.requestId}`) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async getConversations(input) {
    try {
      return repositorySuccess(await apiClient.get(apiEndpoints.residentConnect.directConversations, { query: scopeQuery(input) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async getConversationMessages(input) {
    try {
      return repositorySuccess(await apiClient.get(apiEndpoints.residentConnect.directConversationMessages(input.conversationId), { query: scopeQuery(input) }));
    } catch {
      return repositoryFailure(apiError);
    }
  },
  async sendDirectMessage(input) {
    try {
      return repositorySuccess(await apiClient.post(
        apiEndpoints.residentConnect.directConversationMessages(input.conversationId),
        input,
        { idempotencyKey: createIdempotencyKey(`resident-message-${input.conversationId}`) },
      ));
    } catch {
      return repositoryFailure(apiError);
    }
  },
};
