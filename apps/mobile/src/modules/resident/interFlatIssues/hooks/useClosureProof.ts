import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { interFlatIssuesRepository } from '../data/interFlatIssues.repository';
import type { ClosureProofInput } from '../data/interFlat.dto';
import { repositorySuccess } from '../../../../core/repositories/repository.types';

type SubmitClosureProofInput = ClosureProofInput & { proposalId: string };

export function useClosureProof() {
  const mutation = useRepositoryMutation(async (input: SubmitClosureProofInput) =>
    repositorySuccess(await interFlatIssuesRepository.submitClosureProof(input.proposalId, input))
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
