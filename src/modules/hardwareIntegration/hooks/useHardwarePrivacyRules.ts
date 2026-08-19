import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useHardwarePrivacyRules() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getHardwarePrivacyRules(), []);
}
