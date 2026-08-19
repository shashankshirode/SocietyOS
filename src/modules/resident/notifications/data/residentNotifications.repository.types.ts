import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { ResidentNotification } from './residentNotifications.types';

export type ResidentNotificationsRepository = {
  list(
    context: ResidentRepositoryRequestContext
  ): Promise<RepositoryResult<ResidentNotification[]>>;
};
