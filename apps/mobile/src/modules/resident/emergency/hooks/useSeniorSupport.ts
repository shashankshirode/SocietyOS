import { useCallback, useState } from 'react';
import { seniorSupportService } from '../data/seniorSupportService';
import { useEmergencyActorContextOrThrow } from './useEmergencyActor';
import type { SeniorCareProfile, SeniorDailyCheckIn, SeniorInactivityAlert, SubmitSeniorCheckInInput } from '../../../../shared/types/seniorCare.types';
import type { EmergencyActorContext } from '../data/emergencyActor.types';

export function useSeniorProfile() {
  const [profile, setProfile] = useState<SeniorCareProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await seniorSupportService.getProfile();
      setProfile(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load profile');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (input: Partial<SeniorCareProfile>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await seniorSupportService.updateProfile(input);
      setProfile(updated);
      return updated;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to update profile');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enableSupport = useCallback(async (actorContext: EmergencyActorContext, input: {
    dailyCheckInEnabled: boolean;
    checkInHour: number;
    checkInMinute: number;
    timezone: string;
    preferredHelpType?: string;
    priorityComplaintEnabled: boolean;
    securityCheckCallPreference?: string;
    familyConnectEnabled: boolean;
    consentConfirmed: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await seniorSupportService.enableSeniorSupport(actorContext, input);
      setProfile(updated);
      return updated;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to enable senior support');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disableSupport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await seniorSupportService.disableSeniorSupport();
      setProfile(updated);
      return updated;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to disable senior support');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pauseSupport = useCallback(async (actorContext: EmergencyActorContext, input: {
    effectiveFrom: string;
    effectiveTo?: string;
    reason?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await seniorSupportService.pauseSeniorSupport(actorContext, input);
      setProfile(updated);
      return updated;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to pause senior support');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resumeSupport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await seniorSupportService.resumeSeniorSupport();
      setProfile(updated);
      return updated;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to resume senior support');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    profile,
    loadProfile,
    updateProfile,
    enableSupport,
    disableSupport,
    pauseSupport,
    resumeSupport,
    isLoading,
    error,
  };
}

export function useSeniorCheckIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const actorContext = useEmergencyActorContextOrThrow();

  const submitCheckIn = useCallback(async (input: SubmitSeniorCheckInInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await seniorSupportService.submitCheckIn(actorContext, input);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Check-in failed');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [actorContext]);

  return { submitCheckIn, isSubmitting, error };
}

export function useSeniorCheckIns(filters?: Record<string, string>) {
  const [checkIns, setCheckIns] = useState<SeniorDailyCheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadCheckIns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await seniorSupportService.getCheckIns(filters);
      setCheckIns(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load check-ins');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return { checkIns, loadCheckIns, isLoading, error };
}

export function useSeniorInactivityAlerts(filters?: Record<string, string>) {
  const [alerts, setAlerts] = useState<SeniorInactivityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await seniorSupportService.getInactivityAlerts(filters);
      setAlerts(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load inactivity alerts');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const acknowledge = useCallback(async (alertId: string, notes?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await seniorSupportService.acknowledgeInactivityAlert(alertId, { notes: notes ?? undefined } as { notes?: string; clientOperationId?: string });
      setAlerts(prev => prev.map(a => a.id === alertId ? updated : a));
      return updated;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to acknowledge alert');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const escalate = useCallback(async (alertId: string, notes?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await seniorSupportService.escalateInactivityAlert(alertId, { notes: notes ?? undefined } as { notes?: string; clientOperationId?: string });
      setAlerts(prev => prev.map(a => a.id === alertId ? updated : a));
      return updated;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to escalate alert');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { alerts, loadAlerts, acknowledge, escalate, isLoading, error };
}

export function useSeniorBackgroundJobs() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{
    missedCheckIn?: { processed: number; missed: number; alertsCreated: number; errors: string[] };
    inactivityEscalation?: { processed: number; escalated: number; incidentsCreated: number; errors: string[] };
  } | null>(null);

  const runMissedCheckInJob = useCallback(async () => {
    setIsRunning(true);
    try {
      const result = await seniorSupportService.runMissedCheckInJob();
      setLastResult(prev => ({ ...prev, missedCheckIn: result }));
      return result;
    } finally {
      setIsRunning(false);
    }
  }, []);

  const runInactivityEscalationJob = useCallback(async () => {
    setIsRunning(true);
    try {
      const result = await seniorSupportService.runInactivityEscalationJob();
      setLastResult(prev => ({ ...prev, inactivityEscalation: result }));
      return result;
    } finally {
      setIsRunning(false);
    }
  }, []);

  return { runMissedCheckInJob, runInactivityEscalationJob, isRunning, lastResult };
}