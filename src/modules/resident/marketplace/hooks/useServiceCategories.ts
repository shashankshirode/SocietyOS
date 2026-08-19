import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { serviceMarketplaceRepository } from '../data/serviceMarketplace.repository';

export function useServiceCategories() {
  return useRepositoryResult(() => serviceMarketplaceRepository.listServiceCategories(), []);
}
