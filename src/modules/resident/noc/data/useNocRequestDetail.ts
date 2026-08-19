import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { nocRepository } from './noc.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useNocRequestDetail(requestId: string) {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(() => nocRepository.requestDetail(context, requestId), [requestId, context.dataScopeKey]);
}
export default useNocRequestDetail;
