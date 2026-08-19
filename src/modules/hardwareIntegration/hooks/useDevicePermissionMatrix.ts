import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useDevicePermissionMatrix() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getDevicePermissionMatrix(), []);
}
