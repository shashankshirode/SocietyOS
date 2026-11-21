import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useNotificationChannelStatus() {
  return useRepositoryResult(() => superAdminRepository.getNotificationChannels(), []);
}
