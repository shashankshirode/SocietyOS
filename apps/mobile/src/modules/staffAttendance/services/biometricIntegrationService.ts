import type {
  BiometricDevice,
  BiometricMapping,
  BiometricSyncJob,
  BiometricSyncError,
  CreateBiometricMappingInput,
  UnknownEmployeeCodeRecord,
} from '../../../shared/types/biometric.types';
import type { AttendancePunch, PunchType } from '../../../shared/types/attendance.types';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import { assertSocietyContext, canManageBiometricDevices } from '../data/staffAttendanceActor';
import { generateOperationId } from '../../../core/api/idempotency';

export interface RawDevicePunchPayload {
  employeeCode: string;
  punchTime: string;
  punchType: PunchType;
  sourceEventId?: string;
  deviceTimestamp?: string;
}

export interface SyncBatchResult {
  jobId: string;
  totalPunches: number;
  importedPunches: number;
  duplicatePunches: number;
  unmappedEmployeeCodes: number;
  clockDriftWarnings: number;
  acceptedPunches: AttendancePunch[];
}

export class BiometricIntegrationService {
  private devices = new Map<string, BiometricDevice>();
  private mappings = new Map<string, BiometricMapping>();
  private processedPunchKeys = new Set<string>();
  private syncJobs = new Map<string, BiometricSyncJob>();
  private syncErrors: BiometricSyncError[] = [];
  private unknownEmployeeCodes = new Map<string, UnknownEmployeeCodeRecord>();

  constructor(initialDevices?: BiometricDevice[]) {
    if (initialDevices) {
      for (const d of initialDevices) {
        this.devices.set(d.id, { ...d });
      }
    }
  }

