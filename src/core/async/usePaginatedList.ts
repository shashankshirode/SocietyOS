import { useState, useCallback, useRef } from 'react';

export type PageInfo = {
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type PaginatedResult<TItem> = {
  items: TItem[];
  pageInfo: PageInfo;
};

export function usePaginatedList<TItem extends { id: string }>(
  fetchPage: (cursor: string | null) => Promise<PaginatedResult<TItem>>,
  initialItems: TItem[] = []
) {
  const [items, setItems] = useState<TItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const initialRequestInFlight = useRef(false);
  const nextPageRequestInFlight = useRef(false);
  const refreshRequestInFlight = useRef(false);

  const loadInitial = useCallback(async () => {
    if (initialRequestInFlight.current) return;
    initialRequestInFlight.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchPage(null);
      setItems(result.items);
      setNextCursor(result.pageInfo.nextCursor);
      setHasNextPage(result.pageInfo.hasNextPage);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      initialRequestInFlight.current = false;
      setIsLoading(false);
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (initialRequestInFlight.current || nextPageRequestInFlight.current || !hasNextPage || !nextCursor) return;
    nextPageRequestInFlight.current = true;
    setIsLoadingMore(true);
    try {
      const result = await fetchPage(nextCursor);
      setItems((prev) => {
        const seen = new Set(prev.map((x) => x.id));
        const newItems = result.items.filter((x) => !seen.has(x.id));
        return [...prev, ...newItems];
      });
      setNextCursor(result.pageInfo.nextCursor);
      setHasNextPage(result.pageInfo.hasNextPage);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      nextPageRequestInFlight.current = false;
      setIsLoadingMore(false);
    }
  }, [fetchPage, hasNextPage, nextCursor]);

  const refresh = useCallback(async () => {
    if (refreshRequestInFlight.current) return;
    refreshRequestInFlight.current = true;
    setIsRefreshing(true);
    setError(null);
    try {
      const result = await fetchPage(null);
      setItems(result.items);
      setNextCursor(result.pageInfo.nextCursor);
      setHasNextPage(result.pageInfo.hasNextPage);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      refreshRequestInFlight.current = false;
      setIsRefreshing(false);
    }
  }, [fetchPage]);

  return {
    items,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasNextPage,
    loadInitial,
    loadMore,
    refresh,
  };
}
