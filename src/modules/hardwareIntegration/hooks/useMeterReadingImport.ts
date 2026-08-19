import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useMeterReadingImport() {
  return useRepositoryMutation((input: JsonObject) => hardwareIntegrationRepository.importMeterReadingsPlaceholder(input));
}
