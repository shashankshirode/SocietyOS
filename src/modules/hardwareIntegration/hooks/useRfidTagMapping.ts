import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useRfidTagMapping() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getRfidTagMappings(), []);
}
