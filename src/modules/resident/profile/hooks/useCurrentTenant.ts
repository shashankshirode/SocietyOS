import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';

export function useCurrentTenant(unitId: string) {
  return useRepositoryResult(() => ownerTenantRepository.getCurrentTenant(unitId), [unitId]);
}
