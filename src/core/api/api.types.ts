import type { Absent } from "../../shared/types/absence.types";
export type FieldError = {
    field: string;
    message: string;
};
export type ApiErrorBody = {
    code: string;
    message: string;
    details?: string;
    fieldErrors?: FieldError[];
};
export type ApiMeta = {
    page?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
};
export type ApiSuccessResponse<T> = {
    success: true;
    data: T;
    meta?: ApiMeta;
    traceId: string;
    timestamp: string;
};
export type ApiFailureResponse = {
    success: false;
    error: ApiErrorBody;
    traceId: string;
    timestamp: string;
};
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;
export type PageRequest = {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
};
export type SearchRequest = PageRequest & {
    search?: string;
    filters?: Record<string, string | number | boolean | Absent>;
};
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = {
    [key: string]: JsonValue | Absent;
};
