import type { RepositoryResult, RepositoryError } from '../../../core/repositories/repository.types';

export class FacilityOpsRepositoryException extends Error {
  public readonly repositoryError: RepositoryError;

  constructor(repositoryError: RepositoryError) {
    super(repositoryError.message);
    this.name = 'FacilityOpsRepositoryException';
    this.repositoryError = repositoryError;
  }
}

export function unwrapResult<T>(result: RepositoryResult<T>): T {
  if (result.ok) {
    return result.data;
  }
  throw new FacilityOpsRepositoryException(result.error);
}

export function unwrapResultOrNull<T>(result: RepositoryResult<T | null>): T | null {
  if (result.ok) {
    return result.data;
  }
  if (result.error.code === 'NOT_FOUND') {
    return null;
  }
  throw new FacilityOpsRepositoryException(result.error);
}

export async function unwrapAsync<T>(promise: Promise<RepositoryResult<T>>): Promise<T> {
  const result = await promise;
  return unwrapResult(result);
}

export async function unwrapAsyncOrNull<T>(promise: Promise<RepositoryResult<T | null>>): Promise<T | null> {
  const result = await promise;
  return unwrapResultOrNull(result);
}