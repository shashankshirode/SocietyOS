import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';
import type { ImportMeterReadingsCommand } from '../../../shared/types/hardware.types';

export function useMeterReadingImport() {
  return useRepositoryMutation((input: ImportMeterReadingsCommand) => hardwareIntegrationRepository.importMeterReadings(input));
}