import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useModuleAdoption() {
  return useRepositoryResult(() => superAdminRepository.getModuleAdoption(), []);
}
