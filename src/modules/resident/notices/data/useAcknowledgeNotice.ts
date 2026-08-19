import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { noticeRepository } from './notice.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useAcknowledgeNotice() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryMutation((noticeId: string) => noticeRepository.acknowledge(context, noticeId));
}
export default useAcknowledgeNotice;
