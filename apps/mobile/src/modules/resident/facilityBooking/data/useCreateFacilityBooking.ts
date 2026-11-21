import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useCreateFacilityBooking() {
  return useRepositoryMutation(facilityRepository.createFacilityBooking);
}
