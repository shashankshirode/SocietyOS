import { useState, useEffect, useCallback } from 'react';
import type { AdminApproval } from '../../../shared/types/admin.types';
import { adminRepository } from './admin.repository';

export function usePendingApprovals() {
  const [data, setData] = useState<AdminApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setData(await adminRepository.getApprovals({ status: 'PENDING,UNDER_REVIEW,MORE_INFO_REQUIRED' })); }
    catch (e) { setError(e instanceof Error ? e : new Error('Unknown error')); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { void fetch(); }, [fetch]);
  return { data, isLoading, error, refetch: fetch };
}
