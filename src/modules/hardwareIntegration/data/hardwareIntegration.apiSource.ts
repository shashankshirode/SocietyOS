

import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { HardwareDevice, DeviceLocationMapping, HardwareSyncJob, HardwareEvent, HardwareErrorRecord, IntegrationHealthRow, HardwareAuditLogEntry, HardwareSettingGroup, HardwareHomeData, DevicePermissionRow, HardwarePrivacyRule } from '../../../shared/types/hardware.types';
import type { RfidEvent, RfidTagMapping, AnprEvent, AnprVehicleMatchReview, BoomBarrierDevice, GateHardwareDashboardData } from '../../../shared/types/gateHardware.types';
import type { CctvCamera, CctvAccessRequest } from '../../../shared/types/cctv.types';
import type { SmartMeter, SmartMeterReading, SmartMeterDashboardData } from '../../../shared/types/smartMeter.types';
import type { EvCharger, EvChargingSession, EvChargingDashboardData } from '../../../shared/types/evCharging.types';
import type { HardwareReadinessRecord, IntegrationHealthLogRecord } from './hardwareIntegration.mockData';

const notImplemented = (): Promise<RepositoryResult<never>> =>
  Promise.resolve({ ok: false, error: { message: 'API source not implemented', code: 'NOT_IMPLEMENTED' } });
type BiometricConnectorStatus = { syncHealth: string; lastSync: string };
type AnprReviewInput = Pick<AnprVehicleMatchReview, 'reviewerDecision' | 'notes'>;
type CctvRequestInput = Pick<CctvAccessRequest, 'cameraId' | 'reason' | 'durationMinutes'>;

