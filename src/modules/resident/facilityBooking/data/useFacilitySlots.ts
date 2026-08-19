import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useFacilitySlots(facilityId: string, date: string) {
  return useRepositoryResult(() => facilityRepository.getFacilityAvailability(facilityId, date), [facilityId, date]);
}
