import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useHardwareSyncJobs() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getHardwareSyncJobs(), []);
}
