import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';

export function useUnitVehicles(unitId: string) {
  return useRepositoryResult(() => ownerTenantRepository.getVehicles(unitId), [unitId]);
}
