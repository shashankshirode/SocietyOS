import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import {
  repositoryErrorFromUnknown,
  repositoryFailure,
  repositorySuccess,
  type RepositoryResult,
} from '../../../../core/repositories/repository.types';
import type { ResidentDashboardRequestContext } from './dashboard.repository.types';
import type { ResidentDashboardData } from './dashboard.types';
import { mapContextRoleToAppRole } from '../../homeContext/utils/residentHomeContextPermissions';

export const residentDashboardApiSource = {
  async getDashboardSections(
    context: ResidentDashboardRequestContext
  ): Promise<RepositoryResult<ResidentDashboardData>> {
    try {
      const data = await apiClient.get<ResidentDashboardData>(apiEndpoints.resident.dashboard, {
        context: {
          societyId: context.activeHome.societyId,
          unitId: context.activeHome.unitId,
          residentProfileId: context.residentProfileId,
          locale: context.locale,
          timezone: context.timezone,
          activeRole: mapContextRoleToAppRole(context.activeHome.residentRole),
        },
      });
      return repositorySuccess(data);
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },
};

export default residentDashboardApiSource;
