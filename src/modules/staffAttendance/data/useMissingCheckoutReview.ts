import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../shared/hooks/useLatestValue';
import type { MissingCheckoutRecord } from '../../../shared/types/biometric.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useMissingCheckoutReview(filters?: Record<string, string>) {
  const [data, setData] = useState<MissingCheckoutRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const filterSignature = JSON.stringify(filters);
  const filtersHandle = useLatestValue(filters, filterSignature);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.getMissingCheckout(filtersHandle.valueRef.current);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [filtersHandle]);

  const createCorrection = async (missingCheckoutId: string, requestedCorrection: string, reason: string) => {
    try {
      await staffAttendanceRepository.createMissingCheckoutCorrection(missingCheckoutId, { requestedCorrection, reason });
      void fetch();
    } catch (e) {
      throw e instanceof Error ? e : new Error('Failed to submit correction');
    }
  };

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch, createCorrection };
}
