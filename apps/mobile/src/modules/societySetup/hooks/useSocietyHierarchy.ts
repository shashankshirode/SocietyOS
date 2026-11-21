import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { SocietySetupRepository } from '../data/societySetup.repository';

export function useSocietyHierarchy() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await SocietySetupRepository.getSocietyHierarchy(input);
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
