import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useBoomBarrierReadiness() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getBoomBarrierReadiness(), []);
}
