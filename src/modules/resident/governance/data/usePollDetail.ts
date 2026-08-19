import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from './governance.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function usePollDetail(pollId: string) {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(
    () => governanceRepository.getPollDetail(
      pollId,
      { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }
    ),
    [pollId, activeContext.dataScopeKey]
  );
}
