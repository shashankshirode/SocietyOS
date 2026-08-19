import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useComplianceExpiry() {
  return useRepositoryResult(() => facilityOpsRepository.getComplianceExpiry(), []);
}
