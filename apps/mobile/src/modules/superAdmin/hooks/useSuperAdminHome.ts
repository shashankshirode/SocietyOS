import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useSuperAdminHome() {
  return useRepositoryResult(() => superAdminRepository.getHome(), []);
}
