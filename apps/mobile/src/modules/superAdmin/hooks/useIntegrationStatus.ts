import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useIntegrationStatus() {
  return useRepositoryResult(() => superAdminRepository.getIntegrations(), []);
}
