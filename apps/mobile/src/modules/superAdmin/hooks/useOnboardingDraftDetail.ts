import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useOnboardingDraftDetail(draftId: string) {
  return useRepositoryResult(() => superAdminRepository.getOnboardingDraftDetail(draftId), [draftId]);
}
