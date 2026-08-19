import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { HardwareDevice } from './hardware.types';
import { mockHardwareDevices } from './hardware.mockData';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
export const hardwareMockSource = {
    async getHardwareDevices(): Promise<RepositoryResult<HardwareDevice[]>> {
        await withMockDelay();
        return repositorySuccess(mockHardwareDevices);
    },
    async triggerFirmwareUpdate(id: string): Promise<RepositoryResult<HardwareDevice>> {
        await withMockDelay();
        const device = mockHardwareDevices.find(d => d.id === id);
        if (device) {
            device.status = 'ONLINE';
            device.lastSyncTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
            return repositorySuccess(device);
        }
        return repositorySuccess(getRequiredItem(mockHardwareDevices, 0, "hardware.mockSource.ts"));
    },
};

