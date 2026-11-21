import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';
import type { CreateOnboardingDraftRequest } from '../data/superAdmin.dto';

export function useCreateOnboardingDraft() {
  return useRepositoryMutation((input: CreateOnboardingDraftRequest) => superAdminRepository.createOnboardingDraft(input));
}
