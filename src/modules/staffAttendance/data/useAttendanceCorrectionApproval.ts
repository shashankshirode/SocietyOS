import { useState } from 'react';
import { staffAttendanceRepository } from './staffAttendance.repository';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export function useAttendanceCorrectionApproval() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const approve = async (id: string, auditNote?: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await staffAttendanceRepository.approveCorrectionRequest(id, { ...includeWhenPresent("auditNote", auditNote), confirmationChecked: true });
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Approval failed'));
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const reject = async (id: string, rejectionReason: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await staffAttendanceRepository.rejectCorrectionRequest(id, { rejectionReason, confirmationChecked: true });
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Rejection failed'));
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return { approve, reject, isSubmitting, error };
}

