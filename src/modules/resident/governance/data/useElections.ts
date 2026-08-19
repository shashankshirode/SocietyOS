import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import type { ElectionListParams } from './governance.dto';
import { governanceRepository } from './governance.repository';

export function useElections(params: ElectionListParams = {}) {
  return useRepositoryResult(() => governanceRepository.getElections(params), [params.status]);
}
