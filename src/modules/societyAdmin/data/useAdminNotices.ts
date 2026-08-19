import { useState, useEffect, useCallback } from 'react';
import type { AdminNotice } from '../../../shared/types/admin.types';
import { adminRepository } from './admin.repository';

export function useAdminNotices() {
  const [data, setData] = useState<AdminNotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setData(await adminRepository.getNotices()); }
    catch (e) { setError(e instanceof Error ? e : new Error('Unknown error')); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { void fetch(); }, [fetch]);
  return { data, isLoading, error, refetch: fetch };
}
