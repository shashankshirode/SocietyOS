import { useState } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function useVolunteerAlertDetail(alertId: string) {
    const { data, isLoading, error, refetch } = useRepositoryResult(async () => {
        const res = await emergencySafetyRepository.getVolunteerAlertDetail(alertId);
        return { ok: true, data: res };
    }, [alertId]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const accept = async (note?: string) => {
        setIsSubmitting(true);
        try {
            const res = await emergencySafetyRepository.acceptVolunteerAlert(alertId, { ...includeWhenPresent("note", note) });
            void refetch();
            return res;
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const decline = async (note?: string) => {
        setIsSubmitting(true);
        try {
            const res = await emergencySafetyRepository.declineVolunteerAlert(alertId, { ...includeWhenPresent("note", note) });
            void refetch();
            return res;
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return { data, isLoading, error, refetch, accept, decline, isSubmitting };
}

