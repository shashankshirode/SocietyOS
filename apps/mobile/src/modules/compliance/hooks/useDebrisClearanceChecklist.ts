import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { complianceRepository } from '../data/compliance.repository';

export function useDebrisClearanceChecklist() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await complianceRepository.updateDebrisClearanceChecklist(input);
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
