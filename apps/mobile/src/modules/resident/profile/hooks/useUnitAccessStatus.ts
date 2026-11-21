import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';

export function useUnitAccessStatus(unitId: string) {
  return useRepositoryResult(() => ownerTenantRepository.getUnitAccessStatus(unitId), [unitId]);
}
