import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../shared/hooks/useLatestValue';
import type { StaffMonthlyAttendance } from '../../../shared/types/attendance.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useStaffAttendanceDetail(staffId: string, filters?: Record<string, string>) {
  const [data, setData] = useState<StaffMonthlyAttendance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const filterSignature = JSON.stringify(filters);
  const filtersHandle = useLatestValue(filters, filterSignature);

  const fetch = useCallback(async () => {
    if (!staffId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.getStaffAttendanceDetail(staffId, filtersHandle.valueRef.current);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [staffId, filtersHandle]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
