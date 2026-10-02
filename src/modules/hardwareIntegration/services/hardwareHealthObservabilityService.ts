import type {
  HardwareErrorRecord,
  IntegrationHealthRow,
  HardwareHomeData,
  ResolveHardwareErrorCommand,
  IgnoreHardwareErrorCommand,
  EscalateHardwareErrorCommand,
} from '../../../shared/types/hardware.types';
import {
  assertHumanPrivilege,
  type HardwareActorContext,
} from './hardwareActor';
import { deviceRegistryService } from './deviceRegistryService';

export class HardwareHealthObservabilityService {
  private readonly errors = new Map<string, HardwareErrorRecord>();

  recordHeartbeat(
    deviceId: string,
    deviceTimestamp: string,
    healthData?: { cpuPercent?: number; memoryPercent?: number }
  ): { status: 'ONLINE' | 'DEGRADED'; clockDriftMinutes: number } {
    const actor: HardwareActorContext = {
      userId: 'device-connector',
      userName: 'Device Connector',
      userRole: 'HARDWARE_CONNECTOR',
      societyId: '',
      isDeviceCredential: true,
    };
    const device = deviceRegistryService.getDevice(actor, deviceId);
    if (!device) {
      throw new Error(`DEVICE_NOT_FOUND: Device ${deviceId} does not exist.`);
    }

    const now = Date.now();
    const devTime = new Date(deviceTimestamp).getTime();
    const driftMinutes = Math.abs(Math.round((now - devTime) / 60000));

    device.lastHeartbeat = new Date(now).toISOString();

    if (driftMinutes > 10) {
      this.recordError({
        id: `err-drift-${deviceId}`,
        deviceId,
        deviceName: device.name,
        errorType: 'TIME_DRIFT',
        message: `Clock drift of ${driftMinutes} minutes detected between device and server.`,
        createdAt: new Date().toISOString(),
        status: 'OPEN',
        suggestedAction: 'Sync NTP clock on local device or gateway.',
      });
      device.healthState = 'DEGRADED';
      return { status: 'DEGRADED', clockDriftMinutes: driftMinutes };
    }

    if (healthData && (healthData.cpuPercent && healthData.cpuPercent > 90)) {
      device.healthState = 'DEGRADED';
      return { status: 'DEGRADED', clockDriftMinutes: driftMinutes };
    }

    device.healthState = 'ONLINE';
    device.status = 'ONLINE';
    return { status: 'ONLINE', clockDriftMinutes: driftMinutes };
  }

  evaluateStaleHeartbeats(thresholdMinutes = 15): void {
    const actor: HardwareActorContext = {
      userId: 'system',
      userName: 'Health Monitor',
      userRole: 'SUPER_ADMIN',
      societyId: '',
    };
    const devices = deviceRegistryService.listDevices(actor);
    const now = Date.now();

    for (const d of devices) {
      if (d.lifecycleState !== 'ACTIVE') continue;
      if (!d.lastHeartbeat) {
        d.healthState = 'UNKNOWN';
        d.status = 'NOT_CONFIGURED';
        continue;
      }
      const last = new Date(d.lastHeartbeat).getTime();
      const diff = (now - last) / 60000;
      if (diff > thresholdMinutes) {
        d.healthState = 'OFFLINE';
        d.status = 'OFFLINE';
      }
    }
  }

  computeReadinessScore(actor: HardwareActorContext): number {
    const devices = deviceRegistryService.listDevices(actor);
    if (devices.length === 0) return 0;

    let totalPoints = 0;
    const maxPointsPerDevice = 5;

    for (const d of devices) {
      let points = 0;
      if (d.lifecycleState === 'ACTIVE') points += 1;
      if (d.connectionType) points += 1;
      if (d.credentialReference) points += 1;
      if (d.location) points += 1;
      if (d.healthState === 'ONLINE') points += 1;
      totalPoints += points;
    }

    return Math.round((totalPoints / (devices.length * maxPointsPerDevice)) * 100);
  }

  getHardwareHomeData(actor: HardwareActorContext): HardwareHomeData {
    const devices = deviceRegistryService.listDevices(actor);
    const online = devices.filter(d => d.status === 'ONLINE').length;
    const offline = devices.filter(d => d.status === 'OFFLINE').length;
    const error = devices.filter(d => d.status === 'ERROR' || d.healthState === 'ERROR').length;
    const score = this.computeReadinessScore(actor);

    return {
      societyName: 'Society OS',
      currentRole: actor.userRole,
      readinessScore: score,
      totalDevices: devices.length,
      onlineDevices: online,
      offlineDevices: offline,
      errorDevices: error,
      lastSyncTime: new Date().toISOString(),
    };
  }

