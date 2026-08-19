import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useBiometricConnectorAlignment() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getBiometricConnectorAlignment(), []);
}
