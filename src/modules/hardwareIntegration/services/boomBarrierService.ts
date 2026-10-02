import type {
  BoomBarrierDevice,
  BarrierCommandRecord,
  BoomBarrierStatus,
} from '../../../shared/types/gateHardware.types';
import type { RequestBarrierOverrideCommand } from '../../../shared/types/hardware.types';
import {
  assertHumanPrivilege,
  type HardwareActorContext,
} from './hardwareActor';

export class BoomBarrierService {
  private readonly barriers = new Map<string, BoomBarrierDevice>();
  private readonly commandHistory = new Map<string, BarrierCommandRecord>();

  registerBarrier(barrier: BoomBarrierDevice): void {
    this.barriers.set(barrier.id, barrier);
  }

  issueCommand(
    actor: HardwareActorContext,
    input: {
      barrierId: string;
      commandType: 'OPEN' | 'CLOSE';
      idempotencyKey: string;
      reason?: string;
      emergencyIncidentId?: string;
      simulateTimeout?: boolean;
    }
  ): BarrierCommandRecord {
    const barrier = this.barriers.get(input.barrierId);
    if (!barrier) {
      throw new Error(`BARRIER_NOT_FOUND: Barrier ${input.barrierId} does not exist.`);
    }

    if (this.commandHistory.has(input.idempotencyKey)) {
      return this.commandHistory.get(input.idempotencyKey)!;
    }

    const commandId = `cmd-bb-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    if (input.simulateTimeout) {
      const record: BarrierCommandRecord = {
        commandId,
        barrierId: input.barrierId,
        commandType: input.commandType,
        state: 'TIMED_OUT',
        requestedBy: actor.userName,
        reason: input.reason,
        emergencyIncidentId: input.emergencyIncidentId,
        sentAt: now,
        idempotencyKey: input.idempotencyKey,
      };
      barrier.lastCommandState = 'TIMED_OUT';
      this.commandHistory.set(input.idempotencyKey, record);
      return record;
    }

    const record: BarrierCommandRecord = {
      commandId,
      barrierId: input.barrierId,
      commandType: input.commandType,
      state: 'CONFIRMED',
      requestedBy: actor.userName,
      reason: input.reason,
      emergencyIncidentId: input.emergencyIncidentId,
      sentAt: now,
      acknowledgedAt: now,
      confirmedAt: now,
      idempotencyKey: input.idempotencyKey,
    };

    barrier.status = input.commandType === 'OPEN' ? 'OPEN' : 'CLOSED';
    barrier.controllerState = barrier.status;
    barrier.positionSensorState = barrier.status;
    barrier.stateDiscrepancy = false;
    barrier.lastCommandState = 'CONFIRMED';
    if (input.commandType === 'OPEN') {
      barrier.lastOpenTime = now;
    } else {
      barrier.lastCloseTime = now;
    }

    this.commandHistory.set(input.idempotencyKey, record);
    return record;
  }

  manualOverride(actor: HardwareActorContext, command: RequestBarrierOverrideCommand): BarrierCommandRecord {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'SECURITY_GUARD', 'FACILITY_MANAGER']);

    if (!command.reason || command.reason.trim().length === 0) {
      throw new Error('BARRIER_OVERRIDE_REASON_REQUIRED: A valid operational reason is required for manual barrier override.');
    }

    const idempotencyKey = `manual-${command.barrierId}-${Date.now()}`;
    const record = this.issueCommand(actor, {
      barrierId: command.barrierId,
      commandType: 'OPEN',
      idempotencyKey,
      reason: `[${command.overrideType}] ${command.reason}`,
      emergencyIncidentId: command.emergencyIncidentId,
    });

    const barrier = this.barriers.get(command.barrierId);
    if (barrier) {
      barrier.status = 'MANUAL_OVERRIDE';
    }

    return record;
  }

  reconcilePhysicalState(
    barrierId: string,
    controllerState: BoomBarrierStatus,
    positionSensorState: BoomBarrierStatus
  ): BoomBarrierDevice {
    const barrier = this.barriers.get(barrierId);
    if (!barrier) {
      throw new Error(`BARRIER_NOT_FOUND: Barrier ${barrierId} does not exist.`);
    }

    barrier.controllerState = controllerState;
    barrier.positionSensorState = positionSensorState;
    barrier.stateDiscrepancy = controllerState !== positionSensorState;

    if (barrier.stateDiscrepancy) {
      barrier.status = 'ERROR';
      barrier.lastCommandState = 'RECONCILIATION_REQUIRED';
    } else {
      barrier.status = positionSensorState;
      if (barrier.lastCommandState === 'TIMED_OUT' && positionSensorState === 'OPEN') {
        barrier.lastCommandState = 'CONFIRMED';
      }
    }

    return barrier;
  }

  getBarrier(barrierId: string): BoomBarrierDevice | undefined {
    return this.barriers.get(barrierId);
  }

  listBarriers(): BoomBarrierDevice[] {
    return Array.from(this.barriers.values());
  }

  seedInitialBarriers(barriers: BoomBarrierDevice[]): void {
    for (const b of barriers) {
      this.barriers.set(b.id, b);
    }
  }
}

export const boomBarrierService = new BoomBarrierService();
