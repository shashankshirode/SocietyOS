import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useIntegrationHealthLogs() {
  return useRepositoryResult(() => hardwareIntegrationRepository.listIntegrationHealthLogs(), []);
}
