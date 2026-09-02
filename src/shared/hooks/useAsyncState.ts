import { useCallback, useEffect, useState } from 'react';
import type { DependencyList } from 'react';
import { useLatestValue } from './useLatestValue';
import { AsyncStatus } from '../../core/async/AsyncState';

export type AsyncState<TData, TError = Error> = {
  data: TData | null;
  isLoading: boolean;
  status: AsyncStatus;
  error: TError | null;
  reload: () => Promise<void>;
};

export function useAsyncState<TData, TError = Error>(
  loader: () => Promise<TData>,
  dependencies: DependencyList = []
): AsyncState<TData, TError> {
  const [data, setData] = useState<TData | null>(null);
  const [status, setStatus] = useState<AsyncStatus>(AsyncStatus.INITIAL_LOADING);
  const [error, setError] = useState<TError | null>(null);
  const dependencySignature = JSON.stringify(dependencies);
  const loaderHandle = useLatestValue(loader, dependencySignature);

  const reload = useCallback(async () => {
    setStatus((currentStatus) => currentStatus === AsyncStatus.SUCCESS || currentStatus === AsyncStatus.ERROR
      ? AsyncStatus.REFRESHING
      : AsyncStatus.INITIAL_LOADING);
    try {
      const nextData = await loaderHandle.valueRef.current();
      setData(nextData);
      setError(null);
      setStatus(AsyncStatus.SUCCESS);
    } catch (caughtError) {
      setError(caughtError as TError);
      setStatus(AsyncStatus.ERROR);
    } finally {
    }
  }, [loaderHandle]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    data,
    isLoading: status === AsyncStatus.INITIAL_LOADING || status === AsyncStatus.REFRESHING,
    status,
    error,
    reload,
  };
}
