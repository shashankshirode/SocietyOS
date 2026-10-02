import type { ParkingVaultErrorCode, ParkingVaultViolation, ParkingVaultClock, ParkingVaultActor, VaultActor, ParkingVaultScope, TraceContext, Revision, } from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type { ParkingSlotRecord, AllocationRecord, AllocationType, AllocationStatus, AllocationApproval, ParkingVaultScope, } from '../domain/types/parking';
import { canTransitionAllocation, canTransitionTemporary, isAllocationActive, isAllocationAvailable, getValidNextStates, } from '../domain/stateMachines/allocationStateMachine';
import { evaluateActionPermission, evaluateTenantBoundary } from '../domain/guards/authorizationGuard';
export interface AllocationService {
    requestAllocation(actor: VaultActor, input: AllocationRequest): Promise<{
        ok: true;
        value: AllocationRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    approveAllocation(actor: VaultActor, allocationId: string, level: number): Promise<{
        ok: true;
        value: AllocationRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    rejectAllocation(actor: VaultActor, allocationId: string, reason: string): Promise<{
        ok: true;
        value: AllocationRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    confirmAllocation(actor: VaultActor, allocationId: string): Promise<{
        ok: true;
        value: AllocationRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    transferAllocation(actor: VaultActor, input: TransferRequest): Promise<{
        ok: true;
        value: AllocationRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    endAllocation(actor: VaultActor, allocationId: string, reason: string): Promise<{
        ok: true;
        value: AllocationRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    createTemporaryAllocation(actor: VaultActor, input: TemporaryAllocationRequest): Promise<{
        ok: true;
        value: AllocationRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    extendTemporaryAllocation(actor: VaultActor, allocationId: string, newEndDate: string): Promise<{
        ok: true;
        value: AllocationRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    expireTemporaryAllocation(actor: VaultActor, allocationId: string): Promise<{
        ok: true;
        value: AllocationRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    revokeAllocation(actor: VaultActor, allocationId: string, reason: string): Promise<{
        ok: true;
        value: AllocationRecord;
        warnings: readonly string[];
    } | {
        ok: false;
        code: ParkingVaultErrorCode;
        message: string;
    }>;
    getAllocation(allocationId: string): AllocationRecord | undefined;
    getAllocationsBySlot(slotId: string): readonly AllocationRecord[];
    getAllocationsByVehicle(vehicleId: string): readonly AllocationRecord[];
    getAllocationsByUnit(unitId: string): readonly AllocationRecord[];
    getActiveAllocationBySlot(slotId: string): AllocationRecord | undefined;
    getActiveAllocationByVehicle(vehicleId: string): AllocationRecord | undefined;
    sweepExpiredTemporaryAllocations(): readonly string[];
}
export type AllocationRequest = {
    readonly scope: ParkingVaultScope;
    readonly allocationType: AllocationType;
    readonly slotId: string;
    readonly vehicleId: string | undefined;
    readonly vehicleNumber: string | undefined;
    readonly effectiveFrom: string;
    readonly effectiveTo: string | undefined;
    readonly chargeAmount: number | undefined;
    readonly depositAmount: number | undefined;
    readonly approvalRequired: boolean;
    readonly approvalChain: readonly AllocationApproval[];
    readonly reason: string;
    readonly idempotencyKey: string;
};
export type TransferRequest = {
    readonly scope: ParkingVaultScope;
    readonly currentAllocationId: string;
    readonly targetSlotId: string;
    readonly newEffectiveFrom: string;
    readonly reason: string;
    readonly idempotencyKey: string;
};
export type TemporaryAllocationRequest = {
    readonly scope: ParkingVaultScope;
    readonly slotId: string;
    readonly vehicleId: string;
    readonly vehicleNumber: string;
    readonly effectiveFrom: string;
    readonly effectiveTo: string;
    readonly reason: string;
    readonly chargeAmount: number | undefined;
    readonly depositAmount: number | undefined;
    readonly approvalRequired: boolean;
    readonly approvalChain: readonly AllocationApproval[];
    readonly idempotencyKey: string;
};
function fail(code: ParkingVaultErrorCode, message: string) {
    return { ok: false, code, message };
}
function firstViolation(violations: readonly ParkingVaultViolation[]): ParkingVaultViolation {
    return violations[0] ?? violation('VALIDATION_FAILED', 'request', 'Request rejected.');
}
function advance(allocation: AllocationRecord, nextStatus: AllocationStatus, patch: Partial<AllocationRecord> = {}): AllocationRecord {
    const revision = allocation.revision.revision + 1;
    return {
        ...allocation,
        ...patch,
        status: nextStatus,
        revision: { revision, revisionToken: `rev-${allocation.id}-${revision}` },
    };
}
function allocationBelongsToActor(allocation: AllocationRecord, actor: VaultActor): boolean {
    return allocation.scope.societyId === actor.societyId;
}
export function createAllocationService(ports: {
    readonly clock: ParkingVaultClock;
    readonly allocations: {
        readonly insert: (allocation: any) => boolean;
        readonly update: (allocation: any, expectedRevision: number) => boolean;
        readonly read: (allocationId: string) => any;
        readonly listBySlot: (slotId: string) => readonly any[];
        readonly listByVehicle: (vehicleId: string) => readonly any[];
        readonly listByUnit: (societyId: string, unitId: string) => readonly any[];
        readonly findActiveBySlot: (slotId: string) => any;
        readonly findActiveByVehicle: (vehicleId: string) => any;
    };
    readonly slots: {
        readonly read: (slotId: string) => any;
        readonly update: (slot: any, expectedRevision: number) => boolean;
        readonly listBySociety: (societyId: string) => readonly any[];
    };
    readonly vehicles: {
        readonly read: (vehicleId: string) => any;
    };
    readonly audit: {
        readonly emit: (entry: any) => void;
    };
}): AllocationService {
    const now = (): string => ports.clock.now().toISOString();
    const persist = (allocation: AllocationRecord) => ports.allocations.update(allocation, allocation.revision.revision)
        ? { ok: true as const, value: allocation, warnings: [] as const }
        : fail('CONCURRENT_WRITE', `Allocation ${allocation.id} was modified concurrently.`);
    const requestAllocation = async (actor: VaultActor, input: AllocationRequest) => {
        if (input.idempotencyKey.trim().length === 0) {
            return fail('IDEMPOTENCY_KEY_REQUIRED', 'An idempotency key is required to create an allocation.');
        }
        if (input.scope.societyId !== actor.societyId) {
            return fail('CROSS_SOCIETY_BLOCKED', 'The allocation scope does not match the authenticated society.');
        }
        const slot = ports.slots.read(input.slotId);
        if (!slot) {
            return fail('AGGREGATE_NOT_FOUND', `Slot ${input.slotId} does not exist.`);
        }
        if (slot.societyId !== actor.societyId) {
            return fail('CROSS_SOCIETY_BLOCKED', 'The slot belongs to a different society.');
        }
        const permission = evaluateActionPermission(actor, 'PARKING_ALLOCATE');
        if (!permission.allowed) {
            return fail('ACTOR_NOT_AUTHORIZED', firstViolation(permission.violations).detail ?? 'Not authorized to allocate parking.');
        }
        const boundary = evaluateTenantBoundary(actor, slot);
        if (!boundary.allowed) {
            return fail('CROSS_SOCIETY_BLOCKED', firstViolation(boundary.violations).detail ?? 'Cross-society access blocked.');
        }
        if (!isAllocationAvailable(slot.currentAllocationStatus)) {
            return fail('SLOT_UNAVAILABLE', `The slot is ${slot.currentAllocationStatus} and cannot be allocated.`);
        }
        if (input.vehicleId) {
            const vehicle = ports.vehicles.read(input.vehicleId);
            if (!vehicle) {
                return fail('AGGREGATE_NOT_FOUND', `Vehicle ${input.vehicleId} does not exist.`);
            }
            if (vehicle.societyId !== actor.societyId) {
                return fail('CROSS_SOCIETY_BLOCKED', 'The vehicle belongs to a different society.');
            }
            if (vehicle.verificationStatus !== 'VERIFIED' && vehicle.verificationStatus !== 'APPROVED') {
                return fail('VEHICLE_NOT_VERIFIED', 'Vehicle must be verified before allocation.');
            }
        }
        const activeBySlot = ports.allocations.findActiveBySlot(input.slotId);
        if (activeBySlot) {
            return fail('ALLOCATION_CONFLICT', 'The slot already has an active allocation.');
        }
        if (input.vehicleId) {
            const activeByVehicle = ports.allocations.findActiveByVehicle(input.vehicleId);
            if (activeByVehicle) {
                return fail('ALLOCATION_CONFLICT', 'The vehicle already has an active allocation.');
            }
        }
        const allocationId = `alloc-${input.idempotencyKey}`;
        const replay = ports.allocations.read(allocationId);
        if (replay) {
            return { ok: true, value: replay, warnings: ['IDEMPOTENT_REPLAY'] };
        }
        const now = ports.clock.now().toISOString();
        const allocation: AllocationRecord = {
            id: allocationId,
            scope: input.scope,
            allocationType: input.allocationType,
            status: input.approvalRequired ? 'PENDING_APPROVAL' : 'ALLOCATED',
            slotId: input.slotId,
            slotNumber: '',
            vehicleId: input.vehicleId,
            vehicleNumber: input.vehicleNumber,
            beneficiaryUnitId: input.scope.owningEntityId,
            beneficiaryFlat: '',
            effectiveFrom: input.effectiveFrom,
            effectiveTo: input.effectiveTo,
            approvalChain: input.approvalChain,
            approvalRequired: input.approvalRequired,
            chargeAmount: input.chargeAmount,
            depositAmount: input.depositAmount,
            supersededAt: undefined,
            supersededByAllocationId: undefined,
            transferReason: undefined,
            createdAt: now(),
            createdBy: actor.userId,
            updatedAt: now(),
            revision: { revision: 1, revisionToken: `rev-${allocationId}-1` },
            trace: { correlationId: input.idempotencyKey, causationId: undefined },
        };
        const inserted = ports.allocations.insert(allocation);
        if (!inserted) {
            return fail('CONCURRENT_WRITE', `Allocation ${allocationId} already exists.`);
        }
        const slotUpdated = ports.slots.update({ ...slot, currentAllocationId: allocationId, currentAllocationStatus: allocation.status }, slot.revision.revision);
        if (!slotUpdated) {
            return fail('CONCURRENT_WRITE', 'Slot was modified concurrently.');
        }
        ports.audit.emit({
            id: `aud-${allocationId}`,
            timestamp: now(),
            correlationId: allocation.trace.correlationId,
            actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
            action: 'CREATE',
            entityType: 'PARKING_ALLOCATION',
            entityId: allocationId,
            previousState: undefined,
            newState: { status: allocation.status, slotId: input.slotId, vehicleId: input.vehicleId },
            metadata: { idempotencyKey: input.idempotencyKey, source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return { ok: true as const, value: allocation, warnings: [] as const };
    };
    const approveAllocation = async (actor: VaultActor, allocationId: string, level: number) => {
        const allocation = ports.allocations.read(allocationId);
        if (!allocation)
            return fail('AGGREGATE_NOT_FOUND', `Allocation ${allocationId} not found.`);
        if (!allocationBelongsToActor(allocation, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Allocation belongs to different society.');
        const permission = evaluateActionPermission(actor, 'PARKING_APPROVE');
        if (!permission.allowed)
            return fail('ACTOR_NOT_AUTHORIZED', firstViolation(permission.violations).detail ?? 'Not authorized to approve allocation.');
        if (allocation.status !== 'PENDING_APPROVAL')
            return fail('ILLEGAL_TRANSITION', 'Allocation is not pending approval.');
        const approval: AllocationApproval = {
            approverUserId: actor.userId,
            approverRole: actor.role,
            approvedAt: ports.clock.now().toISOString(),
            level,
        };
        const updatedApprovalChain = [...allocation.approvalChain, approval];
        const allApproved = updatedApprovalChain.length >= allocation.approvalChain.length;
        const nextStatus = allApproved ? 'ALLOCATED' : 'PENDING_APPROVAL';
        const transition = canTransitionAllocation(allocation.status, nextStatus);
        if (!transition.allowed)
            return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');
        const updated = advance(allocation, nextStatus, {
            approvalChain: updatedApprovalChain,
            updatedAt: ports.clock.now().toISOString(),
        });
        const saved = persist(updated);
        if (!saved.ok)
            return saved;
        ports.audit.emit({
            id: `aud-${allocationId}-approve-${level}`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: allocation.trace.correlationId,
            actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
            action: 'APPROVE',
            entityType: 'PARKING_ALLOCATION',
            entityId: allocationId,
            previousState: { status: allocation.status },
            newState: { status: nextStatus, approvalChain: updatedApprovalChain },
            metadata: { source: 'MOBILE', level },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const rejectAllocation = async (actor: VaultActor, allocationId: string, reason: string) => {
        const allocation = ports.allocations.read(allocationId);
        if (!allocation)
            return fail('AGGREGATE_NOT_FOUND', `Allocation ${allocationId} not found.`);
        if (!allocationBelongsToActor(allocation, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Allocation belongs to different society.');
        const permission = evaluateActionPermission(actor, 'PARKING_APPROVE');
        if (!permission.allowed)
            return fail('ACTOR_NOT_AUTHORIZED', firstViolation(permission.violations).detail ?? 'Not authorized to reject allocation.');
        if (allocation.status !== 'PENDING_APPROVAL')
            return fail('ILLEGAL_TRANSITION', 'Allocation is not pending approval.');
        const transition = canTransitionAllocation(allocation.status, 'REJECTED');
        if (!transition.allowed)
            return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');
        const updated = advance(allocation, 'REJECTED', {
            updatedAt: ports.clock.now().toISOString(),
        });
        const saved = persist(updated);
        if (!saved.ok)
            return saved;
        ports.audit.emit({
            id: `aud-${allocationId}-reject`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: allocation.trace.correlationId,
            actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
            action: 'REJECT',
            entityType: 'PARKING_ALLOCATION',
            entityId: allocationId,
            previousState: { status: allocation.status },
            newState: { status: 'REJECTED', reason },
            metadata: { source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const confirmAllocation = async (actor: VaultActor, allocationId: string) => {
        const allocation = ports.allocations.read(allocationId);
        if (!allocation)
            return fail('AGGREGATE_NOT_FOUND', `Allocation ${allocationId} not found.`);
        if (!allocationBelongsToActor(allocation, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Allocation belongs to different society.');
        if (allocation.status !== 'PENDING_APPROVAL' && allocation.status !== 'PAYMENT_PENDING') {
            return fail('ILLEGAL_TRANSITION', 'Allocation is not in a confirmable state.');
        }
        const transition = canTransitionAllocation(allocation.status, 'ALLOCATED');
        if (!transition.allowed)
            return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');
        const updated = advance(allocation, 'ALLOCATED', {
            updatedAt: ports.clock.now().toISOString(),
        });
        const saved = persist(updated);
        if (!saved.ok)
            return saved;
        const slot = ports.slots.read(allocation.slotId);
        if (slot) {
            const slotUpdated = ports.slots.update({ ...slot, currentAllocationId: allocationId, currentAllocationStatus: 'ALLOCATED' }, slot.revision.revision);
            if (!slotUpdated)
                return fail('CONCURRENT_WRITE', 'Slot was modified concurrently.');
        }
        ports.audit.emit({
            id: `aud-${allocationId}-confirm`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: allocation.trace.correlationId,
            actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
            action: 'CONFIRM',
            entityType: 'PARKING_ALLOCATION',
            entityId: allocationId,
            previousState: { status: allocation.status },
            newState: { status: 'ALLOCATED' },
            metadata: { source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const transferAllocation = async (actor: VaultActor, input: TransferRequest) => {
        const currentAllocation = ports.allocations.read(input.currentAllocationId);
        if (!currentAllocation)
            return fail('AGGREGATE_NOT_FOUND', `Current allocation ${input.currentAllocationId} not found.`);
        if (!allocationBelongsToActor(currentAllocation, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Current allocation belongs to different society.');
        const targetSlot = ports.slots.read(input.targetSlotId);
        if (!targetSlot)
            return fail('AGGREGATE_NOT_FOUND', `Target slot ${input.targetSlotId} not found.`);
        if (targetSlot.societyId !== actor.societyId)
            return fail('CROSS_SOCIETY_BLOCKED', 'Target slot belongs to different society.');
        const permission = evaluateActionPermission(actor, 'PARKING_TRANSFER');
        if (!permission.allowed)
            return fail('ACTOR_NOT_AUTHORIZED', firstViolation(permission.violations).detail ?? 'Not authorized to transfer allocation.');
        if (!isAllocationActive(currentAllocation.status)) {
            return fail('ILLEGAL_TRANSITION', 'Current allocation is not active and cannot be transferred.');
        }
        const targetActive = ports.allocations.findActiveBySlot(input.targetSlotId);
        if (targetActive)
            return fail('ALLOCATION_CONFLICT', 'Target slot already has an active allocation.');
        const transition = canTransitionAllocation(currentAllocation.status, 'TRANSFERRED');
        if (!transition.allowed)
            return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');
        const nowIso = ports.clock.now().toISOString();
        const endedAllocation = advance(currentAllocation, 'TRANSFERRED', {
            supersededAt: nowIso,
            supersededByAllocationId: undefined,
            transferReason: input.reason,
            updatedAt: nowIso,
        });
        const newAllocationId = `alloc-${input.idempotencyKey}`;
        const newAllocation: AllocationRecord = {
            id: newAllocationId,
            scope: currentAllocation.scope,
            allocationType: currentAllocation.allocationType,
            status: 'ALLOCATED',
            slotId: input.targetSlotId,
            slotNumber: targetSlot.slotNumber,
            vehicleId: currentAllocation.vehicleId,
            vehicleNumber: currentAllocation.vehicleNumber,
            beneficiaryUnitId: currentAllocation.beneficiaryUnitId,
            beneficiaryFlat: currentAllocation.beneficiaryFlat,
            effectiveFrom: input.newEffectiveFrom,
            effectiveTo: currentAllocation.effectiveTo,
            approvalChain: [],
            approvalRequired: false,
            chargeAmount: currentAllocation.chargeAmount,
            depositAmount: currentAllocation.depositAmount,
            supersededAt: nowIso,
            supersededByAllocationId: undefined,
            transferReason: input.reason,
            createdAt: nowIso,
            createdBy: actor.userId,
            updatedAt: nowIso,
            revision: { revision: 1, revisionToken: `rev-${newAllocationId}-1` },
            trace: { correlationId: input.idempotencyKey, causationId: currentAllocation.trace.correlationId },
        };
        const insertNew = ports.allocations.insert(newAllocation);
        if (!insertNew)
            return fail('CONCURRENT_WRITE', `New allocation ${newAllocationId} already exists.`);
        const saveOld = persist(endedAllocation);
        if (!saveOld.ok)
            return saveOld;
        const oldSlot = ports.slots.read(currentAllocation.slotId);
        if (oldSlot) {
            ports.slots.update({ ...oldSlot, currentAllocationId: undefined, currentAllocationStatus: 'AVAILABLE' }, oldSlot.revision.revision);
        }
        const newSlot = ports.slots.read(input.targetSlotId);
        if (newSlot) {
            ports.slots.update({ ...newSlot, currentAllocationId: newAllocationId, currentAllocationStatus: 'ALLOCATED' }, newSlot.revision.revision);
        }
        ports.audit.emit({
            id: `aud-${currentAllocation.id}-transfer`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: currentAllocation.trace.correlationId,
            actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
            action: 'TRANSFER',
            entityType: 'PARKING_ALLOCATION',
            entityId: currentAllocation.id,
            previousState: { status: currentAllocation.status, slotId: currentAllocation.slotId },
            newState: { status: 'TRANSFERRED', newSlotId: input.targetSlotId, newAllocationId },
            metadata: { source: 'MOBILE', reason: input.reason },
            outcome: 'SUCCESS',
        });
        return { ok: true as const, value: newAllocation, warnings: [] as const };
    };
    const endAllocation = async (actor: VaultActor, allocationId: string, reason: string) => {
        const allocation = ports.allocations.read(allocationId);
        if (!allocation)
            return fail('AGGREGATE_NOT_FOUND', `Allocation ${allocationId} not found.`);
        if (!allocationBelongsToActor(allocation, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Allocation belongs to different society.');
        const permission = evaluateActionPermission(actor, 'PARKING_END_ALLOCATION');
        if (!permission.allowed)
            return fail('ACTOR_NOT_AUTHORIZED', firstViolation(permission.violations).detail ?? 'Not authorized to end allocation.');
        if (!isAllocationActive(allocation.status)) {
            return fail('ILLEGAL_TRANSITION', 'Allocation is not active and cannot be ended.');
        }
        const transition = canTransitionAllocation(allocation.status, 'ENDED');
        if (!transition.allowed)
            return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');
        const updated = advance(allocation, 'ENDED', {
            effectiveTo: ports.clock.now().toISOString(),
            updatedAt: ports.clock.now().toISOString(),
            transferReason: reason,
        });
        const saved = persist(updated);
        if (!saved.ok)
            return saved;
        const slot = ports.slots.read(allocation.slotId);
        if (slot) {
            ports.slots.update({ ...slot, currentAllocationId: undefined, currentAllocationStatus: 'AVAILABLE' }, slot.revision.revision);
        }
        ports.audit.emit({
            id: `aud-${allocationId}-end`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: allocation.trace.correlationId,
            actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
            action: 'END_ALLOCATION',
            entityType: 'PARKING_ALLOCATION',
            entityId: allocationId,
            previousState: { status: allocation.status },
            newState: { status: 'ENDED', reason },
            metadata: { source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const createTemporaryAllocation = async (actor: VaultActor, input: TemporaryAllocationRequest) => {
        if (input.idempotencyKey.trim().length === 0) {
            return fail('IDEMPOTENCY_KEY_REQUIRED', 'An idempotency key is required to create a temporary allocation.');
        }
        if (input.scope.societyId !== actor.societyId) {
            return fail('CROSS_SOCIETY_BLOCKED', 'The allocation scope does not match the authenticated society.');
        }
        const slot = ports.slots.read(input.slotId);
        if (!slot)
            return fail('AGGREGATE_NOT_FOUND', `Slot ${input.slotId} does not exist.`);
        if (slot.societyId !== actor.societyId)
            return fail('CROSS_SOCIETY_BLOCKED', 'The slot belongs to a different society.');
        if (!isAllocationAvailable(slot.currentAllocationStatus)) {
            return fail('SLOT_UNAVAILABLE', `The slot is ${slot.currentAllocationStatus} and cannot be allocated.`);
        }
        const vehicle = ports.vehicles.read(input.vehicleId);
        if (!vehicle)
            return fail('AGGREGATE_NOT_FOUND', `Vehicle ${input.vehicleId} does not exist.`);
        if (vehicle.societyId !== actor.societyId)
            return fail('CROSS_SOCIETY_BLOCKED', 'The vehicle belongs to a different society.');
        if (vehicle.verificationStatus !== 'VERIFIED' && vehicle.verificationStatus !== 'APPROVED') {
            return fail('VEHICLE_NOT_VERIFIED', 'Vehicle must be verified before temporary allocation.');
        }
        const activeBySlot = ports.allocations.findActiveBySlot(input.slotId);
        if (activeBySlot)
            return fail('ALLOCATION_CONFLICT', 'The slot already has an active allocation.');
        const activeByVehicle = ports.allocations.findActiveByVehicle(input.vehicleId);
        if (activeByVehicle)
            return fail('ALLOCATION_CONFLICT', 'The vehicle already has an active allocation.');
        const allocationId = `alloc-temp-${input.idempotencyKey}`;
        const replay = ports.allocations.read(allocationId);
        if (replay)
            return { ok: true as const, value: replay, warnings: ['IDEMPOTENT_REPLAY'] as const };
        const now = ports.clock.now().toISOString();
        const allocation: AllocationRecord = {
            id: allocationId,
            scope: input.scope,
            allocationType: 'TEMPORARY',
            status: input.approvalRequired ? 'PENDING_APPROVAL' : 'TEMPORARY_ACTIVE',
            slotId: input.slotId,
            slotNumber: slot.slotNumber,
            vehicleId: input.vehicleId,
            vehicleNumber: input.vehicleNumber,
            beneficiaryUnitId: input.scope.owningEntityId,
            beneficiaryFlat: '',
            effectiveFrom: input.effectiveFrom,
            effectiveTo: input.effectiveTo,
            approvalChain: input.approvalChain,
            approvalRequired: input.approvalRequired,
            chargeAmount: input.chargeAmount,
            depositAmount: input.depositAmount,
            supersededAt: undefined,
            supersededByAllocationId: undefined,
            transferReason: undefined,
            createdAt: now(),
            createdBy: actor.userId,
            updatedAt: now(),
            revision: { revision: 1, revisionToken: `rev-${allocationId}-1` },
            trace: { correlationId: input.idempotencyKey, causationId: undefined },
        };
        const inserted = ports.allocations.insert(allocation);
        if (!inserted)
            return fail('CONCURRENT_WRITE', `Allocation ${allocationId} already exists.`);
        const slotUpdated = ports.slots.update({ ...slot, currentAllocationId: allocationId, currentAllocationStatus: allocation.status }, slot.revision.revision);
        if (!slotUpdated)
            return fail('CONCURRENT_WRITE', 'Slot was modified concurrently.');
        ports.audit.emit({
            id: `aud-${allocationId}`,
            timestamp: now(),
            correlationId: allocation.trace.correlationId,
            actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
            action: 'CREATE',
            entityType: 'PARKING_ALLOCATION',
            entityId: allocationId,
            previousState: undefined,
            newState: { status: allocation.status, slotId: input.slotId, vehicleId: input.vehicleId },
            metadata: { idempotencyKey: input.idempotencyKey, source: 'MOBILE', temporary: true },
            outcome: 'SUCCESS',
        });
        return { ok: true as const, value: allocation, warnings: [] as const };
    };
    const extendTemporaryAllocation = async (actor: VaultActor, allocationId: string, newEndDate: string) => {
        const allocation = ports.allocations.read(allocationId);
        if (!allocation)
            return fail('AGGREGATE_NOT_FOUND', `Allocation ${allocationId} not found.`);
        if (!allocationBelongsToActor(allocation, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Allocation belongs to different society.');
        if (allocation.allocationType !== 'TEMPORARY')
            return fail('ILLEGAL_TRANSITION', 'Only temporary allocations can be extended.');
        if (allocation.status !== 'TEMPORARY_ACTIVE')
            return fail('ILLEGAL_TRANSITION', 'Temporary allocation is not active.');
        const newEnd = new Date(newEndDate);
        const currentEnd = allocation.effectiveTo ? new Date(allocation.effectiveTo) : null;
        if (currentEnd && newEnd <= currentEnd)
            return fail('PRECONDITION_FAILED', 'New end date must be after current end date.');
        const slot = ports.slots.read(allocation.slotId);
        if (slot) {
            const conflicting = ports.allocations.listBySlot(allocation.slotId).find(a => a.id !== allocationId &&
                a.status === 'TEMPORARY_ACTIVE' &&
                new Date(a.effectiveFrom) < new Date(newEndDate) &&
                new Date(a.effectiveTo ?? '9999-12-31') > new Date(allocation.effectiveFrom));
            if (conflicting)
                return fail('ALLOCATION_CONFLICT', 'Extension would conflict with another temporary allocation.');
        }
        const updated = advance(allocation, 'TEMPORARY_ACTIVE', {
            effectiveTo: newEndDate,
            updatedAt: ports.clock.now().toISOString(),
        });
        const saved = persist(updated);
        if (!saved.ok)
            return saved;
        ports.audit.emit({
            id: `aud-${allocationId}-extend`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: allocation.trace.correlationId,
            actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
            action: 'EXTEND',
            entityType: 'PARKING_ALLOCATION',
            entityId: allocationId,
            previousState: { effectiveTo: allocation.effectiveTo },
            newState: { effectiveTo: newEndDate },
            metadata: { source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const expireTemporaryAllocation = async (actor: VaultActor, allocationId: string) => {
        const allocation = ports.allocations.read(allocationId);
        if (!allocation)
            return fail('AGGREGATE_NOT_FOUND', `Allocation ${allocationId} not found.`);
        if (!allocationBelongsToActor(allocation, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Allocation belongs to different society.');
        if (allocation.status !== 'TEMPORARY_ACTIVE')
            return fail('ILLEGAL_TRANSITION', 'Allocation is not in temporary active state.');
        const transition = canTransitionTemporary(allocation.status, 'EXPIRED');
        if (!transition.allowed)
            return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');
        const updated = advance(allocation, 'EXPIRED', {
            updatedAt: ports.clock.now().toISOString(),
        });
        const saved = persist(updated);
        if (!saved.ok)
            return saved;
        const slot = ports.slots.read(allocation.slotId);
        if (slot) {
            ports.slots.update({ ...slot, currentAllocationId: undefined, currentAllocationStatus: 'AVAILABLE' }, slot.revision.revision);
        }
        ports.audit.emit({
            id: `aud-${allocationId}-expire`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: allocation.trace.correlationId,
            actor: { userId: actor.userId, type: 'SYSTEM', role: actor.role, societyId: actor.societyId },
            action: 'EXPIRE',
            entityType: 'PARKING_ALLOCATION',
            entityId: allocationId,
            previousState: { status: allocation.status },
            newState: { status: 'EXPIRED' },
            metadata: { source: 'SYSTEM_JOB' },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const revokeAllocation = async (actor: VaultActor, allocationId: string, reason: string) => {
        const allocation = ports.allocations.read(allocationId);
        if (!allocation)
            return fail('AGGREGATE_NOT_FOUND', `Allocation ${allocationId} not found.`);
        if (!allocationBelongsToActor(allocation, actor))
            return fail('ACTOR_NOT_AUTHORIZED', 'Allocation belongs to different society.');
        if (!isAllocationActive(allocation.status) && allocation.status !== 'TEMPORARY_ACTIVE') {
            return fail('ILLEGAL_TRANSITION', 'Allocation is not active and cannot be revoked.');
        }
        const transition = canTransitionAllocation(allocation.status, 'REVOKED');
        if (!transition.allowed)
            return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');
        const updated = advance(allocation, 'REVOKED', {
            updatedAt: ports.clock.now().toISOString(),
            transferReason: reason,
        });
        const saved = persist(updated);
        if (!saved.ok)
            return saved;
        const slot = ports.slots.read(allocation.slotId);
        if (slot) {
            ports.slots.update({ ...slot, currentAllocationId: undefined, currentAllocationStatus: 'AVAILABLE' }, slot.revision.revision);
        }
        ports.audit.emit({
            id: `aud-${allocationId}-revoke`,
            timestamp: ports.clock.now().toISOString(),
            correlationId: allocation.trace.correlationId,
            actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
            action: 'REVOKE',
            entityType: 'PARKING_ALLOCATION',
            entityId: allocationId,
            previousState: { status: allocation.status },
            newState: { status: 'REVOKED', reason },
            metadata: { source: 'MOBILE' },
            outcome: 'SUCCESS',
        });
        return saved;
    };
    const getAllocation = (allocationId: string) => ports.allocations.read(allocationId);
    const getAllocationsBySlot = (slotId: string) => ports.allocations.listBySlot(slotId);
    const getAllocationsByVehicle = (vehicleId: string) => ports.allocations.listByVehicle(vehicleId);
    const getAllocationsByUnit = (unitId: string) => ports.allocations.listByUnit(unitId);
    const getActiveAllocationBySlot = (slotId: string) => ports.allocations.findActiveBySlot(slotId);
    const getActiveAllocationByVehicle = (vehicleId: string) => ports.allocations.findActiveByVehicle(vehicleId);
    const sweepExpiredTemporaryAllocations = (): readonly string[] => {
        const expired: string[] = [];
        return expired;
    };
    return {
        requestAllocation,
        approveAllocation,
        rejectAllocation,
        confirmAllocation,
        transferAllocation,
        endAllocation,
        createTemporaryAllocation,
        extendTemporaryAllocation,
        expireTemporaryAllocation,
        revokeAllocation,
        getAllocation,
        getAllocationsBySlot,
        getAllocationsByVehicle,
        getAllocationsByUnit,
        getActiveAllocationBySlot,
        getActiveAllocationByVehicle,
        sweepExpiredTemporaryAllocations,
    };
}

