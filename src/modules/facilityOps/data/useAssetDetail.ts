import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useAssetDetail(assetId: string) {
  return useRepositoryResult(() => facilityOpsRepository.getAssetDetail(assetId), [assetId]);
}
