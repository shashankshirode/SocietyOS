import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';

export function useOccupancyTimeline(unitId: string) {
  return useRepositoryResult(() => ownerTenantRepository.getOccupancyTimeline(unitId), [unitId]);
}
