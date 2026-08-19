import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import type { ResolutionListParams } from './governance.dto';
import { governanceRepository } from './governance.repository';

export function useResolutions(params: ResolutionListParams = {}) {
  return useRepositoryResult(() => governanceRepository.getResolutions(params), [params.query, params.status, params.meetingId]);
}
