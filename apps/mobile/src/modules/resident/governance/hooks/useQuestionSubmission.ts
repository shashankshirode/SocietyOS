import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from '../data/governance.repository';
import type { SubmitQuestionInput } from '../data/governance.dto';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useQuestionSubmission() {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryMutation((input: SubmitQuestionInput) =>
    governanceRepository.submitQuestion(
      input.meetingId,
      input,
      { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }
    )
  );
}
