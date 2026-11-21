import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from './governance.repository';

export function useElectionDetail(electionId: string) {
  return useRepositoryResult(() => governanceRepository.getElectionDetail(electionId), [electionId]);
}
