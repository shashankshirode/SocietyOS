import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { vendorAssetsRepository } from '../data/vendorAssets.repository';

export function useVendorDirectory() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await vendorAssetsRepository.listVendors(input);
    const data = (res && typeof res === 'object' && 'data' in res) ? res.data : res;
    return { ok: true, data };
  });

  return {
    data: [],
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
