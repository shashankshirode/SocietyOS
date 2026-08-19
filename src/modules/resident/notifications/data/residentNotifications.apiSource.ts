import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import {
  repositoryErrorFromUnknown,
  repositoryFailure,
  repositorySuccess,
} from '../../../../core/repositories/repository.types';
import { mapContextRoleToAppRole } from '../../homeContext/utils/residentHomeContextPermissions';
import type { ResidentNotificationsRepository } from './residentNotifications.repository.types';
import type { ResidentNotification } from './residentNotifications.types';

export const residentNotificationsApiSource: ResidentNotificationsRepository = {
  async list(context) {
    try {
      const notifications = await apiClient.get<ResidentNotification[]>(
        apiEndpoints.resident.notifications,
        {
          context: {
            societyId: context.activeHome.societyId,
            unitId: context.activeHome.unitId,
            activeRole: mapContextRoleToAppRole(context.activeHome.residentRole),
          },
        }
      );
      return repositorySuccess(notifications);
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },
};
