export type RepositoryErrorCategory =
  | 'OFFLINE'
  | 'TIMEOUT'
  | 'SESSION_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'RATE_LIMIT'
  | 'INTEGRATION_UNAVAILABLE'
  | 'PAYMENT_FAILED'
  | 'UPLOAD_FAILED'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export type RepositoryError = {
  code: string;
  message: string;
  category?: RepositoryErrorCategory;
  retryable?: boolean;
  preserveInput?: boolean;
  traceId?: string;
  fieldErrors?: {
    field: string;
    message: string;
  }[];
};

export type RepositoryResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: RepositoryError;
    };

export type RepositoryMutationResult<T> = RepositoryResult<T>;

export function repositorySuccess<T>(data: T): RepositoryResult<T> {
  return { ok: true, data };
}

export function repositoryFailure(error: RepositoryError): RepositoryResult<never> {
  return { ok: false, error };
}

function categoryFromCode(code: string, status?: number, message = ''): RepositoryErrorCategory {
  const normalized = code.toUpperCase();
  if (normalized.includes('PAYMENT')) return 'PAYMENT_FAILED';
  if (normalized.includes('UPLOAD')) return 'UPLOAD_FAILED';
  if (normalized.includes('INTEGRATION')) return 'INTEGRATION_UNAVAILABLE';
  if (normalized.includes('TIMEOUT') || normalized.includes('ABORT') || /timed?\s*out|aborted/i.test(message)) return 'TIMEOUT';
  if (normalized.includes('NETWORK') || normalized.includes('OFFLINE')) return 'OFFLINE';
  if (status === 401 || normalized.includes('UNAUTHORIZED') || normalized.includes('SESSION')) return 'SESSION_EXPIRED';
  if (status === 403 || normalized.includes('FORBIDDEN')) return 'FORBIDDEN';
  if (status === 404 || normalized.includes('NOT_FOUND')) return 'NOT_FOUND';
  if (status === 409 || normalized.includes('CONFLICT') || normalized.includes('DUPLICATE')) return 'CONFLICT';
  if (status === 422 || normalized.includes('VALIDATION')) return 'VALIDATION';
  if (status === 429 || normalized.includes('RATE_LIMIT')) return 'RATE_LIMIT';
  if ((status !== undefined && status >= 500) || normalized.includes('SERVER')) return 'SERVER_ERROR';
  return 'UNKNOWN';
}

function isRetryableCategory(category: RepositoryErrorCategory): boolean {
  return category === 'OFFLINE'
    || category === 'TIMEOUT'
    || category === 'RATE_LIMIT'
    || category === 'INTEGRATION_UNAVAILABLE'
    || category === 'SERVER_ERROR'
    || category === 'UNKNOWN';
}

export function repositoryErrorFromUnknown(error: Error | JsonValue): RepositoryError {
  if (error instanceof Error) {
    const candidate = error as Error & {
      code?: string;
      status?: number;
      fieldErrors?: { field: string; message: string }[];
      traceId?: string;
    };
    const code = candidate.code ?? 'REPOSITORY_ERROR';
    const category = categoryFromCode(code, candidate.status, candidate.message);
    return {
      code,
      message: candidate.message,
      category,
      retryable: isRetryableCategory(category),
      preserveInput: category !== 'SESSION_EXPIRED' && category !== 'FORBIDDEN',
      ...(candidate.fieldErrors ? { fieldErrors: candidate.fieldErrors } : {}),
      ...(candidate.traceId ? { traceId: candidate.traceId } : {}),
    };
  }

  if (error && typeof error === 'object' && !Array.isArray(error)) {
    const candidate = error as JsonObject;
    const code = typeof candidate.code === 'string' ? candidate.code : 'REPOSITORY_ERROR';
    const message = typeof candidate.message === 'string' ? candidate.message : 'Unable to complete the request.';
    const status = typeof candidate.status === 'number' ? candidate.status : undefined;
    const category = categoryFromCode(code, status, message);
    const fieldErrors = Array.isArray(candidate.fieldErrors)
      ? candidate.fieldErrors.filter((item): item is { field: string; message: string } => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
          const fieldError = item as JsonObject;
          return typeof fieldError.field === 'string' && typeof fieldError.message === 'string';
        })
      : undefined;
    return {
      code,
      message,
      category,
      retryable: isRetryableCategory(category),
      preserveInput: category !== 'SESSION_EXPIRED' && category !== 'FORBIDDEN',
      ...(fieldErrors?.length ? { fieldErrors } : {}),
      ...(typeof candidate.traceId === 'string' ? { traceId: candidate.traceId } : {}),
    };
  }

  return {
    code: 'UNKNOWN_REPOSITORY_ERROR',
    message: 'Unable to complete the request.',
    category: 'UNKNOWN',
    retryable: true,
    preserveInput: true,
  };
}

export async function withMockDelay(ms = 250): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
