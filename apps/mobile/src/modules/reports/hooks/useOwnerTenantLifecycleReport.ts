import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useOwnerTenantLifecycleReport() {
  return useRepositoryResult(() => reportsRepository.getOwnerTenantLifecycleReport(), []);
}
