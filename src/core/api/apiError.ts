import type { ApiErrorBody } from './api.types';
export class ApiClientError extends Error {
    readonly code: string;
    readonly status?: number;
    readonly fieldErrors?: ApiErrorBody['fieldErrors'];
    readonly traceId?: string;
    constructor(params: {
        code: string;
        message: string;
        status?: number;
        fieldErrors?: ApiErrorBody['fieldErrors'];
        traceId?: string;
    }) {
        super(params.message);
        this.name = 'ApiClientError';
        this.code = params.code;
        if (params.status !== undefined) {
            this.status = params.status;
        }
        this.fieldErrors = params.fieldErrors;
        if (params.traceId !== undefined) {
            this.traceId = params.traceId;
        }
    }
}
export function toApiClientError<Value>(error: Value): ApiClientError {
    if (error instanceof ApiClientError) {
        return error;
    }
    if (error instanceof Error) {
        return new ApiClientError({
            code: 'NETWORK_ERROR',
            message: error.message
        });
    }
    return new ApiClientError({
        code: 'UNKNOWN_ERROR',
        message: 'Something went wrong while processing the request.'
    });
}
