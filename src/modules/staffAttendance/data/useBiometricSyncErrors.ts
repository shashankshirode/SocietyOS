import { useState, useEffect, useCallback } from 'react';
import type { BiometricSyncError } from '../../../shared/types/biometric.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useBiometricSyncErrors(syncJobId: string) {
  const [data, setData] = useState<BiometricSyncError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!syncJobId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.getBiometricSyncErrors(syncJobId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [syncJobId]);

  const resolve = async (errorId: string, note: string) => {
    try {
      await staffAttendanceRepository.resolveSyncError(errorId, { resolutionNote: note, action: 'RESOLVE' });
      void fetch();
    } catch (e) {
      throw e instanceof Error ? e : new Error('Failed to resolve error');
    }
  };

  const ignore = async (errorId: string, note: string) => {
    try {
      await staffAttendanceRepository.ignoreSyncError(errorId, { resolutionNote: note, action: 'IGNORE' });
      void fetch();
    } catch (e) {
      throw e instanceof Error ? e : new Error('Failed to ignore error');
    }
  };

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch, resolve, ignore };
}
