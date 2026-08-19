import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useAssetDocuments(assetId: string) {
  return useRepositoryResult(() => facilityOpsRepository.getAssetDocuments(assetId), [assetId]);
}
