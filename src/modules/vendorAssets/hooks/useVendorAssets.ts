import { useRepositoryResult, useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { vendorAssetsRepository } from '../data/vendorAssets.repository';

export function useVendorAssets() {
  return useRepositoryResult(() => vendorAssetsRepository.getVendors(), []);
}

export function useLogAssetMaintenance() {
  return useRepositoryMutation(({ id }: { id: string }) =>
    vendorAssetsRepository.logAssetMaintenance(id)
  );
}
