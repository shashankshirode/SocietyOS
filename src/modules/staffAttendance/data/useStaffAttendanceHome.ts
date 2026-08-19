import { useState, useEffect, useCallback } from 'react';
import type { StaffAttendanceHomeSummary } from '../../../shared/types/staff.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useStaffAttendanceHome() {
  const [data, setData] = useState<StaffAttendanceHomeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.getStaffAttendanceHome();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
