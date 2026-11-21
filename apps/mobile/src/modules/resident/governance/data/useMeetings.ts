import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import type { MeetingListParams } from './governance.dto';
import { governanceRepository } from './governance.repository';

export function useMeetings(params: MeetingListParams = {}) {
  return useRepositoryResult(() => governanceRepository.getMeetings(params), [params.query, params.meetingType, params.status]);
}
