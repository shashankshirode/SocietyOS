import { useState, useEffect, useCallback } from 'react';
import type { AdminAuditLog } from '../../../shared/types/admin.types';
import { adminRepository } from './admin.repository';

export function useAdminAuditLogs() {
  const [data, setData] = useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setData(await adminRepository.getAuditLogs()); }
    catch (e) { setError(e instanceof Error ? e : new Error('Unknown error')); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { void fetch(); }, [fetch]);
  return { data, isLoading, error, refetch: fetch };
}
