import { useCallback, useState } from 'react';
import { emergencyService } from '../data/emergencyService';
import { useEmergencyActorContextOrThrow } from './useEmergencyActor';
import type { CreateSosInput, CreateEmergencyIncidentInput, EmergencyIncident, EmergencyTimelineEvent, EmergencyStatus } from '../../../../shared/types/emergency.types';
import type { AffectedZone, EmergencyTask, EmergencyInstruction, EvacuationSession, SafetyCheckIn, ResponderAssignment } from '../data/emergencyDomain.types';
import type { EmergencyActorContext } from '../data/emergencyActor.types';

export function useSosTrigger() {
  const actorContext = useEmergencyActorContextOrThrow();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const triggerSos = useCallback(async (input: CreateSosInput): Promise<EmergencyIncident> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await emergencyService.triggerSos(input, actorContext);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('SOS trigger failed');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [actorContext]);

  return { triggerSos, isSubmitting, error };
}

export function useIncidentDeclaration() {
  const actorContext = useEmergencyActorContextOrThrow();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const declareIncident = useCallback(async (input: CreateEmergencyIncidentInput): Promise<EmergencyIncident> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await emergencyService.declareIncident(input, actorContext);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Incident declaration failed');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [actorContext]);

  return { declareIncident, isSubmitting, error };
}

export function useIncidentActions(incidentId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeAction = useCallback(async <T,>(
    action: () => Promise<T>
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      return await action();
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Action failed');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acknowledge = useCallback(async (input: { note?: string } = {}) => {
    return executeAction(() => emergencyService.acknowledgeIncident(incidentId, input));
  }, [incidentId, executeAction]);

  const markOnTheWay = useCallback(async (responderId: string, input: { note?: string } = {}) => {
    return executeAction(() => emergencyService.markResponderOnTheWay(incidentId, responderId, input));
  }, [incidentId, executeAction]);

  const markReached = useCallback(async (input: { note?: string } = {}) => {
    return executeAction(() => emergencyService.markResponderReached(incidentId, input));
  }, [incidentId, executeAction]);

  const escalate = useCallback(async (input: { note: string }) => {
    return executeAction(() => emergencyService.escalateIncident(incidentId, input));
  }, [incidentId, executeAction]);

  const markUnderControl = useCallback(async (input: { note?: string } = {}) => {
    return executeAction(() => emergencyService.markUnderControl(incidentId, input));
  }, [incidentId, executeAction]);

  const resolve = useCallback(async (input: { closureSummary: string }) => {
    return executeAction(() => emergencyService.resolveIncident(incidentId, input));
  }, [incidentId, executeAction]);

  const close = useCallback(async (input: { closureSummary: string }) => {
    return executeAction(() => emergencyService.closeIncident(incidentId, input));
  }, [incidentId, executeAction]);

  const cancel = useCallback(async (input: { reason: string }) => {
    return executeAction(() => emergencyService.cancelIncident(incidentId, input));
  }, [incidentId, executeAction]);

  return {
    acknowledge,
    markOnTheWay,
    markReached,
    escalate,
    markUnderControl,
    resolve,
    close,
    cancel,
    isLoading,
    error,
  };
}

export function useIncidentTimeline(incidentId: string) {
  const [timeline, setTimeline] = useState<EmergencyTimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadTimeline = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const events = await emergencyService.getTimeline(incidentId);
      setTimeline(events);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load timeline');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [incidentId]);

  const addEvent = useCallback(async (input: {
    eventType: EmergencyTimelineEvent['eventType'];
    note?: string;
    source: EmergencyTimelineEvent['source'];
  }) => {
    return emergencyService.addTimelineEvent(incidentId, input);
  }, [incidentId]);

  return { timeline, loadTimeline, addEvent, isLoading, error };
}

export function useAffectedZones(incidentId: string) {
  const [zones, setZones] = useState<AffectedZone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addZone = useCallback(async (zone: Omit<AffectedZone, 'id' | 'incidentId' | 'affectedAt'>) => {
    const newZone = await emergencyService.addAffectedZone(incidentId, zone);
    setZones(prev => [...prev, newZone]);
    return newZone;
  }, [incidentId]);

  const updateZone = useCallback(async (zoneId: string, status: AffectedZone['status'], note?: string) => {
    await emergencyService.updateZoneStatus(incidentId, zoneId, status, { note: note ?? undefined } as { note?: string });
    setZones(prev => prev.map(z => z.id === zoneId ? { ...z, status } : z));
  }, [incidentId]);

  return { zones, addZone, updateZone, isLoading, error };
}

export function useEmergencyTasks(incidentId: string) {
  const [tasks, setTasks] = useState<EmergencyTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTask = useCallback(async (task: Omit<EmergencyTask, 'id' | 'incidentId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newTask = await emergencyService.createTask(incidentId, task);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [incidentId]);

  const updateTask = useCallback(async (taskId: string, status: EmergencyTask['status'], note?: string, evidence?: string[]) => {
    await emergencyService.updateTaskStatus(incidentId, taskId, status, { note: note ?? undefined, evidence: evidence ?? undefined } as { note?: string; evidence?: string[] });
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t));
  }, [incidentId]);

  return { tasks, createTask, updateTask, isLoading, error };
}

export function useEmergencyInstructions(incidentId: string) {
  const [instructions, setInstructions] = useState<EmergencyInstruction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const publish = useCallback(async (instruction: Omit<EmergencyInstruction, 'id' | 'incidentId' | 'version' | 'publishedAt' | 'publishedBy' | 'supersededAt'>) => {
    const newInstruction = await emergencyService.publishInstruction(incidentId, instruction);
    setInstructions(prev => [...prev, newInstruction]);
    return newInstruction;
  }, [incidentId]);

  return { instructions, publish, isLoading, error };
}

export function useEvacuation(incidentId: string) {
  const [sessions, setSessions] = useState<EvacuationSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startEvacuation = useCallback(async (session: Omit<EvacuationSession, 'id' | 'incidentId' | 'startedAt' | 'checkInStatus' | 'instructions'>) => {
    const newSession = await emergencyService.startEvacuation(incidentId, session);
    setSessions(prev => [...prev, newSession]);
    return newSession;
  }, [incidentId]);

  const checkIn = useCallback(async (evacuationSessionId: string, checkIn: Omit<SafetyCheckIn, 'id' | 'evacuationSessionId' | 'incidentId' | 'checkedAt'>) => {
    return emergencyService.submitSafetyCheckIn(evacuationSessionId, incidentId, checkIn);
  }, [incidentId]);

  return { sessions, startEvacuation, checkIn, isLoading, error };
}

export function useEmergencyBroadcast(incidentId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const broadcast = useCallback(async (input: {
    broadcastType: 'FIRE_ALERT' | 'LIFT_OUTAGE' | 'SECURITY_ALERT' | 'WATER_EMERGENCY' | 'WEATHER_ALERT' | 'EVACUATION_NOTICE' | 'DRILL_NOTICE' | 'SENIOR_HELP' | 'OTHER';
    message: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    targetAudience: string;
    affectedArea?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      await emergencyService.createEmergencyBroadcast(incidentId, input as Parameters<typeof emergencyService.createEmergencyBroadcast>[1]);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Broadcast failed');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [incidentId]);

  return { broadcast, isLoading, error };
}