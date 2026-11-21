import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import type { FacilityListParams } from './facility.dto';
import { facilityRepository } from './facility.repository';

export function useFacilities(params: FacilityListParams = {}) {
  return useRepositoryResult(() => facilityRepository.getFacilities(params), [params.query, params.filter]);
}
