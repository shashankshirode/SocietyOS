import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useRfidIntegrationReadiness() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getRfidIntegrationReadiness(), []);
}
