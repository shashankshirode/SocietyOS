import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useFacilityBlockedSlots(facilityId?: string) {
  return useRepositoryResult(() => facilityRepository.getBlockedSlots(facilityId), [facilityId]);
}
