import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from './governance.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useMeetingDetail(meetingId: string) {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(
    () => governanceRepository.getMeetingDetail(meetingId, {
      activeHome: activeContext,
      dataScopeKey: activeContext.dataScopeKey,
    }),
    [meetingId, activeContext.dataScopeKey]
  );
}
