import { useCallback, useEffect, useRef, useState } from 'react';

export interface FacilityBookingResource<TData> {
  readonly data: TData | null;
  readonly isLoading: boolean;
  readonly isRefreshing: boolean;
  readonly error: Error | null;
  readonly refresh: () => Promise<void>;
}

export function useFacilityBookingResource<TData>(
  loader: () => Promise<TData>,
  subscribe: ((listener: () => void) => () => void) | null = null,
): FacilityBookingResource<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const requestSequence = useRef(0);

  const load = useCallback(async (refreshing: boolean) => {
    const requestId = requestSequence.current + 1;
    requestSequence.current = requestId;
    if (refreshing) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const result = await loader();
      if (requestSequence.current === requestId) {
        setData(result);
        setError(null);
      }
    } catch (caught) {
      if (requestSequence.current === requestId) {
        setError(caught instanceof Error ? caught : new Error('The facility request failed.'));
      }
    } finally {
      if (requestSequence.current === requestId) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [loader]);

  useEffect(() => {
    void load(false);
    const unsubscribe = subscribe?.(() => void load(true));
    return () => {
      requestSequence.current += 1;
      unsubscribe?.();
    };
  }, [load, subscribe]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refresh: () => load(true),
  };
}
