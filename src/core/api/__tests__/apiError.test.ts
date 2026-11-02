import {
  toApiClientError,
  AuthenticationExpiredError,
  PermissionDeniedError,
  NotFoundError,
  ConflictError,
  RequestValidationError,
  RateLimitedError,
  NetworkTimeoutError,
  NetworkUnavailableError,
  ServiceUnavailableError,
} from '../apiError';

describe('API Error Normalization', () => {
  it('instantiates specific HTTP error subclasses with correct codes and statuses', () => {
    const authErr = new AuthenticationExpiredError();
    expect(authErr.status).toBe(401);
    expect(authErr.code).toBe('SESSION_EXPIRED');

    const permErr = new PermissionDeniedError();
    expect(permErr.status).toBe(403);
    expect(permErr.code).toBe('FORBIDDEN');

    const notFoundErr = new NotFoundError();
    expect(notFoundErr.status).toBe(404);
    expect(notFoundErr.code).toBe('NOT_FOUND');

    const conflictErr = new ConflictError();
    expect(conflictErr.status).toBe(409);
    expect(conflictErr.code).toBe('CONFLICT');

    const validationErr = new RequestValidationError('Invalid data', [{ field: 'name', message: 'Required' }]);
    expect(validationErr.status).toBe(422);
    expect(validationErr.code).toBe('VALIDATION_ERROR');
    expect(validationErr.fieldErrors).toHaveLength(1);

    const rateLimitErr = new RateLimitedError('Too many', 30);
    expect(rateLimitErr.status).toBe(429);
    expect(rateLimitErr.retryAfterSeconds).toBe(30);

    const timeoutErr = new NetworkTimeoutError();
    expect(timeoutErr.code).toBe('TIMEOUT');

    const offlineErr = new NetworkUnavailableError();
    expect(offlineErr.code).toBe('OFFLINE');

    const serverErr = new ServiceUnavailableError('Server down', 503);
    expect(serverErr.status).toBe(503);
    expect(serverErr.code).toBe('SERVER_ERROR');
  });

  it('normalizes JS Error instances into appropriate transport errors', () => {
    const abortErr = new Error('The operation was aborted');
    abortErr.name = 'AbortError';
    const normalizedTimeout = toApiClientError(abortErr);
    expect(normalizedTimeout).toBeInstanceOf(NetworkTimeoutError);

    const networkErr = new Error('Network request failed');
    const normalizedOffline = toApiClientError(networkErr);
    expect(normalizedOffline).toBeInstanceOf(NetworkUnavailableError);
  });
});
