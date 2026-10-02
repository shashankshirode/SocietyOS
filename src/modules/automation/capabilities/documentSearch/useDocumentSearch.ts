import { useState } from 'react';
import { documentSearchService } from './documentSearchService';
import type { DocumentSearchRequest, DocumentSearchResult } from './documentSearch.types';

export function useDocumentSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [lastResult, setLastResult] = useState<DocumentSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async (
    request: DocumentSearchRequest,
    userRole: string
  ): Promise<DocumentSearchResult | null> => {
    setIsSearching(true);
    setError(null);

    try {
      const result = await documentSearchService.searchDocuments(request, userRole);
      setLastResult(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  const clearResult = () => {
    setLastResult(null);
    setError(null);
  };

  return {
    search,
    isSearching,
    lastResult,
    error,
    clearResult,
  };
}