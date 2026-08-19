import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';

export function useResolutionProposalDetail(proposalId: string) {
  return useRepositoryResult(
    () => interFlatRepository.getResolutionProposalDetail(proposalId),
    [proposalId]
  );
}
