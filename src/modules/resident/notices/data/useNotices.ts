import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { noticeRepository } from './notice.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useNotices() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(() => noticeRepository.list(context), [context.dataScopeKey]);
}
export default useNotices;
