import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useOperationalAlerts() {
  return useRepositoryResult(() => superAdminRepository.getOperationalAlerts(), []);
}
