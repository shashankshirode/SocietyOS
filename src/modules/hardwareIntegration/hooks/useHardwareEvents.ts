import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useHardwareEvents() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getHardwareEvents(), []);
}
