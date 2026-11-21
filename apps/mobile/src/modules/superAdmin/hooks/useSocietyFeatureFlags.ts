import { useRepositoryMutation, useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

type SocietyFeatureFlagInput = { flagKey: string; enabled: boolean; auditNote: string };

export function useSocietyFeatureFlags() {
  const result = useRepositoryResult(() => superAdminRepository.getFeatureFlags(), []);
  const update = useRepositoryMutation((input: SocietyFeatureFlagInput) => superAdminRepository.updateSocietyFeatureFlag(input));
  return { ...result, updateSocietyFeatureFlag: update.submit, isUpdating: update.isSubmitting };
}
