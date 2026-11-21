import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useSocietyList() {
  return useRepositoryResult(() => superAdminRepository.listSocieties(), []);
}
