import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { automationRepository } from '../data/automation.repository';

type PreviewInput = { input: string };

export function useMeetingSummaryPreview() {
  return useRepositoryMutation((input: PreviewInput) => automationRepository.generateMeetingSummaryPreview(input));
}
