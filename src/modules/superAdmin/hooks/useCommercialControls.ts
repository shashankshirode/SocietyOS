import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useCommercialControls() {
  return useRepositoryResult(() => superAdminRepository.getCommercialControls(), []);
}
