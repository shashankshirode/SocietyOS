import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { residentNotificationsApiSource } from './residentNotifications.apiSource';
import { residentNotificationsMockSource } from './residentNotifications.mockSource';
import type { ResidentNotificationsRepository } from './residentNotifications.repository.types';

export const residentNotificationsRepository = createRepository<
  ResidentNotificationsRepository,
  ResidentNotificationsRepository
>({
  moduleKey: 'residentNotifications',
  mockRepository: residentNotificationsMockSource,
  apiRepository: residentNotificationsApiSource,
});
