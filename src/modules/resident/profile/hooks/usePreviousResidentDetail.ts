import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';

export function usePreviousResidentDetail(unitId: string, residentHistoryId: string) {
  return useRepositoryResult(
    () => ownerTenantRepository.getPreviousResidentDetail(unitId, residentHistoryId),
    [unitId, residentHistoryId]
  );
}

export function usePreviousResidentDocuments(unitId: string, residentHistoryId: string) {
  return useRepositoryResult(
    () => ownerTenantRepository.getPreviousResidentDocuments(unitId, residentHistoryId),
    [unitId, residentHistoryId]
  );
}
