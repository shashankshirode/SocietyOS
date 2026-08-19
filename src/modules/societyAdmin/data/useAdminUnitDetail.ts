import { useState, useEffect, useCallback } from 'react';
import type { AdminUnitDetail } from '../../../shared/types/admin.types';
import { adminRepository } from './admin.repository';

export function useAdminUnitDetail(unitId: string) {
  const [data, setData] = useState<AdminUnitDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setData(await adminRepository.getUnitDetail(unitId)); }
    catch (e) { setError(e instanceof Error ? e : new Error('Unknown error')); }
    finally { setIsLoading(false); }
  }, [unitId]);

  useEffect(() => { void fetch(); }, [fetch]);
  return { data, isLoading, error, refetch: fetch };
}
