import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function usePlatformAuditLogs() {
  return useRepositoryResult(() => superAdminRepository.getAuditLogs(), []);
}
