import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { occupancyRepository } from '../data/occupancy.repository';

export function useCreateMoveInRequest() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await occupancyRepository.createMoveInRequest(input);
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
