import { useState, useEffect, useCallback, useRef } from 'react';
import { offlineSyncEngine, type OfflineQueueItem } from './offlineSyncEngine';
import type { ConflictResolution, ConflictType } from './offlineSync.types';
import type { JsonObject } from '../../../core/api/api.types';

export function useOfflineSync() {
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
  const [conflicts, setConflicts] = useState<OfflineQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{ success: number; conflicts: number; failed: number } | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setQueue(offlineSyncEngine.getQueue());
    setConflicts(offlineSyncEngine.getPendingConflicts());

    unsubscribeRef.current = offlineSyncEngine.onUpdate((item) => {
      setQueue(prev => {
        const idx = prev.findIndex(i => i.clientId === item.clientId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = item;
          return next;
        }
        return [...prev, item];
      });
      setConflicts(offlineSyncEngine.getPendingConflicts());
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, []);

  const captureEntry = useCallback(async (
    entry: Omit<OfflineQueueItem, 'id' | 'clientId' | 'createdAt' | 'createdAtLocal' | 'deviceTimezone' | 'retryCount' | 'maxRetries' | 'syncStatus' | 'idempotencyKey' | 'conflict' | 'errorMessage' | 'syncedAt' | 'serverResponse'>
  ) => {
    return offlineSyncEngine.captureEntry(entry);
  }, []);

  const sync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await offlineSyncEngine.sync();
      setLastSyncResult(result);
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const mockSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await offlineSyncEngine.mockSync();
      setLastSyncResult(result);
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const resolveConflict = useCallback(async (
    clientId: string,
    resolution: ConflictResolution,
    mergedPayload?: JsonObject
  ) => {
    return offlineSyncEngine.resolveConflict(clientId, resolution, mergedPayload);
  }, []);

  const startAutoSync = useCallback((intervalMs?: number) => {
    offlineSyncEngine.startAutoSync(intervalMs);
  }, []);

  const stopAutoSync = useCallback(() => {
    offlineSyncEngine.stopAutoSync();
  }, []);

  return {
    queue,
    conflicts,
    isSyncing,
    lastSyncResult,
    captureEntry,
    sync,
    mockSync,
    resolveConflict,
    startAutoSync,
    stopAutoSync,
  };
}

export function useOfflineQueueItem(clientId: string | null) {
  const [item, setItem] = useState<OfflineQueueItem | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!clientId) return;

    unsubscribeRef.current = offlineSyncEngine.onUpdate((updatedItem) => {
      if (updatedItem.clientId === clientId) {
        setItem(updatedItem);
      }
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [clientId]);

  return item;
}