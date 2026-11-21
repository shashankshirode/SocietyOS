import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { serviceMarketplaceApiSource } from './serviceMarketplace.apiSource';
import { serviceMarketplaceMockSource } from './serviceMarketplace.mockSource';

export const serviceMarketplaceRepository = createRepository({
  moduleKey: 'residentMarketplace',
  mockRepository: serviceMarketplaceMockSource,
  apiRepository: serviceMarketplaceApiSource,
});
