export type RepositoryError = {
  code: string;
  message: string;
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

export function repositoryErrorFromUnknown(error: Error | JsonValue): RepositoryError {
  if (error instanceof Error) {
    return {
      code: 'REPOSITORY_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_REPOSITORY_ERROR',
    message: 'Unable to complete the request.',
  };
}

export async function withMockDelay(ms = 250): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
