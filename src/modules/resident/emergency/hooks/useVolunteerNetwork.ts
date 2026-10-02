import { useCallback, useState } from 'react';
import { volunteerNetworkService } from '../data/volunteerNetworkService';
import type { EmergencyVolunteer, VolunteerAlert, RegisterVolunteerInput, VolunteerType, VolunteerAvailability, VolunteerVerificationStatus } from '../../../../shared/types/volunteer.types';
import type { EmergencyIncident } from '../../../../shared/types/emergency.types';

export function useEmergencyVolunteers(filters?: Record<string, string>) {
  const [volunteers, setVolunteers] = useState<EmergencyVolunteer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadVolunteers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await volunteerNetworkService.getVolunteers(filters);
      setVolunteers(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load volunteers');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const register = useCallback(async (input: RegisterVolunteerInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const newVolunteer = await volunteerNetworkService.registerVolunteer(input);
      setVolunteers(prev => [newVolunteer, ...prev]);
      return newVolunteer;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Registration failed');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { volunteers, loadVolunteers, register, isLoading, error };
}

export function useVolunteerAlert(alertId: string) {
  const [alert, setAlert] = useState<VolunteerAlert | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadAlert = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await volunteerNetworkService.getVolunteerAlertDetail(alertId);
      setAlert(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load alert');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [alertId]);

  const accept = useCallback(async (note?: string) => {
    if (!alert) throw new Error('Alert not loaded');
    setIsLoading(true);
    setError(null);
    try {
      const updated = await volunteerNetworkService.acceptVolunteerAlert(alertId, { note: note ?? undefined } as { note?: string; clientOperationId?: string });
      setAlert(updated);
      return updated;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to accept alert');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [alertId, alert]);

  const decline = useCallback(async (note?: string) => {
    if (!alert) throw new Error('Alert not loaded');
    setIsLoading(true);
    setError(null);
    try {
      const updated = await volunteerNetworkService.declineVolunteerAlert(alertId, { note: note ?? undefined } as { note?: string; clientOperationId?: string });
      setAlert(updated);
      return updated;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to decline alert');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [alertId, alert]);

  return { alert, loadAlert, accept, decline, isLoading, error };
}

export function useVolunteerDispatch(incident: EmergencyIncident) {
  const [isDispatching, setIsDispatching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const dispatch = useCallback(async (radiusMeters?: number) => {
    setIsDispatching(true);
    setError(null);
    try {
      const volunteers = await volunteerNetworkService.getEligibleVolunteers(incident, radiusMeters);
      const alerts = await volunteerNetworkService.dispatchVolunteerAlerts(incident, volunteers);
      return { volunteers, alerts };
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Dispatch failed');
      setError(err);
      throw err;
    } finally {
      setIsDispatching(false);
    }
  }, [incident]);

  return { dispatch, isDispatching, error };
}

export function useVolunteerManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateVerification = useCallback(async (volunteerId: string, status: VolunteerVerificationStatus, verifiedBy: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await volunteerNetworkService.updateVerificationStatus(volunteerId, status, verifiedBy);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to update verification');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAvailability = useCallback(async (volunteerId: string, availability: VolunteerAvailability) => {
    setIsLoading(true);
    setError(null);
    try {
      await volunteerNetworkService.updateAvailability(volunteerId, availability);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to update availability');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateVerification, updateAvailability, isLoading, error };
}