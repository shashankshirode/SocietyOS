import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ResidentProfile } from '../../../../shared/types/resident.types';
import type { ResidentDashboard, ResidentDashboardDto, ResidentDto } from './resident.dto';
import { mapResidentDashboardDtoToDomain, mapResidentDtoToDomain } from './resident.mapper';

export const residentApiSource = {
  async getProfile(): Promise<RepositoryResult<ResidentProfile>> {
    try {
      const dto = await apiClient.get<ResidentDto>(apiEndpoints.resident.me);
      return repositorySuccess(mapResidentDtoToDomain(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async getDashboard(): Promise<RepositoryResult<ResidentDashboard>> {
    try {
      const dto = await apiClient.get<ResidentDashboardDto>(apiEndpoints.resident.dashboard);
      return repositorySuccess(mapResidentDashboardDtoToDomain(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },
};

