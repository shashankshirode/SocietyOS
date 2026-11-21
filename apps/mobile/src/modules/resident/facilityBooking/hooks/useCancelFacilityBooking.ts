import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository as facilityBookingRepository } from '../data/facility.repository';

export function useCancelFacilityBooking() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await facilityBookingRepository.cancelFacilityBooking(input);
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
