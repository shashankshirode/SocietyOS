import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';

export function useUnitOccupancyOverview(unitId: string) {
  return useRepositoryResult(() => ownerTenantRepository.getUnitOccupancyOverview(unitId), [unitId]);
}
