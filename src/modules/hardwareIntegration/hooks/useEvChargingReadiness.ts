import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useEvChargingReadiness() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getEvChargingReadiness(), []);
}
