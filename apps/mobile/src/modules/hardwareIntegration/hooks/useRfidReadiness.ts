import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useRfidReadiness() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getRfidReadiness(), []);
}
