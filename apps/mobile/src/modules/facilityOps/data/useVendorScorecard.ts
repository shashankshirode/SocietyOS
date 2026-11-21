import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useVendorScorecard(vendorId: string) {
  return useRepositoryResult(() => facilityOpsRepository.getVendorScorecard(vendorId), [vendorId]);
}
