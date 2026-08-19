import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useFacilityOpsHome() {
  return useRepositoryResult(() => facilityOpsRepository.getFacilityOpsHome(), []);
}
