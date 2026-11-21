import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useEvChargingSession() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getEvChargingSessions(), []);
}
