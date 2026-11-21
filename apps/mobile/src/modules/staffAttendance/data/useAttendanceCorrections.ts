import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../shared/hooks/useLatestValue';
import type { CorrectionRequest, CorrectionRequestInput } from '../../../shared/types/attendance.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useAttendanceCorrections(filters?: Record<string, string>) {
  const [data, setData] = useState<CorrectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const filterSignature = JSON.stringify(filters);
  const filtersHandle = useLatestValue(filters, filterSignature);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.getCorrectionRequests(filtersHandle.valueRef.current);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [filtersHandle]);

  const requestCorrection = async (input: CorrectionRequestInput) => {
    try {
      await staffAttendanceRepository.createCorrectionRequest(input);
      void fetch();
    } catch (e) {
      throw e instanceof Error ? e : new Error('Failed to submit correction request');
    }
  };

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch, requestCorrection };
}
