import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import type { PollListParams } from './governance.dto';
import { governanceRepository } from './governance.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function usePolls(params: PollListParams = {}) {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(
    () => governanceRepository.getPolls(
      params,
      { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }
    ),
    [params.query, params.status, activeContext.dataScopeKey]
  );
}
