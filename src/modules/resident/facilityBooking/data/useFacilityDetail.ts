import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useFacilityDetail(facilityId: string) {
  return useRepositoryResult(() => facilityRepository.getFacilityDetail(facilityId), [facilityId]);
}
