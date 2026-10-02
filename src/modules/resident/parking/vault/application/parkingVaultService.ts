import type { Absent } from '../../../../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../../../../core/audit/audit.types';
import type { ParkingVaultErrorCode, ParkingVaultActor, ParkingVaultClock, TraceContext, Revision, } from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type { ParkingSlotRecord, VehicleRecord, AllocationRecord, VisitorParkingPassRecord, ParkingIncidentRecord, ParkingViolationRecord, StickerRfidRecord, ParkingCredential, ParkingRulesRecord, ParkingHomeRecord, AllocationApproval, AllocationType, AllocationStatus, ParkingSlotOperationalState, } from '../domain/types/parking';
import type { CategoryPolicy, DocumentPolicySet } from '../domain/types/policy.types';
import { findCategoryPolicy } from '../domain/types/policy.types';
import type { AllocationRequest, TransferRequest, TemporaryAllocationRequest } from './allocationService';
import type { VehicleRegistrationRequest, VerificationRequest, ReplacementRequest } from './vehicleService';
import type { IncidentReportRequest, ReviewRequest } from './incidentService';
import type { ViolationRecordRequest } from './violationService';
import type { AllocationRequest as AllocationRequestType } from './allocationService';
import { createAllocationService } from './allocationService';
import { createVehicleService } from './vehicleService';
import { createIncidentService } from './incidentService';
import { createViolationService } from './violationService';
import { createGuardLookupService } from './guardLookupService';
import type { VaultPorts, ServiceOutcome } from './application/ports';
export interface ParkingVaultService {
    allocation: ReturnType<typeof createAllocationService>;
    vehicle: ReturnType<typeof createVehicleService>;
    incident: ReturnType<typeof createIncidentService>;
    violation: ReturnType<typeof createViolationService>;
    guardLookup: ReturnType<typeof createGuardLookupService>;
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
        rfidReadiness: string;
        anprReadiness: string;
        boomBarrierReadiness: string;
        evChargingReadiness: string;
        smartSensorReadiness: string;
        notes: string;
    } | Absent;
    sweepExpiredTemporaryAllocations(): readonly string[];
    expireVisitorParkingPasses(): readonly string[];
}
function fail(code: ParkingVaultErrorCode, message: string): ServiceOutcome<never> {
    return { ok: false, code, message };
}
export function createParkingVaultService(ports: VaultPorts): ParkingVaultService {
    const allocation = createAllocationService(ports);
    const vehicle = createVehicleService({
        clock: ports.clock,
        vehicles: ports.documents,
        audit: ports.audit,
    });
    const incident = createIncidentService(ports);
    const violation = createViolationService(ports);
    const guardLookup = createGuardLookupService({
        clock: ports.clock,
        vehicles: ports.documents,
        slots: ports.slots,
        allocations: ports.allocations,
        visitorPasses: ports.visitorPasses,
        credentials: ports.credentials,
        stickerRfid: ports.stickerRfid,
        notifications: ports.notifications,
        audit: ports.audit,
        clock: ports.clock,
    });
    const getParkingHome = (unitId: string): ParkingHomeRecord | Absent => ports.home.getHome(unitId);
    const getSlot = (slotId: string): ParkingSlotRecord | Absent => ports.slots.read(slotId);
    const getVehicle = (vehicleId: string): VehicleRecord | Absent => ports.vehicles.read(vehicleId);
    const getVehicleByNumber = (societyId: string, normalizedNumber: string): VehicleRecord | Absent => ports.vehicles.readByNumber(societyId, normalizedNumber);
    const getVehiclesByUnit = (unitId: string): readonly VehicleRecord[] => ports.vehicles.listByUnit('society-001', unitId);
    const getSlotById = (slotId: string): ParkingSlotRecord | Absent => ports.slots.read(slotId);
    const getSlotsByUnit = (unitId: string): readonly ParkingSlotRecord[] => ports.slots.listByUnit('society-001', unitId);
    const getActiveAllocationBySlot = (slotId: string): AllocationRecord | Absent => ports.allocations.findActiveBySlot(slotId);
    const getActiveAllocationByVehicle = (vehicleId: string): AllocationRecord | Absent => ports.allocations.findActiveByVehicle(vehicleId);
    const getAllocationsByUnit = (unitId: string): readonly AllocationRecord[] => ports.allocations.listByUnit('society-001', unitId);
    const getIncidentsByUnit = (unitId: string): readonly ParkingIncidentRecord[] => ports.incidents.listByUnit('society-001', unitId);
    const getViolationsByVehicle = (societyId: string, vehicleNumber: string): readonly ParkingViolationRecord[] => ports.violations.listByVehicle(societyId, vehicleNumber);
    const getVisitorPassesByUnit = (unitId: string): readonly VisitorParkingPassRecord[] => ports.visitorPasses.listByUnit('society-001', unitId);
    const getStickerRfidByUnit = (unitId: string): readonly StickerRfidRecord[] => ports.stickerRfid.listBySociety('society-001');
    const getRules = (societyId: string): ParkingRulesRecord | Absent => ports.rules.read(societyId);
    const getHardwareReadiness = (societyId: string) => ports.rules.read(societyId) ? {
        rfidReadiness: 'NOT_CONFIGURED',
        anprReadiness: 'NOT_CONFIGURED',
        boomBarrierReadiness: 'MANUAL',
        evChargingReadiness: 'NOT_AVAILABLE',
        smartSensorReadiness: 'NOT_CONFIGURED',
        notes: 'Hardware integration pending',
    } : undefined;
    const sweepExpiredTemporaryAllocations = (): readonly string[] => {
        return [];
    };
    const expireVisitorParkingPasses = (): readonly string[] => {
        return [];
    };
    return {
        allocation: createAllocationService(ports),
        vehicle: createVehicleService({
            clock: ports.clock,
            documents: {
                read: ports.vehicles.read,
                readByNumber: ports.vehicles.readByNumber,
                listBySociety: ports.vehicles.listBySociety,
                listByUnit: ports.vehicles.listByUnit,
                insert: ports.vehicles.insert,
                update: ports.vehicles.update,
            },
            audit: ports.audit,
        }),
        incident: createIncidentService(ports),
        violation: createViolationService(ports),
        guardLookup: createGuardLookupService({
            clock: ports.clock,
            vehicles: ports.vehicles,
            slots: ports.slots,
            allocations: ports.allocations,
            visitorPasses: ports.visitorPasses,
            credentials: ports.credentials,
            stickerRfid: ports.stickerRfid,
            notifications: ports.notifications,
            audit: ports.audit,
            clock: ports.clock,
        }),
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
export type ParkingVaultService = ReturnType<typeof createParkingVaultService>;

