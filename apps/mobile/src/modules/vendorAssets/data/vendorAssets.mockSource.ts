import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { Vendor, Asset } from './vendorAssets.types';
import { mockVendors, mockAssets } from './vendorAssets.mockData';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
export const vendorAssetsMockSource = {
    async getVendors(): Promise<RepositoryResult<Vendor[]>> {
        await withMockDelay();
        return repositorySuccess(mockVendors);
    },
    async logAssetMaintenance(id: string): Promise<RepositoryResult<Asset>> {
        await withMockDelay();
        const asset = mockAssets.find(a => a.id === id);
        if (asset) {
            asset.lastMaintenance = getRequiredItem(new Date().toISOString().split('T'), 0, "vendorAssets.mockSource.ts");
            const nextDate = new Date();
            nextDate.setMonth(nextDate.getMonth() + 3);
            asset.nextAmcDate = getRequiredItem(nextDate.toISOString().split('T'), 0, "vendorAssets.mockSource.ts");
            return repositorySuccess(asset);
        }
        return repositorySuccess(getRequiredItem(mockAssets, 0, "vendorAssets.mockSource.ts"));
    },
    async listVendors(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async getVendorContract(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listAmcReminders(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listAssets(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listAssetServiceSchedules(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async issueInventoryItem(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async getVendorScorecard(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
};

