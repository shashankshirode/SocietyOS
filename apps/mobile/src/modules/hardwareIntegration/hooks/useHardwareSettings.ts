import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useHardwareSettings() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getHardwareSettings(), []);
}
