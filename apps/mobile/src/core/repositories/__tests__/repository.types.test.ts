import { repositoryErrorFromUnknown } from '../repository.types';

describe('repository error normalization', () => {
  it('classifies transient server errors as retryable and keeps a trace identifier', () => {
    const source = Object.assign(new Error('Service is temporarily unavailable'), {
      code: 'SERVER_UNAVAILABLE',
      status: 503,
      traceId: 'trace-123',
    });

    expect(repositoryErrorFromUnknown(source)).toEqual(expect.objectContaining({
      category: 'SERVER_ERROR',
      retryable: true,
      preserveInput: true,
      traceId: 'trace-123',
    }));
  });

  it('does not retry authorization failures or suggest preserving sensitive input', () => {
    const source = Object.assign(new Error('Session expired'), { status: 401 });

    expect(repositoryErrorFromUnknown(source)).toEqual(expect.objectContaining({
      category: 'SESSION_EXPIRED',
      retryable: false,
      preserveInput: false,
    }));
  });

  it('keeps validation details for calm inline recovery', () => {
    const fieldErrors = [{ field: 'mobile', message: 'Enter a valid mobile number' }];
    const source = Object.assign(new Error('Validation failed'), { status: 422, fieldErrors });

    expect(repositoryErrorFromUnknown(source)).toEqual(expect.objectContaining({
      category: 'VALIDATION',
      retryable: false,
      preserveInput: true,
      fieldErrors,
    }));
  });

  it('normalizes structured API errors that are not Error instances', () => {
    expect(repositoryErrorFromUnknown({ code: 'RATE_LIMITED', status: 429, message: 'Try again shortly' })).toEqual(expect.objectContaining({
      category: 'RATE_LIMIT',
      retryable: true,
    }));
  });
});
