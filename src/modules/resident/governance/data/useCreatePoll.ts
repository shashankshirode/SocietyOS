import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { CreatePollInput } from '../../../../shared/types/poll.types';
import { governanceRepository } from './governance.repository';

export function useCreatePoll() {
  return useRepositoryMutation((input: CreatePollInput) => governanceRepository.createPoll(input));
}
