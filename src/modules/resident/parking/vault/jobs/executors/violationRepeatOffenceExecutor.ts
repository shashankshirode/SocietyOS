import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../../../../../../core/jobs/job.types';
import type { JobPorts as JobPortsInterface } from '../../../../../../core/jobs/job.ports';
import type { VaultClock } from '../../../../../../core/identity/personaRegistry';
import type { ParkingViolationRecord } from '../../domain/types/parking';

interface ParkingBookingPorts extends JobPortsInterface {
  vault: {
    clock: VaultClock;
    violations: {
      listBySociety: (societyId: string) => readonly ParkingViolationRecord[];
      findRepeatOffences: (societyId: string, vehicleNumber: string, timeWindow: string) => number;
      update: (violation: ParkingViolationRecord) => boolean;
    };
    notifications: {
      send: (input: {
        residenceId?: string;
        userId?: string;
        title: string;
        body: string;
        data?: Record<string, string>;
      }) => Promise<void>;
    };
    audit: {
      log: (input: {
        action: string;
        entityType: string;
        entityId: string;
        societyId: string;
        residenceId?: string;
        metadata: Record<string, string | number | boolean>;
      }) => Promise<void>;
    };
  };
}

export class ViolationRepeatOffenceExecutor implements JobExecutor {
  async execute(execution: JobExecution, ports: JobPorts): Promise<JobResult> {
    const vault = (ports as ParkingBookingPorts).vault;
    if (!vault) {
      return { success: false, processedCount: 0, succeededCount: 0, failedCount: 0, details: { error: 'Vault not available' } };
    }

    const now = vault.clock.now().toISOString();
    let processedCount = 0;
    let succeededCount = 0;
    let failedCount = 0;
    const escalatedList: string[] = [];
    const errorList: string[] = [];

    const allViolations = vault.violations.listBySociety(execution.societyId ?? 'society-001');
    const vehicleGroups = new Map<string, ParkingViolationRecord[]>();

    for (const v of allViolations) {
      const group = vehicleGroups.get(v.vehicleNumber) ?? [];
      group.push(v);
      vehicleGroups.set(v.vehicleNumber, group);
    }

    for (const [vehicleNumber, violations] of vehicleGroups.entries()) {
      const confirmedViolations = violations.filter(v =>
        ['WARNING_ISSUED', 'PENALTY_PENDING', 'PENALTY_PAID', 'DISPUTED', 'WAIVED', 'CLOSED'].includes(v.status),
      );
      if (confirmedViolations.length >= 3 && violations.length > 0) {
        const first = violations[0];
        if (!first) continue;
        try {
          processedCount++;
          const latestViolation = violations.reduce(
            (latest, v) => (new Date(v.createdAt) > new Date(latest.createdAt) ? v : latest),
            first,
          );
          if (latestViolation.status !== 'ESCALATED') {
            const updated: ParkingViolationRecord = { ...latestViolation, status: 'ESCALATED', updatedAt: now };
            vault.violations.update(updated);
            await vault.notifications.send({
              residenceId: latestViolation.residenceId,
              userId: latestViolation.userId,
              title: 'Repeat Parking Offence',
              body: `Vehicle ${vehicleNumber} has ${confirmedViolations.length} confirmed violations. Escalated for review.`,
              data: { violationId: latestViolation.id, vehicleNumber },
            });
            await vault.audit.log({
              action: 'VIOLATION_ESCALATED_REPEAT_OFFENCE',
              entityType: 'PARKING_VIOLATION',
              entityId: latestViolation.id,
              societyId: latestViolation.societyId,
              residenceId: latestViolation.residenceId,
              metadata: { vehicleNumber, confirmedCount: confirmedViolations.length },
            });
            succeededCount++;
            escalatedList.push(latestViolation.id);
          }
        } catch (error) {
          failedCount++;
          errorList.push(`${vehicleNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return {
      success: failedCount === 0,
      processedCount,
      succeededCount,
      failedCount,
      details: { escalated: escalatedList, errors: errorList },
    };
  }
}

export function createViolationRepeatOffenceExecutor(): JobExecutor {
  return new ViolationRepeatOffenceExecutor();
}
