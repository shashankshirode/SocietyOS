import {
  setFaultProfile,
  resetFaultProfile,
  getFaultProfile,
  executeWithFaultSimulation,
} from '../faultProfile';
import type { RepositoryError } from '../../repositories/repository.types';

describe('Fault Injection Infrastructure', () => {
  afterEach(() => {
    resetFaultProfile();
  });

  it('executes normally when profile is NORMAL', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const result = await executeWithFaultSimulation('test-op', fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('injects OFFLINE failure when scenario is OFFLINE', async () => {
    setFaultProfile({ scenario: 'OFFLINE' });
    const fn = jest.fn().mockResolvedValue('success');

    await expect(executeWithFaultSimulation('test-op', fn)).rejects.toMatchObject({
      code: 'NETWORK_OFFLINE',
      category: 'OFFLINE',
      retryable: true,
    } as Partial<RepositoryError>);

    expect(fn).not.toHaveBeenCalled();
  });

  it('injects TIMEOUT failure when scenario is TIMEOUT', async () => {
    setFaultProfile({ scenario: 'TIMEOUT' });
    const fn = jest.fn().mockResolvedValue('success');

    await expect(executeWithFaultSimulation('test-op', fn)).rejects.toMatchObject({
      code: 'REQUEST_TIMEOUT',
      category: 'TIMEOUT',
      retryable: true,
    } as Partial<RepositoryError>);

    expect(fn).not.toHaveBeenCalled();
  });

  it('supports custom error codes and messages', async () => {
    setFaultProfile({
      scenario: 'SERVER_ERROR',
      forcedErrorCode: 'GATEWAY_502',
      forcedErrorMessage: 'Bad gateway upstream',
    });

    await expect(executeWithFaultSimulation('test-op', async () => 'ok')).rejects.toMatchObject({
      code: 'GATEWAY_502',
      message: 'Bad gateway upstream',
      category: 'SERVER_ERROR',
    });
  });
});
