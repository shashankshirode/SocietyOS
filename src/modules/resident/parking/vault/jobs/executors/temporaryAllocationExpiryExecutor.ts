import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../../../../../../core/jobs/job.types';
import type { JobPorts as JobPortsInterface } from '../../../../../../core/jobs/job.ports';
import type { VaultClock } from '../../../../../../core/identity/personaRegistry';
import type { AllocationRecord, ParkingSlotRecord } from '../../domain/types/parking';

interface ParkingBookingPorts extends JobPortsInterface {
  vault: {
    clock: VaultClock;
    allocations: {
      findActiveTemporaryByExpiry: (beforeIso: string) => readonly AllocationRecord[];
      update: (allocation: AllocationRecord) => boolean;
      findBySlot: (slotId: string) => readonly AllocationRecord[];
    };
    slots: {
      findById: (slotId: string) => ParkingSlotRecord | undefined;
      update: (slot: ParkingSlotRecord) => boolean;
    };
    notifications: {
      send: (input: { residenceId: string; userId: string; title: string; body: string; data?: Record<string, string> }) => Promise<void>;
    };
    audit: {
      log: (input: { action: string; entityType: string; entityId: string; societyId: string; residenceId: string; metadata: Record<string, string | number | boolean> }) => Promise<void>;
    };
  };
}

export class TemporaryAllocationExpiryExecutor implements JobExecutor {
  async execute(execution: JobExecution, ports: JobPorts): Promise<JobResult> {
    const vault = (ports as ParkingBookingPorts).vault;
    if (!vault) {
      return { success: false, processedCount: 0, succeededCount: 0, failedCount: 0, details: { error: 'Vault not available' } };
    }

    const now = vault.clock.now().toISOString();
    let processedCount = 0;
    let succeededCount = 0;
    let failedCount = 0;
    const expiredList: string[] = [];
    const errorList: string[] = [];

    const expiredAllocations = vault.allocations.findActiveTemporaryByExpiry(now);
    for (const allocation of expiredAllocations) {
      try {
        processedCount++;

        const slot = vault.slots.findById(allocation.slotId);
        if (slot) {
          const updatedSlot: ParkingSlotRecord = { ...slot, currentAllocationId: undefined, currentAllocationStatus: 'AVAILABLE' };
          vault.slots.update(updatedSlot);
        }

        const updatedAllocation: AllocationRecord = { ...allocation, status: 'EXPIRED', updatedAt: now, effectiveTo: now };
        vault.allocations.update(updatedAllocation);

        succeededCount++;
        expiredList.push(allocation.id);
      } catch (error) {
        failedCount++;
        errorList.push(`${allocation.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: failedCount === 0,
      processedCount,
      succeededCount,
      failedCount,
      details: { expired: expiredList, errors: errorList },
    };
  }
}

export function createTemporaryAllocationExpiryExecutor(): JobExecutor {
  return new TemporaryAllocationExpiryExecutor();
}