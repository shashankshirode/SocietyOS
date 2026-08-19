import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';

export function useCurrentOwner(unitId: string) {
  return useRepositoryResult(() => ownerTenantRepository.getCurrentOwner(unitId), [unitId]);
}
