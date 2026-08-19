import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function usePlatformDashboard() {
  return useRepositoryResult(() => superAdminRepository.getDashboard(), []);
}
