import type { Absent } from '../../../../../shared/types/absence.types';
import type { VaultClock, VaultActor } from '../../../../../core/identity/personaRegistry';
import type {
  FacilitySlotStatus,
  FacilitySlot,
} from '../../models/facilityBooking.enums';
import type { Facility } from '../../models/facilityBooking.models';

export interface SlotReservationRequest {
  readonly facilityId: string;
  readonly slotId: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly idempotencyKey: string;
  readonly holdDurationMinutes: number;
}

export interface SlotReservationResult {
  readonly success: boolean;
  readonly slot?: FacilitySlot;
  readonly holdId?: string;
  readonly expiresAt?: string;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly conflictSlotId?: string;
}

export interface SlotConflict {
  readonly slotId: string;
  readonly facilityId: string;
  readonly conflictingResidenceId: string;
  readonly conflictingBookingId: string | Absent;
}

export interface AtomicReservationPorts {
  readonly clock: VaultClock;
  readonly slots: {
    readonly findById: (slotId: string) => FacilitySlot | Absent;
    readonly findByFacilityAndTime: (facilityId: string, startIso: string, endIso: string) => readonly FacilitySlot[];
    readonly update: (slot: FacilitySlot) => boolean;
  };
  readonly bookings: {
    readonly findConflicting: (facilityId: string, startIso: string, endIso: string, excludeResidenceId: string) => readonly { bookingId: string; slotId: string; residenceId: string }[];
  };
  readonly holds: {
    readonly create: (hold: { holdId: string; slotId: string; residenceId: string; unitId: string; startIso: string; endIso: string; expiresAt: string; idempotencyKey: string }) => boolean;
    readonly findBySlot: (slotId: string) => readonly { holdId: string; residenceId: string; expiresAt: string; status: string }[];
    readonly findByFacility: () => readonly { holdId: string; residenceId: string; expiresAt: string; status: string; slotId: string; facilityId: string }[];
  };
}

export interface ReservationPolicy {
  readonly holdDurationMinutes: number;
  readonly maxConcurrentHoldsPerResidence: number;
  readonly allowOverbookingDuringMaintenance: boolean;
}

const DEFAULT_POLICY: ReservationPolicy = {
  holdDurationMinutes: 15,
  maxConcurrentHoldsPerResidence: 3,
  allowOverbookingDuringMaintenance: false,
};

export class AtomicSlotReservationService {
  constructor(
    private ports: AtomicReservationPorts,
    private policy: ReservationPolicy = DEFAULT_POLICY,
  ) {}

  async reserveSlot(
    actor: VaultActor,
    request: SlotReservationRequest,
  ): Promise<SlotReservationResult> {
    const now = this.ports.clock.now().toISOString();

    const slot = this.ports.slots.findById(request.slotId);
    if (!slot) {
      return {
        success: false,
        errorCode: 'SLOT_NOT_FOUND',
        errorMessage: 'The requested time slot does not exist.',
      };
    }

    if (slot.facilityId !== request.facilityId) {
      return {
        success: false,
        errorCode: 'FACILITY_MISMATCH',
        errorMessage: 'The slot does not belong to the specified facility.',
      };
    }

    const existingHolds = this.ports.holds.findBySlot(request.slotId);
    const activeHolds = existingHolds.filter((h) => h.status === 'HELD' && Date.parse(h.expiresAt) > Date.parse(now));
    if (activeHolds.length > 0) {
      return {
        success: false,
        errorCode: 'SLOT_HELD',
        errorMessage: 'This slot is currently held by another resident.',
        conflictSlotId: request.slotId,
      };
    }

    if (slot.status !== 'AVAILABLE' && slot.status !== 'LIMITED') {
      return {
        success: false,
        errorCode: 'SLOT_UNAVAILABLE',
        errorMessage: `This time slot is ${slot.status.toLowerCase()}.`,
        conflictSlotId: slot.id,
      };
    }

    if (Date.parse(slot.startsAt) <= Date.parse(now)) {
      return {
        success: false,
        errorCode: 'PAST_SLOT',
        errorMessage: 'Cannot reserve a slot that has already started.',
      };
    }

    const conflictingBookings = this.ports.bookings.findConflicting(
      request.facilityId,
      slot.startsAt,
      slot.endsAt,
      request.residenceId,
    );
    if (conflictingBookings.length > 0) {
      return {
        success: false,
        errorCode: 'SLOT_CONFLICT',
        errorMessage: 'This slot overlaps with an existing booking.',
        conflictSlotId: conflictingBookings[0].slotId,
      };
    }

    const facilityHolds = this.ports.holds.findByFacility();
    const residenceActiveHolds = facilityHolds.filter((h) => h.residenceId === request.residenceId && h.status === 'HELD');
    if (residenceActiveHolds.length >= this.policy.maxConcurrentHoldsPerResidence) {
      return {
        success: false,
        errorCode: 'HOLD_LIMIT_REACHED',
        errorMessage: `You have reached the maximum number of concurrent holds (${this.policy.maxConcurrentHoldsPerResidence}).`,
      };
    }

    const holdId = `hold-${request.idempotencyKey}`;
    const expiresAt = new Date(Date.parse(now) + this.policy.holdDurationMinutes * 60_000).toISOString();

    const holdCreated = this.ports.holds.create({
      holdId,
      slotId: request.slotId,
      residenceId: request.residenceId,
      unitId: request.unitId,
      startIso: slot.startsAt,
      endIso: slot.endsAt,
      expiresAt,
      idempotencyKey: request.idempotencyKey,
    });

    if (!holdCreated) {
      return {
        success: false,
        errorCode: 'CONCURRENT_RESERVATION',
        errorMessage: 'Another request is processing this slot. Please try again.',
      };
    }

    const updatedSlot: FacilitySlot = {
      ...slot,
      status: 'HELD',
      heldByResidenceId: request.residenceId,
      holdExpiresAt: expiresAt,
    };

    const slotUpdated = this.ports.slots.update(updatedSlot);
    if (!slotUpdated) {
      return {
        success: false,
        errorCode: 'CONCURRENT_UPDATE',
        errorMessage: 'The slot was modified concurrently. Please try again.',
      };
    }

    return {
      success: true,
      slot: updatedSlot,
      holdId,
      expiresAt,
    };
  }

