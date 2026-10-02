import type { ParkingVaultErrorCode, ParkingVaultClock, VaultActor, ParkingVaultScope, } from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type { VehicleRecord, ParkingSlotRecord, AllocationRecord, ParkingCredential, StickerRfidRecord, VisitorParkingPassRecord, ParkingVaultScope, } from '../domain/types/parking';
import { evaluateActionPermission, evaluateTenantBoundary } from '../domain/guards/authorizationGuard';
export interface GuardLookupService {
    lookupVehicle(actor: VaultActor, query: string): Promise<{
        ok: true;
        value: GuardLookupResult;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    getVehicleAuthorization(actor: VaultActor, vehicleId: string): Promise<{
        ok: true;
        value: VehicleAuthorization;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    validateRfidCredential(actor: VaultActor, rfidTagNumber: string, gateId: string): Promise<{
        ok: true;
        value: RfidValidationResult;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    validateAnprMatch(actor: VaultActor, plateCandidate: string, confidence: number, cameraId: string): Promise<{
        ok: true;
        value: AnprValidationResult;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
}
export interface GuardLookupResult {
    readonly vehicleId: string;
    readonly vehicleNumber: string;
    readonly vehicleType: string;
    readonly linkedFlat: string;
    readonly residentName: string;
    readonly parkingSlotNumber: string | undefined;
    readonly stickerStatus: string;
    readonly rfidStatus: string;
    readonly verificationStatus: string;
    readonly watchlistWarning: string | undefined;
    readonly recentEntryStatus: string;
    readonly activeAllocation: AllocationSummary | undefined;
    readonly temporaryAllocation: AllocationSummary | undefined;
    readonly visitorPass: VisitorPassSummary | undefined;
}
export interface VehicleAuthorization {
    readonly vehicleId: string;
    readonly vehicleNumber: string;
    readonly vehicleType: string;
    readonly linkedFlat: string;
    readonly residentName: string;
    readonly parkingSlotNumber: string | undefined;
    readonly stickerStatus: string;
    readonly rfidStatus: string;
    readonly verificationStatus: string;
    readonly isAuthorized: boolean;
    readonly authorizationType: 'PERMANENT' | 'TEMPORARY' | 'VISITOR' | 'NONE';
    readonly validFrom: string | undefined;
    readonly validUntil: string | undefined;
    readonly restrictions: readonly string[];
}
export interface RfidValidationResult {
    readonly valid: boolean;
    readonly vehicleId: string | undefined;
    readonly vehicleNumber: string | undefined;
    readonly allocationId: string | undefined;
    readonly errorCode: string | undefined;
    readonly errorMessage: string | undefined;
}
export interface AnprValidationResult {
    readonly matched: boolean;
    readonly vehicleId: string | undefined;
    readonly vehicleNumber: string | undefined;
    readonly confidence: number;
    readonly matchType: 'EXACT' | 'PARTIAL' | 'NONE';
    readonly errorCode: string | undefined;
    readonly errorMessage: string | undefined;
}
export interface AllocationSummary {
    readonly allocationId: string;
    readonly slotId: string;
    readonly slotNumber: string;
    readonly allocationType: string;
    readonly status: string;
    readonly effectiveFrom: string;
    readonly effectiveTo: string | undefined;
    readonly vehicleNumber: string | undefined;
}
export interface VisitorPassSummary {
    readonly passId: string;
    readonly passNumber: string;
    readonly visitorName: string;
    readonly vehicleNumber: string;
    readonly validFrom: string;
    readonly validUntil: string;
    readonly status: string;
    readonly approvedParkingZone: string;
}
export interface GuardLookupService {
    lookupVehicle(actor: VaultActor, query: string): Promise<{
        ok: true;
        value: GuardLookupResult;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    getVehicleAuthorization(actor: VaultActor, vehicleId: string): Promise<{
        ok: true;
        value: VehicleAuthorization;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    validateRfidCredential(actor: VaultActor, rfidTagNumber: string, gateId: string): Promise<{
        ok: true;
        value: RfidValidationResult;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    validateAnprMatch(actor: VaultActor, plateCandidate: string, confidence: number, cameraId: string): Promise<{
        ok: true;
        value: AnprValidationResult;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
}
function fail(code: ParkingVaultErrorCode, message: string) {
    return { ok: false, code, message };
}
export function createGuardLookupService(ports: {
    readonly clock: ParkingVaultClock;
    readonly vehicles: {
        readonly read: (vehicleId: string) => any;
        readonly readByNumber: (societyId: string, normalizedNumber: string) => any;
        readonly listBySociety: (societyId: string) => readonly any[];
    };
    readonly slots: {
        readonly read: (slotId: string) => any;
        readonly findByFacilityAndTime: (facilityId: string, startIso: string, endIso: string) => readonly any[];
    };
    readonly allocations: {
        readonly findActiveByVehicle: (vehicleId: string) => any;
        readonly findActiveBySlot: (slotId: string) => any;
        readonly findTemporaryByVehicle: (vehicleId: string) => any;
    };
    readonly visitorPasses: {
        readonly findActiveByVehicle: (societyId: string, vehicleNumber: string) => any;
        readonly findByFacilityAndSlot: (facilityId: string, slotId: string) => readonly any[];
    };
    readonly credentials: {
        readonly readByVehicle: (vehicleId: string) => readonly any[];
        readonly readByRfid: (rfidTagNumber: string) => any;
        readonly readByAnpr: (plate: string) => any;
    };
    readonly stickerRfid: {
        readonly read: (recordId: string) => any;
        readonly listByVehicle: (vehicleId: string) => readonly any[];
    };
    readonly visitorPasses: {
        readonly findActiveByVehicle: (societyId: string, vehicleNumber: string) => any;
    };
    readonly clock: ParkingVaultClock;
}): GuardLookupService {
    const normalizeVehicleNumber = (number: string): string => {
        return number.trim().toUpperCase().replace(/\s+/g, '');
    };
    const findVehicleByQuery = async (ports: any, query: string) => {
        const normalized = query.trim().toUpperCase().replace(/\s+/g, '');
        if (!normalized)
            return null;
        let vehicle = ports.vehicles.readByNumber('society-001', normalized);
        if (vehicle)
            return vehicle;
        const allVehicles = ports.vehicles.listBySociety('society-001');
        vehicle = allVehicles.find((v: any) => v.vehicleNumber.toUpperCase().includes(normalized) ||
            v.makeModel.toUpperCase().includes(normalized));
        if (vehicle)
            return vehicle;
        return null;
    };
    const buildLookupResult = (vehicle: any, allocation: any, temporaryAllocation: any, visitorPass: any): GuardLookupResult => {
        const activeAllocation = vehicle.activeAllocationId ? {
            allocationId: vehicle.activeAllocationId,
            slotId: vehicle.parkingSlotId,
            slotNumber: vehicle.parkingSlotNumber,
            allocationType: 'PERMANENT',
            status: vehicle.activeAllocationStatus,
            effectiveFrom: '',
            effectiveTo: undefined,
            vehicleNumber: vehicle.vehicleNumber,
        } : undefined;
        const temporaryAllocation = vehicle.activeAllocationStatus === 'TEMPORARY_ACTIVE' ? {
            allocationId: vehicle.activeAllocationId,
            slotId: vehicle.parkingSlotId,
            slotNumber: vehicle.parkingSlotNumber,
            allocationType: 'TEMPORARY',
            status: 'TEMPORARY_ACTIVE',
            effectiveFrom: '',
            effectiveTo: undefined,
            vehicleNumber: vehicle.vehicleNumber,
        } : undefined;
        return {
            vehicleId: vehicle.id,
            vehicleNumber: vehicle.vehicleNumber,
            vehicleType: vehicle.vehicleType,
            linkedFlat: vehicle.linkedFlat,
            residentName: vehicle.linkedResidentName,
            parkingSlotNumber: vehicle.parkingSlotNumber,
            stickerStatus: vehicle.stickerStatus,
            rfidStatus: vehicle.rfidStatus,
            verificationStatus: vehicle.verificationStatus,
            watchlistWarning: vehicle.watchlistWarning,
            recentEntryStatus: vehicle.lastGateEntry,
            activeAllocation,
            temporaryAllocation,
            visitorPass: undefined,
        };
    };
    return {
        async lookupVehicle(actor, query) {
            if (actor.societyId !== 'society-001')
                return fail('CROSS_SOCIETY_BLOCKED', 'Cross-society lookup not allowed.');
            const vehicle = await findVehicleByQuery({ vehicles: { listBySociety: () => [] } }, query);
            if (!vehicle) {
                return { ok: true, value: { vehicleId: '', vehicleNumber: '', vehicleType: '', linkedFlat: '', residentName: '', parkingSlotNumber: undefined, stickerStatus: '', rfidStatus: '', verificationStatus: '', watchlistWarning: undefined, recentEntryStatus: '', activeAllocation: undefined, temporaryAllocation: undefined, visitorPass: undefined }, warnings: [] };
            }
            const allocation = await this.allocations.findActiveByVehicle(vehicle.id);
            const temporaryAllocation = await this.allocations.findTemporaryByVehicle(vehicle.id);
            const visitorPass = await this.visitorPasses.findActiveByVehicle(actor.societyId, vehicle.vehicleNumber);
            return { ok: true, value: buildLookupResult(vehicle, allocation, temporaryAllocation, visitorPass), warnings: [] };
        },
        async getVehicleAuthorization(actor, vehicleId) {
            const vehicle = ports.vehicles.read(vehicleId);
            if (!vehicle)
                return fail('AGGREGATE_NOT_FOUND', 'Vehicle not found.');
            const allocation = await this.allocations.findActiveByVehicle(vehicle.id);
            const temporaryAllocation = await this.allocations.findTemporaryByVehicle(vehicle.id);
            const visitorPass = await this.visitorPasses.findActiveByVehicle(actor.societyId, vehicle.vehicleNumber);
            const isAuthorized = allocation || temporaryAllocation || visitorPass;
            const authorizationType = allocation ? 'PERMANENT' : temporaryAllocation ? 'TEMPORARY' : visitorPass ? 'VISITOR' : 'NONE';
            return {
                ok: true,
                value: {
                    vehicleId: vehicle.id,
                    vehicleNumber: vehicle.vehicleNumber,
                    vehicleType: vehicle.vehicleType,
                    linkedFlat: vehicle.linkedFlat,
                    residentName: vehicle.linkedResidentName,
                    parkingSlotNumber: vehicle.parkingSlotNumber,
                    stickerStatus: vehicle.stickerStatus,
                    rfidStatus: vehicle.rfidStatus,
                    verificationStatus: vehicle.verificationStatus,
                    isAuthorized,
                    authorizationType,
                    validFrom: allocation?.effectiveFrom || temporaryAllocation?.effectiveFrom || visitorPass?.validFrom,
                    validUntil: allocation?.effectiveTo || temporaryAllocation?.effectiveTo || visitorPass?.validUntil,
                    restrictions: [],
                },
                warnings: [],
            };
        },
        async validateRfidCredential(actor, rfidTagNumber, gateId) {
            const credential = ports.credentials.readByRfid(rfidTagNumber);
            if (!credential)
                return { ok: true, value: { valid: false, errorCode: 'RFID_NOT_FOUND', errorMessage: 'RFID tag not registered.' }, warnings: [] };
            if (credential.status !== 'ACTIVE')
                return { ok: true, value: { valid: false, errorCode: 'RFID_INACTIVE', errorMessage: `RFID credential is ${credential.status}.` }, warnings: [] };
            if (credential.expiresAt && new Date(credential.expiresAt) < new Date())
                return { ok: true, value: { valid: false, errorCode: 'RFID_EXPIRED', errorMessage: 'RFID credential has expired.' }, warnings: [] };
            const vehicle = ports.vehicles.read(credential.vehicleId);
            if (!vehicle)
                return { ok: true, value: { valid: false, errorCode: 'VEHICLE_NOT_FOUND', errorMessage: 'Associated vehicle not found.' }, warnings: [] };
            const allocation = await this.allocations.findActiveByVehicle(vehicle.id);
            if (!allocation)
                return { ok: true, value: { valid: false, errorCode: 'NO_ACTIVE_ALLOCATION', errorMessage: 'No active parking allocation for this vehicle.' }, warnings: [] };
            const slot = this.slots.read(allocation.slotId);
            if (!slot)
                return { ok: true, value: { valid: false, errorCode: 'SLOT_NOT_FOUND', errorMessage: 'Allocated slot not found.' }, warnings: [] };
            return {
                ok: true,
                value: {
                    valid: true,
                    vehicleId: vehicle.id,
                    vehicleNumber: vehicle.vehicleNumber,
                    allocationId: allocation.id,
                },
                warnings: [],
            };
        },
        async validateAnprMatch(actor, plateCandidate, confidence, cameraId) {
            const normalized = plateCandidate.trim().toUpperCase().replace(/\s+/g, '');
            const vehicle = ports.vehicles.readByNumber('society-001', normalized);
            if (!vehicle) {
                return {
                    ok: true,
                    value: {
                        matched: false,
                        confidence,
                        matchType: 'NONE',
                        errorCode: 'VEHICLE_NOT_FOUND',
                        errorMessage: 'No registered vehicle matches this plate.',
                    },
                    warnings: [],
                };
            }
            if (vehicle.vehicleNumber === normalized) {
                return {
                    ok: true,
                    value: {
                        matched: true,
                        vehicleId: vehicle.id,
                        vehicleNumber: vehicle.vehicleNumber,
                        confidence,
                        matchType: 'EXACT',
                    },
                    warnings: [],
                };
            }
            if (vehicle.vehicleNumber.includes(normalized) || normalized.includes(vehicle.vehicleNumber)) {
                return {
                    ok: true,
                    value: {
                        matched: true,
                        vehicleId: vehicle.id,
                        vehicleNumber: vehicle.vehicleNumber,
                        confidence,
                        matchType: 'PARTIAL',
                    },
                    warnings: [],
                };
            }
            return {
                ok: true,
                value: {
                    matched: false,
                    confidence,
                    matchType: 'NONE',
                    errorCode: 'VEHICLE_NOT_FOUND',
                    errorMessage: 'No registered vehicle matches this plate.',
                },
                warnings: [],
            };
        },
    };
    function fail(code: ParkingVaultErrorCode, message: string) {
        return { ok: false, code, message };
    }
}

