import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useBoomBarrierPlaceholder() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getBoomBarriers(), []);
}
