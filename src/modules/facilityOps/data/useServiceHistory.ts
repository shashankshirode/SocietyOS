import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useServiceHistory() {
  return useRepositoryResult(() => facilityOpsRepository.getServiceHistory(), []);
}
