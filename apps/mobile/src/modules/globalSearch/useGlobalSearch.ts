import { useState, useEffect, useCallback, useRef } from 'react';
import { globalSearchEngine, type SearchQuery, type SearchResponse, type SearchResult, type SearchSuggestion, type SearchEntityType, type SearchFacet, type SearchPermission } from './globalSearchEngine';

export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isSearching, setIsSearching] = useState(false);
  const [tookMs, setTookMs] = useState(0);
  const [facets, setFacets] = useState<SearchFacet[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lastQuery, setLastQuery] = useState<SearchQuery | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    unsubscribeRef.current = globalSearchEngine.onSearch((response) => {
      setResults(response.results);
      setTotal(response.total);
      setPage(response.page);
      setPageSize(response.pageSize);
      setTookMs(response.tookMs);
      setSuggestions(response.suggestions);
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, []);

  const search = useCallback(async (query: SearchQuery) => {
    setIsSearching(true);
    setLastQuery(query);
    try {
      await globalSearchEngine.search(query);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const nextPage = useCallback(async () => {
    if (!lastQuery) return;
    await search({ ...lastQuery, page: lastQuery.page! + 1 });
  }, [lastQuery, search]);

  const prevPage = useCallback(async () => {
    if (!lastQuery || lastQuery.page! <= 1) return;
    await search({ ...lastQuery, page: lastQuery.page! - 1 });
  }, [lastQuery, search]);

  const getSuggestions = useCallback(async (
    partialQuery: string,
    societyId: string,
    userId: string,
    userRole: string,
    userPermissions: SearchPermission[]
  ) => {
    return globalSearchEngine.getSuggestions(partialQuery, societyId, userId, userRole, userPermissions);
  }, []);

  return {
    results,
    total,
    page,
    pageSize,
    isSearching,
    tookMs,
    facets,
    suggestions,
    search,
    nextPage,
    prevPage,
    getSuggestions,
    hasNextPage: page * pageSize < total,
    hasPrevPage: page > 1,
  };
}

export function useSearchResults(query: SearchQuery | null) {
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    globalSearchEngine.search(query).then(res => {
      setResponse(res);
      setIsLoading(false);
    });

    unsubscribeRef.current = globalSearchEngine.onSearch((res) => {
      if (res.query === query.query) {
        setResponse(res);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [query?.query, query?.entityTypes?.join(',')]);

  return { response, isLoading };
}