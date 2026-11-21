import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { CancelFacilityBookingInput } from '../../../../shared/types/facilityBooking.types';
import { facilityRepository } from './facility.repository';

export function useCancelFacilityBooking(bookingId: string) {
  return useRepositoryMutation((input: CancelFacilityBookingInput) => facilityRepository.cancelBooking(bookingId, input));
}
