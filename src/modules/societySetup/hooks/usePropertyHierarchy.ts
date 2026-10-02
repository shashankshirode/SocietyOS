import { useState, useCallback } from 'react';
import { SocietyService } from '../services/societyService';
import type { Phase, Tower, Wing, Floor, Unit, PropertyHierarchyNode, UnitType, UnitOccupancyStatus, UnitBillingCategory } from '../data/societyProperty.types';

export function usePhases(societyId: string) {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SocietyService.getPhases(societyId);
      setPhases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load phases');
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  const create = useCallback(async (phase: Omit<Phase, 'id' | 'level' | 'societyId' | 'createdAt' | 'updatedAt' | 'children'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPhase = await SocietyService.createPhase(societyId, phase);
      setPhases((prev) => [...prev, newPhase]);
      return newPhase;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create phase');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  return { phases, isLoading, error, load, create };
}

export function useTowers(societyId: string, phaseId?: string) {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SocietyService.getTowers(societyId, phaseId);
      setTowers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load towers');
    } finally {
      setIsLoading(false);
    }
  }, [societyId, phaseId]);

  const create = useCallback(async (tower: Omit<Tower, 'id' | 'level' | 'societyId' | 'createdAt' | 'updatedAt' | 'children'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTower = await SocietyService.createTower(societyId, tower);
      setTowers((prev) => [...prev, newTower]);
      return newTower;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tower');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  return { towers, isLoading, error, load, create };
}

export function useWings(societyId: string, towerId: string) {
  const [wings, setWings] = useState<Wing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SocietyService.getWings(societyId, towerId);
      setWings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wings');
    } finally {
      setIsLoading(false);
    }
  }, [societyId, towerId]);

  const create = useCallback(async (wing: Omit<Wing, 'id' | 'level' | 'societyId' | 'createdAt' | 'updatedAt' | 'children'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newWing = await SocietyService.createWing(societyId, wing);
      setWings((prev) => [...prev, newWing]);
      return newWing;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wing');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  return { wings, isLoading, error, load, create };
}

export function useFloors(societyId: string, wingId: string) {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SocietyService.getFloors(societyId, wingId);
      setFloors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load floors');
    } finally {
      setIsLoading(false);
    }
  }, [societyId, wingId]);

  const create = useCallback(async (floor: Omit<Floor, 'id' | 'level' | 'societyId' | 'createdAt' | 'updatedAt' | 'children'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newFloor = await SocietyService.createFloor(societyId, floor);
      setFloors((prev) => [...prev, newFloor]);
      return newFloor;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create floor');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  return { floors, isLoading, error, load, create };
}

export function useUnits(societyId: string, floorId?: string) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SocietyService.getUnits(societyId, floorId);
      setUnits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load units');
    } finally {
      setIsLoading(false);
    }
  }, [societyId, floorId]);

  const create = useCallback(async (unit: Omit<Unit, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUnit = await SocietyService.createUnit(unit);
      setUnits((prev) => [...prev, newUnit]);
      return newUnit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create unit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  const update = useCallback(async (unit: { id: string } & Partial<Unit>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await SocietyService.updateUnit(unit as any);
      setUnits((prev) => prev.map((u) => (u.id === unit.id ? updated : u)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update unit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  const remove = useCallback(async (unitId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await SocietyService.deleteUnit(unitId);
      setUnits((prev) => prev.filter((u) => u.id !== unitId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete unit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { units, isLoading, error, load, create, update, remove };
}

export function useBulkUnitGeneration(societyId: string) {
  const [preview, setPreview] = useState<{
    items: Array<{
      unitNumber: string;
      floorNumber: number;
      towerName: string;
      isDuplicate: boolean;
      errors: string[];
    }>;
    totalGenerated: number;
    valid: number;
    duplicates: number;
    errors: number;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = useCallback(async (request: {
    towerId: string;
    wingId?: string;
    startFloor: number;
    endFloor: number;
    unitsPerFloor: number;
    unitNumberPattern: string;
    unitType: UnitType;
    carpetAreaSqFt: number;
    builtupAreaSqFt: number;
    occupancyStatus: UnitOccupancyStatus;
    billingCategory: UnitBillingCategory;
  }) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await SocietyService.previewBulkUnits({
        societyId,
        ...request,
      });
      setPreview(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [societyId]);

  const confirmBulkUnits = useCallback(async (request: {
    towerId: string;
    wingId?: string;
    startFloor: number;
    endFloor: number;
    unitsPerFloor: number;
    unitNumberPattern: string;
    unitType: UnitType;
    carpetAreaSqFt: number;
    builtupAreaSqFt: number;
    occupancyStatus: UnitOccupancyStatus;
    billingCategory: UnitBillingCategory;
  }) => {
    if (!preview) {
      throw new Error('No preview available');
    }
    setIsConfirming(true);
    setError(null);
    try {
      const units = await SocietyService.confirmBulkUnits(
        { societyId, ...request },
        preview.items
      );
      setPreview(null);
      return units;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm bulk units');
      throw err;
    } finally {
      setIsConfirming(false);
    }
  }, [societyId, preview]);

  const clearPreview = useCallback(() => {
    setPreview(null);
  }, []);

  return {
    preview,
    isGenerating,
    isConfirming,
    error,
    generatePreview,
    confirmBulkUnits,
    clearPreview,
  };
}

export function usePropertyTree(societyId: string) {
  const [tree, setTree] = useState<PropertyHierarchyNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SocietyService.getPropertyTree(societyId);
      setTree(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property tree');
    } finally {
      setIsLoading(false);
    }
  }, [societyId]);

  return { tree, isLoading, error, load };
}