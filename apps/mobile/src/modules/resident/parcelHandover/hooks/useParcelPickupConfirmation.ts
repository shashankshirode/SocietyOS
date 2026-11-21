import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { parcelRepository } from '../data/parcelHandover.repository';

export function useParcelPickupConfirmation() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await parcelRepository.confirmParcelPickup(input);
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
