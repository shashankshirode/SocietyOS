import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';

export function useUnitDocuments(unitId: string) {
  return useRepositoryResult(() => ownerTenantRepository.getUnitDocuments(unitId), [unitId]);
}
