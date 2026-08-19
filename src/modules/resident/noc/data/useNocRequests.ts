import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { nocRepository } from './noc.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useNocRequests() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  const result = useRepositoryResult(() => nocRepository.listRequests(context), [context.dataScopeKey]);

  return result;
}
export default useNocRequests;
