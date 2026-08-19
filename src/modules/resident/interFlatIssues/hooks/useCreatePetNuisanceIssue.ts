import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { interFlatIssuesRepository } from '../data/interFlatIssues.repository';

export function useCreatePetNuisanceIssue() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await interFlatIssuesRepository.createPetNuisanceIssue(input);
    const data = (res && typeof res === 'object' && 'data' in res) ? res.data : res;
    return { ok: true, data };
  });

  return {
    data: [],
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
