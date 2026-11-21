import { useState, useEffect, useCallback } from 'react';
import type { DomesticHelp } from '../../../shared/types/domesticHelp.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useDomesticHelpDetail(domesticHelpId: string) {
  const [data, setData] = useState<DomesticHelp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!domesticHelpId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.getDomesticHelpDetail(domesticHelpId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [domesticHelpId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
