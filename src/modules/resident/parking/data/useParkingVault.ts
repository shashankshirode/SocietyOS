import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../../shared/hooks/useLatestValue';
import type { ParkingSlotRecord, VehicleRecord, AllocationRecord, VisitorParkingPassRecord, ParkingIncidentRecord, ParkingViolationRecord, StickerRfidRecord, ParkingRulesRecord, ParkingHomeRecord } from '../vault/domain/types/parking';
import { createParkingVaultService } from '../vault/application/parkingVaultService';
import { parkingVaultRepository } from '../vault/infrastructure/parkingVaultRepository';

let parkingVaultService: ReturnType<typeof createParkingVaultService> | null = null;

function getParkingVaultService() {
  if (!parkingVaultService) {
    parkingVaultService = createParkingVaultService(parkingVaultRepository);
  }
  return parkingVaultService;
}

export function useParkingHomeVault(unitId: string) {
  const [data, setData] = useState<ParkingHomeRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unitIdRef = { current: unitId };

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const result = service.getParkingHome(unitIdRef.current);
      setData(result || null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useMyVehicles(unitId: string) {
  const [data, setData] = useState<VehicleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unitIdRef = { current: unitId };

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const result = service.getVehiclesByUnit(unitIdRef.current);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVehicleDetail(vehicleId: string) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!vehicleId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const result = service.getVehicle(vehicleId);
      setData(result || null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVehicleRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: {
    societyId: string;
    unitId: string;
    vehicleType: string;
    vehicleNumber: string;
    makeModel: string;
    color: string;
    fuelType: string;
    ownerName: string;
    linkedResidentName: string;
    linkedFlat: string;
    insuranceExpiry?: string;
    pollutionCertificateExpiry?: string;
    notes?: string;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: input.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const scope = {
        societyId: input.societyId,
        owningEntityType: 'UNIT',
        owningEntityId: input.unitId,
      };

      const normalizedNumber = input.vehicleNumber.trim().toUpperCase().replace(/\s+/g, '');
      const duplicate = service.checkDuplicate(input.societyId, normalizedNumber);
      if (duplicate) {
        throw new Error('A vehicle with this registration number already exists.');
      }

      const vehicleId = `vehicle-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const now = new Date().toISOString();

      const vehicle = {
        id: vehicleId,
        societyId: input.societyId,
        owningEntityType: 'UNIT',
        owningEntityId: input.unitId,
        vehicleNumber: input.vehicleNumber,
        normalizedVehicleNumber: normalizedNumber,
        vehicleType: input.vehicleType as any,
        makeModel: input.makeModel,
        color: input.color,
        fuelType: input.fuelType as any,
        isEv: input.fuelType === 'ELECTRIC' || input.vehicleType === 'EV',
        ownerName: input.ownerName,
        linkedResidentName: input.linkedResidentName,
        linkedFlat: input.linkedFlat,
        verificationStatus: 'PENDING' as any,
        verificationCaseId: undefined,
        registrationDocumentStatus: 'NOT_UPLOADED',
        insuranceExpiry: input.insuranceExpiry,
        pollutionCertificateExpiry: input.pollutionCertificateExpiry,
        stickerStatus: 'NOT_ISSUED' as any,
        stickerNumber: undefined,
        stickerIssuedAt: undefined,
        stickerValidUntil: undefined,
        rfidStatus: 'NOT_CONFIGURED' as any,
        rfidTagNumber: undefined,
        rfidIssuedAt: undefined,
        rfidRevokedAt: undefined,
        activeAllocationId: undefined,
        activeAllocationStatus: undefined,
        isActive: true,
        lastGateEntry: undefined,
        notes: input.notes,
        createdAt: now,
        createdBy: 'current-user',
        updatedAt: now,
        revision: { revision: 1, revisionToken: `rev-${vehicleId}-1` },
        trace: { correlationId: `reg-${vehicleId}`, causationId: undefined },
      };

      const result = await service.vehicle.registerVehicle(actor, {
        scope: {
          societyId: input.societyId,
          owningEntityType: 'UNIT',
          owningEntityId: input.unitId,
        },
        vehicleNumber: input.vehicleNumber,
        vehicleType: input.vehicleType,
        makeModel: input.makeModel,
        color: input.color,
        fuelType: input.fuelType,
        ownerName: input.ownerName,
        linkedResidentName: input.linkedResidentName,
        linkedFlat: input.linkedFlat,
        insuranceExpiry: input.insuranceExpiry,
        pollutionCertificateExpiry: input.pollutionCertificateExpiry,
        idempotencyKey: `vehicle-reg-${Date.now()}`,
      });

      if (!result.ok) throw new Error(result.message);
      return { ok: true, data: result.value };
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

export function useVehicleReplacement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: {
    oldVehicleId: string;
    newVehicle: {
      vehicleType: string;
      vehicleNumber: string;
      makeModel: string;
      color: string;
      fuelType: string;
      ownerName: string;
      linkedResidentName: string;
      linkedFlat: string;
      insuranceExpiry?: string;
      pollutionCertificateExpiry?: string;
    };
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = await service.vehicle.replaceVehicle(actor, {
        oldVehicleId: input.oldVehicleId,
        newVehicle: {
          ...input.newVehicle,
          societyId: 'society-001',
          unitId: 'unit-a-1204',
          idempotencyKey: `replace-${Date.now()}`,
        },
      });

      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { execute, isLoading, error };
}

export function useParkingAllocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const allocate = useCallback(async (input: {
    unitId: string;
    slotId: string;
    vehicleId?: string;
    vehicleNumber?: string;
    effectiveFrom: string;
    effectiveTo?: string;
    allocationType: 'PERMANENT' | 'TEMPORARY';
    approvalRequired: boolean;
    reason: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const scope = {
        societyId: 'society-001',
        owningEntityType: 'UNIT',
        owningEntityId: input.unitId,
      };

      const idempotencyKey = `alloc-${input.slotId}-${Date.now()}`;
      const result = await service.allocation.requestAllocation(actor, {
        scope,
        allocationType: input.allocationType,
        slotId: input.slotId,
        vehicleId: input.vehicleId,
        vehicleNumber: input.vehicleNumber,
        effectiveFrom: input.effectiveFrom,
        effectiveTo: input.effectiveTo,
        chargeAmount: undefined,
        depositAmount: undefined,
        approvalRequired: input.approvalRequired,
        approvalChain: [],
        reason: input.reason || 'Permanent parking allocation',
        idempotencyKey,
      });

      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const transfer = useCallback(async (input: {
    currentAllocationId: string;
    targetSlotId: string;
    newEffectiveFrom: string;
    reason: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const scope = { societyId: 'society-001', owningEntityType: 'UNIT', owningEntityId: 'unit-a-1204' };
      const idempotencyKey = `transfer-${Date.now()}`;

      const result = await service.allocation.transferAllocation(actor, {
        scope,
        currentAllocationId: input.currentAllocationId,
        targetSlotId: input.targetSlotId,
        newEffectiveFrom: input.newEffectiveFrom,
        reason: input.reason || 'Transfer requested by resident',
        idempotencyKey,
      });

      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const endAllocation = useCallback(async (allocationId: string, reason: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = await service.allocation.endAllocation(actor, allocationId, reason);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { allocate, transfer, endAllocation, isLoading, error };
}

export function useTemporaryParking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (input: {
    slotId: string;
    vehicleId: string;
    vehicleNumber: string;
    effectiveFrom: string;
    effectiveTo: string;
    reason: string;
    chargeAmount?: number;
    depositAmount?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const scope = { societyId: 'society-001', owningEntityType: 'UNIT', owningEntityId: 'unit-a-1204' };
      const idempotencyKey = `temp-${Date.now()}`;

      const result = await service.allocation.createTemporaryAllocation(
        { ...actor, societyId: 'society-001' },
        {
          scope,
          slotId: input.slotId,
          vehicleId: input.vehicleId,
          vehicleNumber: input.vehicleNumber,
          effectiveFrom: input.effectiveFrom,
          effectiveTo: input.effectiveTo,
          reason: input.reason || 'Temporary parking',
          chargeAmount: input.chargeAmount,
          depositAmount: input.depositAmount,
          approvalRequired: false,
          approvalChain: [],
          idempotencyKey,
        }
      );

      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const extend = useCallback(async (allocationId: string, newEndDate: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = await service.allocation.extendTemporaryAllocation(actor, allocationId, newEndDate);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const end = useCallback(async (allocationId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = await service.allocation.expireTemporaryAllocation(actor, allocationId);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { create, extend, end, isLoading, error };
}

export function useParkingIncidents() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const report = useCallback(async (input: {
    societyId: string;
    unitId: string;
    issueType: string;
    reportedFlat: string;
    vehicleNumber?: string;
    location: string;
    description: string;
    priority: string;
    immediateSecurityHelp: boolean;
    isVehicleBlocked: boolean;
    evidenceLabel?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: input.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const scope = { societyId: input.societyId, owningEntityType: 'UNIT', owningEntityId: input.unitId };
      const idempotencyKey = `incident-${Date.now()}`;

      const result = await service.incident.reportIncident(
        { ...actor, societyId: input.societyId },
        {
          scope,
          issueType: input.issueType as any,
          reportedFlat: input.reportedFlat,
          vehicleNumber: input.vehicleNumber,
          location: input.location,
          description: input.description,
          priority: input.priority as any,
          immediateSecurityHelp: input.immediateSecurityHelp,
          isVehicleBlocked: input.isVehicleBlocked,
          evidenceLabel: input.evidenceLabel,
          idempotencyKey,
        }
      );

      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resolve = useCallback(async (incidentId: string, resolutionNotes: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'SECURITY_GUARD',
        actorType: 'SECURITY_GUARD' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = await service.incident.resolveIncident(actor, incidentId, resolutionNotes);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const escalate = useCallback(async (incidentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'current-user',
        role: 'SECURITY_GUARD',
        actorType: 'SECURITY_GUARD' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = await service.incident.escalateIncident(actor, incidentId);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { report, resolve, escalate, isLoading, error };
}

export function useParkingViolations(unitId: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const result = service.getViolationsByVehicle('society-001', unitId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useParkingHardwareReadiness(societyId: string) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const result = service.getHardwareReadiness(societyId);
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

export function useGuardVehicleLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const lookup = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const actor = {
        userId: 'guard-1',
        role: 'SECURITY_GUARD',
        actorType: 'SECURITY_GUARD' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = await service.guardLookup.lookupVehicle(
        { ...actor, societyId: 'society-001' },
        query
      );

      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { lookup, isLoading, error };
}

export function useParkingSlotDetail(slotId: string) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!slotId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const result = service.getSlot(slotId);
      setData(result || null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [slotId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useParkingHome(unitId: string) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getParkingVaultService();
      const result = service.getParkingHome(unitId);
      setData(result || null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}