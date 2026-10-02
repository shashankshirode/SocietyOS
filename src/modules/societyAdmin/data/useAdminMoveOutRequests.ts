import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../shared/hooks/useLatestValue';
import type { MoveOutRequest, MoveOutRequestFilters, MoveOutStatus, ClearanceStatus, ClearanceChecklistItem } from '../../../shared/types/moveOut.types';
import { moveOutService } from '../services/moveOutService';
import { nocService } from '../services/nocService';
import { accessService } from '../services/accessService';
import { RelationshipService } from '../../societySetup/services/relationshipService';

export function useAdminMoveOutRequests(filters?: MoveOutRequestFilters) {
  const [data, setData] = useState<MoveOutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const filterSignature = JSON.stringify(filters);
  const filtersHandle = useLatestValue(filters, filterSignature);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentFilters = filtersHandle.valueRef.current || {};
      const result = await moveOutService.getMoveOutRequests(currentFilters);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [filtersHandle]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useAdminMoveOutRequest(id: string) {
  const [data, setData] = useState<MoveOutRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await moveOutService.getMoveOutRequestById(id);
      setData(result || null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useAdminCreateMoveOutRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: {
    societyId: string;
    unitId: string;
    residentId: string;
    occupancyRelationshipId: string;
    personType: 'OWNER' | 'TENANT' | 'FAMILY_MEMBER';
    requestedExitDate: string;
    reason: string;
    newAddress?: string;
    contactNumber: string;
    vehicleEntryRequired: boolean;
    liftSlotRequired: boolean;
    moverName?: string;
    notes?: string;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await moveOutService.createMoveOutRequest(input);
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

export function useAdminUpdateMoveOutRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (id: string, updates: Partial<MoveOutRequest>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await moveOutService.updateMoveOutRequest({ id, ...updates });
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

export function useAdminMoveOutStatusTransition() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (
    id: string,
    newStatus: MoveOutStatus,
    additionalData?: Partial<MoveOutRequest>
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await moveOutService.transitionStatus(id, newStatus, additionalData);
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

export function useAdminMoveOutClearance() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const evaluate = useCallback(async (moveOutRequestId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await moveOutService.evaluateClearance(moveOutRequestId);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (
    moveOutRequestId: string,
    clearanceItemId: string,
    updates: Partial<ClearanceChecklistItem>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await moveOutService.updateClearanceItem(moveOutRequestId, clearanceItemId, updates);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const override = useCallback(async (input: {
    moveOutRequestId: string;
    clearanceItemId: string;
    reason: string;
    overriddenBy: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await moveOutService.overrideClearance(input);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { evaluate, updateItem, override, isLoading, error };
}

export function useAdminMoveOutApproval() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approve = useCallback(async (input: { moveOutRequestId: string; approvedBy: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await moveOutService.approveMoveOut(input);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const reject = useCallback(async (input: { moveOutRequestId: string; rejectedBy: string; reason: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await moveOutService.rejectMoveOut(input);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resubmit = useCallback(async (input: { moveOutRequestId: string; resubmittedBy: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await moveOutService.resubmitMoveOut(input);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { approve, reject, resubmit, isSubmitting, error };
}

export function useAdminMoveOutNoc() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(async (input: { moveOutRequestId: string; generatedBy: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const request = await moveOutService.getMoveOutRequestById(input.moveOutRequestId);
      if (!request || !request.clearanceSnapshotId) {
        throw new Error('Clearance snapshot not found');
      }
      const certificate = await nocService.generateMoveOutNoc(
        input.moveOutRequestId,
        request.clearanceSnapshotId,
        input.generatedBy
      );
      return certificate;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const issue = useCallback(async (moveOutRequestId: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await moveOutService.issueNoc(moveOutRequestId);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { generate, issue, isSubmitting, error };
}

export function useAdminMoveOutAccess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const revoke = useCallback(async (input: { moveOutRequestId: string; revokedBy: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await moveOutService.revokeAccess(input);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const getStatus = useCallback(async (residentId: string, unitId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await accessService.getResidentAccessStatus(residentId, unitId);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { revoke, getStatus, isSubmitting, error };
}

export function useAdminMoveOutOccupancy() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const close = useCallback(async (input: { moveOutRequestId: string; closedBy: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await moveOutService.closeOccupancy(input);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { close, isSubmitting, error };
}

export function useAdminMoveOutCancel() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: { moveOutRequestId: string; cancelledBy: string; reason: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await moveOutService.cancelMoveOut(input);
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

export function useAdminClearanceSnapshot() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async (snapshotId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await moveOutService.getClearanceSnapshot(snapshotId);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, isLoading, error };
}