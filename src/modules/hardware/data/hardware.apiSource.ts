import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { HardwareDevice } from './hardware.types';

export const hardwareApiSource = {
  async getHardwareDevices(): Promise<RepositoryResult<HardwareDevice[]>> {
    throw new Error('Not implemented');
  },

  async triggerFirmwareUpdate(id: string): Promise<RepositoryResult<HardwareDevice>> {
    throw new Error('Not implemented');
  },
};
