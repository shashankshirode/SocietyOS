export interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: ResponseMeta | Absent;
    error?: ApiError | Absent;
    traceId: string;
    timestamp: string;
}
export interface ResponseMeta {
    page?: number | Absent;
    pageSize?: number | Absent;
    totalItems?: number | Absent;
    totalPages?: number | Absent;
    hasNext?: boolean | Absent;
    hasPrevious?: boolean | Absent;
    cursor?: string | Absent;
    etag?: string | Absent;
    lastModified?: string | Absent;
}
export interface ApiError {
    code: string;
    message: string;
    details?: string | Absent;
    fieldErrors?: FieldError[] | Absent;
    stack?: string | Absent;
    statusCode?: number | Absent;
}
export interface FieldError {
    field: string;
    message: string;
    code?: string | Absent;
}
export interface PaginatedResponse<T> {
    items: T[];
    meta: ResponseMeta;
}
export type { JsonObject, JsonValue } from '../../core/api/api.types';
import type { JsonObject } from '../../core/api/api.types';
import type { Absent } from "../../shared/types/absence.types";
export interface ApiRequestConfig {
    params?: Record<string, JsonObject[string]>;
    headers?: Record<string, string>;
    signal?: AbortSignal;
    timeout?: number;
    retries?: number;
    idempotencyKey?: string;
}
export interface MutationConfig extends ApiRequestConfig {
    optimisticUpdate?: boolean;
    rollbackOnError?: boolean;
}
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export interface EndpointDefinition<TRequest = unknown, TResponse = unknown> {
    method: HttpMethod;
    path: string;
    pathParams?: string[];
    queryParams?: string[];
    requestBody?: TRequest;
    responseBody?: TResponse;
    authRequired?: boolean;
    roles?: string[];
    rateLimit?: {
        maxRequests: number;
        windowMs: number;
    };
    cache?: {
        ttl: number;
        key?: string;
    };
}

