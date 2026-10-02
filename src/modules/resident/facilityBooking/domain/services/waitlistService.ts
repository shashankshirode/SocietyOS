import type { Absent } from '../../../../../shared/types/absence.types';
import type { VaultClock, VaultActor } from '../../../../../core/identity/personaRegistry';
import type { FacilityWaitlistEntry } from '../../models/facilityBooking.models';

export interface WaitlistJoinRequest {
  readonly facilityId: string;
  readonly slotId: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly userId: string;
  readonly idempotencyKey: string;
}

export interface WaitlistPromotionResult {
  readonly success: boolean;
  readonly waitlistEntry?: FacilityWaitlistEntry;
  readonly holdId?: string;
  readonly expiresAt?: string;
  readonly errorCode?: string;
  readonly errorMessage?: string;
}

export interface WaitlistPorts {
  readonly clock: VaultClock;
  readonly waitlist: {
    readonly findByFacilityAndSlot: (facilityId: string, slotId: string) => readonly FacilityWaitlistEntry[];
    readonly findByUserAndFacility: (userId: string, facilityId: string) => FacilityWaitlistEntry | Absent;
    readonly create: (entry: FacilityWaitlistEntry) => boolean;
    readonly update: (entry: FacilityWaitlistEntry) => boolean;
    readonly remove: (entryId: string) => boolean;
  };
  readonly slots: {
    readonly findById: (slotId: string) => { slotId: string; facilityId: string; startsAt: string; endsAt: string; status: string } | Absent;
  };
  readonly holds: {
    readonly create: (hold: { holdId: string; slotId: string; residenceId: string; unitId: string; startIso: string; endIso: string; expiresAt: string; idempotencyKey: string }) => boolean;
  };
  readonly notifications: {
    readonly send: (input: { residenceId: string; userId: string; title: string; body: string; data?: Record<string, string> }) => Promise<void>;
  };
}

export interface WaitlistPolicy {
  readonly offerDurationMinutes: number;
  readonly maxWaitlistSize: number;
  readonly promotionOrder: 'FIFO' | 'PRIORITY';
}

const DEFAULT_POLICY: WaitlistPolicy = {
  offerDurationMinutes: 60,
  maxWaitlistSize: 50,
  promotionOrder: 'FIFO',
};

export class WaitlistService {
  constructor(
    private ports: WaitlistPorts,
    private policy: WaitlistPolicy = DEFAULT_POLICY,
  ) {}

  async joinWaitlist(
    actor: VaultActor,
    request: WaitlistJoinRequest,
  ): Promise<WaitlistPromotionResult> {
    const now = this.ports.clock.now().toISOString();

    const slot = this.ports.slots.findById(request.slotId);
    if (!slot) {
      return { success: false, errorCode: 'SLOT_NOT_FOUND', errorMessage: 'Time slot not found.' };
    }

    if (slot.facilityId !== request.facilityId) {
      return { success: false, errorCode: 'FACILITY_MISMATCH', errorMessage: 'Slot does not belong to the specified facility.' };
    }

    if (slot.status !== 'FULL' && slot.status !== 'HELD') {
      return { success: false, errorCode: 'SLOT_NOT_FULL', errorMessage: 'This slot is still available for direct booking.' };
    }

    const existingEntry = this.ports.waitlist.findByUserAndFacility(request.userId, request.facilityId);
    if (existingEntry) {
      if (existingEntry.slotId === request.slotId) {
        return { success: true, waitlistEntry: existingEntry };
      }
      return { success: false, errorCode: 'ALREADY_WAITLISTED', errorMessage: 'You are already on the waitlist for this facility.' };
    }

    const currentWaitlist = this.ports.waitlist.findByFacilityAndSlot(request.facilityId, request.slotId);
    if (currentWaitlist.length >= this.policy.maxWaitlistSize) {
      return { success: false, errorCode: 'WAITLIST_FULL', errorMessage: 'The waitlist for this slot is full.' };
    }

    const position = currentWaitlist.length + 1;
    const expiresAt = new Date(Date.parse(now) + 7 * 24 * 60 * 60 * 1000).toISOString();

    const entry: FacilityWaitlistEntry = {
      id: `wl-${request.idempotencyKey}`,
      userId: request.userId,
      societyId: actor.societyId,
      residenceId: request.residenceId,
      unitId: request.unitId,
      facilityId: request.facilityId,
      slotId: request.slotId,
      position,
      joinedAt: now,
      expiresAt,
      offeredHoldId: null,
    };

    const created = this.ports.waitlist.create(entry);
    if (!created) {
      return { success: false, errorCode: 'CONCURRENT_JOIN', errorMessage: 'Waitlist position changed. Please try again.' };
    }

    return { success: true, waitlistEntry: entry };
  }

  async leaveWaitlist(
    actor: VaultActor,
    waitlistEntryId: string,
  ): Promise<{ success: boolean; errorCode?: string; errorMessage?: string }> {
    const waitlist = this.ports.waitlist.findByFacilityAndSlot('', '');
    const entry = waitlist.find((e) => e.id === waitlistEntryId);

    if (!entry) {
      return { success: false, errorCode: 'NOT_FOUND', errorMessage: 'Waitlist entry not found.' };
    }

    if (entry.userId !== actor.userId && actor.role !== 'ADMIN') {
      return { success: false, errorCode: 'UNAUTHORIZED', errorMessage: 'Not authorized to remove this waitlist entry.' };
    }

    const removed = this.ports.waitlist.remove(waitlistEntryId);
    if (!removed) {
      return { success: false, errorCode: 'CONCURRENT_REMOVAL', errorMessage: 'Entry was modified concurrently.' };
    }

    await this.recalculatePositions(entry.facilityId, entry.slotId);
    return { success: true };
  }

