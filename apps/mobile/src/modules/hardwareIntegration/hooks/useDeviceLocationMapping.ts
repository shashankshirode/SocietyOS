import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useDeviceLocationMapping() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getDeviceLocationMappings(), []);
}
