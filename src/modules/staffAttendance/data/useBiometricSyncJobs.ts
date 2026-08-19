import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../shared/hooks/useLatestValue';
import type { BiometricSyncJob } from '../../../shared/types/biometric.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useBiometricSyncJobs(filters?: Record<string, string>) {
  const [data, setData] = useState<BiometricSyncJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const filterSignature = JSON.stringify(filters);
  const filtersHandle = useLatestValue(filters, filterSignature);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.getBiometricSyncJobs(filtersHandle.valueRef.current);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [filtersHandle]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
