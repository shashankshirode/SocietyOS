import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useSocietyAdminUsers(societyId: string) {
  return useRepositoryResult(() => superAdminRepository.getSocietyAdmins(societyId), [societyId]);
}
