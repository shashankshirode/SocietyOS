import { useState, useCallback } from 'react';
import type { SosType, SosRecipientResolutionResult, SosResidenceContext } from '../data/sosResponsePlan.types';
import { sosConfigurationRepository } from '../data/sosConfiguration.repository';
import { sosEmergencyContactRepository, trustedContactInvitationRepository } from '../data/sosEmergencyContact.repository';
import { resolveRecipients } from '../data/SosRecipientResolver';
import type { Absent } from "../../../../shared/types/absence.types";
export interface UseSosRecipientResolutionResult {
    resolution: SosRecipientResolutionResult | null;
    isResolving: boolean;
    error: Error | null;
    resolve: (sosType: SosType) => Promise<SosRecipientResolutionResult>;
}
export function useSosRecipientResolution(context: SosResidenceContext | Absent): UseSosRecipientResolutionResult {
    const [resolution, setResolution] = useState<SosRecipientResolutionResult | null>(null);
    const [isResolving, setIsResolving] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const resolve = useCallback(async (sosType: SosType): Promise<SosRecipientResolutionResult> => {
        if (!context)
            throw new Error('No active residence context');
        setIsResolving(true);
        setError(null);
        try {
            const [plan, contacts, invitations] = await Promise.all([
                sosConfigurationRepository.getResponsePlan(context, sosType).catch(() => undefined),
                sosEmergencyContactRepository.getContacts(context),
                trustedContactInvitationRepository.getInvitations(context),
            ]);
            const result = resolveRecipients({
                sosType,
                context,
                plan,
                contacts,
                invitations,
            });
            setResolution(result);
            return result;
        }
        catch (e) {
            const err = e instanceof Error ? e : new Error('Failed to resolve recipients');
            setError(err);
            throw err;
        }
        finally {
            setIsResolving(false);
        }
    }, [context]);
    return { resolution, isResolving, error, resolve };
}

