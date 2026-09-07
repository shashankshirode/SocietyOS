import type { ApiResponse, ApiRequestConfig, HttpMethod, EndpointDefinition } from '../contracts/api.types';
import type { JsonObject } from '../../core/api/api.types';
import type { Absent } from "../../shared/types/absence.types";
export interface ApiClientConfig {
    baseUrl: string;
    timeout?: number | Absent;
    defaultHeaders?: Record<string, string> | Absent;
    interceptors?: {
        request?: ((config: RequestConfig) => RequestConfig | Promise<RequestConfig>) | Absent;
        response?: ((response: ApiResponse<JsonObject>) => ApiResponse<JsonObject> | Promise<ApiResponse<JsonObject>>) | Absent;
        error?: ((error: ApiError) => Promise<never> | ApiResponse<JsonObject>) | Absent;
    } | Absent;
    retryConfig?: {
        maxRetries: number;
        retryDelay: (attempt: number) => number;
        retryCondition?: ((error: ApiError) => boolean) | Absent;
    } | Absent;
    cacheConfig?: {
        enabled: boolean;
        defaultTtl: number;
        storage?: 'memory' | 'localStorage' | 'sessionStorage' | Absent;
    } | Absent;
}
export interface RequestConfig {
    method: HttpMethod;
    url: string;
    params?: Record<string, any> | Absent;
    data?: any;
    headers?: Record<string, string> | Absent;
    signal?: AbortSignal | Absent;
    timeout?: number | Absent;
    idempotencyKey?: string | Absent;
    cache?: boolean | Absent;
    cacheTtl?: number | Absent;
}
export interface ApiError extends Error {
    code: string;
    status?: number | Absent;
    statusText?: string | Absent;
    response?: ApiResponse<JsonObject> | Absent;
    request?: RequestConfig | Absent;
    isNetworkError: boolean;
    isTimeout: boolean;
    isCancelled: boolean;
    fieldErrors?: Array<{
        field: string;
        message: string;
        code?: string | Absent;
    }> | Absent;
}
export class UniversalApiClient {
    private config: Required<Omit<ApiClientConfig, 'interceptors' | 'retryConfig' | 'cacheConfig'>> & {
        interceptors: NonNullable<ApiClientConfig['interceptors']>;
        retryConfig: NonNullable<ApiClientConfig['retryConfig']>;
        cacheConfig: NonNullable<ApiClientConfig['cacheConfig']>;
    };
    private cache: Map<string, {
        data: JsonObject;
        expiresAt: number;
    }> = new Map();
    private requestInterceptors: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>> = [];
    private responseInterceptors: Array<(response: ApiResponse<JsonObject>) => ApiResponse<JsonObject> | Promise<ApiResponse<JsonObject>>> = [];
    private errorInterceptors: Array<(error: ApiError) => Promise<never> | ApiResponse<JsonObject>> = [];
    constructor(config: ApiClientConfig) {
        this.config = {
            baseUrl: config.baseUrl.replace(/\/$/, ''),
            timeout: config.timeout ?? 30000,
            defaultHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...config.defaultHeaders,
            },
            interceptors: config.interceptors ?? {},
            retryConfig: {
                maxRetries: config.retryConfig?.maxRetries ?? 3,
                retryDelay: config.retryConfig?.retryDelay ?? ((attempt) => Math.min(1000 * 2 ** attempt, 10000)),
                retryCondition: config.retryConfig?.retryCondition ?? ((error) => error.isNetworkError || error.isTimeout || (error.status !== undefined && error.status >= 500)),
            },
            cacheConfig: {
                enabled: config.cacheConfig?.enabled ?? true,
                defaultTtl: config.cacheConfig?.defaultTtl ?? 5 * 60 * 1000,
                storage: config.cacheConfig?.storage ?? 'memory',
            },
        };
        if (this.config.interceptors.request) {
            this.requestInterceptors.push(this.config.interceptors.request);
        }
        if (this.config.interceptors.response) {
            this.responseInterceptors.push(this.config.interceptors.response);
        }
        if (this.config.interceptors.error) {
            this.errorInterceptors.push(this.config.interceptors.error);
        }
        this.loadCacheFromStorage();
    }
    private loadCacheFromStorage(): void {
        if (this.config.cacheConfig.storage !== 'memory') {
            try {
                const stored = globalThis.localStorage?.getItem('api_cache') || globalThis.sessionStorage?.getItem('api_cache');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const now = Date.now();
                    for (const [key, value] of Object.entries(parsed)) {
                        if (value && typeof value === 'object' && 'expiresAt' in value && (value as {
                            expiresAt: number;
                        }).expiresAt > now) {
                            this.cache.set(key, value as {
                                data: JsonObject;
                                expiresAt: number;
                            });
                        }
                    }
                }
            }
            catch {
            }
        }
    }
    private saveCacheToStorage(): void {
        if (this.config.cacheConfig.storage !== 'memory') {
            try {
                const toStore: Record<string, {
                    data: JsonObject;
                    expiresAt: number;
                }> = {};
                for (const [key, value] of this.cache.entries()) {
                    toStore[key] = value;
                }
                const storage = this.config.cacheConfig.storage === 'localStorage' ? globalThis.localStorage : globalThis.sessionStorage;
                storage?.setItem('api_cache', JSON.stringify(toStore));
            }
            catch {
            }
        }
    }
    private getCacheKey(config: RequestConfig): string {
        const { method, url, params, data } = config;
        const paramStr = params ? JSON.stringify(params) : '';
        const dataStr = data ? JSON.stringify(data) : '';
        return `${method}:${url}:${paramStr}:${dataStr}`;
    }
    private getFromCache(key: string): JsonObject | null {
        const entry = this.cache.get(key);
        if (entry && entry.expiresAt > Date.now()) {
            return entry.data;
        }
        if (entry) {
            this.cache.delete(key);
        }
        return null;
    }
    private setCache(key: string, data: JsonObject, ttl: number): void {
        this.cache.set(key, { data, expiresAt: Date.now() + ttl });
        this.saveCacheToStorage();
    }
    private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
        let result = config;
        for (const interceptor of this.requestInterceptors) {
            result = await interceptor(result);
        }
        return result;
    }
    private async applyResponseInterceptors(response: ApiResponse<JsonObject>): Promise<ApiResponse<JsonObject>> {
        let result = response;
        for (const interceptor of this.responseInterceptors) {
            result = await interceptor(result);
        }
        return result;
    }
    private async applyErrorInterceptors(error: ApiError): Promise<never> {
        for (const interceptor of this.errorInterceptors) {
            const result = await interceptor(error);
            if (result)
                return result as never;
        }
        throw error;
    }
    private buildUrl(path: string, params?: Record<string, any>): string {
        const url = new URL(path, this.config.baseUrl);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined && value !== null && value !== '') {
                    if (Array.isArray(value)) {
                        value.forEach(v => url.searchParams.append(key, String(v)));
                    }
                    else {
                        url.searchParams.set(key, String(value));
                    }
                }
            }
        }
        return url.toString();
    }
    private async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
        const finalConfig = await this.applyRequestInterceptors(config);
        const cacheKey = this.getCacheKey(finalConfig);
        if (finalConfig.method === 'GET' && finalConfig.cache !== false) {
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                return cached as unknown as ApiResponse<T>;
            }
        }
        let attempt = 0;
        let lastError: ApiError | null = null;
        while (attempt <= this.config.retryConfig.maxRetries) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout ?? this.config.timeout);
                if (finalConfig.signal) {
                    finalConfig.signal.addEventListener('abort', () => controller.abort());
                }
                const headers: Record<string, string> = {
                    ...this.config.defaultHeaders,
                    ...finalConfig.headers,
                };
                if (finalConfig.idempotencyKey) {
                    headers['Idempotency-Key'] = finalConfig.idempotencyKey;
                }
                const fetchInit: RequestInit = {
                    method: finalConfig.method,
                    headers,
                    signal: controller.signal,
                    ...(finalConfig.data !== undefined ? { body: JSON.stringify(finalConfig.data) } : {}),
                };
                const response = await fetch(this.buildUrl(finalConfig.url, finalConfig.params), fetchInit);
                clearTimeout(timeoutId);
                const responseData = (await response.json().catch(() => ({}))) as ApiResponse<T>;
                if (!response.ok || responseData.success === false) {
                    const error: ApiError = new Error(responseData.error?.message || response.statusText || 'Request failed') as ApiError;
                    error.code = responseData.error?.code || `HTTP_${response.status}`;
                    error.status = response.status;
                    error.statusText = response.statusText;
                    error.response = responseData as unknown as ApiResponse<JsonObject>;
                    error.request = finalConfig;
                    error.isNetworkError = false;
                    error.isTimeout = false;
                    error.isCancelled = false;
                    error.fieldErrors = responseData.error?.fieldErrors;
                    throw error;
                }
                const processedResponse = await this.applyResponseInterceptors(responseData as unknown as ApiResponse<JsonObject>);
                if (finalConfig.method === 'GET' && finalConfig.cache !== false) {
                    this.setCache(cacheKey, processedResponse as unknown as JsonObject, finalConfig.cacheTtl ?? this.config.cacheConfig.defaultTtl);
                }
                return processedResponse as unknown as ApiResponse<T>;
            }
            catch (error) {
                lastError = error as ApiError;
                if (lastError.isCancelled || lastError.name === 'AbortError') {
                    throw lastError;
                }
                const shouldRetry = attempt < this.config.retryConfig.maxRetries &&
                    (this.config.retryConfig.retryCondition ? this.config.retryConfig.retryCondition(lastError) : false);
                if (!shouldRetry) {
                    break;
                }
                const delay = this.config.retryConfig.retryDelay ? this.config.retryConfig.retryDelay(attempt + 1) : 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                attempt++;
            }
        }
        await this.applyErrorInterceptors(lastError!);
        throw lastError;
    }
    async get<T = any>(url: string, config?: Omit<ApiRequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: 'GET',
            url,
            ...(config?.params !== undefined ? { params: config.params as Record<string, any> } : {}),
            ...(config?.headers !== undefined ? { headers: config.headers } : {}),
            ...(config?.signal !== undefined ? { signal: config.signal } : {}),
            ...(config?.timeout !== undefined ? { timeout: config.timeout } : {}),
            ...(config?.idempotencyKey !== undefined ? { idempotencyKey: config.idempotencyKey } : {}),
            cache: config?.headers?.['Cache-Control'] !== 'no-cache',
            ...(config?.headers?.['Cache-Ttl'] ? { cacheTtl: parseInt(config.headers['Cache-Ttl']) } : {}),
        });
    }
    async post<T = any>(url: string, data?: any, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: 'POST',
            url,
            ...(data !== undefined ? { data } : {}),
            ...(config?.params !== undefined ? { params: config.params as Record<string, any> } : {}),
            ...(config?.headers !== undefined ? { headers: config.headers } : {}),
            ...(config?.signal !== undefined ? { signal: config.signal } : {}),
            ...(config?.timeout !== undefined ? { timeout: config.timeout } : {}),
            ...(config?.idempotencyKey !== undefined ? { idempotencyKey: config.idempotencyKey } : {}),
        });
    }
    async put<T = any>(url: string, data?: any, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: 'PUT',
            url,
            ...(data !== undefined ? { data } : {}),
            ...(config?.params !== undefined ? { params: config.params as Record<string, any> } : {}),
            ...(config?.headers !== undefined ? { headers: config.headers } : {}),
            ...(config?.signal !== undefined ? { signal: config.signal } : {}),
            ...(config?.timeout !== undefined ? { timeout: config.timeout } : {}),
            ...(config?.idempotencyKey !== undefined ? { idempotencyKey: config.idempotencyKey } : {}),
        });
    }
    async patch<T = any>(url: string, data?: any, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: 'PATCH',
            url,
            ...(data !== undefined ? { data } : {}),
            ...(config?.params !== undefined ? { params: config.params as Record<string, any> } : {}),
            ...(config?.headers !== undefined ? { headers: config.headers } : {}),
            ...(config?.signal !== undefined ? { signal: config.signal } : {}),
            ...(config?.timeout !== undefined ? { timeout: config.timeout } : {}),
            ...(config?.idempotencyKey !== undefined ? { idempotencyKey: config.idempotencyKey } : {}),
        });
    }
    async delete<T = any>(url: string, config?: Omit<ApiRequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: 'DELETE',
            url,
            ...(config?.params !== undefined ? { params: config.params as Record<string, any> } : {}),
            ...(config?.headers !== undefined ? { headers: config.headers } : {}),
            ...(config?.signal !== undefined ? { signal: config.signal } : {}),
            ...(config?.timeout !== undefined ? { timeout: config.timeout } : {}),
            ...(config?.idempotencyKey !== undefined ? { idempotencyKey: config.idempotencyKey } : {}),
        });
    }
    addRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>): () => void {
        this.requestInterceptors.push(interceptor);
        return () => {
            const index = this.requestInterceptors.indexOf(interceptor);
            if (index > -1)
                this.requestInterceptors.splice(index, 1);
        };
    }
    addResponseInterceptor(interceptor: (response: ApiResponse<JsonObject>) => ApiResponse<JsonObject> | Promise<ApiResponse<JsonObject>>): () => void {
        this.responseInterceptors.push(interceptor);
        return () => {
            const index = this.responseInterceptors.indexOf(interceptor);
            if (index > -1)
                this.responseInterceptors.splice(index, 1);
        };
    }
    addErrorInterceptor(interceptor: (error: ApiError) => Promise<never> | ApiResponse<JsonObject>): () => void {
        this.errorInterceptors.push(interceptor);
        return () => {
            const index = this.errorInterceptors.indexOf(interceptor);
            if (index > -1)
                this.errorInterceptors.splice(index, 1);
        };
    }
    clearCache(pattern?: string): void {
        if (pattern) {
            const regex = new RegExp(pattern);
            for (const key of this.cache.keys()) {
                if (regex.test(key)) {
                    this.cache.delete(key);
                }
            }
        }
        else {
            this.cache.clear();
        }
        this.saveCacheToStorage();
    }
    invalidateCache(key: string): void {
        this.cache.delete(key);
        this.saveCacheToStorage();
    }
}
export function createApiClient(config: ApiClientConfig): UniversalApiClient {
    return new UniversalApiClient(config);
}
export function createApiClientFromEnv(): UniversalApiClient {
    const baseUrl = typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE_URL
        ? process.env.EXPO_PUBLIC_API_BASE_URL
        : 'http://localhost:3000/api/v1';
    return new UniversalApiClient({ baseUrl });
}

