import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type {
  HardwareDevice,
  DeviceLocationMapping,
  HardwareSyncJob,
  HardwareEvent,
  HardwareErrorRecord,
  IntegrationHealthRow,
  HardwareAuditLogEntry,
  HardwareSettingGroup,
  HardwareHomeData,
  DevicePermissionRow,
  HardwarePrivacyRule,
  HardwareReadinessRecord,
  IntegrationHealthLogRecord,
  RegisterHardwareDeviceCommand,
  UpdateHardwareDeviceCommand,
  MapDeviceLocationCommand,
  CreateRfidTagMappingCommand,
  UpdateRfidTagMappingCommand,
  RequestBarrierOverrideCommand,
  RequestCctvAccessCommand,
  ImportMeterReadingsCommand,
  ResolveHardwareErrorCommand,
  IgnoreHardwareErrorCommand,
  EscalateHardwareErrorCommand,
  UpdateHardwareSettingsCommand,
} from '../../../shared/types/hardware.types';
import type { RfidEvent, RfidTagMapping, AnprEvent, AnprVehicleMatchReview, BoomBarrierDevice, GateHardwareDashboardData } from '../../../shared/types/gateHardware.types';
import type { CctvCamera } from '../../../shared/types/cctv.types';
import type {
  SmartMeter,
  SmartMeterReading,
  SmartMeterDashboardData,
} from '../../../shared/types/smartMeter.types';
import type {
  EvCharger,
  EvChargingSession,
  EvChargingDashboardData,
} from '../../../shared/types/evCharging.types';
import { mockHardwareHome } from '../../../shared/mock/hardwareDashboard.mock';
import { mockHardwareDevices } from '../../../shared/mock/hardwareDevices.mock';
import { mockDeviceLocationMappings } from '../../../shared/mock/deviceLocationMappings.mock';
import { mockGateHardwareDashboard } from '../../../shared/mock/gateHardware.mock';
import { mockRfidEvents } from '../../../shared/mock/rfidEvents.mock';
import { mockRfidTagMappings } from '../../../shared/mock/rfidTagMappings.mock';
import { mockAnprEvents } from '../../../shared/mock/anprEvents.mock';
import { mockBoomBarriers } from '../../../shared/mock/boomBarriers.mock';
import { mockCctvCameras } from '../../../shared/mock/cctvCameras.mock';
import { mockSmartMeterDashboard, mockSmartMeterReadings } from '../../../shared/mock/smartMeterReadings.mock';
import { mockSmartMeters } from '../../../shared/mock/smartMeters.mock';
import { mockEvChargers } from '../../../shared/mock/evChargers.mock';
import { mockEvChargingDashboard, mockEvChargingSessions } from '../../../shared/mock/evChargingSessions.mock';
import { mockHardwareSyncJobs } from '../../../shared/mock/hardwareSyncJobs.mock';
import { mockHardwareEvents } from '../../../shared/mock/hardwareEvents.mock';
import { mockHardwareErrors } from '../../../shared/mock/hardwareErrors.mock';
import { mockIntegrationHealth } from '../../../shared/mock/integrationHealth.mock';
import { mockHardwareAuditLogs } from '../../../shared/mock/hardwareAuditLogs.mock';
import { anprIntegrationReadinessMockData, boomBarrierReadinessMockData, cctvAccessReadinessMockData, evChargingReadinessMockData, integrationHealthLogsMockData, rfidIntegrationReadinessMockData, smartMeterReadinessMockData } from './hardwareIntegration.mockData';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import {
  deviceRegistryService,
  rfidIntegrationService,
  anprIntegrationService,
  boomBarrierService,
  cctvIntegrationService,
  smartMeterConnectorService,
  evChargingConnectorService,
  hardwareHealthObservabilityService,
} from '../services';

deviceRegistryService.seedInitialDevices(mockHardwareDevices);
deviceRegistryService.seedInitialMappings(mockDeviceLocationMappings);
rfidIntegrationService.seedInitialMappings(mockRfidTagMappings);
rfidIntegrationService.seedInitialEvents(mockRfidEvents);
anprIntegrationService.seedInitialEvents(mockAnprEvents);
boomBarrierService.seedInitialBarriers(mockBoomBarriers);
cctvIntegrationService.seedInitialCameras(mockCctvCameras);
smartMeterConnectorService.seedInitialMeters(mockSmartMeters);
smartMeterConnectorService.seedInitialReadings(mockSmartMeterReadings);
evChargingConnectorService.seedInitialChargers(mockEvChargers);
evChargingConnectorService.seedInitialSessions(mockEvChargingSessions);
hardwareHealthObservabilityService.seedInitialErrors(mockHardwareErrors);

