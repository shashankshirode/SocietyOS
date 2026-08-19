import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useSmartMeterDashboard() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getSmartMeterDashboard(), []);
}