  public registerDevice(
    actor: StaffOperationsActor,
    societyId: string,
    params: {
      deviceCode: string;
      deviceName: string;
      vendorName: string;
      location: string;
      ipAddressMasked?: string;
    }
  ): BiometricDevice {
    assertSocietyContext(actor, societyId);
    if (!canManageBiometricDevices(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to register biometric devices');
    }

    const existing = Array.from(this.devices.values()).find(
      d => d.deviceCode.toUpperCase() === params.deviceCode.trim().toUpperCase()
    );
    if (existing) {
      throw new Error(`DEVICE_CODE_CONFLICT: Biometric device with code ${params.deviceCode} already registered`);
    }

    const deviceId = `bio-dev-${generateOperationId('dev')}`;
    const device: BiometricDevice = {
      id: deviceId,
      deviceCode: params.deviceCode.trim().toUpperCase(),
      deviceName: params.deviceName.trim(),
      vendorName: params.vendorName.trim(),
      location: params.location,
      syncType: 'API_CONNECTOR',
      status: 'ACTIVE',
      health: 'ONLINE',
      mappedStaffCount: 0,
      unmappedEmployeeCodes: 0,
      recentErrorCount: 0,
      ...(params.ipAddressMasked ? { ipAddressMasked: params.ipAddressMasked } : {}),
      installedAt: new Date().toISOString(),
    };

    this.devices.set(deviceId, device);
    return device;
  }

  public createMapping(
    actor: StaffOperationsActor,
    societyId: string,
    input: CreateBiometricMappingInput & { deviceCode: string; deviceName: string; staffName: string; staffCode: string }
  ): BiometricMapping {
    assertSocietyContext(actor, societyId);
    if (!canManageBiometricDevices(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to manage biometric mappings');
    }

    const device = this.devices.get(input.deviceId);
    if (!device) {
      throw new Error('BIOMETRIC_DEVICE_NOT_FOUND: Device does not exist');
    }

    const existingMappings = Array.from(this.mappings.values()).filter(
      m => m.deviceId === input.deviceId && m.biometricEmployeeCode === input.biometricEmployeeCode && m.status === 'ACTIVE'
    );

    for (const em of existingMappings) {
      const fromA = em.effectiveFrom;
      const toA = em.effectiveTo ?? '9999-12-31';
      const fromB = input.effectiveFrom;
      const toB = input.effectiveTo ?? '9999-12-31';

      if (fromA <= toB && fromB <= toA) {
        throw new Error('BIOMETRIC_MAPPING_CONFLICT: Overlapping effective employee mapping for this device and code');
      }
    }

    const mappingId = `map-${generateOperationId('map')}`;
    const nowIso = new Date().toISOString();

    const mapping: BiometricMapping = {
      id: mappingId,
      deviceId: input.deviceId,
      deviceName: input.deviceName,
      deviceCode: input.deviceCode,
      biometricEmployeeCode: input.biometricEmployeeCode,
      staffId: input.staffId,
      staffName: input.staffName,
      staffCode: input.staffCode,
      status: 'ACTIVE',
      effectiveFrom: input.effectiveFrom,
      ...(input.effectiveTo ? { effectiveTo: input.effectiveTo } : {}),
      createdBy: actor.userId,
      createdAt: nowIso,
      updatedAt: nowIso,
      ...(input.notes ? { notes: input.notes } : {}),
    };

    this.mappings.set(mappingId, mapping);

    this.devices.set(device.id, {
      ...device,
      mappedStaffCount: device.mappedStaffCount + 1,
    });

    const unknownKey = `${input.deviceId}_${input.biometricEmployeeCode}`;
    const unknownRec = this.unknownEmployeeCodes.get(unknownKey);
    if (unknownRec) {
      this.unknownEmployeeCodes.set(unknownKey, {
        ...unknownRec,
        resolutionStatus: 'MAPPED',
        mappedStaffId: input.staffId,
        mappedStaffName: input.staffName,
        resolvedAt: nowIso,
        resolvedBy: actor.userId,
      });
    }

    return mapping;
  }

  public getMappingForPunch(deviceId: string, employeeCode: string, punchTime: string): BiometricMapping | undefined {
    const punchDate = punchTime.split('T')[0] ?? '';
    return Array.from(this.mappings.values()).find(m => {
      if (m.deviceId !== deviceId || m.biometricEmployeeCode !== employeeCode || m.status !== 'ACTIVE') {
        return false;
      }
      const from = m.effectiveFrom;
      const to = m.effectiveTo ?? '9999-12-31';
      return punchDate >= from && punchDate <= to;
    });
  }

  public syncDeviceBatch(
    deviceId: string,
    societyId: string,
    rawPunches: RawDevicePunchPayload[]
  ): SyncBatchResult {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error('BIOMETRIC_DEVICE_NOT_FOUND: Device does not exist');
    }

    const jobId = `job-${generateOperationId('job')}`;
    const nowIso = new Date().toISOString();
    const serverTimeMs = Date.now();

    let importedPunches = 0;
    let duplicatePunches = 0;
    let unmappedEmployeeCodes = 0;
    let clockDriftWarnings = 0;
    const acceptedPunches: AttendancePunch[] = [];

    for (const raw of rawPunches) {
      if (raw.deviceTimestamp) {
        const deviceTimeMs = new Date(raw.deviceTimestamp).getTime();
        const diffMinutes = Math.abs(serverTimeMs - deviceTimeMs) / (1000 * 60);
        if (diffMinutes > 15) {
          clockDriftWarnings++;
          this.syncErrors.push({
            id: `err-${generateOperationId('err')}`,
            syncJobId: jobId,
            deviceId,
            deviceCode: device.deviceCode,
            errorType: 'DEVICE_TIME_MISMATCH',
            biometricEmployeeCode: raw.employeeCode,
            punchTime: raw.punchTime,
            punchType: raw.punchType,
            errorMessage: `Clock drift detected: device time differs from server by ${Math.round(diffMinutes)} minutes`,
            suggestedAction: 'Calibrate device internal RTC clock',
            status: 'OPEN',
            createdAt: nowIso,
          });
        }
      }

      const dedupeKey = `${raw.employeeCode}_${deviceId}_${raw.punchTime}_${raw.punchType}`;
      if (this.processedPunchKeys.has(dedupeKey)) {
        duplicatePunches++;
        continue;
      }

      const mapping = this.getMappingForPunch(deviceId, raw.employeeCode, raw.punchTime);
      if (!mapping || !mapping.staffId) {
        unmappedEmployeeCodes++;
        const unknownKey = `${deviceId}_${raw.employeeCode}`;
        const existingUnknown = this.unknownEmployeeCodes.get(unknownKey);
        if (existingUnknown) {
          this.unknownEmployeeCodes.set(unknownKey, {
            ...existingUnknown,
            lastSeenAt: raw.punchTime,
            punchCount: existingUnknown.punchCount + 1,
          });
        } else {
          this.unknownEmployeeCodes.set(unknownKey, {
            id: `unk-${generateOperationId('unk')}`,
            deviceId,
            deviceCode: device.deviceCode,
            employeeCode: raw.employeeCode,
            firstSeenAt: raw.punchTime,
            lastSeenAt: raw.punchTime,
            punchCount: 1,
            resolutionStatus: 'OPEN',
          });
        }

        this.syncErrors.push({
          id: `err-${generateOperationId('err')}`,
          syncJobId: jobId,
          deviceId,
          deviceCode: device.deviceCode,
          errorType: 'UNKNOWN_EMPLOYEE_CODE',
          biometricEmployeeCode: raw.employeeCode,
          punchTime: raw.punchTime,
          punchType: raw.punchType,
          errorMessage: `Unknown employee code ${raw.employeeCode} on device ${device.deviceCode}`,
          suggestedAction: 'Map employee code to valid StaffProfile in admin console',
          status: 'OPEN',
          createdAt: nowIso,
        });

        this.processedPunchKeys.add(dedupeKey);
        continue;
      }

      this.processedPunchKeys.add(dedupeKey);
      importedPunches++;

      const punch: AttendancePunch = {
        id: `pn-bio-${generateOperationId('pn')}`,
        staffId: mapping.staffId,
        staffName: mapping.staffName ?? 'Unknown',
        staffCode: mapping.staffCode ?? 'STF-UNKNOWN',
        biometricEmployeeCode: raw.employeeCode,
        punchTime: raw.punchTime,
        punchType: raw.punchType,
        source: 'BIOMETRIC_DEVICE',
        deviceId,
        deviceName: device.deviceName,
        location: device.location,
        syncJobId: jobId,
        isDuplicate: false,
        duplicateKey: dedupeKey,
        isMapped: true,
        createdAt: nowIso,
      };

      acceptedPunches.push(punch);
    }

    const job: BiometricSyncJob = {
      id: jobId,
      deviceId,
      deviceName: device.deviceName,
      deviceCode: device.deviceCode,
      startedAt: nowIso,
      completedAt: new Date().toISOString(),
      status: unmappedEmployeeCodes > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED',
      totalPunchesFromDevice: rawPunches.length,
      importedPunches,
      duplicatePunches,
      failedPunches: unmappedEmployeeCodes,
      unmappedEmployeeCodes,
      errorCount: unmappedEmployeeCodes + clockDriftWarnings,
      triggeredBy: 'DEVICE_CONNECTOR',
      syncType: 'API_CONNECTOR',
    };
    this.syncJobs.set(jobId, job);

    this.devices.set(deviceId, {
      ...device,
      lastSyncTime: nowIso,
      lastSyncJobId: jobId,
      lastSyncStatus: job.status,
      lastSyncPunchCount: importedPunches,
      unmappedEmployeeCodes: device.unmappedEmployeeCodes + unmappedEmployeeCodes,
      recentErrorCount: device.recentErrorCount + unmappedEmployeeCodes + clockDriftWarnings,
    });

    return {
      jobId,
      totalPunches: rawPunches.length,
      importedPunches,
      duplicatePunches,
      unmappedEmployeeCodes,
      clockDriftWarnings,
      acceptedPunches,
    };
  }

  public getDevice(deviceId: string): BiometricDevice | undefined {
    return this.devices.get(deviceId);
  }

  public getUnknownEmployeeCodes(): UnknownEmployeeCodeRecord[] {
    return Array.from(this.unknownEmployeeCodes.values());
  }

  public getSyncErrors(deviceId?: string): BiometricSyncError[] {
    if (deviceId) {
      return this.syncErrors.filter(e => e.deviceId === deviceId);
    }
    return [...this.syncErrors];
  }
}
