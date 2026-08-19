import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from '../data/governance.repository';

export function useResolutionTracker() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await governanceRepository.listResolutions(input);
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
