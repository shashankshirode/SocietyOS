import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { SocietySetupRepository } from '../data/societySetup.repository';

export function useUnitDetail() {
  const mutation = useRepositoryMutation(async (input: string | { id?: string }) => {
    const res = await SocietySetupRepository.getUnitById(input);
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
