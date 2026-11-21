import { useState, useEffect, useCallback } from 'react';
import type { ResidenceOnboardingConfiguration, ResidenceOnboardingState } from '../data/membership.types';
import { onboardingMockSource } from '../data/onboarding.mockSource';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import type { Absent } from "../../../../shared/types/absence.types";
export function useResidenceOnboarding(membershipId: string | Absent) {
    const [config, setConfig] = useState<ResidenceOnboardingConfiguration | null>(null);
    const [currentState, setCurrentState] = useState<ResidenceOnboardingState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | Absent>();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const fetchOnboardingConfig = useCallback(async () => {
        if (!membershipId)
            return;
        setIsLoading(true);
        setError(undefined);
        try {
            const data = await onboardingMockSource.getOnboardingConfiguration(membershipId);
            setConfig(data);
            const totalSteps = data.steps.length;
            const completedStepIds = data.steps.filter((s) => s.completed).map((s) => s.id);
            const nextIncompleteIndex = data.steps.findIndex((s) => !s.completed && s.id !== 'completion');
            setCurrentStepIndex(nextIncompleteIndex !== -1 ? nextIncompleteIndex : 0);
            setCurrentState({
                completed: completedStepIds.includes('completion'),
                currentStepId: nextIncompleteIndex !== -1 ? getRequiredItem(data.steps, nextIncompleteIndex, "useResidenceOnboarding.ts").id : 'completion',
                completedStepIds,
                totalSteps,
                completedSteps: completedStepIds.length,
                rulesVersionAcknowledged: null,
                latestRulesVersion: 'v2.1',
            });
        }
        catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : 'Failed to load onboarding configurations.');
        }
        finally {
            setIsLoading(false);
        }
    }, [membershipId]);
    useEffect(() => {
        fetchOnboardingConfig();
    }, [fetchOnboardingConfig]);
    const saveStep = useCallback(async (stepId: string, data: Record<string, string | boolean | number>) => {
        if (!membershipId)
            return false;
        try {
            const updatedState = await onboardingMockSource.saveOnboardingStep(membershipId, {
                stepId,
                data,
            });
            setCurrentState(updatedState);
            if (config) {
                const updatedSteps = config.steps.map((step) => step.id === stepId ? { ...step, completed: true } : step);
                setConfig({
                    ...config,
                    steps: updatedSteps,
                    completedRequired: updatedSteps.filter((s) => s.required && s.completed).length,
                });
            }
            return true;
        }
        catch {
            return false;
        }
    }, [membershipId, config]);
    const completeOnboarding = useCallback(async (acknowledgedRulesVersion: string) => {
        if (!membershipId)
            return false;
        try {
            const result = await onboardingMockSource.completeOnboarding(membershipId, {
                acknowledgedRulesVersion,
                consentTimestamp: new Date().toISOString(),
            });
            return result.completed;
        }
        catch {
            return false;
        }
    }, [membershipId]);
    const nextStep = useCallback(() => {
        if (!config)
            return;
        if (currentStepIndex < config.steps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        }
    }, [config, currentStepIndex]);
    const prevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
        }
    }, [currentStepIndex]);
    return {
        config,
        currentState,
        isLoading,
        error,
        currentStepIndex,
        setCurrentStepIndex,
        saveStep,
        completeOnboarding,
        nextStep,
        prevStep,
        refresh: fetchOnboardingConfig,
    };
}

