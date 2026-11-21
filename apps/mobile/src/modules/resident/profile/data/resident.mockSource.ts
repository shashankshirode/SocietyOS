import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { mockResident } from '../../../../shared/mock/resident.mock';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { ResidentProfile } from '../../../../shared/types/resident.types';
import { mapResidentDashboardDtoToDomain } from './resident.mapper';
import type { ResidentDashboard } from './resident.dto';

export const residentMockSource = {
  async getProfile(): Promise<RepositoryResult<ResidentProfile>> {
    await withMockDelay();
    return repositorySuccess(mockResident);
  },

  async getDashboard(): Promise<RepositoryResult<ResidentDashboard>> {
    await withMockDelay();
    const state = mockStore.getState();
    return repositorySuccess(
      mapResidentDashboardDtoToDomain({
        resident: mockResident,
        visitors: state.visitors,
        complaints: state.complaints,
        bills: state.bills,
        notices: state.notices,
      })
    );
  },
};
