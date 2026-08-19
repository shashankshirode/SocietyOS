import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useFacilityBookingDetail(bookingId: string) {
  return useRepositoryResult(() => facilityRepository.getBookingDetail(bookingId), [bookingId]);
}
