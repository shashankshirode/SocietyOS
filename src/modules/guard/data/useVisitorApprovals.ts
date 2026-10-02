import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../shared/hooks/useLatestValue';
import type { VisitorApprovalRequest } from '../../../shared/types/visitorPhase8.types';
import { visitorApprovalService } from '../services/visitorApprovalService';
export function useVisitorApprovalRequests(filters?: {
    unitId?: string;
    guardId?: string;
    societyId?: string;
}) {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const filterSignature = JSON.stringify(filters);
    const filtersHandle = useLatestValue(filters, filterSignature);
    const fetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const currentFilters = filtersHandle.valueRef.current || {};
            let requests: any[] = [];
            if (currentFilters.unitId) {
                requests = await visitorApprovalService.getPendingApprovalsForUnit(currentFilters.unitId);
            }
            else if (currentFilters.guardId) {
                requests = await visitorApprovalService.getPendingApprovalsForGuard(currentFilters.guardId);
            }
            else {
                requests = [];
            }
            setData(requests.sort((a, b) => new Date(b.requestedAtIso).getTime() - new Date(a.requestedAtIso).getTime()));
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Unknown error'));
        }
        finally {
            setIsLoading(false);
        }
    }, [filtersHandle]);
    useEffect(() => { void fetch(); }, [fetch]);
    return { data, isLoading, error, refetch: fetch };
}
export function useVisitorApprovalRequest(requestId: string) {
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const fetch = useCallback(async () => {
        if (!requestId)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await import('../services/visitorApprovalService').then(m => m.visitorApprovalService.getApprovalRequest(requestId));
            setData(result || null);
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Unknown error'));
        }
        finally {
            setIsLoading(false);
        }
    }, [requestId]);
    useEffect(() => { void fetch(); }, [fetch]);
    return { data, isLoading, error, refetch: fetch };
}
export function useVisitorApprovalAction() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const approve = useCallback(async (requestId: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await import('../services/visitorApprovalService').then(m => m.visitorApprovalService.respondToApproval(requestId, 'APPROVE', 'current-user', 'RESIDENT'));
            return result;
        }
        catch (e) {
            const err = e instanceof Error ? e : new Error('Unknown error');
            setError(err);
            throw err;
        }
        finally {
            setIsSubmitting(false);
        }
    }, []);
    const deny = useCallback(async (requestId: string, reason: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await import('../services/visitorApprovalService').then(m => m.visitorApprovalService.respondToApproval(requestId, 'DENY', 'current-user', 'RESIDENT', reason));
            return result;
        }
        catch (e) {
            const err = e instanceof Error ? e : new Error('Unknown error');
            setError(err);
            throw err;
        }
        finally {
            setIsSubmitting(false);
        }
    }, []);
    const escalate = useCallback(async (requestId: string, type: 'SECURITY' | 'SUPERVISOR' | 'COMMITTEE', reason: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const escalationType = type === 'SECURITY' ? 'ESCALATED_TO_SECURITY' : type === 'SUPERVISOR' ? 'ESCALATED_TO_SUPERVISOR' : 'ESCALATED_TO_COMMITTEE';
            const result = await import('../services/visitorApprovalService').then(m => m.visitorApprovalService.escalateRequest(requestId, 'current-user', reason, type === 'SECURITY' ? 'ESCALATED_TO_SECURITY' : type === 'SUPERVISOR' ? 'ESCALATED_TO_SUPERVISOR' : 'ESCALATED_TO_COMMITTEE'));
            return result;
        }
        catch (e) {
            const err = e instanceof Error ? e : new Error('Unknown error');
            setError(err);
            throw err;
        }
        finally {
            setIsSubmitting(false);
        }
    }, []);
    return { approve, deny, escalate, isSubmitting, error };
}

