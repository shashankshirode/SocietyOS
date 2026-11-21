import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useAnprIntegrationReadiness() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getAnprIntegrationReadiness(), []);
}
