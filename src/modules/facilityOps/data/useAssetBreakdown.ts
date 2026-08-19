import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useAssetBreakdown() {
  return useRepositoryMutation(facilityOpsRepository.reportAssetBreakdown);
}
