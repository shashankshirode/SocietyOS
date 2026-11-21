import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { visitorsRepository } from './visitors.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useVisitorDetail(visitorPassId: string) {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(() => visitorsRepository.detail(context, visitorPassId), [visitorPassId, context.dataScopeKey]);
}
export default useVisitorDetail;
