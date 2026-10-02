import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';
import type { RegisterHardwareDeviceCommand } from '../../../shared/types/hardware.types';

export function useRegisterHardwareDevice() {
  return useRepositoryMutation((input: RegisterHardwareDeviceCommand) => hardwareIntegrationRepository.registerHardwareDevice(input));
}