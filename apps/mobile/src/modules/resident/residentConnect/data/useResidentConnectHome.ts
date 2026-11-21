import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useResidentConnectHome() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(
    () => residentConnectRepository.getResidentConnectHome(context),
    [context.dataScopeKey]
  );
}
export default useResidentConnectHome;
