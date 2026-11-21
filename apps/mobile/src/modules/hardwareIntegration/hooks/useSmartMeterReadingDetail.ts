import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useSmartMeterReadingDetail(meterId: string) {
  return useRepositoryResult(() => hardwareIntegrationRepository.getSmartMeterReadings(meterId), [meterId]);
}
