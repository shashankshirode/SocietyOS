import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function usePlatformSettings() {
  return useRepositoryResult(() => superAdminRepository.getSettings(), []);
}
