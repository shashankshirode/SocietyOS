import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { GuardRepository } from '../data/guard.repository';

export function useDeliveryEntry() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await GuardRepository.createDeliveryEntry(input);
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
