import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useCctvCameraRegistry() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getCctvCameras(), []);
}
