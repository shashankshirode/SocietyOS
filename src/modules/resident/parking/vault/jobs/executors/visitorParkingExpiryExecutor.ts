import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../../../../../../core/jobs/job.types';
import type { JobPorts as JobPortsInterface } from '../../../../../../core/jobs/job.ports';
import type { VaultClock } from '../../../../../../core/identity/personaRegistry';
import type { VisitorParkingPassRecord } from '../../domain/types/parking';

interface ParkingBookingPorts extends JobPortsInterface {
  vault: {
    clock: VaultClock;
    visitorPasses: {
      findActiveByExpiry: (beforeIso: string) => readonly VisitorParkingPassRecord[];
      findByFacilityAndSlot: (facilityId: string, slotId: string) => readonly VisitorParkingPassRecord[];
      update: (pass: VisitorParkingPassRecord) => boolean;
    };
    notifications: {
      send: (input: { residenceId: string; userId: string; title: string; body: string; data?: Record<string, string> }) => Promise<void>;
    };
    audit: {
      log: (input: { action: string; entityType: string; entityId: string; societyId: string; residenceId: string; metadata: Record<string, string | number | boolean> }) => Promise<void>;
    };
  };
}

export class VisitorParkingExpiryExecutor implements JobExecutor {
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

    const expiredPasses = vault.visitorPasses.findActiveByExpiry(now);
    for (const pass of expiredPasses) {
      try {
        processedCount++;

        const updatedPass: VisitorParkingPassRecord = { ...pass, status: 'EXPIRED', updatedAt: now };
        vault.visitorPasses.update(updatedPass);

        await vault.notifications.send({
          residenceId: pass.residenceId,
          userId: pass.userId,
          title: 'Visitor Parking Expired',
          body: `Visitor parking pass ${pass.passNumber} has expired.`,
          data: { passId: pass.id },
        });

        await vault.audit.log({
          action: 'VISITOR_PARKING_EXPIRED',
          entityType: 'VISITOR_PARKING_PASS',
          entityId: pass.id,
          societyId: pass.societyId,
          residenceId: pass.residenceId,
          metadata: { passNumber: pass.passNumber },
        });

        succeededCount++;
        expiredList.push(pass.id);
      } catch (error) {
        failedCount++;
        errorList.push(`${pass.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

export function createVisitorParkingExpiryExecutor(): JobExecutor {
  return new VisitorParkingExpiryExecutor();
}