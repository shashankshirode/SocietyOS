import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useVendorDocuments(vendorId: string) {
  return useRepositoryResult(() => facilityOpsRepository.getVendorDocuments(vendorId), [vendorId]);
}
