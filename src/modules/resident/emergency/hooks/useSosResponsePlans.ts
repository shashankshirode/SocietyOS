import { useState, useEffect, useCallback } from 'react';
import type { SosResponsePlan, SosResidenceContext } from '../data/sosResponsePlan.types';
import { sosConfigurationRepository } from '../data/sosConfiguration.repository';
import type { Absent } from "../../../../shared/types/absence.types";
export interface UseSosResponsePlansResult {
    plans: SosResponsePlan[];
    isLoading: boolean;
    error: Error | null;
    refresh: () => void;
}
export function useSosResponsePlans(context: SosResidenceContext | Absent): UseSosResponsePlansResult {
    const [plans, setPlans] = useState<SosResponsePlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const load = useCallback(async () => {
        if (!context) {
            setPlans([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await sosConfigurationRepository.getResponsePlans(context);
            setPlans(result);
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Failed to load response plans'));
        }
        finally {
            setIsLoading(false);
        }
    }, [context]);
    useEffect(() => {
        load();
    }, [load]);
    return { plans, isLoading, error, refresh: load };
}

