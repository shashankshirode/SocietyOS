import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { noticeRepository } from './notice.repository';
import { useMockStore } from '../../../../core/mockStore/useMockStore';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useNotices() {
  const { state } = useMockStore();
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  const result = useRepositoryResult(() => noticeRepository.list(context), [context.dataScopeKey]);

  const scopedNotices = state.notices.filter(
    (n) => n.societyName.toLowerCase() === activeContext.societyName.toLowerCase()
  );

  return {
    ...result,
    data: scopedNotices,
  };
}
export default useNotices;
