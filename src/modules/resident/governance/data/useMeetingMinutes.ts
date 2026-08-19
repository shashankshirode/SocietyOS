import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from './governance.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useMeetingMinutes(meetingId: string) {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(
    () => governanceRepository.getMeetingMinutes(
      meetingId,
      { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }
    ),
    [meetingId, activeContext.dataScopeKey]
  );
}
