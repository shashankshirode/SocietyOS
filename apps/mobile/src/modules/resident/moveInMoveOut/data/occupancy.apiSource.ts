import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import {
  repositorySuccess,
  repositoryFailure,
  type RepositoryResult,
  type RepositoryErrorCategory,
  type JsonValue,
  type JsonObject,
} from '../../../../core/repositories/repository.types';
import type { OccupancyRecord } from './occupancy.types';
import { validateUnitScopeInput } from '../validators/occupancy.validators';

function toResultError(error: Error | JsonValue, defaultCode = 'INTEGRATION_UNAVAILABLE'): RepositoryResult<never> {
  if (error && typeof error === 'object' && !Array.isArray(error)) {
    const obj = error as JsonObject;
    const code = typeof obj.code === 'string' ? obj.code : defaultCode;
    const message = typeof obj.message === 'string' ? obj.message : 'Error';
    const category = (typeof obj.category === 'string' ? obj.category : 'INTEGRATION_UNAVAILABLE') as RepositoryErrorCategory;
    return repositoryFailure({
      code,
      message,
      category,
    });
  }
  return repositoryFailure({
    code: defaultCode,
    message: error instanceof Error ? error.message : 'Error',
    category: 'INTEGRATION_UNAVAILABLE',
  });
}

function parseUnitScope(scope: JsonValue): { societyId: string; unitId: string } | null {
  const validation = validateUnitScopeInput(scope);
  if (!validation.isValid) return null;
  const obj = scope as JsonObject;
  return {
    societyId: typeof obj.societyId === 'string' ? obj.societyId : '',
    unitId: typeof obj.unitId === 'string' ? obj.unitId : '',
  };
}

