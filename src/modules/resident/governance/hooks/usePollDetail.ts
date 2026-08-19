import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from '../data/governance.repository';
import type { SubmitPollVoteInput } from '../../../../shared/types/poll.types';

export function usePollDetail() {
  const mutation = useRepositoryMutation((input: SubmitPollVoteInput) =>
    governanceRepository.submitPollVote(input.pollId, input.selectedOptionIds)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
