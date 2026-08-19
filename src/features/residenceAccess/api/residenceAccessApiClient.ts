import { apiClient } from '../../../core/api/apiClient';
import type { ResidenceAccessListQuery } from '../models/residenceAccess.types';
import { residenceAccessEndpoints } from './residenceAccessEndpoints';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export const residenceAccessApiClient = {
    list(query: ResidenceAccessListQuery): Promise<JsonValue> {
        return apiClient.get<JsonValue>(residenceAccessEndpoints.list, {
            query: {
                userId: query.userId,
                cursor: query.cursor,
                pageSize: query.pageSize,
                search: query.searchText,
                status: query.statusFilter,
                role: query.roleFilter
            }
        });
    },
    detail(residenceAccessId: string): Promise<JsonValue> {
        return apiClient.get<JsonValue>(residenceAccessEndpoints.detail(residenceAccessId));
    },
    postDetail(endpoint: string, body: JsonObject, idempotencyKey: string, signal?: AbortSignal): Promise<JsonValue> {
        return apiClient.post<JsonValue>(endpoint, body, { idempotencyKey, ...includeWhenPresent("signal", signal) });
    },
    putDetail(endpoint: string, body: JsonObject, idempotencyKey: string): Promise<JsonValue> {
        return apiClient.put<JsonValue>(endpoint, body, { idempotencyKey });
    },
    deleteDetail(endpoint: string): Promise<JsonValue> {
        return apiClient.delete<JsonValue>(endpoint);
    }
};
