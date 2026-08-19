import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { ownerTenantApiSource } from './ownerTenant.apiSource';
import { ownerTenantMockSource } from './ownerTenant.mockSource';

export const ownerTenantRepository = createRepository({
  moduleKey: 'residentProfile',
  mockRepository: ownerTenantMockSource,
  apiRepository: ownerTenantApiSource,
});
export type { ResidentHistoryRecord } from '../../../../shared/types/ownerTenant.types';
