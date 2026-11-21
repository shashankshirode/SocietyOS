import type { RepositoryResult } from '../repositories/repository.types';
import { safeLog } from '../logging/safeLog';

export interface OperationGuardOptions {
  readonly idempotencyKey?: string;
  readonly maxRetries?: number;
  readonly backoffBaseMs?: number;
}

const inFlightOperations = new Map<string, Promise<unknown>>();
const idempotencyStore = new Map<string, { result: unknown; completedAt: number }>();

export function clearOperationStore(): void {
  inFlightOperations.clear();
  idempotencyStore.clear();
}

/**
 * Executes an operation with:
 * 1. Double-tap / concurrent in-flight deduplication (reuses the existing in-flight promise).
 * 2. Idempotency protection (returns previous successful result if idempotencyKey was already settled).
 * 3. Automatic retry for retryable repository failures up to maxRetries.
 */
export async function executeGuardedOperation<T>(
  operationKey: string,
  operation: () => Promise<RepositoryResult<T>>,
  options: OperationGuardOptions = {}
): Promise<RepositoryResult<T>> {
  const { idempotencyKey, maxRetries = 0 } = options;

  // 1. Check idempotency store for previously completed result
  if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
    safeLog.info('[OperationGuard] Returning cached idempotent result', { idempotencyKey });
    return idempotencyStore.get(idempotencyKey)!.result as RepositoryResult<T>;
  }

  // 2. Check in-flight lock to deduplicate concurrent double-taps
  const lockKey = idempotencyKey ? `idem:${idempotencyKey}` : `op:${operationKey}`;
  if (inFlightOperations.has(lockKey)) {
    safeLog.info('[OperationGuard] Deduplicating concurrent in-flight operation', { lockKey });
    return inFlightOperations.get(lockKey) as Promise<RepositoryResult<T>>;
  }

  const executionPromise = (async (): Promise<RepositoryResult<T>> => {
    let attempts = 0;
    while (true) {
      try {
        attempts++;
        const result = await operation();

        if (result.ok) {
          if (idempotencyKey) {
            idempotencyStore.set(idempotencyKey, { result, completedAt: Date.now() });
          }
          return result;
        }

        // Retry if error is marked retryable and attempts remain
        if (result.error?.retryable && attempts <= maxRetries) {
          safeLog.warn('[OperationGuard] Retrying retryable repository failure', {
            operationKey,
            attempt: attempts,
            code: result.error.code,
          });
          continue;
        }

        return result;
      } catch (thrown) {
        if (attempts <= maxRetries) {
          safeLog.warn('[OperationGuard] Retrying thrown error', {
            operationKey,
            attempt: attempts,
            error: String(thrown),
          });
          continue;
        }
        throw thrown;
      }
    }
  })();

  inFlightOperations.set(lockKey, executionPromise);

  try {
    return await executionPromise;
  } finally {
    inFlightOperations.delete(lockKey);
  }
}
