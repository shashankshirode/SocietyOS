import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { visitorsRepository } from './visitors.repository';
import { useMockStore } from '../../../../core/mockStore/useMockStore';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useVisitors() {
  const { state } = useMockStore();
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  const result = useRepositoryResult(() => visitorsRepository.list(context), [context.dataScopeKey]);

  const scopedVisitors = state.visitors.filter(
    (v) =>
      v.flatNumber === activeContext.flatNumber &&
      v.societyName.toLowerCase() === activeContext.societyName.toLowerCase()
  );

  return {
    ...result,
    data: scopedVisitors,
  };
}
export default useVisitors;
