import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../shared/hooks/useLatestValue';
import type { DuplicatePunchCandidate } from '../../../shared/types/biometric.types';
import { staffAttendanceRepository } from './staffAttendance.repository';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export function useDuplicatePunchReview(filters?: Record<string, string>) {
    const [data, setData] = useState<DuplicatePunchCandidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const filterSignature = JSON.stringify(filters);
    const filtersHandle = useLatestValue(filters, filterSignature);
    const fetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await staffAttendanceRepository.getDuplicatePunches(filtersHandle.valueRef.current);
            setData(result);
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Unknown error'));
        }
        finally {
            setIsLoading(false);
        }
    }, [filtersHandle]);
    const resolve = async (duplicateId: string, action: 'KEEP_EXISTING' | 'KEEP_NEWER' | 'IGNORE', notes?: string) => {
        try {
            await staffAttendanceRepository.resolveDuplicatePunch(duplicateId, { action, ...includeWhenPresent("notes", notes) });
            void fetch();
        }
        catch (e) {
            throw e instanceof Error ? e : new Error('Failed to resolve duplicate punch');
        }
    };
    useEffect(() => { void fetch(); }, [fetch]);
    return { data, isLoading, error, refetch: fetch, resolve };
}

