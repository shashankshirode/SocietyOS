import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../shared/hooks/useLatestValue';
import type { ShiftDefinition } from '../../../shared/types/staff.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useShifts(filters?: Record<string, string>) {
  const [data, setData] = useState<ShiftDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const filterSignature = JSON.stringify(filters);
  const filtersHandle = useLatestValue(filters, filterSignature);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.getShifts(filtersHandle.valueRef.current);
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
