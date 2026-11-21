import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository as facilityBookingRepository } from '../data/facility.repository';

export function useCreateFacilityBooking() {
  const mutation = useRepositoryMutation((input: Parameters<typeof facilityBookingRepository.createFacilityBooking>[0]) =>
    facilityBookingRepository.createFacilityBooking(input)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
