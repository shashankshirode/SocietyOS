import { getAccessToken } from '../auth/tokenStore';
import { apiConfig } from './apiConfig';
import { ApiClientError, toApiClientError } from './apiError';
import type { ApiResponse, JsonObject } from './api.types';
import { createCorrelationId, getMockRequestContext, type RequestContext } from './requestContext';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import type { Absent } from "../../shared/types/absence.types";
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
type RequestOptions = {
    query?: Record<string, string | number | boolean | Absent>;
    body?: JsonObject;
    context?: RequestContext;
    idempotencyKey?: string;
    timeoutMs?: number;
    signal?: AbortSignal;
};
function buildUrl(path: string, query?: RequestOptions['query']): string {
    const url = new URL(`${apiConfig.baseUrl}${path}`);
    Object.entries(query ?? {}).forEach(([key, value]) => {
        if (value !== undefined) {
            url.searchParams.set(key, String(value));
        }
    });
    return url.toString();
}
async function buildHeaders(options: RequestOptions): Promise<Record<string, string>> {
    const context = {
        ...getMockRequestContext(),
        ...options.context
    };
    const token = await getAccessToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Correlation-Id': context.correlationId ?? createCorrelationId(),
        'X-Client-App': apiConfig.clientApp,
        'X-Client-Version': apiConfig.clientVersion
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    if (context.societyId) {
        headers['X-Society-Id'] = context.societyId;
    }
    if (context.unitId) {
        headers['X-Unit-Id'] = context.unitId;
    }
    if (context.activeRole) {
        headers['X-Actor-Role'] = context.activeRole;
    }
    if (context.residentProfileId) {
        headers['X-Resident-Profile-Id'] = context.residentProfileId;
    }
    if (context.locale) {
        headers['Accept-Language'] = context.locale;
    }
    if (context.timezone) {
        headers['X-Timezone'] = context.timezone;
    }
    if (options.idempotencyKey) {
        headers['Idempotency-Key'] = options.idempotencyKey;
    }
    return headers;
}
async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? apiConfig.timeoutMs);
    const cancelFromCaller = () => controller.abort();
    if (options.signal?.aborted) {
        controller.abort();
    }
    else {
        options.signal?.addEventListener('abort', cancelFromCaller);
    }
    try {
        const response = await fetch(buildUrl(path, options.query), {
            method,
            headers: await buildHeaders(options),
            ...includeWhenPresent("body", options.body ? JSON.stringify(options.body) : undefined),
            signal: controller.signal
        });
        const payload = (await response.json()) as ApiResponse<T>;
        if (!response.ok || !payload.success) {
            const error = payload.success
                ? {
                    code: `HTTP_${response.status}`,
                    message: response.statusText || 'Request failed.'
                }
                : payload.error;
            throw new ApiClientError({
                code: error.code,
                message: error.message,
                status: response.status,
                ...includeWhenPresent("fieldErrors", error.fieldErrors),
                traceId: payload.traceId
            });
        }
        return payload.data;
    }
    catch (error) {
        throw toApiClientError(error);
    }
    finally {
        clearTimeout(timeout);
        options.signal?.removeEventListener('abort', cancelFromCaller);
    }
}
export const apiClient = {
    get: <T>(path: string, options?: Omit<RequestOptions, 'body' | 'idempotencyKey'>) => request<T>('GET', path, options),
    post: <T>(path: string, body?: JsonObject, options?: Omit<RequestOptions, 'body'>) => request<T>('POST', path, { ...options, ...includeWhenPresent("body", body) }),
    patch: <T>(path: string, body?: JsonObject, options?: Omit<RequestOptions, 'body'>) => request<T>('PATCH', path, { ...options, ...includeWhenPresent("body", body) }),
    put: <T>(path: string, body?: JsonObject, options?: Omit<RequestOptions, 'body'>) => request<T>('PUT', path, { ...options, ...includeWhenPresent("body", body) }),
    delete: <T>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('DELETE', path, options)
};
