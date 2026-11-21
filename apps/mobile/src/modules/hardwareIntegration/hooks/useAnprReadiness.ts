import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useAnprReadiness() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getAnprReadiness(), []);
}
