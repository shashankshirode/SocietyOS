import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useFacilityUsageHistory() {
  return useRepositoryResult(() => facilityRepository.getUsageHistory(), []);
}
