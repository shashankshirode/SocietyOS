import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';
import type { FeatureFlagChangeRequestDto } from '../data/superAdmin.dto';

export function useFeatureFlagChange() {
  return useRepositoryMutation((input: FeatureFlagChangeRequestDto) => superAdminRepository.changeFeatureFlag(input));
}
