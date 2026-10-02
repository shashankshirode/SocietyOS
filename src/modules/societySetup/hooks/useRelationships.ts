import { useState, useCallback } from 'react';
import { RelationshipService } from '../services/relationshipService';
import type {
  ResidentUnitRelationship,
  RelationshipType,
  RelationshipStatus,
  TenancyDetails,
  CreateRelationshipInput,
  UpdateRelationshipInput,
  EndRelationshipInput,
  CurrentOccupancy,
  OccupancyHistory,
  UnitTimelineEvent,
  RelationshipValidationResult,
} from '../data/occupancyRelationship.types';

export function useRelationships(societyId: string, unitId?: string) {
  const [relationships, setRelationships] = useState<ResidentUnitRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!unitId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await RelationshipService.getRelationshipsForUnit(unitId);
      setRelationships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load relationships');
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  const create = useCallback(async (input: CreateRelationshipInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const newRel = await RelationshipService.createRelationship(input);
      setRelationships((prev) => [...prev, newRel]);
      return newRel;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create relationship');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const update = useCallback(async (input: UpdateRelationshipInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await RelationshipService.updateRelationship(input);
      setRelationships((prev) => prev.map((r) => (r.id === input.id ? updated : r)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update relationship');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const end = useCallback(async (input: EndRelationshipInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const ended = await RelationshipService.endRelationship(input);
      setRelationships((prev) => prev.map((r) => (r.id === input.id ? ended : r)));
      return ended;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end relationship');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validate = useCallback(async (input: CreateRelationshipInput) => {
    return RelationshipService.validateRelationship(input);
  }, []);

  return {
    relationships,
    isLoading,
    error,
    load,
    create,
    update,
    end,
    validate,
  };
}

export function useActiveRelationships(societyId: string, unitId?: string) {
  const [relationships, setRelationships] = useState<ResidentUnitRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!unitId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await RelationshipService.getActiveRelationshipsForUnit(unitId);
      setRelationships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load active relationships');
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  return { relationships, isLoading, error, load };
}

export function useCurrentOccupancy(societyId: string, unitId?: string) {
  const [occupancy, setOccupancy] = useState<import('../data/occupancyRelationship.types').CurrentOccupancy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!unitId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await RelationshipService.getCurrentOccupancy(unitId);
      setOccupancy(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load current occupancy');
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  return { occupancy, isLoading, error, load };
}

export function useOccupancyHistory(societyId: string, unitId?: string) {
  const [history, setHistory] = useState<import('../data/occupancyRelationship.types').OccupancyHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!unitId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await RelationshipService.getOccupancyHistory(unitId);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load occupancy history');
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  return { history, isLoading, error, load };
}

export function useUnitTimeline(societyId: string, unitId?: string) {
  const [timeline, setTimeline] = useState<import('../data/occupancyRelationship.types').UnitTimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!unitId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await RelationshipService.getUnitTimeline(unitId);
      setTimeline(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load unit timeline');
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  return { timeline, isLoading, error, load };
}

export function useRelationshipActions(societyId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveTenancy = useCallback(async (relationshipId: string, approvedBy: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await RelationshipService.approveTenancy(relationshipId, approvedBy);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve tenancy');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rejectTenancy = useCallback(async (relationshipId: string, rejectedBy: string, reason: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await RelationshipService.rejectTenancy(relationshipId, rejectedBy, reason);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject tenancy');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const endRelationship = useCallback(async (input: EndRelationshipInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const ended = await RelationshipService.endRelationship(input);
      return ended;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end relationship');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateRelationship = useCallback(async (input: import('../data/occupancyRelationship.types').CreateRelationshipInput) => {
    return RelationshipService.validateRelationship(input);
  }, []);

  return {
    approveTenancy,
    rejectTenancy,
    endRelationship,
    validateRelationship,
    isLoading,
    error,
  };
}