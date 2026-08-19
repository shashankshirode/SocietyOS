import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useFacilityRules(facilityId?: string) {
  return useRepositoryResult(() => facilityRepository.getFacilityRules(facilityId ?? 'facility-1'), [facilityId]);
}
