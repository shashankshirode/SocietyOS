import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';

export function useNeighbourNotificationPreview(issueId: string) {
  return useRepositoryResult(() => interFlatRepository.getInterFlatIssueDetail(issueId), [issueId]);
}
