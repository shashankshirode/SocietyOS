import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useVendorDetail(vendorId: string) {
  return useRepositoryResult(() => facilityOpsRepository.getVendorDetail(vendorId), [vendorId]);
}
