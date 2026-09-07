import { useState, useCallback, useEffect, useRef } from 'react';
import { apiService, ApiService } from '../services/ApiService';
import type { ApiResponse } from '../contracts/api.types';
import type { PaginatedResponse } from '../contracts/api.types';

export function useApi(): ApiService {
  return apiService;
}

export function useApiService(): ApiService {
  return apiService;
}

interface UseQueryOptions<T> {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  retry?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: T | null, error: Error | null) => void;
}

interface UseQueryResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

export function useQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options: UseQueryOptions<T> = {}
): UseQueryResult<T> {
  const { 
    enabled = true, 
    refetchOnWindowFocus = false, 
    refetchInterval,
    retry = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    onSettled,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch = useCallback(async (isRetry = false) => {
    if (!enabled) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (!isRetry) {
      setIsLoading(true);
    }
    setIsFetching(true);
    setError(null);

    try {
      const result = await queryFn();
      setData(result);
      setError(null);
      retryCountRef.current = 0;
      onSuccess?.(result);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setData(null);
      
      if (retryCountRef.current < retry && !abortControllerRef.current?.signal.aborted) {
        retryCountRef.current++;
        setTimeout(() => fetch(true), retryDelay * retryCountRef.current);
        return;
      }
      
      onError?.(error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
      onSettled?.(data, error);
    }
  }, [enabled, queryFn, onSuccess, onError, onSettled, retry, retryDelay]);

  const refetch = useCallback(async () => {
    retryCountRef.current = 0;
    await fetch(false);
  }, [fetch]);

  useEffect(() => {
    if (enabled) {
      fetch();
    }

    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        if (!isLoading) fetch();
      }, refetchInterval);
    }

    if (refetchOnWindowFocus) {
      const handleFocus = () => {
        if (enabled) fetch();
      };
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [enabled, fetch, refetchInterval, refetchOnWindowFocus, isLoading]);

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess: !error && data !== null,
    isFetching,
    refetch,
  };
}

interface UseMutationOptions<TData, TVariables> {
  onMutate?: (variables: TVariables) => Promise<void> | void;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | null, error: Error | null, variables: TVariables) => void;
}

interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  data: TData | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  reset: () => void;
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationResult<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await options.onMutate?.(variables);
      const result = await mutationFn(variables);
      setData(result);
      setError(null);
      options.onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error, variables);
      throw error;
    } finally {
      setIsLoading(false);
      options.onSettled?.(data, error, variables);
    }
  }, [mutationFn, options]);

  const mutateAsync = useCallback(async (variables: TVariables): Promise<TData> => {
    return mutate(variables);
  }, [mutate]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    mutateAsync,
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess: !error && data !== null,
    reset,
  };
}

export function useInfiniteQuery<T>(
  queryKey: unknown[],
  queryFn: (pageParam: JsonObject[string]) => Promise<{ data: T[]; nextPageParam?: JsonObject[string] }>,
  options: UseQueryOptions<{ data: T[]; nextPageParam?: JsonObject[string] }> = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [nextPageParam, setNextPageParam] = useState<JsonObject[string] | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isFetchingNextRef = useRef(false);

  const fetch = useCallback(async (pageParam?: JsonObject[string], isLoadMore = false) => {
    if (!options.enabled) return;
    
    if (isLoadMore) {
      if (isFetchingNextRef.current || !hasNextPage) return;
      isFetchingNextRef.current = true;
      setIsFetching(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    let fetchResult: { data: T[]; nextPageParam?: JsonObject[string] | null } | null = null;
    let fetchError: Error | null = null;

    try {
      const result = await queryFn(pageParam ?? null);
      fetchResult = result;
      if (isLoadMore) {
        setData(prev => [...prev, ...result.data]);
      } else {
        setData(result.data);
      }
      setNextPageParam(result.nextPageParam ?? null);
      setHasNextPage(!!result.nextPageParam);
      setError(null);
      options.onSuccess?.({ data: result.data, nextPageParam: result.nextPageParam });
    } catch (err) {
      fetchError = err as Error;
      setError(fetchError);
      options.onError?.(fetchError);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
      isFetchingNextRef.current = false;
      options.onSettled?.(fetchResult, fetchError);
    }
  }, [queryFn, options]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextRef.current) {
      fetch(nextPageParam, true);
    }
  }, [fetch, hasNextPage, nextPageParam]);

  const refetch = useCallback(() => {
    setData([]);
    setNextPageParam(null);
    setHasNextPage(true);
    fetch(null, false);
  }, [fetch]);

  useEffect(() => {
    if (options.enabled) {
      fetch();
    }
  }, [fetch, options.enabled]);

  return {
    data,
    nextPageParam,
    hasNextPage,
    isLoading,
    isError: !!error,
    isSuccess: !error && data.length > 0,
    isFetching,
    isFetchingNext: isFetchingNextRef.current,
    error,
    fetchNextPage: loadMore,
    refetch,
  };
}