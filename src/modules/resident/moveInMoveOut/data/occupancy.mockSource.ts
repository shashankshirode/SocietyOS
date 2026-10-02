import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { OccupancyRecord } from './occupancy.types';
import { mockOccupancyRecords } from './occupancy.mockData';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import type { JsonValue, JsonObject } from '../../../../core/api/api.types';

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

  async listOccupancyHistoryByUnit(_params?: JsonValue): Promise<RepositoryResult<JsonObject[]>> {
    return repositorySuccess([{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE',
    }]);
  },

  async listOwnerHistoryByUnit(_params?: JsonValue): Promise<RepositoryResult<JsonObject[]>> {
    return repositorySuccess([{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE',
    }]);
  },

  async listTenantHistoryByUnit(_params?: JsonValue): Promise<RepositoryResult<JsonObject[]>> {
    return repositorySuccess([{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE',
    }]);
  },

  async getFlatTimeline(_params?: JsonValue): Promise<RepositoryResult<JsonObject[]>> {
    return repositorySuccess([{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE',
    }]);
  },

  async listPreviousResidentDocuments(_params?: JsonValue): Promise<RepositoryResult<JsonObject[]>> {
    return repositorySuccess([{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE',
    }]);
  },

  async createMoveInRequest(_params?: JsonValue): Promise<RepositoryResult<JsonObject[]>> {
    return repositorySuccess([{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE',
    }]);
  },

  async createMoveOutRequest(_params?: JsonValue): Promise<RepositoryResult<JsonObject[]>> {
    return repositorySuccess([{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE',
    }]);
  },

  async activateResidentAccess(_params?: JsonValue): Promise<RepositoryResult<JsonObject[]>> {
    return repositorySuccess([{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE',
    }]);
  },

  async revokeResidentAccess(_params?: JsonValue): Promise<RepositoryResult<JsonObject[]>> {
    return repositorySuccess([{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE',
    }]);
  },
};
