import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from '../data/parking.repository';

export function useTemporaryVehiclePass() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await parkingRepository.createTemporaryVehiclePass(input);
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
