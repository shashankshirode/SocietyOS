import { useState, useCallback } from 'react';
import { watchlistService } from '../services/watchlistService';
import type { WatchlistEntry, CreateWatchlistEntryPayload } from '../../../shared/types/visitorPhase8.types';

export function useWatchlist(societyId: string) {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const entries = await watchlistService.getAllEntries(societyId);
      setEntries(entries);
    } catch (error) {
      setError('Failed to fetch watchlist entries');
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  const createEntry = useCallback(async (payload: any) => {
    try {
      const entry = await watchlistService.createEntry(payload, 'current-user', 'SECURITY_SUPERVISOR', 'society-123');
      return entry;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateEntry = useCallback(async (entryId: string, updates: Partial<any>) => {
    try {
      const entry = await watchlistService.updateEntry(entryId, updates);
      return entry;
    } catch (error) {
      throw error;
    }
  }, []);

  const revokeEntry = useCallback(async (entryId: string, reason: string) => {
    try {
      const entry = await watchlistService.revokeEntry(entryId, 'current-user', reason);
      return entry;
    } catch (error) {
      throw error;
    }
  }, []);

  const checkWatchlist = useCallback(async (visitorPhone: string, visitorId?: string) => {
    try {
      const result = await watchlistService.checkWatchlist(visitorPhone, visitorId, 'society-123');
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const getEntriesByReason = useCallback(async (reason: string) => {
    try {
      const entries = await watchlistService.getEntriesByReason('society-123', reason);
      return entries;
    } catch (error) {
      throw error;
    }
  }, []);

  const getEntriesBySeverity = useCallback(async (severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => {
    try {
      const entries = await watchlistService.getEntriesBySeverity('society-123', severity);
      return entries;
    } catch (error) {
      throw error;
    }
  }, []);

  const getStats = useCallback(async () => {
    try {
      const stats = await watchlistService.getStats('society-123');
      return stats;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    entries,
    isLoading,
    error,
    fetchEntries,
    createEntry,
    updateEntry,
    revokeEntry,
    checkWatchlist,
    getEntriesByReason,
    getEntriesBySeverity,
    getStats,
  };
}