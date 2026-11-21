import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useCctvAccessReadiness() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getCctvAccessReadiness(), []);
}
