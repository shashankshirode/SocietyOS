import {
  executeGuardedOperation,
  clearOperationStore,
} from '../operationGuard';
import {
  repositorySuccess,
  repositoryFailure,
  type RepositoryResult,
} from '../../repositories/repository.types';

describe('OperationGuard', () => {
  beforeEach(() => {
    clearOperationStore();
  });

  it('deduplicates simultaneous concurrent double-tap invocations', async () => {
    let callCount = 0;
    const slowOperation = async (): Promise<RepositoryResult<string>> => {
      callCount++;
      await new Promise((r) => setTimeout(r, 20));
      return repositorySuccess('done');
    };

    // Simulate two simultaneous presses
    const [res1, res2] = await Promise.all([
      executeGuardedOperation('test-btn', slowOperation),
      executeGuardedOperation('test-btn', slowOperation),
    ]);

    expect(res1).toEqual(repositorySuccess('done'));
    expect(res2).toEqual(repositorySuccess('done'));
    // The underlying operation should only have executed once
    expect(callCount).toBe(1);
  });

  it('returns cached result when the same idempotency key is submitted subsequently', async () => {
    let callCount = 0;
    const op = async (): Promise<RepositoryResult<{ id: string }>> => {
      callCount++;
      return repositorySuccess({ id: `tx-${callCount}` });
    };

    const first = await executeGuardedOperation('pay-op', op, { idempotencyKey: 'idem-key-123' });
    expect(first).toEqual(repositorySuccess({ id: 'tx-1' }));
    expect(callCount).toBe(1);

    const second = await executeGuardedOperation('pay-op', op, { idempotencyKey: 'idem-key-123' });
    expect(second).toEqual(repositorySuccess({ id: 'tx-1' }));
    // Operation not invoked a second time
    expect(callCount).toBe(1);
  });

  it('retries when repository failure is retryable', async () => {
    let attempts = 0;
    const flakyOp = async (): Promise<RepositoryResult<string>> => {
      attempts++;
      if (attempts < 3) {
        return repositoryFailure({
          code: 'TIMEOUT',
          message: 'Timed out',
          retryable: true,
        });
      }
      return repositorySuccess('recovered');
    };

    const res = await executeGuardedOperation('retry-op', flakyOp, { maxRetries: 3 });
    expect(res).toEqual(repositorySuccess('recovered'));
    expect(attempts).toBe(3);
  });

  it('does not retry when repository failure is not retryable', async () => {
    let attempts = 0;
    const fatalOp = async (): Promise<RepositoryResult<string>> => {
      attempts++;
      return repositoryFailure({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        retryable: false,
      });
    };

    const res = await executeGuardedOperation('fatal-op', fatalOp, { maxRetries: 3 });
    expect(res.ok).toBe(false);
    expect(attempts).toBe(1);
  });
});
