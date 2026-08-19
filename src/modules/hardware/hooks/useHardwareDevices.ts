import { useRepositoryResult, useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { hardwareRepository } from '../data/hardware.repository';

export function useHardwareDevices() {
  return useRepositoryResult(() => hardwareRepository.getHardwareDevices(), []);
}

export function useTriggerFirmwareUpdate() {
  return useRepositoryMutation(({ id }: { id: string }) =>
    hardwareRepository.triggerFirmwareUpdate(id)
  );
}
