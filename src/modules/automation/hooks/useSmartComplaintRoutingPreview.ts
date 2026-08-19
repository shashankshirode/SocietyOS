import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { automationRepository } from '../data/automation.repository';

type PreviewInput = { input: string };

export function useSmartComplaintRoutingPreview() {
  return useRepositoryMutation((input: PreviewInput) => automationRepository.generateSmartComplaintRoutingPreview(input));
}
