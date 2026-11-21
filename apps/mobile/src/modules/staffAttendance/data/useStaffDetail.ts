import { useState, useEffect, useCallback } from 'react';
import type { StaffProfile } from '../../../shared/types/staff.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useStaffDetail(staffId: string) {
  const [data, setData] = useState<StaffProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!staffId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.getStaffDetail(staffId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [staffId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
