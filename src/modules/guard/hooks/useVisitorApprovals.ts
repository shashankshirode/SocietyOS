import { useState, useCallback } from 'react';
import { visitorApprovalService } from '../services/visitorApprovalService';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { VisitorApprovalRequest } from '../../../shared/types/visitorPhase8.types';

export function useVisitorApprovals() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = useCallback(async (unitId?: string, guardId?: string) => {
    setIsLoading(true);
    try {
      let requests: any[] = [];
      if (unitId) {
        const result = await visitorApprovalService.getPendingApprovalsForUnit(unitId);
        requests = result;
      } else if (guardId) {
        const result = await visitorApprovalService.getPendingApprovalsForGuard(guardId);
        requests = result;
      } else {
        const requestsData = mockStore.getState().visitorApprovalRequests || [];
        requests = requestsData.filter(r => r.status === 'PENDING');
      }
      setRequests(requests);
    } catch (error) {
      setError('Failed to fetch approval requests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approve = useCallback(async (requestId: string) => {
    try {
      const result = await visitorApprovalService.respondToApproval(
        requestId,
        'APPROVE',
        'current-user',
        'RESIDENT'
      );
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const deny = useCallback(async (requestId: string, reason: string) => {
    try {
      const result = await visitorApprovalService.respondToApproval(
        requestId,
        'DENY',
        'current-user',
        'RESIDENT',
        reason
      );
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const escalate = useCallback(async (requestId: string, type: 'SECURITY' | 'SUPERVISOR' | 'COMMITTEE', reason: string) => {
    const escalationType = type === 'SECURITY' ? 'ESCALATED_TO_SECURITY' : 
                           type === 'SUPERVISOR' ? 'ESCALATED_TO_SUPERVISOR' : 'ESCALATED_TO_COMMITTEE';
    try {
      const result = await visitorApprovalService.escalateRequest(
        requestId,
        'current-user',
        reason,
        type === 'SECURITY' ? 'ESCALATED_TO_SECURITY' : type === 'SUPERVISOR' ? 'ESCALATED_TO_SUPERVISOR' : 'ESCALATED_TO_COMMITTEE'
      );
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    requests,
    isLoading,
    error,
    fetchPending,
    approve,
    deny,
    escalate,
  };
}