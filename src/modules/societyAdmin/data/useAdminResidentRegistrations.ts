import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../shared/hooks/useLatestValue';
import type { ResidentRegistration, ResidentRegistrationFilters, ResidentRegistrationStatus, ResidentRelationshipType, ResidentRegistrationDetail, FamilyRelationshipSubType } from '../data/residentRegistration.types';
import { residentRegistrationService } from '../services/residentRegistrationService';

export function useAdminResidentRegistrations(filters: ResidentRegistrationFilters = { societyId: '' }) {
  const [data, setData] = useState<ResidentRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const filterSignature = JSON.stringify(filters);
  const filtersHandle = useLatestValue(filters, filterSignature);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentFilters = filtersHandle.valueRef.current;
      if (!currentFilters?.societyId) {
        setData([]);
        setIsLoading(false);
        return;
      }
      const result = await residentRegistrationService.getRegistrations(currentFilters);
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

export function useAdminResidentRegistration(id: string) {
  const [data, setData] = useState<ResidentRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await residentRegistrationService.getRegistrationById(id);
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

export function useAdminResidentRegistrationDetail(id: string) {
  const [data, setData] = useState<ResidentRegistrationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await residentRegistrationService.getRegistrationDetail(id);
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

export function useAdminCreateResidentRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (request: {
    societyId: string;
    unitId: string;
    relationshipType: ResidentRelationshipType;
    familyRelationshipSubType?: FamilyRelationshipSubType;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    createdBy: string;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await residentRegistrationService.createRegistration(request);
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

export function useAdminUpdateResidentRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (id: string, updates: Partial<ResidentRegistration>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await residentRegistrationService.updateRegistration({ id, ...updates });
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

export function useAdminTransitionRegistrationStatus() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (id: string, newStatus: ResidentRegistrationStatus, additionalData?: Partial<ResidentRegistration>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await residentRegistrationService.transitionStatus(id, newStatus, additionalData);
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

export function useAdminResidentInvitation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createInvitation = useCallback(async (request: {
    registrationId: string;
    societyId: string;
    societyName: string;
    unitId: string;
    unitNumber: string;
    relationshipType: ResidentRelationshipType;
    familyRelationshipSubType?: FamilyRelationshipSubType;
    recipientMobile: string;
    recipientEmail: string;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await residentRegistrationService.createInvitation(request);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { createInvitation, isSubmitting, error };
}

export function useAdminCheckDuplicate() {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (societyId: string, mobile: string, email: string, excludeRegistrationId?: string) => {
    setIsChecking(true);
    setError(null);
    try {
      const result = await residentRegistrationService.checkDuplicate(societyId, mobile, email, excludeRegistrationId);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { execute, isChecking, error };
}