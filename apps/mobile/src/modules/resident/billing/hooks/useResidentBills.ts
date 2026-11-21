import * as React from 'react';
import type { RepositoryError } from '../../../../core/repositories/repository.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { billRepository, mergeUniqueBills } from '../data/billing.repository';
import type {
  BillListFilter,
  ResidentBillListItem,
  ResidentBillingSummary,
} from '../data/residentBilling.types';

const DEFAULT_PAGE_SIZE = 8;

export function useResidentBills(
  filter: BillListFilter = 'all',
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const { activeContext } = useActiveResidentHome();
  const context = React.useMemo(() => ({
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  }), [activeContext]);
  const [bills, setBills] = React.useState<ResidentBillListItem[]>([]);
  const [summary, setSummary] = React.useState<ResidentBillingSummary | null>(null);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<RepositoryError | null>(null);
  const requestVersionRef = React.useRef(0);
  const loadingMoreRef = React.useRef(false);

  const loadFirstPage = React.useCallback(async (mode: 'initial' | 'refresh') => {
    const version = requestVersionRef.current + 1;
    requestVersionRef.current = version;
    if (mode === 'initial') {
      setBills([]);
      setIsInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);
    setNextCursor(null);
    setHasMore(false);
    loadingMoreRef.current = false;
    setIsLoadingMore(false);

    const [pageResult, summaryResult] = await Promise.all([
      billRepository.getBillsPage(context, { filter, cursor: null, pageSize }),
      billRepository.getBillSummary(context),
    ]);
    if (version !== requestVersionRef.current) return;

    if (pageResult.ok) {
      setBills(mergeUniqueBills([], pageResult.data.bills));
      setNextCursor(pageResult.data.nextCursor);
      setHasMore(pageResult.data.hasMore);
    } else {
      setError(pageResult.error);
    }
    if (summaryResult.ok) {
      setSummary(summaryResult.data);
    }
    setIsInitialLoading(false);
    setIsRefreshing(false);
  }, [context, filter, pageSize]);

  React.useEffect(() => {
    void loadFirstPage('initial');
    return () => {
      requestVersionRef.current += 1;
      loadingMoreRef.current = false;
    };
  }, [loadFirstPage]);

  const loadMore = React.useCallback(async () => {
    if (!hasMore || !nextCursor || loadingMoreRef.current || isInitialLoading || isRefreshing) {
      return;
    }

    const version = requestVersionRef.current;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    const result = await billRepository.getBillsPage(context, {
      filter,
      cursor: nextCursor,
      pageSize,
    });

    if (version === requestVersionRef.current) {
      if (result.ok) {
        setBills((current) => mergeUniqueBills(current, result.data.bills));
        setNextCursor(result.data.nextCursor);
        setHasMore(result.data.hasMore);
      } else {
        setError(result.error);
      }
      setIsLoadingMore(false);
    }
    loadingMoreRef.current = false;
  }, [context, filter, hasMore, isInitialLoading, isRefreshing, nextCursor, pageSize]);

  const refresh = React.useCallback(async () => {
    await loadFirstPage('refresh');
  }, [loadFirstPage]);

  const retry = React.useCallback(async () => {
    await loadFirstPage('initial');
  }, [loadFirstPage]);

  return {
    bills,
    summary,
    isInitialLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    error,
    loadMore,
    refresh,
    retry,
    activeResidenceKey: activeContext.dataScopeKey,
  };
}

export default useResidentBills;
