import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { serviceMarketplaceRepository } from '../data/serviceMarketplace.repository';

export function useFeaturedServiceCategory() {
  return useRepositoryResult(() => serviceMarketplaceRepository.getFeaturedServiceCategory(), []);
}
