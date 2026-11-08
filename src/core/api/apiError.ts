import type { ApiErrorBody } from './api.types';
export { ApiContractError } from './decoders';

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

export class AuthenticationExpiredError extends ApiClientError {
  constructor(message = 'Session has expired. Please authenticate again.', traceId?: string) {
    super({
      code: 'SESSION_EXPIRED',
      status: 401,
      message,
      ...(traceId !== undefined ? { traceId } : {}),
    });
    this.name = 'AuthenticationExpiredError';
  }
}

export class PermissionDeniedError extends ApiClientError {
  constructor(message = 'You do not have permission to perform this action.', traceId?: string) {
    super({
      code: 'FORBIDDEN',
      status: 403,
      message,
      ...(traceId !== undefined ? { traceId } : {}),
    });
    this.name = 'PermissionDeniedError';
  }
}

export class NotFoundError extends ApiClientError {
  constructor(message = 'The requested resource was not found.', traceId?: string) {
    super({
      code: 'NOT_FOUND',
      status: 404,
      message,
      ...(traceId !== undefined ? { traceId } : {}),
    });
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiClientError {
  constructor(message = 'A conflict occurred with the current state of the resource.', traceId?: string) {
    super({
      code: 'CONFLICT',
      status: 409,
      message,
      ...(traceId !== undefined ? { traceId } : {}),
    });
    this.name = 'ConflictError';
  }
}

export class RequestValidationError extends ApiClientError {
  constructor(message: string, fieldErrors?: ApiErrorBody['fieldErrors'], traceId?: string) {
    super({
      code: 'VALIDATION_ERROR',
      status: 422,
      message,
      ...(fieldErrors !== undefined ? { fieldErrors } : {}),
      ...(traceId !== undefined ? { traceId } : {}),
    });
    this.name = 'RequestValidationError';
  }
}

export class RateLimitedError extends ApiClientError {
  readonly retryAfterSeconds?: number;
  constructor(message = 'Too many requests. Please try again later.', retryAfterSeconds?: number, traceId?: string) {
    super({
      code: 'RATE_LIMIT',
      status: 429,
      message,
      ...(traceId !== undefined ? { traceId } : {}),
    });
    this.name = 'RateLimitedError';
    if (retryAfterSeconds !== undefined) {
      this.retryAfterSeconds = retryAfterSeconds;
    }
  }
}

export class NetworkTimeoutError extends ApiClientError {
  constructor(message = 'Request timed out. Check your connection and try again.') {
    super({ code: 'TIMEOUT', message });
    this.name = 'NetworkTimeoutError';
  }
}

export class NetworkUnavailableError extends ApiClientError {
  constructor(message = 'Network connection unavailable.') {
    super({ code: 'OFFLINE', message });
    this.name = 'NetworkUnavailableError';
  }
}

export class ServiceUnavailableError extends ApiClientError {
  constructor(message = 'Service temporarily unavailable. Please try again shortly.', status = 503, traceId?: string) {
    super({
      code: 'SERVER_ERROR',
      ...(status !== undefined ? { status } : {}),
      message,
      ...(traceId !== undefined ? { traceId } : {}),
    });
    this.name = 'ServiceUnavailableError';
  }
}

export function toApiClientError<Value>(error: Value): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('abort') || msg.includes('timeout') || error.name === 'AbortError') {
      return new NetworkTimeoutError();
    }
    if (msg.includes('network') || msg.includes('offline') || msg.includes('failed to fetch')) {
      return new NetworkUnavailableError();
    }
    return new ApiClientError({
      code: 'NETWORK_ERROR',
      message: error.message,
    });
  }
  return new ApiClientError({
    code: 'UNKNOWN_ERROR',
    message: 'Something went wrong while processing the request.',
  });
}
