import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { OccupancyRecord } from './occupancy.types';
import { mockOccupancyRecords } from './occupancy.mockData';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
export const occupancyMockSource = {
    async getOccupancyRecords(): Promise<RepositoryResult<OccupancyRecord[]>> {
        await withMockDelay();
        return repositorySuccess(mockOccupancyRecords);
    },
    async updateOccupancyStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<RepositoryResult<OccupancyRecord>> {
        await withMockDelay();
        const record = mockOccupancyRecords.find(r => r.id === id);
        if (record) {
            record.documentStatus = status;
            return repositorySuccess(record);
        }
        return repositorySuccess(getRequiredItem(mockOccupancyRecords, 0, "occupancy.mockSource.ts"));
    },
    async listOccupancyHistoryByUnit(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listOwnerHistoryByUnit(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listTenantHistoryByUnit(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async getFlatTimeline(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listPreviousResidentDocuments(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async createMoveInRequest(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async createMoveOutRequest(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async activateResidentAccess(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
};

