import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';

export function useOwnerHistory(unitId: string) {
  return useRepositoryResult(() => ownerTenantRepository.getOwnerHistory(unitId), [unitId]);
}
