import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useGateHardwareDashboard() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getGateHardwareDashboard(), []);
}
