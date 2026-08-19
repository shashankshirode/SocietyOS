

import type { HardwareDevice, DeviceLocationMapping, HardwareSyncJob, HardwareEvent, HardwareErrorRecord, IntegrationHealthRow, HardwareAuditLogEntry, HardwareSettingGroup, HardwareHomeData } from '../../../shared/types/hardware.types';
import type { RfidEvent, RfidTagMapping, AnprEvent, AnprVehicleMatchReview, BoomBarrierDevice, GateHardwareDashboardData } from '../../../shared/types/gateHardware.types';
import type { CctvCamera, CctvAccessRequest } from '../../../shared/types/cctv.types';
import type { SmartMeter, SmartMeterReading, SmartMeterDashboardData } from '../../../shared/types/smartMeter.types';
import type { EvCharger, EvChargingSession, EvChargingDashboardData } from '../../../shared/types/evCharging.types';

export type HardwareDeviceDto = HardwareDevice;
export type DeviceLocationMappingDto = DeviceLocationMapping;
export type HardwareSyncJobDto = HardwareSyncJob;
export type HardwareEventDto = HardwareEvent;
export type HardwareErrorRecordDto = HardwareErrorRecord;
export type IntegrationHealthRowDto = IntegrationHealthRow;
export type HardwareAuditLogEntryDto = HardwareAuditLogEntry;
export type HardwareSettingGroupDto = HardwareSettingGroup;
export type HardwareHomeDataDto = HardwareHomeData;

export type RfidEventDto = RfidEvent;
export type RfidTagMappingDto = RfidTagMapping;
export type AnprEventDto = AnprEvent;
export type AnprVehicleMatchReviewDto = AnprVehicleMatchReview;
export type BoomBarrierDeviceDto = BoomBarrierDevice;
export type GateHardwareDashboardDataDto = GateHardwareDashboardData;

export type CctvCameraDto = CctvCamera;
export type CctvAccessRequestDto = CctvAccessRequest;

export type SmartMeterDto = SmartMeter;
export type SmartMeterReadingDto = SmartMeterReading;
export type SmartMeterDashboardDataDto = SmartMeterDashboardData;

export type EvChargerDto = EvCharger;
export type EvChargingSessionDto = EvChargingSession;
export type EvChargingDashboardDataDto = EvChargingDashboardData;
