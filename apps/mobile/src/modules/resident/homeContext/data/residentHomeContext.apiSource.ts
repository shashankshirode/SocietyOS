import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ResidentHomeContext, ActiveResidentHomeContext, SwitchResidentHomeInput, SwitchResidentHomeResult } from './residentHomeContext.types';

export const residentHomeContextApiSource = {
  async getHomeContexts(): Promise<RepositoryResult<ResidentHomeContext[]>> {
    try {
      return repositorySuccess(await apiClient.get<ResidentHomeContext[]>(apiEndpoints.resident.homeContexts));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async getActiveHomeContext(): Promise<RepositoryResult<ActiveResidentHomeContext>> {
    try {
      return repositorySuccess(await apiClient.get<ActiveResidentHomeContext>(apiEndpoints.resident.activeHomeContext));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async switchHomeContext(input: SwitchResidentHomeInput): Promise<RepositoryResult<SwitchResidentHomeResult>> {
    try {
      const result = await apiClient.put<SwitchResidentHomeResult>(
        apiEndpoints.resident.activeHomeContext,
        input,
        { idempotencyKey: createIdempotencyKey(`resident-home-switch-${input.homeContextId}`) }
      );
      return repositorySuccess(result);
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },
};
export default residentHomeContextApiSource;
