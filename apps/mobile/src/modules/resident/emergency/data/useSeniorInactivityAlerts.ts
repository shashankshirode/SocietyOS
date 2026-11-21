import { useState } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function useSeniorInactivityAlerts(filters?: Record<string, string>) {
    const { data, isLoading, error, refetch } = useRepositoryResult(async () => {
        const res = await emergencySafetyRepository.getSeniorInactivityAlerts(filters);
        return { ok: true, data: res };
    }, [JSON.stringify(filters)]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const acknowledgeAlert = async (alertId: string, notes?: string) => {
        setIsSubmitting(true);
        try {
            const res = await emergencySafetyRepository.acknowledgeSeniorInactivityAlert(alertId, { ...includeWhenPresent("notes", notes) });
            void refetch();
            return res;
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const escalateAlert = async (alertId: string, notes?: string) => {
        setIsSubmitting(true);
        try {
            const res = await emergencySafetyRepository.escalateSeniorInactivityAlert(alertId, { ...includeWhenPresent("notes", notes) });
            void refetch();
            return res;
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return { data, isLoading, error, refetch, acknowledgeAlert, escalateAlert, isSubmitting };
}

