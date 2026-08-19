import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useIntegrationHealth() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getIntegrationHealth(), []);
}
