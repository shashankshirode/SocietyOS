import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { HardwareDevice, DeviceLocationMapping, HardwareSyncJob, HardwareEvent, HardwareErrorRecord, IntegrationHealthRow, HardwareAuditLogEntry, HardwareSettingGroup, HardwareHomeData, DevicePermissionRow, HardwarePrivacyRule } from '../../../shared/types/hardware.types';
import type { RfidEvent, RfidTagMapping, AnprEvent, AnprVehicleMatchReview, BoomBarrierDevice, GateHardwareDashboardData } from '../../../shared/types/gateHardware.types';
import type { CctvCamera, CctvAccessRequest } from '../../../shared/types/cctv.types';
import type { SmartMeter, SmartMeterReading, SmartMeterDashboardData } from '../../../shared/types/smartMeter.types';
import type { EvCharger, EvChargingSession, EvChargingDashboardData } from '../../../shared/types/evCharging.types';
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
import { anprIntegrationReadinessMockData, boomBarrierReadinessMockData, cctvAccessReadinessMockData, evChargingReadinessMockData, integrationHealthLogsMockData, rfidIntegrationReadinessMockData, smartMeterReadinessMockData, type HardwareReadinessRecord, type IntegrationHealthLogRecord, } from './hardwareIntegration.mockData';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
const delay = (ms = 400) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const ok = <T>(data: T): RepositoryResult<T> => ({ ok: true, data });
type BiometricConnectorStatus = {
    syncHealth: string;
    lastSync: string;
};
type AnprReviewInput = Pick<AnprVehicleMatchReview, 'reviewerDecision' | 'notes'>;
type CctvRequestInput = Pick<CctvAccessRequest, 'cameraId' | 'reason' | 'durationMinutes'>;
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
    registerHardwareDevice: async (input: Partial<HardwareDevice>): Promise<RepositoryResult<HardwareDevice>> => {
        await delay();
        return ok({ ...getRequiredItem(mockHardwareDevices, 0, "hardwareIntegration.mockSource.ts"), id: `dev-${Date.now()}`, ...input });
    },
    updateHardwareDevice: async (deviceId: string, input: Partial<HardwareDevice>): Promise<RepositoryResult<HardwareDevice>> => {
        await delay();
        return ok({ ...getRequiredItem(mockHardwareDevices, 0, "hardwareIntegration.mockSource.ts"), id: deviceId, ...input });
    },
    markDeviceInactive: async (deviceId: string): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
    },
    testDeviceSyncPlaceholder: async (deviceId: string): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
    },
    getDeviceLocationMappings: async (): Promise<RepositoryResult<DeviceLocationMapping[]>> => {
        await delay();
        return ok([...mockDeviceLocationMappings]);
    },
    createDeviceLocationMapping: async (input: Partial<DeviceLocationMapping>): Promise<RepositoryResult<DeviceLocationMapping>> => {
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
    createRfidTagMapping: async (input: Partial<RfidTagMapping>): Promise<RepositoryResult<RfidTagMapping>> => {
        await delay();
        return ok({ ...getRequiredItem(mockRfidTagMappings, 0, "hardwareIntegration.mockSource.ts"), id: `rtm-${Date.now()}`, ...input });
    },
    updateRfidTagMapping: async (mappingId: string, input: Partial<RfidTagMapping>): Promise<RepositoryResult<RfidTagMapping>> => {
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
    reviewAnprVehicleMatch: async (eventId: string, input: AnprReviewInput): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
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
    requestBoomBarrierManualOverridePlaceholder: async (barrierId: string, input: JsonObject): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
    },
    getCctvAccessPlaceholder: async (): Promise<RepositoryResult<CctvAccessRequest[]>> => {
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
    createCctvAccessRequestPlaceholder: async (input: CctvRequestInput): Promise<RepositoryResult<CctvAccessRequest>> => {
        await delay();
        return ok({
            id: `car-${Date.now()}`,
            cameraId: input.cameraId,
            cameraName: 'CCTV Camera',
            requesterName: 'Suresh Patil',
            requesterRole: 'FACILITY_MANAGER',
            reason: input.reason,
            durationMinutes: input.durationMinutes,
            status: 'PENDING',
            requestedAt: new Date().toISOString(),
        });
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
    importMeterReadingsPlaceholder: async (input: JsonObject): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
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
    resolveHardwareErrorPlaceholder: async (errorId: string, input: JsonObject): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
    },
    ignoreHardwareErrorPlaceholder: async (errorId: string, input: JsonObject): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
    },
    escalateHardwareErrorPlaceholder: async (errorId: string, input: JsonObject): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
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
    updateHardwareSettings: async (input: JsonObject): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
    },
};

