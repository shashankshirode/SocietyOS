import { useRepositoryMutation, useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useFacilityCheckInPass(bookingId: string) {
  return useRepositoryResult(() => facilityRepository.getCheckInPass(bookingId), [bookingId]);
}

export function useFacilityCheckIn() {
  return useRepositoryMutation((bookingId: string) => facilityRepository.simulateCheckIn(bookingId));
}
