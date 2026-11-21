import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { CastResolutionVoteInput } from './governance.dto';
import { governanceRepository } from './governance.repository';

export function useCastResolutionVote() {
  return useRepositoryMutation((input: CastResolutionVoteInput) => governanceRepository.castResolutionVote(input.resolutionId, input.choice));
}
