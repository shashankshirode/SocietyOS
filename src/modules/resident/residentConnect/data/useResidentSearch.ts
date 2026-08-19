import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useResidentSearch(query: string) {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(
    () => residentConnectRepository.searchResidents(query, context),
    [query, context.dataScopeKey]
  );
}
export default useResidentSearch;