export const occupancyApiSource = {
  async getOccupancyRecords(): Promise<RepositoryResult<OccupancyRecord[]>> {
    try {
      const raw = await apiClient.get<JsonValue>('/occupancy-records');
      if (!Array.isArray(raw)) {
        return repositorySuccess([]);
      }
      const records: OccupancyRecord[] = [];
      for (const item of raw) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
        const row = item as JsonObject;
        if (typeof row.id !== 'string' || !row.id || typeof row.unitId !== 'string' || !row.unitId) {
          continue;
        }
        const occupantType = (row.occupantType === 'OWNER' || row.occupantType === 'TENANT' || row.occupantType === 'FAMILY_MEMBER' || row.occupantType === 'CO_OWNER')
          ? row.occupantType
          : 'OWNER';
        const documentStatus = (row.documentStatus === 'APPROVED' || row.documentStatus === 'REJECTED' || row.documentStatus === 'PENDING')
          ? row.documentStatus
          : 'PENDING';

        records.push({
          id: row.id,
          unitId: row.unitId,
          occupantName: typeof row.occupantName === 'string' ? row.occupantName : 'Occupant',
          occupantType,
          documentStatus,
          ...(typeof row.flatNumber === 'string' ? { flatNumber: row.flatNumber } : {}),
          ...(typeof row.leaseStartDate === 'string' ? { leaseStartDate: row.leaseStartDate } : {}),
          ...(typeof row.leaseEndDate === 'string' ? { leaseEndDate: row.leaseEndDate } : {}),
        } as OccupancyRecord);
      }
      return repositorySuccess(records);
    } catch (error) {
      return toResultError(error instanceof Error ? error : (error as JsonValue), 'NETWORK_ERROR');
    }
  },

  async updateOccupancyStatus(_id: string, _status: 'APPROVED' | 'REJECTED'): Promise<RepositoryResult<OccupancyRecord>> {
    return repositoryFailure({
      code: 'INTEGRATION_UNAVAILABLE',
      message: 'Document status approval route unavailable',
      category: 'INTEGRATION_UNAVAILABLE',
    });
  },

  async listOccupancyHistoryByUnit(scope?: JsonValue): Promise<RepositoryResult<JsonObject>> {
    const parsed = parseUnitScope(scope ?? null);
    if (!parsed) {
      return repositoryFailure({
        code: 'VALIDATION_FAILED',
        message: 'Invalid unit scope',
        category: 'VALIDATION',
      });
    }
    try {
      const data = await apiClient.get<JsonObject>(apiEndpoints.occupancy.occupancyTimeline(parsed.societyId, parsed.unitId));
      return repositorySuccess(data);
    } catch (error) {
      return toResultError(error instanceof Error ? error : (error as JsonValue));
    }
  },

  async listOwnerHistoryByUnit(scope?: JsonValue): Promise<RepositoryResult<JsonObject>> {
    const parsed = parseUnitScope(scope ?? null);
    if (!parsed) {
      return repositoryFailure({
        code: 'VALIDATION_FAILED',
        message: 'Invalid unit scope',
        category: 'VALIDATION',
      });
    }
    try {
      const data = await apiClient.get<JsonObject>(apiEndpoints.occupancy.ownerHistory(parsed.societyId, parsed.unitId));
      return repositorySuccess(data);
    } catch (error) {
      return toResultError(error instanceof Error ? error : (error as JsonValue));
    }
  },

  async listTenantHistoryByUnit(scope?: JsonValue): Promise<RepositoryResult<JsonObject>> {
    const parsed = parseUnitScope(scope ?? null);
    if (!parsed) {
      return repositoryFailure({
        code: 'VALIDATION_FAILED',
        message: 'Invalid unit scope',
        category: 'VALIDATION',
      });
    }
    try {
      const data = await apiClient.get<JsonObject>(apiEndpoints.occupancy.tenantHistory(parsed.societyId, parsed.unitId));
      return repositorySuccess(data);
    } catch (error) {
      return toResultError(error instanceof Error ? error : (error as JsonValue));
    }
  },

  async getFlatTimeline(scope?: JsonValue): Promise<RepositoryResult<JsonObject>> {
    const parsed = parseUnitScope(scope ?? null);
    if (!parsed) {
      return repositoryFailure({
        code: 'VALIDATION_FAILED',
        message: 'Invalid unit scope',
        category: 'VALIDATION',
      });
    }
    try {
      const data = await apiClient.get<JsonObject>(apiEndpoints.occupancy.occupancyOverview(parsed.societyId, parsed.unitId));
      return repositorySuccess(data);
    } catch (error) {
      return toResultError(error instanceof Error ? error : (error as JsonValue));
    }
  },

  async listPreviousResidentDocuments(params?: JsonValue): Promise<RepositoryResult<JsonObject>> {
    if (!params || typeof params !== 'object' || Array.isArray(params)) {
      return repositoryFailure({
        code: 'VALIDATION_FAILED',
        message: 'Invalid parameters',
        category: 'VALIDATION',
      });
    }
    const p = params as JsonObject;
    if (typeof p.societyId !== 'string' || !p.societyId || typeof p.unitId !== 'string' || !p.unitId || typeof p.residentHistoryId !== 'string' || !p.residentHistoryId) {
      return repositoryFailure({
        code: 'VALIDATION_FAILED',
        message: 'Missing required parameters',
        category: 'VALIDATION',
      });
    }
    try {
      const data = await apiClient.get<JsonObject>(apiEndpoints.occupancy.prevResidentDocs(p.societyId, p.unitId, p.residentHistoryId));
      return repositorySuccess(data);
    } catch (error) {
      return toResultError(error instanceof Error ? error : (error as JsonValue));
    }
  },

  async createMoveInRequest(params?: JsonValue): Promise<RepositoryResult<JsonObject>> {
    try {
      const body = (params && typeof params === 'object' && !Array.isArray(params) ? params : {}) as JsonObject;
      const data = await apiClient.post<JsonObject>(
        apiEndpoints.occupancy.createMoveInRequest,
        body,
        { idempotencyKey: createIdempotencyKey('occupancy-move-in') }
      );
      return repositorySuccess(data);
    } catch (error) {
      return toResultError(error instanceof Error ? error : (error as JsonValue));
    }
  },

  async createMoveOutRequest(params?: JsonValue): Promise<RepositoryResult<JsonObject>> {
    try {
      const body = (params && typeof params === 'object' && !Array.isArray(params) ? params : {}) as JsonObject;
      const data = await apiClient.post<JsonObject>(
        '/move-out-requests',
        body,
        { idempotencyKey: createIdempotencyKey('occupancy-move-out') }
      );
      return repositorySuccess(data);
    } catch (error) {
      return toResultError(error instanceof Error ? error : (error as JsonValue));
    }
  },

  async activateResidentAccess(scope?: JsonValue): Promise<RepositoryResult<JsonObject>> {
    const parsed = parseUnitScope(scope ?? null);
    if (!parsed) {
      return repositoryFailure({
        code: 'VALIDATION_FAILED',
        message: 'Invalid unit scope',
        category: 'VALIDATION',
      });
    }
    try {
      const data = await apiClient.post<JsonObject>(
        apiEndpoints.occupancy.accessActivate(parsed.societyId, parsed.unitId),
        {},
        { idempotencyKey: createIdempotencyKey('occupancy-access-activate') }
      );
      return repositorySuccess(data);
    } catch (error) {
      return toResultError(error instanceof Error ? error : (error as JsonValue));
    }
  },

  async revokeResidentAccess(scope?: JsonValue): Promise<RepositoryResult<JsonObject>> {
    const parsed = parseUnitScope(scope ?? null);
    if (!parsed) {
      return repositoryFailure({
        code: 'VALIDATION_FAILED',
        message: 'Invalid unit scope',
        category: 'VALIDATION',
      });
    }
    try {
      const data = await apiClient.post<JsonObject>(
        apiEndpoints.occupancy.accessRevoke(parsed.societyId, parsed.unitId),
        {},
        { idempotencyKey: createIdempotencyKey('occupancy-access-revoke') }
      );
      return repositorySuccess(data);
    } catch (error) {
      return toResultError(error instanceof Error ? error : (error as JsonValue));
    }
  },
};
