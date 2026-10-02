import { useState, useCallback } from 'react';
import { visitorInvitationService } from '../services/visitorInvitationService';
import type { VisitorInvitation, CreateVisitorInvitationPayload } from '../../../../shared/types/visitorPhase8.types';
export function useVisitorInvitations(societyId: string) {
    const [invitations, setInvitations] = useState<VisitorInvitation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchInvitations = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await visitorInvitationService.getInvitationsByResident(societyId);
            const filtered = result.filter((inv) => inv.residentId === 'current-user');
            setInvitations(filtered);
        }
        catch (error) {
            setError('Failed to fetch invitations');
        }
        finally {
            setIsLoading(false);
        }
    }, [societyId]);
    const createInvitation = useCallback(async (payload: CreateVisitorInvitationPayload) => {
        try {
            const invitation = await visitorInvitationService.createInvitation(payload, 'current-user', 'Current User', 'unit-123', 'A-1204', 'society-123');
            return invitation;
        }
        catch (error) {
            throw error;
        }
    }, []);
    const revokeInvitation = useCallback(async (preApprovalId: string, reason: string) => {
        const invitation = await visitorInvitationService.revokeInvitation(preApprovalId, 'current-user', reason);
        return invitation;
    }, []);
    const acceptInvitation = useCallback(async (preApprovalId: string) => {
        const invitation = await visitorInvitationService.acceptInvitation(preApprovalId);
        return invitation;
    }, []);
    const validateAndAccept = useCallback(async (preApprovalId: string) => {
        const result = await visitorInvitationService.validateAndAcceptInvitation(preApprovalId);
        return result;
    }, []);
    const useInvitationByCode = useCallback(async (preApprovalId: string) => {
        const invitation = await visitorInvitationService.getInvitationByCode(preApprovalId);
        return invitation;
    }, []);
    return {
        invitations,
        isLoading,
        error,
        fetchInvitations: fetchInvitations,
        createInvitation,
        revokeInvitation,
        acceptInvitation,
        validateAndAccept: validateAndAccept,
        getInvitationByCode: useInvitationByCode,
    };
}
