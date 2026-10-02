import type { ParkingVaultErrorCode, ParkingVaultViolation, ParkingVaultClock, VaultActor, ParkingVaultScope, TraceContext, Revision, } from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type { VehicleRecord, VehicleVerificationStatus, ParkingVehicleType, FuelType, ParkingStickerStatus, RfidStatus, ParkingVaultScope, } from '../domain/types/parking';
import { canTransitionVerification, canTransitionVehicleState, isVerificationReviewable, isVerificationTerminal, isVehicleActive, canVehicleBeReplaced, } from '../domain/stateMachines/vehicleStateMachine';
import { evaluateActionPermission, evaluateTenantBoundary } from '../domain/guards/authorizationGuard';
export interface VehicleService {
    registerVehicle(actor: VaultActor, input: VehicleRegistrationRequest): Promise<{
        ok: true;
        value: VehicleRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    verifyVehicle(actor: VaultActor, input: VerificationRequest): Promise<{
        ok: true;
        value: VehicleRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    rejectVehicle(actor: VaultActor, input: RejectionRequest): Promise<{
        ok: true;
        value: VehicleRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    requestResubmission(actor: VaultActor, vehicleId: string, reason: string): Promise<{
        ok: true;
        value: VehicleRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    replaceVehicle(actor: VaultActor, input: ReplacementRequest): Promise<{
        ok: true;
        value: {
            oldVehicle: VehicleRecord;
            newVehicle: VehicleRecord;
        };
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    deactivateVehicle(actor: VaultActor, vehicleId: string, reason: string): Promise<{
        ok: true;
        value: VehicleRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    activateVehicle(actor: VaultActor, vehicleId: string): Promise<{
        ok: true;
        value: VehicleRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    updateVehicle(actor: VaultActor, vehicleId: string, updates: Partial<VehicleRecord>): Promise<{
        ok: true;
        value: VehicleRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    normalizeVehicleNumber(number: string): string;
    checkDuplicate(societyId: string, normalizedNumber: string): VehicleRecord | undefined;
    getVehicle(vehicleId: string): VehicleRecord | undefined;
    getVehicleByNumber(societyId: string, normalizedNumber: string): VehicleRecord | undefined;
    getVehiclesByUnit(unitId: string): readonly VehicleRecord[];
    getVehiclesBySociety(societyId: string): readonly VehicleRecord[];
}
export type VehicleRegistrationRequest = {
    readonly scope: ParkingVaultScope;
    readonly vehicleNumber: string;
    readonly vehicleType: ParkingVehicleType;
    readonly makeModel: string;
    readonly color: string;
    readonly fuelType: FuelType;
    readonly ownerName: string;
    readonly linkedResidentName: string;
    readonly linkedFlat: string;
    readonly insuranceExpiry: string | undefined;
    readonly pollutionCertificateExpiry: string | undefined;
    readonly idempotencyKey: string;
};
export type VerificationRequest = {
    readonly vehicleId: string;
    readonly action: 'APPROVE' | 'REJECT' | 'REQUEST_RESUBMISSION';
    readonly reason: string | undefined;
    readonly checklistItems: readonly string[];
};
export type RejectionRequest = {
    readonly vehicleId: string;
    readonly reason: string;
    readonly resubmissionAllowed: boolean;
    readonly resubmissionDeadline: string | undefined;
};
export type ResubmissionRequest = {
    readonly vehicleId: string;
    readonly reason: string;
    readonly idempotencyKey: string;
};
export type ReplacementRequest = {
    readonly oldVehicleId: string;
    readonly newVehicle: Omit<VehicleRegistrationRequest, 'scope' | 'idempotencyKey'>;
    readonly idempotencyKey: string;
};
function fail(code: ParkingVaultErrorCode, message: string) {
    return { ok: false, code, message };
}
function firstViolation(violations: readonly ParkingVaultViolation[]): ParkingVaultViolation {
    return violations[0] ?? violation('VALIDATION_FAILED', 'request', 'Request rejected.');
}
function advanceVehicle(vehicle: VehicleRecord, nextVerificationStatus: VehicleVerificationStatus, patch: Partial<VehicleRecord> = {}): VehicleRecord {
    const revision = vehicle.revision.revision + 1;
    return {
        ...vehicle,
        ...patch,
        verificationStatus: nextVerificationStatus,
        revision: { revision, revisionToken: `rev-${vehicle.id}-${revision}` },
    };
}
function advanceVehicleState(vehicle: VehicleRecord, nextState: string, patch: Partial<VehicleRecord> = {}): VehicleRecord {
    const revision = vehicle.revision.revision + 1;
    return {
        ...vehicle,
        ...patch,
        isActive: nextState === 'ACTIVE',
        revision: { revision: vehicle.revision.revision + 1, revisionToken: `rev-${vehicle.id}-${vehicle.revision.revision + 1}` },
    };
}
function vehicleBelongsToActor(vehicle: VehicleRecord, actor: VaultActor): boolean {
    return vehicle.societyId === actor.societyId;
}
function normalizeVehicleNumber(number: string): string {
    return number.trim().toUpperCase().replace(/\s+/g, '');
}
export function createVehicleService(ports: {
    readonly clock: ParkingVaultClock;
    readonly vehicles: {
        readonly insert: (vehicle: VehicleRecord) => boolean;
        readonly update: (vehicle: VehicleRecord, expectedRevision: number) => boolean;
        readonly read: (vehicleId: string) => any;
        readonly readByNumber: (societyId: string, normalizedNumber: string) => any;
        readonly listBySociety: (societyId: string) => readonly any[];
        readonly listByUnit: (societyId: string, unitId: string) => readonly any[];
    };
    readonly audit: {
        readonly emit: (entry: any) => void;
    };
}): VehicleService {
    const now = (): string => ports.clock.now().toISOString();
    const persist = (vehicle: VehicleRecord) => ports.vehicles.update(vehicle, vehicle.revision.revision)
        ? { ok: true as const, value: vehicle, warnings: [] as const }
        : { ok: false as const, code: 'CONCURRENT_WRITE' as const, message: `Vehicle was modified concurrently.` };
    const registerVehicle = async (actor: VaultActor, input: VehicleRegistrationRequest) => {
        if (input.idempotencyKey.trim().length === 0) {
            return fail('IDEMPOTENCY_KEY_REQUIRED', 'An idempotency key is required to register a vehicle.');
        }
        if (input.scope.societyId !== actor.societyId) {
            return fail('CROSS_SOCIETY_BLOCKED', 'The vehicle scope does not match the authenticated society.');
        }
        const permission = evaluateActionPermission(actor, 'VEHICLE_REGISTER');
        if (!permission.allowed)
            return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to register vehicle.');
        const boundary = evaluateTenantBoundary(actor, { societyId: input.scope.societyId } as any);
        if (!boundary.allowed)
            return fail('CROSS_SOCIETY_BLOCKED', 'Cross-society access blocked.');
        const normalized = normalizeVehicleNumber(input.vehicleNumber);
        const existing = ports.vehicles.readByNumber(input.scope.societyId, normalized);
        if (existing) {
            return fail('VEHICLE_ALREADY_REGISTERED', 'A vehicle with this registration number already exists in this society.');
        }
        const vehicleId = `vehicle-${input.idempotencyKey}`;
        const replay = ports.vehicles.read(vehicleId);
        if (replay)
            return { ok: true, value: replay, warnings: ['IDEMPOTENT_REPLAY'] };
        const now = ports.clock.now().toISOString();
        const vehicle: VehicleRecord = {
            id: vehicleId,
            societyId: input.scope.societyId,
            owningEntityType: input.scope.owningEntityType,
            owningEntityId: input.scope.owningEntityId,
            vehicleNumber: input.vehicleNumber,
            normalizedVehicleNumber: normalized,
            vehicleType: input.vehicleType,
            makeModel: input.makeModel,
            color: input.color,
            fuelType: input.fuelType,
            isEv: input.fuelType === 'ELECTRIC' || input.vehicleType === 'EV',
            ownerName: input.ownerName,
            linkedResidentName: input.linkedResidentName,
            linkedFlat: input.linkedFlat,
            verificationStatus: 'PENDING',
            verificationCaseId: undefined,
            registrationDocumentStatus: 'NOT_UPLOADED',
            insuranceExpiry: input.insuranceExpiry,
            pollutionCertificateExpiry: input.pollutionCertificateExpiry,
            stickerStatus: 'NOT_ISSUED',
            stickerNumber: undefined,
            stickerIssuedAt: undefined,
            stickerValidUntil: undefined,
            rfidStatus: 'NOT_CONFIGURED',
            rfidTagNumber: undefined,
            rfidIssuedAt: undefined,
            rfidRevokedAt: undefined,
            activeAllocationId: undefined,
            activeAllocationStatus: undefined,
            isActive: true,
            lastGateEntry: undefined,
            notes: undefined,
            createdAt: ports.clock.now().toISOString(),
            createdBy: actor.userId,
            updatedAt: ports.clock.now().toISOString(),
            revision: { revision: 1, revisionToken: `rev-${vehicleId}-1` },
            trace: { correlationId: input.idempotencyKey, causationId: undefined },
        };
        if (!ports.vehicles.insert(vehicle))
            return fail('CONCURRENT_WRITE', 'Vehicle already exists.');
        ports.audit.emit({
            id: `aud-${vehicleId}`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: vehicle.trace.correlationId,
            actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
            action: 'CREATE',
            entityType: 'VEHICLE',
            entityId: vehicleId,
            previousState: undefined,
            newState: { vehicleNumber: normalized, vehicleType: input.vehicleType },
            metadata: { idempotencyKey: input.idempotencyKey, source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return { ok: true, value: vehicle, warnings: [] };
    };
    const verifyVehicle = async (actor: VaultActor, input: VerificationRequest) => {
        const vehicle = ports.vehicles.read(input.vehicleId);
        if (!vehicle)
            return fail('AGGREGATE_NOT_FOUND', 'Vehicle not found.');
        if (!vehicleBelongsToActor(vehicle, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Vehicle belongs to different society.');
        if (!isVerificationReviewable(vehicle.verificationStatus)) {
            return fail('ILLEGAL_TRANSITION', 'Vehicle is not in a reviewable state.');
        }
        const permission = evaluateActionPermission(actor, 'VEHICLE_VERIFY');
        if (!permission.allowed)
            return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to verify vehicle.');
        const targetState = input.action === 'APPROVE' ? 'APPROVED' : input.action === 'REJECT' ? 'REJECTED' : 'RESUBMISSION_REQUIRED';
        const transition = canTransitionVerification(vehicle.verificationStatus, targetState);
        if (!transition.allowed)
            return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');
        if (input.action === 'APPROVE' && input.checklistItems.length === 0) {
            return fail('VERIFICATION_CHECKLIST_INCOMPLETE', 'All checklist items must be completed for approval.');
        }
        const updated = advanceVehicle(vehicle, targetState, {
            verificationCaseId: input.action === 'APPROVE' ? `vc-${vehicle.id}` : vehicle.verificationCaseId,
            updatedAt: ports.clock.now().toISOString(),
        });
        const saved = ports.vehicles.update(updated, vehicle.revision.revision)
            ? { ok: true as const, value: updated, warnings: [] as const }
            : fail('CONCURRENT_WRITE', 'Vehicle was modified concurrently.');
        if (!saved.ok)
            return saved;
        ports.audit.emit({
            id: `aud-${vehicle.id}-verify`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: vehicle.trace.correlationId,
            actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
            action: input.action,
            entityType: 'VEHICLE_VERIFICATION',
            entityId: vehicle.id,
            previousState: { status: vehicle.verificationStatus },
            newState: { status: targetState, reason: input.reason },
            metadata: { source: 'MOBILE', checklistItems: input.checklistItems },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const rejectVehicle = async (actor: VaultActor, input: RejectionRequest) => {
        const vehicle = ports.vehicles.read(input.vehicleId);
        if (!vehicle)
            return fail('AGGREGATE_NOT_FOUND', 'Vehicle not found.');
        if (!vehicleBelongsToActor(vehicle, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Vehicle belongs to different society.');
        if (!isVerificationReviewable(vehicle.verificationStatus)) {
            return fail('ILLEGAL_TRANSITION', 'Vehicle is not in a reviewable state.');
        }
        const permission = evaluateActionPermission(actor, 'VEHICLE_VERIFY');
        if (!permission.allowed)
            return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to reject vehicle.');
        if (!input.reason.trim())
            return fail('VERIFICATION_REASON_REQUIRED', 'Rejection reason is required.');
        const targetState = input.resubmissionAllowed ? 'RESUBMISSION_REQUIRED' : 'REJECTED';
        const transition = canTransitionVerification(vehicle.verificationStatus, targetState);
        if (!transition.allowed)
            return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');
        const updated = advanceVehicle(vehicle, targetState, {
            updatedAt: ports.clock.now().toISOString(),
            notes: input.reason,
        });
        if (input.resubmissionAllowed) {
            const resubmissionDeadline = input.resubmissionDeadline || ports.clock.now().toISOString();
        }
        const saved = ports.vehicles.update(advanceVehicle(vehicle, targetState, { updatedAt: ports.clock.now().toISOString(), notes: input.reason }), vehicle.revision.revision) ? { ok: true as const, value: vehicle, warnings: [] as const } : fail('CONCURRENT_WRITE', 'Vehicle was modified concurrently.');
        if (!saved.ok)
            return saved;
        ports.audit.emit({
            id: `aud-${vehicle.id}-reject`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: vehicle.trace.correlationId,
            actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
            action: 'REJECT',
            entityType: 'VEHICLE_VERIFICATION',
            entityId: vehicle.id,
            previousState: { status: vehicle.verificationStatus },
            newState: { status: targetState, reason: input.reason },
            metadata: { source: 'MOBILE', resubmissionAllowed: input.resubmissionAllowed },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const requestResubmission = async (actor: VaultActor, vehicleId: string, reason: string) => {
        const vehicle = ports.vehicles.read(vehicleId);
        if (!vehicle)
            return fail('AGGREGATE_NOT_FOUND', 'Vehicle not found.');
        if (!vehicleBelongsToActor(vehicle, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Vehicle belongs to different society.');
        if (vehicle.verificationStatus !== 'RESUBMISSION_REQUIRED') {
            return fail('ILLEGAL_TRANSITION', 'Vehicle is not in resubmission required state.');
        }
        const updated = advanceVehicle(vehicle, 'PENDING', {
            updatedAt: ports.clock.now().toISOString(),
            notes: reason,
        });
        const saved = persist(advanceVehicle(vehicle, 'PENDING', { updatedAt: ports.clock.now().toISOString(), notes: reason }));
        if (!saved.ok)
            return saved;
        ports.audit.emit({
            id: `aud-${vehicle.id}-resubmit`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: vehicle.trace.correlationId,
            actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
            action: 'RESUBMIT',
            entityType: 'VEHICLE_VERIFICATION',
            entityId: vehicle.id,
            previousState: { status: vehicle.verificationStatus },
            newState: { status: 'PENDING', reason },
            metadata: { source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const replaceVehicle = async (actor: VaultActor, input: ReplacementRequest) => {
        const oldVehicle = ports.vehicles.read(input.oldVehicleId);
        if (!oldVehicle)
            return fail('AGGREGATE_NOT_FOUND', 'Old vehicle not found.');
        if (!vehicleBelongsToActor(oldVehicle, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Old vehicle belongs to different society.');
        if (!canVehicleBeReplaced(oldVehicle.isActive ? 'ACTIVE' : 'INACTIVE')) {
            return fail('ILLEGAL_TRANSITION', 'Old vehicle cannot be replaced in its current state.');
        }
        const permission = evaluateActionPermission(actor, 'VEHICLE_REPLACE');
        if (!permission.allowed)
            return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to replace vehicle.');
        const normalized = normalizeVehicleNumber(input.newVehicle.vehicleNumber);
        const existing = ports.vehicles.readByNumber(actor.societyId, normalized);
        if (existing && existing.id !== input.oldVehicleId) {
            return fail('VEHICLE_ALREADY_REGISTERED', 'A vehicle with this registration number already exists.');
        }
        const now = ports.clock.now().toISOString();
        const newVehicleId = `vehicle-replace-${input.idempotencyKey}`;
        const newVehicle: VehicleRecord = {
            id: newVehicleId,
            societyId: actor.societyId,
            owningEntityType: 'RESIDENT',
            owningEntityId: oldVehicle.owningEntityId,
            vehicleNumber: input.newVehicle.vehicleNumber,
            normalizedVehicleNumber: normalizeVehicleNumber(input.newVehicle.vehicleNumber),
            vehicleType: input.newVehicle.vehicleType,
            makeModel: input.newVehicle.makeModel,
            color: input.newVehicle.color,
            fuelType: input.newVehicle.fuelType,
            isEv: input.newVehicle.fuelType === 'ELECTRIC' || input.newVehicle.vehicleType === 'EV',
            ownerName: input.newVehicle.ownerName,
            linkedResidentName: input.newVehicle.linkedResidentName,
            linkedFlat: input.newVehicle.linkedFlat,
            verificationStatus: 'PENDING',
            verificationCaseId: undefined,
            registrationDocumentStatus: 'NOT_UPLOADED',
            insuranceExpiry: input.newVehicle.insuranceExpiry,
            pollutionCertificateExpiry: input.newVehicle.pollutionCertificateExpiry,
            stickerStatus: 'NOT_ISSUED',
            stickerNumber: undefined,
            stickerIssuedAt: undefined,
            stickerValidUntil: undefined,
            rfidStatus: 'NOT_CONFIGURED',
            rfidTagNumber: undefined,
            rfidIssuedAt: undefined,
            rfidRevokedAt: undefined,
            activeAllocationId: oldVehicle.activeAllocationId,
            activeAllocationStatus: oldVehicle.activeAllocationStatus,
            isActive: true,
            lastGateEntry: undefined,
            notes: undefined,
            createdAt: ports.clock.now().toISOString(),
            createdBy: actor.userId,
            updatedAt: now,
            revision: { revision: 1, revisionToken: `rev-${newVehicleId}-1` },
            trace: { correlationId: input.idempotencyKey, causationId: oldVehicle.trace.correlationId },
        };
        if (!ports.vehicles.insert(newVehicle))
            return fail('CONCURRENT_WRITE', 'New vehicle already exists.');
        const deactivatedOld = advanceVehicleState(oldVehicle, 'REPLACED', {
            isActive: false,
            updatedAt: now,
        });
        const oldSaved = ports.vehicles.update(deactivatedOld, oldVehicle.revision.revision)
            ? { ok: true as const, value: deactivatedOld, warnings: [] as const }
            : fail('CONCURRENT_WRITE', 'Old vehicle was modified concurrently.');
        if (!oldSaved.ok) {
            ports.vehicles.read(newVehicle.id);
            return fail('CONCURRENT_WRITE', 'Failed to deactivate old vehicle.');
        }
        const allocationId = oldVehicle.activeAllocationId;
        if (allocationId) {
        }
        ports.audit.emit({
            id: `aud-replace-${oldVehicle.id}`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: oldVehicle.trace.correlationId,
            actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
            action: 'REPLACE',
            entityType: 'VEHICLE',
            entityId: oldVehicle.id,
            previousState: { vehicleId: oldVehicle.id, vehicleNumber: oldVehicle.vehicleNumber },
            newState: { newVehicleId, vehicleNumber: normalized, allocationId: oldVehicle.activeAllocationId },
            metadata: { source: 'MOBILE', idempotencyKey: input.idempotencyKey },
            outcome: 'SUCCESS',
        });
        return { ok: true as const, value: { oldVehicle: deactivatedOld, newVehicle }, warnings: [] };
    };
    const deactivateVehicle = async (actor: VaultActor, vehicleId: string, reason: string) => {
        const vehicle = ports.vehicles.read(vehicleId);
        if (!vehicle)
            return fail('AGGREGATE_NOT_FOUND', 'Vehicle not found.');
        if (!vehicleBelongsToActor(vehicle, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Vehicle belongs to different society.');
        if (!vehicle.isActive)
            return fail('TERMINAL_STATE', 'Vehicle is already inactive.');
        const updated = advanceVehicleState(vehicle, 'DEACTIVATED', {
            updatedAt: ports.clock.now().toISOString(),
            notes: reason,
        });
        const saved = persist(updated);
        if (!saved.ok)
            return saved;
        ports.audit.emit({
            id: `aud-${vehicle.id}-deactivate`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: vehicle.trace.correlationId,
            actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
            action: 'DEACTIVATE',
            entityType: 'VEHICLE',
            entityId: vehicleId,
            previousState: { isActive: vehicle.isActive },
            newState: { isActive: false, reason },
            metadata: { source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const activateVehicle = async (actor: VaultActor, vehicleId: string) => {
        const vehicle = ports.vehicles.read(vehicleId);
        if (!vehicle)
            return fail('AGGREGATE_NOT_FOUND', 'Vehicle not found.');
        if (!vehicleBelongsToActor(vehicle, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Vehicle belongs to different society.');
        if (vehicle.isActive)
            return { ok: true as const, value: vehicle, warnings: ['ALREADY_ACTIVE'] as const };
        const updated = advanceVehicleState(vehicle, 'ACTIVE', { updatedAt: ports.clock.now().toISOString() });
        const saved = persist(updated);
        if (!saved.ok)
            return saved;
        ports.audit.emit({
            id: `aud-${vehicle.id}-activate`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: vehicle.trace.correlationId,
            actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
            action: 'ACTIVATE',
            entityType: 'VEHICLE',
            entityId: vehicleId,
            previousState: { isActive: vehicle.isActive },
            newState: { isActive: true },
            metadata: { source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const updateVehicle = async (actor: VaultActor, vehicleId: string, updates: Partial<VehicleRecord>) => {
        const vehicle = ports.vehicles.read(vehicleId);
        if (!vehicle)
            return fail('AGGREGATE_NOT_FOUND', 'Vehicle not found.');
        if (!vehicleBelongsToActor(vehicle, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Vehicle belongs to different society.');
        const permission = evaluateActionPermission(actor, 'VEHICLE_UPDATE');
        if (!permission.allowed)
            return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to update vehicle.');
        const updated = { ...vehicle, ...updates, updatedAt: ports.clock.now().toISOString(), revision: { revision: vehicle.revision.revision + 1, revisionToken: `rev-${vehicle.id}-${vehicle.revision.revision + 1}` } };
        const saved = persist(updated);
        if (!saved.ok)
            return saved;
        ports.audit.emit({
            id: `aud-${vehicle.id}-update`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: vehicle.trace.correlationId,
            actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
            action: 'UPDATE',
            entityType: 'VEHICLE',
            entityId: vehicleId,
            previousState: { vehicle },
            newState: { updates },
            metadata: { source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const normalizeVehicleNumber = (number: string): string => {
        return number.trim().toUpperCase().replace(/\s+/g, '');
    };
    const checkDuplicate = (societyId: string, normalizedNumber: string) => {
        return ports.vehicles.readByNumber(societyId, normalizedNumber);
    };
    const getVehicle = (vehicleId: string) => ports.vehicles.read(vehicleId);
    const getVehicleByNumber = (societyId: string, normalizedNumber: string) => ports.vehicles.readByNumber(societyId, normalizedNumber);
    const getVehiclesByUnit = (unitId: string) => ports.vehicles.listByUnit('society-001', unitId);
    const getVehiclesBySociety = (societyId: string) => ports.vehicles.listBySociety(societyId);
    function persist(vehicle: VehicleRecord) {
        return ports.vehicles.update(vehicle, vehicle.revision.revision)
            ? { ok: true as const, value: vehicle, warnings: [] as const }
            : fail('CONCURRENT_WRITE', 'Vehicle was modified concurrently.');
    }
    function fail(code: ParkingVaultErrorCode, message: string) {
        return { ok: false, code, message };
    }
    return {
        registerVehicle,
        verifyVehicle,
        rejectVehicle,
        requestResubmission,
        replaceVehicle,
        deactivateVehicle,
        activateVehicle,
        updateVehicle,
        normalizeVehicleNumber,
        checkDuplicate,
        getVehicle,
        getVehicleByNumber,
        getVehiclesByUnit,
        getVehiclesBySociety,
    };
}

