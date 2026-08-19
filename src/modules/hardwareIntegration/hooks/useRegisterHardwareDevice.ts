import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';
import type { HardwareDevice } from '../../../shared/types/hardware.types';

export function useRegisterHardwareDevice() {
  return useRepositoryMutation((input: Partial<HardwareDevice>) => hardwareIntegrationRepository.registerHardwareDevice(input));
}
