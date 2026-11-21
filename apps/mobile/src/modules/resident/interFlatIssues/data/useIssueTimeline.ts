import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';

export function useIssueTimeline(issueId: string) {
  return useRepositoryResult(() => interFlatRepository.getIssueTimeline(issueId), [issueId]);
}