  recordError(error: HardwareErrorRecord): HardwareErrorRecord {
    const existing = this.errors.get(error.id);
    if (existing) {
      existing.occurrences = (existing.occurrences || 1) + 1;
      existing.lastOccurredAt = new Date().toISOString();
      return existing;
    }
    const record: HardwareErrorRecord = {
      ...error,
      occurrences: 1,
      lastOccurredAt: error.createdAt,
    };
    this.errors.set(error.id, record);
    return record;
  }

  resolveError(actor: HardwareActorContext, command: ResolveHardwareErrorCommand): HardwareErrorRecord {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'FACILITY_MANAGER', 'INTEGRATION_ADMIN']);
    const err = this.errors.get(command.errorId);
    if (!err) {
      throw new Error(`HARDWARE_ERROR_NOT_FOUND: Error ${command.errorId} does not exist.`);
    }

    err.status = 'RESOLVED';
    err.resolutionNotes = `[${command.resolutionAction}] ${command.notes}`;
    err.resolvedBy = actor.userName;
    err.resolvedAt = new Date().toISOString();
    err.correctiveWorkOrderId = command.correctiveWorkOrderId;
    return err;
  }

  ignoreError(actor: HardwareActorContext, command: IgnoreHardwareErrorCommand): HardwareErrorRecord {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'FACILITY_MANAGER']);
    const err = this.errors.get(command.errorId);
    if (!err) {
      throw new Error(`HARDWARE_ERROR_NOT_FOUND: Error ${command.errorId} does not exist.`);
    }

    err.status = 'IGNORED';
    err.resolutionNotes = `Ignored: ${command.reason}`;
    return err;
  }

  escalateError(actor: HardwareActorContext, command: EscalateHardwareErrorCommand): HardwareErrorRecord {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'FACILITY_MANAGER', 'SECURITY_SUPERVISOR']);
    const err = this.errors.get(command.errorId);
    if (!err) {
      throw new Error(`HARDWARE_ERROR_NOT_FOUND: Error ${command.errorId} does not exist.`);
    }

    err.status = 'ESCALATED';
    err.suggestedAction = `Escalated to ${command.targetDepartment}: ${command.escalationNotes}`;
    if (command.createWorkOrder) {
      err.correctiveWorkOrderId = `wo-hw-${Date.now()}`;
    }
    return err;
  }

  listErrors(): HardwareErrorRecord[] {
    return Array.from(this.errors.values());
  }

  getIntegrationHealth(): IntegrationHealthRow[] {
    const actor: HardwareActorContext = {
      userId: 'system',
      userName: 'Health Observability',
      userRole: 'SUPER_ADMIN',
      societyId: '',
    };
    const devices = deviceRegistryService.listDevices(actor);
    const categories: { category: string; type: string }[] = [
      { category: 'Gate & Barrier Automation', type: 'BOOM_BARRIER' },
      { category: 'Vehicle ANPR', type: 'ANPR_CAMERA' },
      { category: 'RFID Access Readers', type: 'RFID_READER' },
      { category: 'CCTV Integration', type: 'CCTV_CAMERA' },
      { category: 'Smart Utility Meters', type: 'SMART_WATER_METER' },
      { category: 'EV Charging Infrastructure', type: 'EV_CHARGER' },
    ];

    return categories.map(cat => {
      const match = devices.filter(d => d.type === cat.type || d.type.startsWith(cat.type.slice(0, 5)));
      const online = match.filter(d => d.status === 'ONLINE').length;
      const errors = match.filter(d => d.status === 'ERROR' || d.healthState === 'ERROR').length;
      let status: IntegrationHealthRow['status'] = 'HEALTHY';
      if (match.length === 0) status = 'NOT_CONFIGURED';
      else if (errors > 0) status = 'DEGRADED';
      else if (online === 0) status = 'DOWN';

      return {
        category: cat.category,
        status,
        deviceCount: match.length,
        onlineCount: online,
        errorCount: errors,
        lastSync: new Date().toISOString(),
        riskLevel: errors > 0 ? 'HIGH' : 'LOW',
        recommendedAction: errors > 0 ? 'Review active hardware error records.' : 'Normal operation.',
      };
    });
  }

  seedInitialErrors(errors: HardwareErrorRecord[]): void {
    for (const e of errors) {
      this.errors.set(e.id, e);
    }
  }
}

export const hardwareHealthObservabilityService = new HardwareHealthObservabilityService();
