import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { SubmitPollVoteInput } from '../../../../shared/types/poll.types';
import { governanceRepository } from './governance.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useSubmitPollVote() {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryMutation((input: SubmitPollVoteInput) => governanceRepository.submitPollVote(
    input.pollId,
    input.selectedOptionIds,
    { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }
  ));
}
