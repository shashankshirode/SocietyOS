import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../shared/hooks/useLatestValue';
import type { AdminComplaint } from '../../../shared/types/admin.types';
import { adminRepository } from './admin.repository';

export function useAdminComplaints(filters?: Record<string, string>) {
  const [data, setData] = useState<AdminComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const filterSignature = JSON.stringify(filters);
  const filtersHandle = useLatestValue(filters, filterSignature);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setData(await adminRepository.getComplaints(filtersHandle.valueRef.current)); }
    catch (e) { setError(e instanceof Error ? e : new Error('Unknown error')); }
    finally { setIsLoading(false); }
  }, [filtersHandle]);

  useEffect(() => { void fetch(); }, [fetch]);
  return { data, isLoading, error, refetch: fetch };
}