const delay = (ms = 400) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const ok = <T>(data: T): RepositoryResult<T> => ({ ok: true, data });
type BiometricConnectorStatus = {
    syncHealth: string;
    lastSync: string;
};
type AnprReviewInput = Pick<AnprVehicleMatchReview, 'reviewerDecision' | 'notes'>;

export const hardwareIntegrationMockSource = {
    getHardwareHome: async (): Promise<RepositoryResult<HardwareHomeData>> => {
        await delay();
        return ok(mockHardwareHome);
    },
    getHardwareDevices: async (): Promise<RepositoryResult<HardwareDevice[]>> => {
        await delay();
        return ok([...mockHardwareDevices]);
    },
    getHardwareDeviceDetail: async (deviceId: string): Promise<RepositoryResult<HardwareDevice>> => {
        await delay();
        const d = mockHardwareDevices.find(x => x.id === deviceId);
        if (!d)
            return { ok: false, error: { message: 'Device not found', code: 'NOT_FOUND' } };
        return ok(d);
    },
    registerHardwareDevice: async (input: RegisterHardwareDeviceCommand): Promise<RepositoryResult<HardwareDevice>> => {
        await delay();
        return ok({ ...getRequiredItem(mockHardwareDevices, 0, "hardwareIntegration.mockSource.ts"), id: `dev-${Date.now()}`, ...input });
    },
    updateHardwareDevice: async (deviceId: string, input: UpdateHardwareDeviceCommand): Promise<RepositoryResult<HardwareDevice>> => {
        await delay();
        return ok({ ...getRequiredItem(mockHardwareDevices, 0, "hardwareIntegration.mockSource.ts"), id: deviceId, ...input });
    },
    activateHardwareDevice: async (deviceId: string): Promise<RepositoryResult<HardwareDevice>> => {
        await delay();
        return ok({ ...getRequiredItem(mockHardwareDevices, 0, "hardwareIntegration.mockSource.ts"), id: deviceId, status: 'ONLINE', lifecycleState: 'ACTIVE', healthState: 'ONLINE' });
    },
    suspendHardwareDevice: async (deviceId: string, reason: string): Promise<RepositoryResult<HardwareDevice>> => {
        await delay();
        return ok({ ...getRequiredItem(mockHardwareDevices, 0, "hardwareIntegration.mockSource.ts"), id: deviceId, status: 'DISABLED', lifecycleState: 'SUSPENDED' });
    },
    decommissionHardwareDevice: async (deviceId: string, reason: string): Promise<RepositoryResult<HardwareDevice>> => {
        await delay();
        return ok({ ...getRequiredItem(mockHardwareDevices, 0, "hardwareIntegration.mockSource.ts"), id: deviceId, status: 'DISABLED', lifecycleState: 'DECOMMISSIONED', decommissionedAt: new Date().toISOString() });
    },
    replaceHardwareDevice: async (oldDeviceId: string, newDeviceCommand: RegisterHardwareDeviceCommand): Promise<RepositoryResult<{ oldDevice: HardwareDevice; newDevice: HardwareDevice }>> => {
        await delay();
        return ok({
            oldDevice: getRequiredItem(mockHardwareDevices, 0, "hardwareIntegration.mockSource.ts"),
            newDevice: { ...getRequiredItem(mockHardwareDevices, 0, "hardwareIntegration.mockSource.ts"), id: `dev-${Date.now()}`, ...newDeviceCommand, replacedDeviceId: oldDeviceId }
        });
    },
    rotateDeviceCredential: async (deviceId: string, newCredentialRef: string): Promise<RepositoryResult<HardwareDevice>> => {
        await delay();
        return ok({ ...getRequiredItem(mockHardwareDevices, 0, "hardwareIntegration.mockSource.ts"), id: deviceId, credentialReference: newCredentialRef });
    },
    testDeviceSync: async (deviceId: string): Promise<RepositoryResult<{ success: boolean; lastHeartbeat: string }>> => {
        await delay();
        return ok({ success: true, lastHeartbeat: new Date().toISOString() });
    },
    getDeviceLocationMappings: async (): Promise<RepositoryResult<DeviceLocationMapping[]>> => {
        await delay();
        return ok([...mockDeviceLocationMappings]);
    },
    createDeviceLocationMapping: async (input: MapDeviceLocationCommand): Promise<RepositoryResult<DeviceLocationMapping>> => {
        await delay();
        return ok({ ...getRequiredItem(mockDeviceLocationMappings, 0, "hardwareIntegration.mockSource.ts"), id: `dlm-${Date.now()}`, ...input });
    },
    updateDeviceLocationMapping: async (mappingId: string, input: Partial<DeviceLocationMapping>): Promise<RepositoryResult<DeviceLocationMapping>> => {
        await delay();
        return ok({ ...getRequiredItem(mockDeviceLocationMappings, 0, "hardwareIntegration.mockSource.ts"), id: mappingId, ...input });
    },
    getGateHardwareDashboard: async (): Promise<RepositoryResult<GateHardwareDashboardData>> => {
        await delay();
        return ok(mockGateHardwareDashboard);
    },
    getRfidReadiness: async (): Promise<RepositoryResult<RfidEvent[]>> => {
        await delay();
        return ok([...mockRfidEvents]);
    },
    getRfidIntegrationReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
        await delay();
        return ok([...rfidIntegrationReadinessMockData]);
    },
    getRfidTagMappings: async (): Promise<RepositoryResult<RfidTagMapping[]>> => {
        await delay();
        return ok([...mockRfidTagMappings]);
    },
    createRfidTagMapping: async (input: CreateRfidTagMappingCommand): Promise<RepositoryResult<RfidTagMapping>> => {
        await delay();
        return ok({ ...getRequiredItem(mockRfidTagMappings, 0, "hardwareIntegration.mockSource.ts"), id: `rtm-${Date.now()}`, ...input });
    },
    updateRfidTagMapping: async (mappingId: string, input: UpdateRfidTagMappingCommand): Promise<RepositoryResult<RfidTagMapping>> => {
        await delay();
        return ok({ ...getRequiredItem(mockRfidTagMappings, 0, "hardwareIntegration.mockSource.ts"), id: mappingId, ...input });
    },
    getAnprReadiness: async (): Promise<RepositoryResult<AnprEvent[]>> => {
        await delay();
        return ok([...mockAnprEvents]);
    },
    getAnprIntegrationReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
        await delay();
        return ok([...anprIntegrationReadinessMockData]);
    },
    getAnprEvents: async (): Promise<RepositoryResult<AnprEvent[]>> => {
        await delay();
        return ok([...mockAnprEvents]);
    },
    reviewAnprVehicleMatch: async (eventId: string, input: AnprReviewInput): Promise<RepositoryResult<{ success: boolean }>> => {
        await delay();
        return ok({ success: true });
    },
    getBoomBarriers: async (): Promise<RepositoryResult<BoomBarrierDevice[]>> => {
        await delay();
        return ok([...mockBoomBarriers]);
    },
    getBoomBarrierReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
        await delay();
        return ok([...boomBarrierReadinessMockData]);
    },
    getBoomBarrierDetail: async (barrierId: string): Promise<RepositoryResult<BoomBarrierDevice>> => {
        await delay();
        const b = mockBoomBarriers.find(x => x.id === barrierId);
        if (!b)
            return { ok: false, error: { message: 'Barrier not found', code: 'NOT_FOUND' } };
        return ok(b);
    },
    issueBarrierCommand: async (input: {
        barrierId: string;
        commandType: 'OPEN' | 'CLOSE';
        idempotencyKey: string;
        reason?: string;
        emergencyIncidentId?: string;
    }): Promise<RepositoryResult<{ commandId: string; state: string }>> => {
        await delay();
        return ok({ commandId: `cmd-${Date.now()}`, state: 'CONFIRMED' });
    },
    requestBoomBarrierManualOverride: async (input: RequestBarrierOverrideCommand): Promise<RepositoryResult<{ commandId: string; state: string }>> => {
        await delay();
        return ok({ commandId: `cmd-${Date.now()}`, state: 'CONFIRMED' });
    },
    reconcileBarrierState: async (barrierId: string, controllerState: string, positionSensorState: string): Promise<RepositoryResult<BoomBarrierDevice>> => {
        await delay();
        const b = mockBoomBarriers.find(x => x.id === barrierId);
        if (!b)
            return { ok: false, error: { message: 'Barrier not found', code: 'NOT_FOUND' } };
        return ok({ ...b, controllerState: controllerState as any, positionSensorState: positionSensorState as any });
    },
    getCctvAccessRequests: async (): Promise<RepositoryResult<CctvAccessRequest[]>> => {
        await delay();
        return ok([]);
    },
    getCctvAccessReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
        await delay();
        return ok([...cctvAccessReadinessMockData]);
    },
    getCctvCameras: async (): Promise<RepositoryResult<CctvCamera[]>> => {
        await delay();
        return ok([...mockCctvCameras]);
    },
    getCctvCameraDetail: async (cameraId: string): Promise<RepositoryResult<CctvCamera>> => {
        await delay();
        const c = mockCctvCameras.find(x => x.id === cameraId);
        if (!c)
            return { ok: false, error: { message: 'Camera not found', code: 'NOT_FOUND' } };
        return ok(c);
    },
    createCctvAccessRequest: async (input: RequestCctvAccessCommand): Promise<RepositoryResult<CctvAccessRequest>> => {
        await delay();
        return ok({
            id: `car-${Date.now()}`,
            cameraId: input.cameraId,
            cameraName: 'CCTV Camera',
            requesterName: 'Authorized Operator',
            requesterRole: 'FACILITY_MANAGER',
            requesterId: 'user-01',
            reason: input.reason,
            purpose: input.purpose,
            durationMinutes: input.durationMinutes,
            status: 'PENDING',
            requestedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + input.durationMinutes * 60000).toISOString(),
            incidentReferenceId: input.incidentReferenceId,
        });
    },
    approveCctvAccess: async (requestId: string): Promise<RepositoryResult<CctvAccessRequest>> => {
        await delay();
        return ok({
            id: requestId,
            cameraId: 'cam-01',
            cameraName: 'CCTV Camera',
            requesterName: 'Authorized Operator',
            requesterRole: 'FACILITY_MANAGER',
            requesterId: 'user-01',
            reason: 'Test',
            purpose: 'SECURITY_INCIDENT',
            durationMinutes: 30,
            status: 'APPROVED',
            requestedAt: new Date().toISOString(),
            approvedAt: new Date().toISOString(),
            approvedBy: 'Admin',
            accessToken: `cctv-token-${Date.now()}`,
            evidenceReference: `cctv://vault/evidence/cam-01/${Date.now()}`,
            evidenceChecksum: 'sha256-test',
            expiresAt: new Date(Date.now() + 30 * 60000).toISOString(),
        });
    },
    rejectCctvAccess: async (requestId: string, reason: string): Promise<RepositoryResult<CctvAccessRequest>> => {
        await delay();
        return ok({
            id: requestId,
            cameraId: 'cam-01',
            cameraName: 'CCTV Camera',
            requesterName: 'Authorized Operator',
            requesterRole: 'FACILITY_MANAGER',
            requesterId: 'user-01',
            reason: 'Test',
            purpose: 'SECURITY_INCIDENT',
            durationMinutes: 30,
            status: 'REJECTED',
            requestedAt: new Date().toISOString(),
        });
    },
    verifyCctvAccessToken: async (requestId: string, token: string): Promise<RepositoryResult<{ valid: boolean; evidenceReference?: string }>> => {
        await delay();
        return ok({ valid: true, evidenceReference: `cctv://vault/evidence/cam-01/${Date.now()}` });
    },
    getSmartMeterDashboard: async (): Promise<RepositoryResult<SmartMeterDashboardData>> => {
        await delay();
        return ok(mockSmartMeterDashboard);
    },
    getSmartMeterReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
        await delay();
        return ok([...smartMeterReadinessMockData]);
    },
    getSmartMeters: async (): Promise<RepositoryResult<SmartMeter[]>> => {
        await delay();
        return ok([...mockSmartMeters]);
    },
    getSmartMeterDetail: async (meterId: string): Promise<RepositoryResult<SmartMeter>> => {
        await delay();
        const m = mockSmartMeters.find(x => x.id === meterId);
        if (!m)
            return { ok: false, error: { message: 'Meter not found', code: 'NOT_FOUND' } };
        return ok(m);
    },
    getSmartMeterReadings: async (meterId: string): Promise<RepositoryResult<SmartMeterReading[]>> => {
        await delay();
        return ok([...mockSmartMeterReadings]);
    },
    ingestMeterReading: async (input: {
        meterId: string;
        currentValue: number;
        readingDate: string;
        source: 'AUTOMATIC' | 'MANUAL' | 'IMPORT' | 'ESTIMATED';
        unitNumber?: string;
    }): Promise<RepositoryResult<SmartMeterReading>> => {
        await delay();
        return ok({
            id: `smr-${Date.now()}`,
            meterId: input.meterId,
            meterCode: 'WM-TEST',
            unitNumber: input.unitNumber || 'A-101',
            type: 'WATER',
            previousReadingValue: 100,
            currentReadingValue: input.currentValue,
            consumptionValue: input.currentValue - 100,
            readingDate: input.readingDate,
            source: input.source,
            status: 'VALIDATED',
            billingReadiness: 'READY',
            sourceTimestamp: input.readingDate,
            receivedAt: new Date().toISOString(),
            deduplicationKey: `meter_${input.meterId}_${input.currentValue}_${input.readingDate}`,
        });
    },
    importMeterReadings: async (input: ImportMeterReadingsCommand): Promise<RepositoryResult<{ imported: number; failed: number }>> => {
        await delay();
        return ok({ imported: input.readings.length, failed: 0 });
    },
    getEvChargingDashboard: async (): Promise<RepositoryResult<EvChargingDashboardData>> => {
        await delay();
        return ok(mockEvChargingDashboard);
    },
    getEvChargingReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
        await delay();
        return ok([...evChargingReadinessMockData]);
    },
    getEvChargers: async (): Promise<RepositoryResult<EvCharger[]>> => {
        await delay();
        return ok([...mockEvChargers]);
    },
    getEvChargerDetail: async (chargerId: string): Promise<RepositoryResult<EvCharger>> => {
        await delay();
        const c = mockEvChargers.find(x => x.id === chargerId);
        if (!c)
            return { ok: false, error: { message: 'Charger not found', code: 'NOT_FOUND' } };
        return ok(c);
    },
    getEvChargingSessions: async (): Promise<RepositoryResult<EvChargingSession[]>> => {
        await delay();
        return ok([...mockEvChargingSessions]);
    },
    getEvChargingSessionDetail: async (sessionId: string): Promise<RepositoryResult<EvChargingSession>> => {
        await delay();
        const s = mockEvChargingSessions.find(x => x.id === sessionId);
        if (!s)
            return { ok: false, error: { message: 'Session not found', code: 'NOT_FOUND' } };
        return ok(s);
    },
    processEvSessionEvent: async (input: {
        chargerId: string;
        externalSessionId: string;
        eventType: 'START' | 'UPDATE' | 'STOP';
        timestamp: string;
        energyConsumedKwh?: number;
        meterStartKwh?: number;
        meterEndKwh?: number;
        claimedResidentName?: string;
        claimedUnitNumber?: string;
        vehicleNumberMasked?: string;
    }): Promise<RepositoryResult<EvChargingSession>> => {
        await delay();
        return ok({
            id: `sess-${Date.now()}`,
            chargerId: input.chargerId,
            chargerName: 'Test Charger',
            residentName: input.claimedResidentName || 'Test User',
            unitNumber: input.claimedUnitNumber || 'A-101',
            vehicleNumberMasked: input.vehicleNumberMasked || 'EV-**-****',
            startTime: input.timestamp,
            energyConsumedKwh: input.energyConsumedKwh || 0,
            billingStatus: 'PENDING',
            status: input.eventType === 'STOP' ? 'COMPLETED' : 'IN_PROGRESS',
            externalSessionId: input.externalSessionId,
            sourceTimestamp: input.timestamp,
            receivedAt: new Date().toISOString(),
            deduplicationKey: `ev_${input.chargerId}_${input.externalSessionId}_${input.eventType}_${input.timestamp}`,
        });
    },
    getBiometricConnectorAlignment: async (): Promise<RepositoryResult<BiometricConnectorStatus>> => {
        await delay();
        return ok({ syncHealth: 'HEALTHY', lastSync: new Date().toISOString() });
    },
    getHardwareSyncJobs: async (): Promise<RepositoryResult<HardwareSyncJob[]>> => {
        await delay();
        return ok([...mockHardwareSyncJobs]);
    },
    getHardwareSyncJobDetail: async (syncJobId: string): Promise<RepositoryResult<HardwareSyncJob>> => {
        await delay();
        const j = mockHardwareSyncJobs.find(x => x.id === syncJobId);
        if (!j)
            return { ok: false, error: { message: 'Sync job not found', code: 'NOT_FOUND' } };
        return ok(j);
    },
    getHardwareEvents: async (): Promise<RepositoryResult<HardwareEvent[]>> => {
        await delay();
        return ok([...mockHardwareEvents]);
    },
    getHardwareEventDetail: async (eventId: string): Promise<RepositoryResult<HardwareEvent>> => {
        await delay();
        const e = mockHardwareEvents.find(x => x.id === eventId);
        if (!e)
            return { ok: false, error: { message: 'Event not found', code: 'NOT_FOUND' } };
        return ok(e);
    },
    getHardwareErrors: async (): Promise<RepositoryResult<HardwareErrorRecord[]>> => {
        await delay();
        return ok([...mockHardwareErrors]);
    },
    resolveHardwareError: async (input: ResolveHardwareErrorCommand): Promise<RepositoryResult<HardwareErrorRecord>> => {
        await delay();
        return ok({
            id: input.errorId,
            deviceId: 'dev-01',
            deviceName: 'Test Device',
            errorType: 'VENDOR_API_ERROR',
            message: 'Test error',
            createdAt: new Date().toISOString(),
            status: 'RESOLVED',
            suggestedAction: 'Test',
            resolutionNotes: `[${input.resolutionAction}] ${input.notes}`,
            resolvedBy: 'Admin',
            resolvedAt: new Date().toISOString(),
            correctiveWorkOrderId: input.correctiveWorkOrderId,
        });
    },
    ignoreHardwareError: async (input: IgnoreHardwareErrorCommand): Promise<RepositoryResult<HardwareErrorRecord>> => {
        await delay();
        return ok({
            id: input.errorId,
            deviceId: 'dev-01',
            deviceName: 'Test Device',
            errorType: 'VENDOR_API_ERROR',
            message: 'Test error',
            createdAt: new Date().toISOString(),
            status: 'IGNORED',
            suggestedAction: 'Test',
            resolutionNotes: `Ignored: ${input.reason}`,
        });
    },
    escalateHardwareError: async (input: EscalateHardwareErrorCommand): Promise<RepositoryResult<HardwareErrorRecord>> => {
        await delay();
        return ok({
            id: input.errorId,
            deviceId: 'dev-01',
            deviceName: 'Test Device',
            errorType: 'VENDOR_API_ERROR',
            message: 'Test error',
            createdAt: new Date().toISOString(),
            status: 'ESCALATED',
            suggestedAction: `Escalated to ${input.targetDepartment}: ${input.escalationNotes}`,
            correctiveWorkOrderId: input.createWorkOrder ? `wo-hw-${Date.now()}` : undefined,
        });
    },
    getIntegrationHealth: async (): Promise<RepositoryResult<IntegrationHealthRow[]>> => {
        await delay();
        return ok([...mockIntegrationHealth]);
    },
    listIntegrationHealthLogs: async (): Promise<RepositoryResult<IntegrationHealthLogRecord[]>> => {
        await delay();
        return ok([...integrationHealthLogsMockData]);
    },
    getDevicePermissionMatrix: async (): Promise<RepositoryResult<DevicePermissionRow[]>> => {
        await delay();
        return ok([]);
    },
    getHardwarePrivacyRules: async (): Promise<RepositoryResult<HardwarePrivacyRule[]>> => {
        await delay();
        return ok([]);
    },
    getHardwareAuditLogs: async (): Promise<RepositoryResult<HardwareAuditLogEntry[]>> => {
        await delay();
        return ok([...mockHardwareAuditLogs]);
    },
    getHardwareSettings: async (): Promise<RepositoryResult<HardwareSettingGroup[]>> => {
        await delay();
        return ok([]);
    },
    updateHardwareSettings: async (input: UpdateHardwareSettingsCommand): Promise<RepositoryResult<{ success: boolean }>> => {
        await delay();
        return ok({ success: true });
    },
};