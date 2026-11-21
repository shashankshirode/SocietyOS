import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';

export function useTenantHistory(unitId: string) {
  return useRepositoryResult(() => ownerTenantRepository.getTenantHistory(unitId), [unitId]);
}
