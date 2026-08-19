import { useState, useEffect, useCallback } from 'react';
import type { AttendanceSettings } from '../../../shared/types/biometric.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useAttendanceSettings() {
  const [data, setData] = useState<AttendanceSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.getAttendanceSettings();
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
