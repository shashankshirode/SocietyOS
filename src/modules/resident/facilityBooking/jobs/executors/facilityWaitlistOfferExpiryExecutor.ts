import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../../../../../core/jobs/job.types';
import type { JobPorts as JobPortsInterface } from '../../../../../core/jobs/job.ports';
import type { VaultClock } from '../../../../../core/identity/personaRegistry';

interface FacilityBookingPorts extends JobPortsInterface {
  vault: {
    clock: VaultClock;
    waitlist: {
      findByFacilityAndSlot: (facilityId: string, slotId: string) => readonly any[];
      findByExpiry: (beforeIso: string) => readonly any[];
      findAll: () => readonly any[];
      update: (entry: any) => boolean;
      remove: (entryId: string) => boolean;
    };
    holds: {
      findById: (holdId: string) => any;
      update: (hold: any) => boolean;
    };
    notifications: {
      send: (input: { residenceId: string; userId: string; title: string; body: string; data?: Record<string, string> }) => Promise<void>;
    };
    audit: {
      log: (input: { action: string; entityType: string; entityId: string; societyId: string; residenceId: string; metadata: Record<string, unknown> }) => Promise<void>;
    };
  };
}

export class FacilityWaitlistOfferExpiryExecutor implements JobExecutor {
  async execute(execution: JobExecution, ports: JobPorts): Promise<JobResult> {
    const vault = (ports as FacilityBookingPorts).vault;
    if (!vault) {
      return { success: false, processedCount: 0, succeededCount: 0, failedCount: 0, details: { error: 'Vault not available' } };
    }

    const now = vault.clock.now().toISOString();
    let processedCount = 0;
    let succeededCount = 0;
    let failedCount = 0;
    const details: Record<string, unknown> = { expired: [], promoted: [], errors: [] };

    const allEntries = vault.waitlist.findAll();
    const expiredEntries = allEntries.filter(
      (e) => e.offeredHoldId && Date.parse(e.expiresAt) <= Date.parse(now)
    );

    for (const entry of expiredEntries) {
      try {
        processedCount++;

        if (entry.offeredHoldId) {
          const hold = vault.holds.findById(entry.offeredHoldId);
          if (hold && hold.status === 'HELD') {
            const releasedHold = { ...hold, status: 'RELEASED', releasedAt: new Date().toISOString(), releaseReasonKey: 'WAITLIST_OFFER_EXPIRED' };
            vault.holds.update(releasedHold);
          }
        }

        const removed = vault.waitlist.remove(entry.id);
        if (!removed) {
          failedCount++;
          (details.errors as string[]).push(`${entry.id}: failed to remove`);
          continue;
        }

        await vault.audit.log({
          action: 'WAITLIST_OFFER_EXPIRED',
          entityType: 'FacilityWaitlistEntry',
          entityId: entry.id,
          societyId: entry.societyId,
          residenceId: entry.residenceId,
          metadata: { facilityId: entry.facilityId, slotId: entry.slotId, holdId: entry.offeredHoldId },
        });

        await vault.notifications.send({
          residenceId: entry.residenceId,
          userId: entry.userId,
          title: 'Waitlist Offer Expired',
          body: `Your waitlist offer for a slot has expired. You have been moved back to the waitlist.`,
          data: { waitlistEntryId: entry.id, facilityId: entry.facilityId },
        });

        const nextEntry = await this.promoteNext(entry.facilityId, entry.slotId, vault);
        if (nextPromoted) {
          (details.promoted as string[]).push(nextEntry.id);
        }

        succeededCount++;
        (details.expired as string[]).push(entry.id);
      } catch (error) {
        failedCount++;
        (details.errors as string[]).push(`${entry.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { success: failedCount === 0, processedCount, succeededCount, failedCount, details };
  }

  private async promoteNext(facilityId: string, slotId: string, vault: any): Promise<{ id: string } | null> {
    const waitlist = vault.waitlist.findByFacilityAndSlot(facilityId, slotId);
    if (waitlist.length === 0) return null;

    const sorted = waitlist.sort((a: any, b: any) => a.position - b.position);
    const nextEntry = sorted[0];

    const slot = vault.slots.findById(slotId);
    if (!slot) return null;

    const holdId = `hold-wl-${nextEntry.id}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const holdCreated = vault.holds.create({
      holdId,
      slotId,
      residenceId: nextEntry.residenceId,
      unitId: nextEntry.unitId,
      startIso: slot.startsAt,
      endIso: slot.endsAt,
      expiresAt,
      idempotencyKey: `wl-promote-${nextEntry.id}`,
    });

    if (!holdCreated) return null;

    const updatedEntry = { ...nextEntry, offeredHoldId: holdId, expiresAt: expiresAt };
    vault.waitlist.update(updatedEntry);

    return { id: nextEntry.id };
  }
}

export function createFacilityWaitlistOfferExpiryExecutor(): JobExecutor {
  return new FacilityWaitlistOfferExpiryExecutor();
}