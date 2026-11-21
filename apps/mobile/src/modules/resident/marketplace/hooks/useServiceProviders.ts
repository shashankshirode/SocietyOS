import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { serviceMarketplaceRepository } from '../data/serviceMarketplace.repository';

export function useServiceProviders(categoryId?: string) {
  return useRepositoryResult(() => serviceMarketplaceRepository.listServiceProvidersByCategory(categoryId), [categoryId]);
}
