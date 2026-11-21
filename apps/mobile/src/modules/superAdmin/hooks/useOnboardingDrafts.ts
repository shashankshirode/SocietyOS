import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useOnboardingDrafts() {
  return useRepositoryResult(() => superAdminRepository.getOnboardingDrafts(), []);
}
