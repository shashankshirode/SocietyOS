import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useSocietyHealth() {
  return useRepositoryResult(() => superAdminRepository.getSocietyHealth(), []);
}
