import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import {
  repositoryErrorFromUnknown,
  repositoryFailure,
  repositorySuccess,
} from '../../../../core/repositories/repository.types';
import { mapContextRoleToAppRole } from '../../homeContext/utils/residentHomeContextPermissions';
import type { ResidentNotificationsRepository } from './residentNotifications.repository.types';
import type {
  ResidentNotification,
  ResidentNotificationPreferences,
} from './residentNotifications.types';

const defaultPreferences: ResidentNotificationPreferences = {
  pushEnabled: true,
  inAppEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  criticalAlertsOverride: true,
  categories: {
    security: true,
    billing: true,
    complaints: true,
    notices: true,
    community: true,
  },
};

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
  async markAsRead(notificationId, context) {
    try {
      const result = await apiClient.post<{ success: boolean; notificationId: string }>(
        `${apiEndpoints.resident.notifications}/${notificationId}/read`,
        {},
        {
          context: context
            ? {
                societyId: context.activeHome.societyId,
                unitId: context.activeHome.unitId,
                activeRole: mapContextRoleToAppRole(context.activeHome.residentRole),
              }
            : undefined,
        }
      );
      return repositorySuccess(result);
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },
  async markAllAsRead(context) {
    try {
      const result = await apiClient.post<{ success: boolean; count: number }>(
        `${apiEndpoints.resident.notifications}/read-all`,
        {},
        {
          context: context
            ? {
                societyId: context.activeHome.societyId,
                unitId: context.activeHome.unitId,
                activeRole: mapContextRoleToAppRole(context.activeHome.residentRole),
              }
            : undefined,
        }
      );
      return repositorySuccess(result);
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },
  async getPreferences() {
    return repositorySuccess(defaultPreferences);
  },
  async updatePreferences(preferences) {
    return repositorySuccess({ ...defaultPreferences, ...preferences });
  },
};
