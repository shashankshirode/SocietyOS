import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { serviceMarketplaceRepository } from '../data/serviceMarketplace.repository';

type VendorRatingInput = { providerId: string; rating: number; review: string };

export function useVendorRating() {
  return useRepositoryMutation((input: VendorRatingInput) => serviceMarketplaceRepository.submitVendorRating(input));
}
