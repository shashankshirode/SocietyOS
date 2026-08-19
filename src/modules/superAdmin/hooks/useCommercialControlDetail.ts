import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useCommercialControlDetail(societyId: string) {
  return useRepositoryResult(() => superAdminRepository.getCommercialControlDetail(societyId), [societyId]);
}
