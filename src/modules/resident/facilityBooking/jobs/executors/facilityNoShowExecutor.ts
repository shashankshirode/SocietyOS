import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../../../../../core/jobs/job.types';
import type { JobPorts as JobPortsInterface } from '../../../../../core/jobs/job.ports';
import type { VaultClock } from '../../../../../core/identity/personaRegistry';
import type { FacilityBookingStatus } from '../../../models/facilityBooking.enums';

interface FacilityBookingPorts extends JobPortsInterface {
  vault: {
    clock: VaultClock;
    bookings: {
      findByStatus: (status: FacilityBookingStatus) => readonly any[];
      findByFacilityAndTime: (facilityId: string, startIso: string, endIso: string) => readonly any[];
      update: (booking: any) => boolean;
    };
    notifications: {
      send: (input: { residenceId: string; userId: string; title: string; body: string; data?: Record<string, string> }) => Promise<void>;
    };
    audit: {
      log: (input: { action: string; entityType: string; entityId: string; societyId: string; residenceId: string; metadata: Record<string, unknown> }) => Promise<void>;
    };
  };
}

interface NoShowPolicy {
  readonly checkInCutoffMinutes: number;
  readonly autoMarkNoShow: boolean;
  readonly applyPenalty: boolean;
  readonly penaltyAmountInMinorUnits: number;
}

const DEFAULT_POLICY: NoShowPolicy = {
  checkInCutoffMinutes: 30,
  autoMarkNoShow: true,
  applyPenalty: true,
  penaltyAmountInMinorUnits: 5000,
};

export class FacilityNoShowExecutor implements JobExecutor {
  constructor(private policy: NoShowPolicy = DEFAULT_POLICY) {}

  async execute(execution: JobExecution, ports: JobPorts): Promise<JobResult> {
    const vault = (ports as FacilityBookingPorts).vault;
    if (!vault) {
      return { success: false, processedCount: 0, succeededCount: 0, failedCount: 0, details: { error: 'Vault not available' } };
    }

    const now = vault.clock.now().toISOString();
    const cutoff = this.policy.checkInCutoffMinutes;

    const confirmedBookings = vault.bookings.findByStatus('CONFIRMED');
    let processedCount = 0;
    let succeededCount = 0;
    let failedCount = 0;
    const details: Record<string, unknown> = { noShows: [], errors: [] };

    for (const booking of confirmedBookings) {
      if (booking.checkInStatus === 'CHECKED_IN' || booking.checkInStatus === 'COMPLETED') continue;

      const bookingStart = Date.parse(booking.startsAt);
      const cutoffTime = bookingStart - cutoff * 60_000;
      const nowMs = Date.parse(new Date().toISOString());

      if (nowMs < cutoffTime) continue;

      try {
        processedCount++;

        const updatedBooking = {
          ...booking,
          status: 'NO_SHOW',
          checkInStatus: 'NO_SHOW',
        };

        const updated = vault.bookings.update(updatedBooking);
        if (!updated) {
          failedCount++;
          (details.errors as string[]).push(`${booking.id}: concurrent modification`);
          continue;
        }

        if (this.policy.applyPenalty && this.policy.penaltyAmountInMinorUnits > 0) {
          // Would integrate with Phase 7 finance here
        }

        await vault.notifications.send({
          residenceId: booking.residenceId,
          userId: booking.userId,
          title: 'No-Show Recorded',
          body: `Your booking for ${booking.facilityName} was marked as a no-show.`,
          data: { bookingId: booking.id, facilityId: booking.facilityId },
        });

        await vault.audit.log({
          action: 'NO_SHOW_RECORDED',
          entityType: 'FacilityBooking',
          entityId: booking.id,
          societyId: booking.societyId,
          residenceId: booking.residenceId,
          metadata: { bookingReference: booking.bookingReference, penaltyApplied: this.policy.applyPenalty },
        });

        succeededCount++;
        (details.noShows as string[]).push(booking.id);
      } catch (error) {
        failedCount++;
        (details.errors as string[]).push(`${booking.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { success: failedCount === 0, processedCount, succeededCount, failedCount, details };
  }
}

export function createFacilityNoShowExecutor(policy?: Partial<NoShowPolicy>): JobExecutor {
  return new FacilityNoShowExecutor({ ...DEFAULT_POLICY, ...policy });
}