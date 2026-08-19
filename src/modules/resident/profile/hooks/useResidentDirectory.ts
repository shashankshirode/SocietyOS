import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { ResidentsRepository } from '../data/residents.repository';

export function useResidentDirectory() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await ResidentsRepository.listResidents(input);
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
