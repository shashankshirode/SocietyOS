import { useCallback, useEffect, useState } from 'react';
import type { DependencyList } from 'react';
import { useLatestValue } from './useLatestValue';

export type AsyncState<TData, TError = Error> = {
  data: TData | null;
  isLoading: boolean;
  error: TError | null;
  reload: () => Promise<void>;
};

export function useAsyncState<TData, TError = Error>(
  loader: () => Promise<TData>,
  dependencies: DependencyList = []
): AsyncState<TData, TError> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<TError | null>(null);
  const dependencySignature = JSON.stringify(dependencies);
  const loaderHandle = useLatestValue(loader, dependencySignature);

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextData = await loaderHandle.valueRef.current();
      setData(nextData);
      setError(null);
    } catch (caughtError) {
      setError(caughtError as TError);
    } finally {
      setIsLoading(false);
    }
  }, [loaderHandle]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}
