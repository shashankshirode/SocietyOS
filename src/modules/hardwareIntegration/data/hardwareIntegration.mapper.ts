

import type { HardwareDevice, DeviceLocationMapping, HardwareSyncJob, HardwareEvent, HardwareErrorRecord, IntegrationHealthRow, HardwareAuditLogEntry } from '../../../shared/types/hardware.types';
import type { RfidEvent, RfidTagMapping, AnprEvent, BoomBarrierDevice } from '../../../shared/types/gateHardware.types';
import type { CctvCamera } from '../../../shared/types/cctv.types';
import type { SmartMeter, SmartMeterReading } from '../../../shared/types/smartMeter.types';
import type { EvCharger, EvChargingSession } from '../../../shared/types/evCharging.types';

export const mapDevice = (dto: HardwareDevice): HardwareDevice => dto;
export const mapDevices = (dtos: HardwareDevice[]): HardwareDevice[] => dtos.map(mapDevice);

export const mapLocationMapping = (dto: DeviceLocationMapping): DeviceLocationMapping => dto;
export const mapLocationMappings = (dtos: DeviceLocationMapping[]): DeviceLocationMapping[] => dtos.map(mapLocationMapping);

export const mapSyncJob = (dto: HardwareSyncJob): HardwareSyncJob => dto;
export const mapSyncJobs = (dtos: HardwareSyncJob[]): HardwareSyncJob[] => dtos.map(mapSyncJob);

export const mapEvent = (dto: HardwareEvent): HardwareEvent => dto;
export const mapEvents = (dtos: HardwareEvent[]): HardwareEvent[] => dtos.map(mapEvent);

export const mapErrorRecord = (dto: HardwareErrorRecord): HardwareErrorRecord => dto;
export const mapErrorRecords = (dtos: HardwareErrorRecord[]): HardwareErrorRecord[] => dtos.map(mapErrorRecord);

export const mapHealthRow = (dto: IntegrationHealthRow): IntegrationHealthRow => dto;
export const mapHealthRows = (dtos: IntegrationHealthRow[]): IntegrationHealthRow[] => dtos.map(mapHealthRow);

export const mapAuditLog = (dto: HardwareAuditLogEntry): HardwareAuditLogEntry => dto;
export const mapAuditLogs = (dtos: HardwareAuditLogEntry[]): HardwareAuditLogEntry[] => dtos.map(mapAuditLog);

export const mapRfidEvent = (dto: RfidEvent): RfidEvent => dto;
export const mapRfidEvents = (dtos: RfidEvent[]): RfidEvent[] => dtos.map(mapRfidEvent);

export const mapRfidTagMapping = (dto: RfidTagMapping): RfidTagMapping => dto;
export const mapRfidTagMappings = (dtos: RfidTagMapping[]): RfidTagMapping[] => dtos.map(mapRfidTagMapping);

export const mapAnprEvent = (dto: AnprEvent): AnprEvent => dto;
export const mapAnprEvents = (dtos: AnprEvent[]): AnprEvent[] => dtos.map(mapAnprEvent);

export const mapBoomBarrier = (dto: BoomBarrierDevice): BoomBarrierDevice => dto;
export const mapBoomBarriers = (dtos: BoomBarrierDevice[]): BoomBarrierDevice[] => dtos.map(mapBoomBarrier);

export const mapCctvCamera = (dto: CctvCamera): CctvCamera => dto;
export const mapCctvCameras = (dtos: CctvCamera[]): CctvCamera[] => dtos.map(mapCctvCamera);

export const mapSmartMeter = (dto: SmartMeter): SmartMeter => dto;
export const mapSmartMeters = (dtos: SmartMeter[]): SmartMeter[] => dtos.map(mapSmartMeter);

export const mapSmartMeterReading = (dto: SmartMeterReading): SmartMeterReading => dto;
export const mapSmartMeterReadings = (dtos: SmartMeterReading[]): SmartMeterReading[] => dtos.map(mapSmartMeterReading);

export const mapEvCharger = (dto: EvCharger): EvCharger => dto;
export const mapEvChargers = (dtos: EvCharger[]): EvCharger[] => dtos.map(mapEvCharger);

export const mapEvChargingSession = (dto: EvChargingSession): EvChargingSession => dto;
export const mapEvChargingSessions = (dtos: EvChargingSession[]): EvChargingSession[] => dtos.map(mapEvChargingSession);
