import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../../../../../core/jobs/job.types';
import type { JobPorts as JobPortsInterface } from '../../../../../core/jobs/job.ports';
import type { VaultClock } from '../../../../../core/identity/personaRegistry';
interface FacilityBookingPorts extends JobPortsInterface {
    vault: {
        clock: VaultClock;
        slots: {
            findById: (slotId: string) => any;
            findByFacility: (facilityId: string) => readonly any[];
            update: (slot: any) => boolean;
        };
        holds: {
            findBySlot: (slotId: string) => readonly any[];
            findByFacility: (facilityId: string) => readonly any[];
            findByResidence: (residenceId: string) => readonly any[];
            update: (hold: any) => boolean;
        };
        bookings: {
            findByHoldId: (holdId: string) => any;
            update: (booking: any) => boolean;
        };
        notifications: {
            send: (input: {
                residenceId: string;
                userId: string;
                title: string;
                body: string;
                data?: Record<string, string>;
            }) => Promise<void>;
        };
    };
}
export class FacilityHoldExpiryExecutor implements JobExecutor {
    async execute(execution: JobExecution, ports: JobPorts): Promise<JobResult> {
        const vault = (ports as FacilityBookingPorts).vault;
        if (!vault) {
            return { success: false, processedCount: 0, succeededCount: 0, failedCount: 0, details: { error: 'Vault not available' } };
        }
        const now = vault.clock.now().toISOString();
        let processedCount = 0;
        let succeededCount = 0;
        let failedCount = 0;
        const details: Record<string, unknown> = { expired: [], errors: [] };
        const allHolds = vault.holds.findByFacility('');
        for (const hold of allHolds) {
            if (hold.status !== 'HELD')
                continue;
            if (Date.parse(hold.expiresAt) > Date.parse(now))
                continue;
            try {
                processedCount++;
                const slot = vault.slots.findById(hold.slotId);
                if (slot) {
                    const updatedSlot = { ...slot, status: 'AVAILABLE', heldByResidenceId: null, holdExpiresAt: null };
                    vault.slots.update(updatedSlot);
                }
                const booking = vault.bookings.findByHoldId(hold.holdId);
                if (booking) {
                    const updatedBooking = { ...booking, status: 'EXPIRED' };
                    vault.bookings.update(updatedBooking);
                }
                const updatedHold = { ...hold, status: 'EXPIRED', releasedAt: new Date().toISOString(), releaseReasonKey: 'AUTO_EXPIRED' };
                succeededCount++;
                (details.expired as string[]).push(hold.holdId);
            }
            catch (error) {
                failedCount++;
                (details.errors as string[]).push(`${hold.holdId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        return { success: failedCount === 0, processedCount, succeededCount, failedCount, details };
    }
}
export function createFacilityHoldExpiryExecutor(): JobExecutor {
    return new FacilityHoldExpiryExecutor();
}

