import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from '../data/governance.repository';

export function useMeetingAgenda(meetingId: string) {
  return useRepositoryResult(
    () => governanceRepository.getMeetingAgenda(meetingId),
    [meetingId]
  );
}
