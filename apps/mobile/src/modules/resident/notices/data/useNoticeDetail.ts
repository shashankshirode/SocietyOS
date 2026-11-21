import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { noticeRepository } from './notice.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useNoticeDetail(noticeId: string) {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(() => noticeRepository.detail(context, noticeId), [noticeId, context.dataScopeKey]);
}
export default useNoticeDetail;
