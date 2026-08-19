import type { ApiResponse } from '../core/api/api.types';

export function createApiSuccess<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    traceId: 'trace-test-001',
    timestamp: '2026-06-29T10:00:00.000Z',
  };
}

export function createApiFailure(message = 'Request failed'): ApiResponse<never> {
  return {
    success: false,
    error: {
      code: 'TEST_ERROR',
      message,
    },
    traceId: 'trace-test-001',
    timestamp: '2026-06-29T10:00:00.000Z',
  };
}
