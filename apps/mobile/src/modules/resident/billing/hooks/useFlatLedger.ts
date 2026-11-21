import * as React from 'react';
import type { RepositoryError } from '../../../../core/repositories/repository.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { billRepository } from '../data/billing.repository';
import type { ResidentLedgerEntry } from '../data/residentBilling.types';

const LEDGER_PAGE_SIZE = 12;

export function useFlatLedger() {
  const { activeContext } = useActiveResidentHome();
  const context = React.useMemo(() => ({
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  }), [activeContext]);
  const [entries, setEntries] = React.useState<ResidentLedgerEntry[]>([]);
  const [totalOutstanding, setTotalOutstanding] = React.useState(0);
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<RepositoryError | null>(null);
  const versionRef = React.useRef(0);
  const loadingMoreRef = React.useRef(false);

  const loadFirstPage = React.useCallback(async () => {
    const version = versionRef.current + 1;
    versionRef.current = version;
    setIsLoading(true);
    setError(null);
    const [result, summaryResult] = await Promise.all([
      billRepository.getLedgerEntriesPage(context, {
        cursor: null,
        pageSize: LEDGER_PAGE_SIZE,
      }),
      billRepository.getBillSummary(context),
    ]);
    if (version !== versionRef.current) return;
    if (result.ok) {
      setEntries(result.data.entries);
      setCursor(result.data.nextCursor);
      setHasMore(result.data.hasMore);
    } else {
      setError(result.error);
    }
    if (summaryResult.ok) setTotalOutstanding(summaryResult.data.totalOutstanding);
    setIsLoading(false);
  }, [context]);

  React.useEffect(() => {
    void loadFirstPage();
    return () => {
      versionRef.current += 1;
    };
  }, [loadFirstPage]);

  const loadMore = React.useCallback(async () => {
    if (!hasMore || !cursor || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    const version = versionRef.current;
    const result = await billRepository.getLedgerEntriesPage(context, {
      cursor,
      pageSize: LEDGER_PAGE_SIZE,
    });
    if (version === versionRef.current && result.ok) {
      setEntries((current) => {
        const knownIds = new Set(current.map((entry) => entry.id));
        return [...current, ...result.data.entries.filter((entry) => !knownIds.has(entry.id))];
      });
      setCursor(result.data.nextCursor);
      setHasMore(result.data.hasMore);
    }
    if (version === versionRef.current) setIsLoadingMore(false);
    loadingMoreRef.current = false;
  }, [context, cursor, hasMore]);

  return {
    entries,
    totalOutstanding,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    retry: loadFirstPage,
  };
}
