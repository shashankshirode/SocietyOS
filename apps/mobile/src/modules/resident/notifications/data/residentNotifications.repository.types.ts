import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type {
  ResidentNotification,
  ResidentNotificationPreferences,
} from './residentNotifications.types';

export type ResidentNotificationsRepository = {
  list(
    context: ResidentRepositoryRequestContext
  ): Promise<RepositoryResult<ResidentNotification[]>>;
  markAsRead(
    notificationId: string,
    context?: ResidentRepositoryRequestContext
  ): Promise<RepositoryResult<{ success: boolean; notificationId: string }>>;
  markAllAsRead(
    context?: ResidentRepositoryRequestContext
  ): Promise<RepositoryResult<{ success: boolean; count: number }>>;
  getPreferences(
    context?: ResidentRepositoryRequestContext
  ): Promise<RepositoryResult<ResidentNotificationPreferences>>;
  updatePreferences(
    preferences: Partial<ResidentNotificationPreferences>,
    context?: ResidentRepositoryRequestContext
  ): Promise<RepositoryResult<ResidentNotificationPreferences>>;
};
