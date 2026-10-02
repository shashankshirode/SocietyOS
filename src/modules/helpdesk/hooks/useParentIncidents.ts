import { useState, useCallback, useEffect } from 'react';
import { parentIncidentService } from '../services/parentIncidentService';
import { useAuth } from '../../../core/auth/AuthProvider';
import type { ParentIncident, CorrelationCandidate, CorrelationResult } from '../../../shared/types/complaintPhase6';

export function useParentIncidents(societyId: string) {
  const [data, setData] = useState<ParentIncident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!societyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await parentIncidentService.getParentIncidents(societyId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useParentIncident(id: string) {
  const [data, setData] = useState<ParentIncident | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await parentIncidentService.getParentIncident(id);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useParentIncidentChildren(parentId: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!parentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await parentIncidentService.getChildComplaints(parentId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [parentId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useCorrelationCandidates(societyId: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!societyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await parentIncidentService.getPendingCandidates(societyId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useConfirmCorrelation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (candidateId: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      const result = await parentIncidentService.confirmCandidate(candidateId, user.id);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { execute, isSubmitting, error };
}

export function useRejectCorrelation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (candidateId: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      await parentIncidentService.rejectCandidate(candidateId, user.id);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { execute, isSubmitting, error };
}

export function useResolveParentIncident() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: {
    parentIncidentId: string;
    rootCause: string;
    resolutionSummary: string;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      await parentIncidentService.resolveParentIncident({
        parentIncidentId: input.parentIncidentId,
        adminId: user.id,
        rootCause: input.rootCause,
        resolutionSummary: input.resolutionSummary,
      });
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { execute, isSubmitting, error };
}

export function useCloseParentIncident() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (parentIncidentId: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      await parentIncidentService.closeParentIncident({
        parentIncidentId,
        adminId: user.id,
      });
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { execute, isSubmitting, error };
}

export function useCreateParentIncident() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: {
    childComplaintIds: string[];
    correlationRuleId: string;
    correlationConfidence: number;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      return await parentIncidentService.createParentIncidentFromComplaints(
        input.childComplaintIds,
        input.correlationRuleId,
        input.correlationConfidence,
        user.id
      );
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { execute, isSubmitting, error };
}

export function useUnlinkFromParent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (complaintId: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      return await parentIncidentService.unlinkFromParent(complaintId);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { execute, isSubmitting, error };
}