export const hardwareIntegrationApiSource = {
  getHardwareHome: () => notImplemented() as Promise<RepositoryResult<HardwareHomeData>>,
  getHardwareDevices: () => notImplemented() as Promise<RepositoryResult<HardwareDevice[]>>,
  getHardwareDeviceDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<HardwareDevice>>,
  registerHardwareDevice: (_input: Partial<HardwareDevice>) => notImplemented() as Promise<RepositoryResult<HardwareDevice>>,
  updateHardwareDevice: (_id: string, _input: Partial<HardwareDevice>) => notImplemented() as Promise<RepositoryResult<HardwareDevice>>,
  markDeviceInactive: (_id: string) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  testDeviceSyncPlaceholder: (_id: string) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  getDeviceLocationMappings: () => notImplemented() as Promise<RepositoryResult<DeviceLocationMapping[]>>,
  createDeviceLocationMapping: (_input: Partial<DeviceLocationMapping>) => notImplemented() as Promise<RepositoryResult<DeviceLocationMapping>>,
  updateDeviceLocationMapping: (_id: string, _input: Partial<DeviceLocationMapping>) => notImplemented() as Promise<RepositoryResult<DeviceLocationMapping>>,
  getGateHardwareDashboard: () => notImplemented() as Promise<RepositoryResult<GateHardwareDashboardData>>,
  getRfidReadiness: () => notImplemented() as Promise<RepositoryResult<RfidEvent[]>>,
  getRfidIntegrationReadiness: () => notImplemented() as Promise<RepositoryResult<HardwareReadinessRecord[]>>,
  getRfidTagMappings: () => notImplemented() as Promise<RepositoryResult<RfidTagMapping[]>>,
  createRfidTagMapping: (_input: Partial<RfidTagMapping>) => notImplemented() as Promise<RepositoryResult<RfidTagMapping>>,
  updateRfidTagMapping: (_id: string, _input: Partial<RfidTagMapping>) => notImplemented() as Promise<RepositoryResult<RfidTagMapping>>,
  getAnprReadiness: () => notImplemented() as Promise<RepositoryResult<AnprEvent[]>>,
  getAnprIntegrationReadiness: () => notImplemented() as Promise<RepositoryResult<HardwareReadinessRecord[]>>,
  getAnprEvents: () => notImplemented() as Promise<RepositoryResult<AnprEvent[]>>,
  reviewAnprVehicleMatch: (_id: string, _input: AnprReviewInput) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  getBoomBarriers: () => notImplemented() as Promise<RepositoryResult<BoomBarrierDevice[]>>,
  getBoomBarrierReadiness: () => notImplemented() as Promise<RepositoryResult<HardwareReadinessRecord[]>>,
  getBoomBarrierDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<BoomBarrierDevice>>,
  requestBoomBarrierManualOverridePlaceholder: (_id: string, _input: JsonObject) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  getCctvAccessPlaceholder: () => notImplemented() as Promise<RepositoryResult<CctvAccessRequest[]>>,
  getCctvAccessReadiness: () => notImplemented() as Promise<RepositoryResult<HardwareReadinessRecord[]>>,
  getCctvCameras: () => notImplemented() as Promise<RepositoryResult<CctvCamera[]>>,
  getCctvCameraDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<CctvCamera>>,
  createCctvAccessRequestPlaceholder: (_input: CctvRequestInput) => notImplemented() as Promise<RepositoryResult<CctvAccessRequest>>,
  getSmartMeterDashboard: () => notImplemented() as Promise<RepositoryResult<SmartMeterDashboardData>>,
  getSmartMeterReadiness: () => notImplemented() as Promise<RepositoryResult<HardwareReadinessRecord[]>>,
  getSmartMeters: () => notImplemented() as Promise<RepositoryResult<SmartMeter[]>>,
  getSmartMeterDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<SmartMeter>>,
  getSmartMeterReadings: (_id: string) => notImplemented() as Promise<RepositoryResult<SmartMeterReading[]>>,
  importMeterReadingsPlaceholder: (_input: JsonObject) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  getEvChargingDashboard: () => notImplemented() as Promise<RepositoryResult<EvChargingDashboardData>>,
  getEvChargingReadiness: () => notImplemented() as Promise<RepositoryResult<HardwareReadinessRecord[]>>,
  getEvChargers: () => notImplemented() as Promise<RepositoryResult<EvCharger[]>>,
  getEvChargerDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<EvCharger>>,
  getEvChargingSessions: () => notImplemented() as Promise<RepositoryResult<EvChargingSession[]>>,
  getEvChargingSessionDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<EvChargingSession>>,
  getBiometricConnectorAlignment: () => notImplemented() as Promise<RepositoryResult<BiometricConnectorStatus>>,
  getHardwareSyncJobs: () => notImplemented() as Promise<RepositoryResult<HardwareSyncJob[]>>,
  getHardwareSyncJobDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<HardwareSyncJob>>,
  getHardwareEvents: () => notImplemented() as Promise<RepositoryResult<HardwareEvent[]>>,
  getHardwareEventDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<HardwareEvent>>,
  getHardwareErrors: () => notImplemented() as Promise<RepositoryResult<HardwareErrorRecord[]>>,
  resolveHardwareErrorPlaceholder: (_id: string, _input: JsonObject) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  ignoreHardwareErrorPlaceholder: (_id: string, _input: JsonObject) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  escalateHardwareErrorPlaceholder: (_id: string, _input: JsonObject) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  getIntegrationHealth: () => notImplemented() as Promise<RepositoryResult<IntegrationHealthRow[]>>,
  listIntegrationHealthLogs: () => notImplemented() as Promise<RepositoryResult<IntegrationHealthLogRecord[]>>,
  getDevicePermissionMatrix: () => notImplemented() as Promise<RepositoryResult<DevicePermissionRow[]>>,
  getHardwarePrivacyRules: () => notImplemented() as Promise<RepositoryResult<HardwarePrivacyRule[]>>,
  getHardwareAuditLogs: () => notImplemented() as Promise<RepositoryResult<HardwareAuditLogEntry[]>>,
  getHardwareSettings: () => notImplemented() as Promise<RepositoryResult<HardwareSettingGroup[]>>,
  updateHardwareSettings: (_input: JsonObject) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
};
