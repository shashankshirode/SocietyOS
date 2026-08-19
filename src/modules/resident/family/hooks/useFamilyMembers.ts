import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../../profile/data/ownerTenant.repository';

export function useFamilyMembers(unitId: string) {
  return useRepositoryResult(() => ownerTenantRepository.getFamilyMembers(unitId), [unitId]);
}
