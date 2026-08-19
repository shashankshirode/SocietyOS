import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { RescheduleFacilityBookingInput } from '../../../../shared/types/facilityBooking.types';
import { facilityRepository } from './facility.repository';

export function useRescheduleFacilityBooking(bookingId: string) {
  return useRepositoryMutation((input: RescheduleFacilityBookingInput) => facilityRepository.rescheduleBooking(bookingId, input));
}
