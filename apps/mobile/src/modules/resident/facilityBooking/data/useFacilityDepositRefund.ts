import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useFacilityDepositRefund(bookingId: string) {
  return useRepositoryResult(() => facilityRepository.getDepositRefund(bookingId), [bookingId]);
}
