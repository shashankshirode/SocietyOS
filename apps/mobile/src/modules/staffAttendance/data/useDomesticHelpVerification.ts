import { useState } from 'react';
import { staffAttendanceRepository } from './staffAttendance.repository';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export function useDomesticHelpVerification() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const verify = async (domesticHelpId: string, itemKey: string, status: 'VERIFIED' | 'REJECTED', notes?: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await staffAttendanceRepository.verifyDomesticHelp(domesticHelpId, { checklistItemKey: itemKey, status, ...includeWhenPresent("notes", notes) });
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Verification failed'));
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const blockAccess = async (domesticHelpId: string, reason: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await staffAttendanceRepository.blockDomesticHelpAccess(domesticHelpId, { reason, confirmationChecked: true });
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Block access failed'));
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return { verify, blockAccess, isSubmitting, error };
}

