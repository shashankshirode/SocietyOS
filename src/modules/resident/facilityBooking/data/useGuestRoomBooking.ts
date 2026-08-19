import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useGuestRoomBooking() {
  return useRepositoryMutation(facilityRepository.createGuestRoomBooking);
}
