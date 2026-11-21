import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useFeatureFlagManagement() {
  return useRepositoryResult(() => superAdminRepository.getFeatureFlags(), []);
}
