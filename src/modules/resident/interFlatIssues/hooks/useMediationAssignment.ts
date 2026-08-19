import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { interFlatIssuesRepository } from '../data/interFlatIssues.repository';
import type { AssignMediatorInput } from '../data/interFlat.dto';
import { repositorySuccess } from '../../../../core/repositories/repository.types';

type SubmitMediationAssignmentInput = AssignMediatorInput & { mediationId: string };

export function useMediationAssignment() {
  const mutation = useRepositoryMutation(async (input: SubmitMediationAssignmentInput) =>
    repositorySuccess(await interFlatIssuesRepository.assignMediator(input.mediationId, input))
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
