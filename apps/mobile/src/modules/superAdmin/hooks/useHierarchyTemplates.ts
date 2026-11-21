import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useHierarchyTemplates() {
  return useRepositoryResult(() => superAdminRepository.getHierarchyTemplates(), []);
}
