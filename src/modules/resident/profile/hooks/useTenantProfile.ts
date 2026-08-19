import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { ResidentsRepository } from '../data/residents.repository';

export function useTenantProfile() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await ResidentsRepository.getTenantProfile(input);
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
