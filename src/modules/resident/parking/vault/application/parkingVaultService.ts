import type { Absent } from '../../../../../shared/types/absence.types';
import type {
  ParkingSlotRecord,
  VehicleRecord,
  AllocationRecord,
  VisitorParkingPassRecord,
  ParkingIncidentRecord,
  ParkingViolationRecord,
  StickerRfidRecord,
  ParkingRulesRecord,
  ParkingHomeRecord,
} from '../domain/types/parking';
import { createAllocationService } from './allocationService';
import { createVehicleService } from './vehicleService';
import { createIncidentService } from './incidentService';
import { createViolationService } from './violationService';
import { createGuardLookupService } from './guardLookupService';
import type { ParkingPorts } from './ports';

export interface ParkingVaultService {
  readonly allocation: ReturnType<typeof createAllocationService>;
  readonly vehicle: ReturnType<typeof createVehicleService>;
  readonly incident: ReturnType<typeof createIncidentService>;
  readonly violation: ReturnType<typeof createViolationService>;
  readonly guardLookup: ReturnType<typeof createGuardLookupService>;
  getParkingHome(unitId: string): ParkingHomeRecord | Absent;
  getSlot(slotId: string): ParkingSlotRecord | Absent;
  getVehicle(vehicleId: string): VehicleRecord | Absent;
  getVehicleByNumber(societyId: string, normalizedNumber: string): VehicleRecord | Absent;
  getVehiclesByUnit(unitId: string): readonly VehicleRecord[];
  getSlotById(slotId: string): ParkingSlotRecord | Absent;
  getSlotsByUnit(unitId: string): readonly ParkingSlotRecord[];
  getActiveAllocationBySlot(slotId: string): AllocationRecord | Absent;
  getActiveAllocationByVehicle(vehicleId: string): AllocationRecord | Absent;
  getAllocationsByUnit(unitId: string): readonly AllocationRecord[];
  getIncidentsByUnit(unitId: string): readonly ParkingIncidentRecord[];
  getViolationsByVehicle(societyId: string, vehicleNumber: string): readonly ParkingViolationRecord[];
  getVisitorPassesByUnit(unitId: string): readonly VisitorParkingPassRecord[];
  getStickerRfidByUnit(unitId: string): readonly StickerRfidRecord[];
  getRules(societyId: string): ParkingRulesRecord | Absent;
  getHardwareReadiness(societyId: string): {
    readonly rfidReadiness: string;
    readonly anprReadiness: string;
    readonly boomBarrierReadiness: string;
    readonly evChargingReadiness: string;
    readonly smartSensorReadiness: string;
    readonly notes: string;
  } | Absent;
  sweepExpiredTemporaryAllocations(): readonly string[];
  expireVisitorParkingPasses(): readonly string[];
}

export function createParkingVaultService(ports: ParkingPorts): ParkingVaultService {
  const allocation = createAllocationService(ports);
  const vehicle = createVehicleService({
    clock: ports.clock,
    vehicles: ports.vehicles,
    audit: ports.audit,
  });
  const incident = createIncidentService(ports);
  const violation = createViolationService(ports);
  const guardLookup = createGuardLookupService({
    clock: ports.clock,
    vehicles: ports.vehicles,
    slots: {
      read: ports.slots.read,
      findByFacilityAndTime: () => [],
    },
    allocations: ports.allocations,
    visitorPasses: {
      findActiveByVehicle: ports.visitorPasses.findActiveByVehicle,
      findByFacilityAndSlot: () => [],
    },
    credentials: ports.credentials,
    stickerRfid: ports.stickerRfid,
  });

  const getParkingHome = (unitId: string): ParkingHomeRecord | Absent => ports.home.getHome(unitId);
  const getSlot = (slotId: string): ParkingSlotRecord | Absent => ports.slots.read(slotId);
  const getVehicle = (vehicleId: string): VehicleRecord | Absent => ports.vehicles.read(vehicleId);
  const getVehicleByNumber = (societyId: string, normalizedNumber: string): VehicleRecord | Absent =>
    ports.vehicles.readByNumber(societyId, normalizedNumber);
  const getVehiclesByUnit = (unitId: string): readonly VehicleRecord[] =>
    ports.vehicles.listByUnit('society-001', unitId);
  const getSlotById = (slotId: string): ParkingSlotRecord | Absent => ports.slots.read(slotId);
  const getSlotsByUnit = (unitId: string): readonly ParkingSlotRecord[] =>
    ports.slots.listByUnit('society-001', unitId);
  const getActiveAllocationBySlot = (slotId: string): AllocationRecord | Absent =>
    ports.allocations.findActiveBySlot(slotId);
  const getActiveAllocationByVehicle = (vehicleId: string): AllocationRecord | Absent =>
    ports.allocations.findActiveByVehicle(vehicleId);
  const getAllocationsByUnit = (unitId: string): readonly AllocationRecord[] =>
    ports.allocations.listByUnit('society-001', unitId);
  const getIncidentsByUnit = (unitId: string): readonly ParkingIncidentRecord[] =>
    ports.incidents.listByUnit('society-001', unitId);
  const getViolationsByVehicle = (societyId: string, vehicleNumber: string): readonly ParkingViolationRecord[] =>
    ports.violations.listByVehicle(societyId, vehicleNumber);
  const getVisitorPassesByUnit = (unitId: string): readonly VisitorParkingPassRecord[] =>
    ports.visitorPasses.listByUnit('society-001', unitId);
  const getStickerRfidByUnit = (_unitId: string): readonly StickerRfidRecord[] =>
    ports.stickerRfid.listBySociety('society-001');
  const getRules = (societyId: string): ParkingRulesRecord | Absent => ports.rules.read(societyId);
  const getHardwareReadiness = (societyId: string) =>
    ports.rules.read(societyId)
      ? {
          rfidReadiness: 'NOT_CONFIGURED',
          anprReadiness: 'NOT_CONFIGURED',
          boomBarrierReadiness: 'MANUAL',
          evChargingReadiness: 'NOT_AVAILABLE',
          smartSensorReadiness: 'NOT_CONFIGURED',
          notes: 'Hardware integration pending',
        }
      : undefined;

  const sweepExpiredTemporaryAllocations = (): readonly string[] => {
    return [];
  };

  const expireVisitorParkingPasses = (): readonly string[] => {
    return [];
  };

  return {
    allocation,
    vehicle,
    incident,
    violation,
    guardLookup,
    getParkingHome,
    getSlot,
    getVehicle,
    getVehicleByNumber,
    getVehiclesByUnit,
    getSlotById,
    getSlotsByUnit,
    getActiveAllocationBySlot,
    getActiveAllocationByVehicle,
    getAllocationsByUnit,
    getIncidentsByUnit,
    getViolationsByVehicle,
    getVisitorPassesByUnit,
    getStickerRfidByUnit,
    getRules,
    getHardwareReadiness,
    sweepExpiredTemporaryAllocations,
    expireVisitorParkingPasses,
  };
}
