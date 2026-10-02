import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../../../../../core/jobs/job.types';
import type { JobPorts as JobPortsInterface } from '../../../../../core/jobs/job.ports';
import type { VaultClock } from '../../../../../core/identity/personaRegistry';

interface FacilityBookingPorts extends JobPortsInterface {
  vault: {
    clock: VaultClock;
    waitlist: {
      findByFacilityAndSlot: (facilityId: string, slotId: string) => readonly any[];
      update: (entry: any) => boolean;
    };
    slots: {
      findById: (slotId: string) => any;
      findByFacility: (facilityId: string) => readonly any[];
      findAvailable: (facilityId: string) => readonly any[];
    };
    holds: {
      create: (hold: any) => boolean;
    };
    notifications: {
      send: (input: { residenceId: string; userId: string; title: string; body: string; data?: Record<string, string> }) => Promise<void>;
    };
    audit: {
      log: (input: { action: string; entityType: string; entityId: string; societyId: string; residenceId: string; metadata: Record<string, unknown> }) => Promise<void>;
    };
  };
}

export class FacilityWaitlistPromotionExecutor implements JobExecutor {
  async execute(execution: JobExecution, ports: JobPorts): Promise<JobResult> {
    const vault = (ports as FacilityBookingPorts).vault;
    if (!vault) {
      return { success: false, processedCount: 0, succeededCount: 0, failedCount: 0, details: { error: 'Vault not available' } };
    }

    const now = vault.clock.now().toISOString();
    let processedCount = 0;
    let succeededCount = 0;
    let failedCount = 0;
    const details: Record<string, unknown> = { promoted: [], errors: [] };

    const allSlots = vault.slots.findByFacility('');
    for (const slot of allSlots) {
      if (slot.status !== 'FULL' && slot.status !== 'HELD') continue;

      const waitlist = vault.waitlist.findByFacilityAndSlot(slot.facilityId, slot.id);
      if (waitlist.length === 0) continue;

      const availableEntries = waitlist
        .filter((e) => Date.parse(e.expiresAt) > Date.parse(now))
        .sort((a, b) => a.position - b.position);

      if (availableEntries.length === 0) continue;

      const nextEntry = availableEntries[0];

      try {
        processedCount++;

        const holdId = `hold-wl-${nextEntry.id}`;
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        const holdCreated = vault.holds.create({
          holdId,
          slotId: slot.id,
          residenceId: nextEntry.residenceId,
          unitId: nextEntry.unitId,
          startIso: slot.startsAt,
          endIso: slot.endsAt,
          expiresAt,
          idempotencyKey: `wl-promote-${nextEntry.id}-${Date.now()}`,
        });

        if (!holdCreated) {
          failedCount++;
          (details.errors as string[]).push(`${nextEntry.id}: hold creation failed`);
          continue;
        }

        const updatedEntry = { ...nextEntry, offeredHoldId: holdId, expiresAt };
        vault.waitlist.update(updatedEntry);

        await vault.notifications.send({
          residenceId: nextEntry.residenceId,
          userId: nextEntry.userId,
          title: 'Waitlist Offer',
          body: `A slot has opened up for ${slot.facilityName}! You have 60 minutes to confirm your booking.`,
          data: { waitlistEntryId: nextEntry.id, holdId, slotId: slot.id, facilityId: slot.facilityId },
        });

        await vault.audit.log({
          action: 'WAITLIST_PROMOTED',
          entityType: 'FacilityWaitlistEntry',
          entityId: nextEntry.id,
          societyId: nextEntry.societyId,
          residenceId: nextEntry.residenceId,
          metadata: { facilityId: slot.facilityId, slotId: slot.id, holdId, position: nextEntry.position },
        });

        succeededCount++;
        (details.promoted as string[]).push(nextEntry.id);
      } catch (error) {
        failedCount++;
        (details.errors as string[]).push(`${nextEntry.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { success: failedCount === 0, processedCount, succeededCount, failedCount, details };
  }
}

export function createFacilityWaitlistPromotionExecutor(): JobExecutor {
  return new FacilityWaitlistPromotionExecutor();
}