  private async recalculatePositions(facilityId: string, slotId: string): Promise<void> {
    const waitlist = this.ports.waitlist.findByFacilityAndSlot(facilityId, slotId);
    const sorted = waitlist.sort((a, b) => a.position - b.position);

    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].position !== i + 1) {
        const updated = { ...sorted[i], position: i + 1 };
        this.ports.waitlist.update(updated);
      }
    }
  }

  async promoteNext(
    facilityId: string,
    slotId: string,
    actor: VaultActor,
  ): Promise<WaitlistPromotionResult> {
    const now = this.ports.clock.now().toISOString();

    const slot = this.ports.slots.findById(slotId);
    if (!slot) {
      return { success: false, errorCode: 'SLOT_NOT_FOUND', errorMessage: 'Slot not found.' };
    }

    const waitlist = this.ports.waitlist.findByFacilityAndSlot(facilityId, slotId);
    if (waitlist.length === 0) {
      return { success: false, errorCode: 'WAITLIST_EMPTY', errorMessage: 'No one is on the waitlist for this slot.' };
    }

    const sorted = waitlist
      .filter((e) => Date.parse(e.expiresAt) > Date.parse(now))
      .sort((a, b) => a.position - b.position);

    if (sorted.length === 0) {
      return { success: false, errorCode: 'WAITLIST_EXPIRED', errorMessage: 'All waitlist entries have expired.' };
    }

    const nextEntry = sorted[0];

    const holdId = `hold-wl-${nextEntry.id}`;
    const holdDurationMinutes = 60;
    const expiresAt = new Date(Date.parse(now) + holdDurationMinutes * 60_000).toISOString();

    const holdCreated = this.ports.holds.create({
      holdId,
      slotId,
      residenceId: nextEntry.residenceId,
      unitId: nextEntry.unitId,
      startIso: slot.startsAt,
      endIso: slot.endsAt,
      expiresAt,
      idempotencyKey: `wl-promote-${nextEntry.id}`,
    });

    if (!holdCreated) {
      return { success: false, errorCode: 'HOLD_CREATION_FAILED', errorMessage: 'Failed to create hold for promoted waitlist entry.' };
    }

    const updatedEntry = { ...nextEntry, offeredHoldId: holdId, expiresAt };
    this.ports.waitlist.update(updatedEntry);

    await this.ports.notifications.send({
      residenceId: nextEntry.residenceId,
      userId: nextEntry.userId,
      title: 'Waitlist Offer',
      body: `A slot has opened up! You have ${this.policy.offerDurationMinutes} minutes to confirm your booking.`,
      data: { waitlistEntryId: nextEntry.id, holdId, slotId, facilityId },
    });

    return { success: true, waitlistEntry: updatedEntry, holdId, expiresAt };
  }

  async expireWaitlistOffer(
    waitlistEntryId: string,
  ): Promise<{ success: boolean; nextPromoted?: boolean; errorCode?: string; errorMessage?: string }> {
    const waitlist = this.ports.waitlist.findByFacilityAndSlot('', '');
    const entry = waitlist.find((e) => e.id === waitlistEntryId);

    if (!entry) {
      return { success: false, errorCode: 'NOT_FOUND', errorMessage: 'Waitlist entry not found.' };
    }

    if (entry.offeredHoldId) {
      const holdReleased = await this.releaseHold(entry.offeredHoldId);
      if (!holdReleased.success) {
        return { success: false, errorCode: 'HOLD_RELEASE_FAILED', errorMessage: 'Failed to release hold for expired offer.' };
      }
    }

    const removed = this.ports.waitlist.remove(waitlistEntryId);
    if (!removed) {
      return { success: false, errorCode: 'CONCURRENT_REMOVAL', errorMessage: 'Entry was modified concurrently.' };
    }

    await this.recalculatePositions(entry.facilityId, entry.slotId);

    const nextPromoted = await this.promoteNext(entry.facilityId, entry.slotId, { role: 'SYSTEM' } as any);
    return { success: true, nextPromoted: nextPromoted.success };
  }

  private async releaseHold(holdId: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  async getWaitlistPosition(
    actor: VaultActor,
    waitlistEntryId: string,
  ): Promise<{ position: number | null; total: number; errorCode?: string }> {
    const waitlist = this.ports.waitlist.findByFacilityAndSlot('', '');
    const entry = waitlist.find((e) => e.id === waitlistEntryId);

    if (!entry) {
      return { position: null, total: 0, errorCode: 'NOT_FOUND' };
    }

    if (entry.userId !== actor.userId && actor.role !== 'ADMIN') {
      return { position: null, total: 0, errorCode: 'UNAUTHORIZED' };
    }

    const facilityWaitlist = this.ports.waitlist.findByFacilityAndSlot(entry.facilityId, entry.slotId);
    return { position: entry.position, total: facilityWaitlist.length };
  }
}