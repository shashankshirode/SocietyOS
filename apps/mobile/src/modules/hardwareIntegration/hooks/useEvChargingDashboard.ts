import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useEvChargingDashboard() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getEvChargingDashboard(), []);
}
