import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useModuleConfiguration(societyId: string) {
  return useRepositoryResult(() => superAdminRepository.getModuleConfiguration(societyId), [societyId]);
}