  async releaseHold(
    actor: VaultActor,
    holdId: string,
    reason: 'EXPIRED' | 'CANCELLED' | 'CONFIRMED' | 'PAYMENT_FAILED',
  ): Promise<{ success: boolean; errorCode?: string; errorMessage?: string }> {
    const holds = this.ports.holds.findBySlot('');
    const hold = holds.find((h) => h.holdId === holdId);

    if (!hold) {
      return { success: false, errorCode: 'HOLD_NOT_FOUND', errorMessage: 'Hold not found.' };
    }

    if (hold.residenceId !== actor.residenceId && actor.role !== 'ADMIN') {
      return { success: false, errorCode: 'UNAUTHORIZED', errorMessage: 'Not authorized to release this hold.' };
    }

    if (hold.status === 'RELEASED' || hold.status === 'EXPIRED') {
      return { success: true };
    }

    const slot = this.ports.slots.findById(hold.slotId);
    if (slot) {
      const updatedSlot: FacilitySlot = {
        ...slot,
        status: 'AVAILABLE',
        heldByResidenceId: null,
        holdExpiresAt: null,
      };
      this.ports.slots.update(updatedSlot);
    }

    return { success: true };
  }

  async confirmHold(
    actor: VaultActor,
    holdId: string,
    paymentCompleted: boolean,
  ): Promise<{ success: boolean; holdId?: string; errorCode?: string; errorMessage?: string }> {
    const holds = this.ports.holds.findBySlot('');
    const hold = holds.find((h) => h.holdId === holdId);

    if (!hold) {
      return { success: false, errorCode: 'HOLD_NOT_FOUND', errorMessage: 'Hold not found.' };
    }

    if (hold.residenceId !== actor.residenceId) {
      return { success: false, errorCode: 'UNAUTHORIZED', errorMessage: 'Not authorized to confirm this hold.' };
    }

    if (hold.status !== 'HELD') {
      return { success: false, errorCode: 'HOLD_NOT_ACTIVE', errorMessage: 'This hold is no longer active.' };
    }

    if (Date.parse(hold.expiresAt) < Date.parse(this.ports.clock.now().toISOString())) {
      return { success: false, errorCode: 'HOLD_EXPIRED', errorMessage: 'This hold has expired.' };
    }

    if (!paymentCompleted) {
      return { success: false, errorCode: 'PAYMENT_REQUIRED', errorMessage: 'Payment must be completed before confirming the booking.' };
    }

    return { success: true, holdId };
  }

  async expireStaleHolds(): Promise<number> {
    const now = this.ports.clock.now().toISOString();
    let expiredCount = 0;

    const allHolds = this.ports.holds.findBySlot('');
    for (const hold of allHolds) {
      if (hold.status !== 'HELD') continue;
      if (Date.parse(hold.expiresAt) <= Date.parse(now)) {
        await this.releaseHold({ residenceId: hold.residenceId, role: 'SYSTEM' } as any, hold.holdId, 'EXPIRED');
        expiredCount++;
      }
    }

    return expiredCount;
  }
}