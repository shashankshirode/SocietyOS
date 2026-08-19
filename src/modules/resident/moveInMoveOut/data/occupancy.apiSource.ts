import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type { OccupancyRecord } from './occupancy.types';

export const occupancyApiSource = {
  async getOccupancyRecords(): Promise<RepositoryResult<OccupancyRecord[]>> {
    throw new Error('Not implemented');
  },

  async updateOccupancyStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<RepositoryResult<OccupancyRecord>> {
    throw new Error('Not implemented');
  },

  async listOccupancyHistoryByUnit(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async listOwnerHistoryByUnit(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async listTenantHistoryByUnit(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async getFlatTimeline(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async listPreviousResidentDocuments(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async createMoveInRequest(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async createMoveOutRequest(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async activateResidentAccess(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },
};
