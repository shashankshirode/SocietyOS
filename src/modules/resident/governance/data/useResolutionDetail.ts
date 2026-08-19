import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from './governance.repository';

export function useResolutionDetail(resolutionId: string) {
  return useRepositoryResult(() => governanceRepository.getResolutionDetail(resolutionId), [resolutionId]);
}
