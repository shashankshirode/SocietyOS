import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';

export function useInterFlatIssueDetail(issueId: string) {
  return useRepositoryResult(() => interFlatRepository.getInterFlatIssueDetail(issueId), [issueId]);
}
