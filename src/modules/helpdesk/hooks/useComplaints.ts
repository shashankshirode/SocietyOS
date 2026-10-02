import { useState, useCallback, useEffect } from 'react';
import { complaintService } from '../services/complaintService';
import type { Complaint, ComplaintSearchFilters, ComplaintListItem, ComplaintDashboardMetrics, ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../../../shared/types/complaintPhase6';
import type { Absent } from '../../../shared/types/absence.types';
import { useAuth } from '../../../core/auth/AuthProvider';
import { useSociety } from '../../../core/auth/SocietyProvider';

export function useComplaints(filters: ComplaintSearchFilters = { societyId: '' }) {
  const { currentSociety } = useSociety();
  const [data, setData] = useState<ComplaintListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const effectiveFilters: ComplaintSearchFilters = {
    ...filters,
    societyId: filters.societyId || currentSociety?.id || '',
    page,
    pageSize: filters.pageSize || 20,
  };

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await complaintService.getComplaints(effectiveFilters);
      setData(result.items);
      setTotal(result.total);
      setHasMore(effectiveFilters.page! * (filters.pageSize || 20) < result.total);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [effectiveFilters]);

  useEffect(() => { void fetch(); }, [fetch]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await complaintService.getComplaints({ ...effectiveFilters, page: nextPage });
      setData(prev => [...prev, ...result.items]);
      setPage(nextPage);
      setHasMore(nextPage * (filters.pageSize || 20) < result.total);
    } catch (e) {
      // Error handled silently for load more
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, page, effectiveFilters]);

  return { data, total, isLoading, error, loadMore, refetch: fetch, page, hasMore };
}

export function useComplaint(id: string) {
  const [data, setData] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await complaintService.getComplaint(id);
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

export function useComplaintDetail(id: string) {
  const { data: complaint, isLoading, error, refetch } = useComplaint(id);
  const [comments, setComments] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [slaMetrics, setSlaMetrics] = useState<any>(null);

  const fetchDetails = useCallback(async () => {
    if (!complaint) return;
    try {
      const [comments, evidence, statusHistory, slaMetrics] = await Promise.all([
        complaintService.getComplaintComments(id),
        complaintService.getComplaintEvidence(id),
        complaintService.getComplaintStatusHistory(id),
        complaintService.getComplaintSlaMetrics(id),
      ]);
      setComments(comments);
      setEvidence(evidence);
      setStatusHistory(statusHistory);
      setSlaMetrics(slaMetrics);
    } catch (e) {
      // Silent error
    }
  }, [complaint, id]);

  useEffect(() => {
    if (complaint) void fetchDetails();
  }, [complaint, fetchDetails]);

  return { complaint, comments, evidence, statusHistory, slaMetrics, isLoading, error, refetch };
}

export function useComplaintDashboard() {
  const { currentSociety } = useSociety();
  const [data, setData] = useState<ComplaintDashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!currentSociety?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await complaintService.getDashboardMetrics(currentSociety.id);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [currentSociety]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useCreateComplaint() {
  const { currentSociety } = useSociety();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (payload: {
    category: any;
    subcategory?: any;
    title: string;
    description: string;
    priority: any;
    location?: string;
    isPrivate?: boolean;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (!currentSociety || !user) throw new Error('No active society or user');

      const result = await complaintService.createComplaint({
        payload: {
          category: payload.category,
          subcategory: payload.subcategory,
          title: payload.title,
          description: payload.description,
          priority: payload.priority,
          location: payload.location,
          isPrivate: payload.isPrivate,
        },
        reporterUserId: user.id,
        reporterDisplayName: user.name,
        reporterRole: user.role || 'RESIDENT_OWNER',
        unitId: currentSociety.unitId || '',
        unitNumber: currentSociety.flatNumber || '',
        tower: currentSociety.tower,
        floor: currentSociety.floor,
        societyId: currentSociety.id,
        isPrivate: payload.isPrivate || false,
      });
      return { ok: true as const, value: result };
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      return { ok: false as const, error: err };
    } finally {
      setIsSubmitting(false);
    }
  }, [currentSociety, user]);

  return { execute, submit: execute, isSubmitting, error };
}

export function useTransitionComplaintStatus() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (
    id: string,
    newStatus: any,
    reason?: string,
    metadata?: Record<string, unknown>
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      const result = await complaintService.transitionStatus(
        id,
        newStatus,
        user.id,
        user.name,
        user.role || 'RESIDENT_OWNER',
        reason,
        false,
        metadata
      );
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

export function useResolveComplaint() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: {
    complaintId: string;
    outcome: any;
    summary: string;
    evidenceIds: string[];
    requiresConfirmation: boolean;
    confirmationPolicy: any;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      return await complaintService.resolveComplaint({
        complaintId: input.complaintId,
        resolvedByUserId: user.id,
        resolvedByDisplayName: user.name,
        outcome: input.outcome,
        summary: input.summary,
        evidenceIds: input.evidenceIds,
        requiresConfirmation: input.requiresConfirmation,
        confirmationPolicy: input.confirmationPolicy,
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

export function useReopenComplaint() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: {
    complaintId: string;
    reason: any;
    description?: string;
    evidenceIds?: string[];
    slaPolicy: any;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      return await complaintService.reopenComplaint({
        complaintId: input.complaintId,
        reopenedByUserId: user.id,
        reopenedByDisplayName: user.name,
        reason: input.reason,
        description: input.description,
        evidenceIds: input.evidenceIds,
        slaPolicy: input.slaPolicy,
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

export function useConfirmResolution() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (complaintId: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      return await complaintService.confirmResolution({
        complaintId,
        confirmedByUserId: user.id,
        confirmedByDisplayName: user.name,
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

export function useCancelComplaint() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (complaintId: string, reason: any, description?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      return await complaintService.cancelComplaint({
        complaintId,
        cancelledByUserId: user.id,
        cancelledByDisplayName: user.name,
        reason,
        description,
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

export function useAddComplaintComment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: {
    complaintId: string;
    content: string;
    visibility?: any;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      return await complaintService.addComment({
        complaintId: input.complaintId,
        authorUserId: user.id,
        authorDisplayName: user.name,
        authorRole: user.role || 'RESIDENT_OWNER',
        content: input.content,
        visibility: input.visibility || 'PUBLIC',
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

export function useComplaintEvidence() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadEvidence = useCallback(async (input: {
    complaintId: string;
    type: any;
    fileName: string;
    fileSize: number;
    mimeType: string;
    documentId: string;
    description?: string;
    isResolutionEvidence: boolean;
  }) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    try {
      const { user } = useAuth();
      if (!user) throw new Error('User not authenticated');

      const idempotencyKey = `evidence-${input.complaintId}-${input.documentId}-${Date.now()}`;

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await complaintService.addEvidence(input.complaintId, {
        ...input,
        uploadedByUserId: user.id,
        uploadedByDisplayName: user.name,
        documentId: input.documentId,
        idempotencyKey,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteEvidence = useCallback(async (evidenceId: string) => {
    const { user } = useAuth();
    if (!user) throw new Error('User not authenticated');
    return evidenceService.deleteEvidence(evidenceId, user.id, user.name);
  }, []);

  return { uploadEvidence, deleteEvidence, isUploading, uploadProgress, error };
}

export function useComplaintSla() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMetrics = useCallback(async (complaintId: string) => {
    setIsLoading(true);
    try {
      const metrics = await complaintService.getComplaintSlaMetrics(complaintId);
      setMetrics(metrics);
    } catch (e) {
      // Silent error
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { metrics, isLoading, fetchMetrics };
}