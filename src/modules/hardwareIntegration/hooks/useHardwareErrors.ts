import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useHardwareErrors() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getHardwareErrors(), []);
}
