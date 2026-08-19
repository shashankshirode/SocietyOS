import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function usePlatformSocietyDetail(societyId: string) {
  return useRepositoryResult(() => superAdminRepository.getSocietyDetail(societyId), [societyId]);
}
