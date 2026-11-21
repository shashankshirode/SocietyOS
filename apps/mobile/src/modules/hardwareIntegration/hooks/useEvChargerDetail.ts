import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useEvChargerDetail(chargerId: string) {
  return useRepositoryResult(() => hardwareIntegrationRepository.getEvChargerDetail(chargerId), [chargerId]);
}
