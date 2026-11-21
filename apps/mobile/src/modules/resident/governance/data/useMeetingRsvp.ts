import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { MeetingRsvpInput } from './governance.dto';
import { governanceRepository } from './governance.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useMeetingRsvp() {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryMutation((input: MeetingRsvpInput) => governanceRepository.submitMeetingRsvp(
    input.meetingId,
    input,
    { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }
  ));
}
