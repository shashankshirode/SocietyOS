import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useHardwareDevices() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getHardwareDevices(), []);
}
