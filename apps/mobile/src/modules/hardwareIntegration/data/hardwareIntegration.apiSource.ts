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
  ReviewAnprMatchCommand,
  RequestBarrierOverrideCommand,
  RequestCctvAccessCommand,
  ImportMeterReadingsCommand,
  ResolveHardwareErrorCommand,
  IgnoreHardwareErrorCommand,
  EscalateHardwareErrorCommand,
  UpdateHardwareSettingsCommand,
} from '../../../shared/types/hardware.types';
import type {
  RfidEvent,
  RfidTagMapping,
  AnprEvent,
  AnprVehicleMatchReview,
  BoomBarrierDevice,
  GateHardwareDashboardData,
} from '../../../shared/types/gateHardware.types';
import type { CctvCamera, CctvAccessRequest } from '../../../shared/types/cctv.types';
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
import {
  deviceRegistryService,
  rfidIntegrationService,
  anprIntegrationService,
  boomBarrierService,
  cctvIntegrationService,
  smartMeterConnectorService,
  evChargingConnectorService,
  hardwareHealthObservabilityService,
  type HardwareActorContext,
} from '../services';

const ok = <T>(data: T): RepositoryResult<T> => ({ ok: true, data });
const fail = <T>(message: string, code = 'HARDWARE_API_ERROR'): RepositoryResult<T> => ({
  ok: false,
  error: { message, code },
});

const defaultActor: HardwareActorContext = {
  userId: 'api-admin-01',
  userName: 'Integration Admin',
  userRole: 'SUPER_ADMIN',
  societyId: 'soc-canonical-01',
};

export const hardwareIntegrationApiSource = {
  getHardwareHome: async (): Promise<RepositoryResult<HardwareHomeData>> => {
    try {
      const data = hardwareHealthObservabilityService.getHardwareHomeData(defaultActor);
      return ok(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get hardware home data';
      return fail(msg);
    }
  },

  getHardwareDevices: async (): Promise<RepositoryResult<HardwareDevice[]>> => {
    try {
      const devices = deviceRegistryService.listDevices(defaultActor);
      return ok(devices);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list hardware devices';
      return fail(msg);
    }
  },

  getHardwareDeviceDetail: async (id: string): Promise<RepositoryResult<HardwareDevice>> => {
    try {
      const device = deviceRegistryService.getDevice(defaultActor, id);
      if (!device) {
        return fail('Device not found', 'DEVICE_NOT_FOUND');
      }
      return ok(device);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get device detail';
      return fail(msg);
    }
  },

  registerHardwareDevice: async (input: RegisterHardwareDeviceCommand): Promise<RepositoryResult<HardwareDevice>> => {
    try {
      const device = deviceRegistryService.registerDevice(defaultActor, input);
      return ok(device);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to register hardware device';
      return fail(msg);
    }
  },

  updateHardwareDevice: async (id: string, input: UpdateHardwareDeviceCommand): Promise<RepositoryResult<HardwareDevice>> => {
    try {
      const device = deviceRegistryService.updateDevice(defaultActor, id, input);
      return ok(device);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update hardware device';
      return fail(msg);
    }
  },

  activateHardwareDevice: async (id: string): Promise<RepositoryResult<HardwareDevice>> => {
    try {
      const device = deviceRegistryService.activateDevice(defaultActor, id);
      return ok(device);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to activate hardware device';
      return fail(msg);
    }
  },

  suspendHardwareDevice: async (id: string, reason: string): Promise<RepositoryResult<HardwareDevice>> => {
    try {
      const device = deviceRegistryService.suspendDevice(defaultActor, id, reason);
      return ok(device);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to suspend hardware device';
      return fail(msg);
    }
  },

  decommissionHardwareDevice: async (id: string, reason: string): Promise<RepositoryResult<HardwareDevice>> => {
    try {
      const device = deviceRegistryService.decommissionDevice(defaultActor, id, reason);
      return ok(device);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to decommission hardware device';
      return fail(msg);
    }
  },

  replaceHardwareDevice: async (oldDeviceId: string, newDeviceCommand: RegisterHardwareDeviceCommand): Promise<RepositoryResult<{ oldDevice: HardwareDevice; newDevice: HardwareDevice }>> => {
    try {
      const result = deviceRegistryService.replaceDevice(defaultActor, oldDeviceId, newDeviceCommand);
      return ok(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to replace hardware device';
      return fail(msg);
    }
  },

  rotateDeviceCredential: async (id: string, newCredentialRef: string): Promise<RepositoryResult<HardwareDevice>> => {
    try {
      const device = deviceRegistryService.rotateCredential(defaultActor, id, newCredentialRef);
      return ok(device);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to rotate device credential';
      return fail(msg);
    }
  },

  testDeviceSync: async (id: string): Promise<RepositoryResult<{ success: boolean; lastHeartbeat: string }>> => {
    try {
      const result = hardwareHealthObservabilityService.recordHeartbeat(id, new Date().toISOString());
      return ok({ success: true, lastHeartbeat: result.status === 'ONLINE' ? new Date().toISOString() : '' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to test device sync';
      return fail(msg);
    }
  },

  getDeviceLocationMappings: async (): Promise<RepositoryResult<DeviceLocationMapping[]>> => {
    try {
      const mappings = deviceRegistryService.listLocationMappings();
      return ok(mappings);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list location mappings';
      return fail(msg);
    }
  },

  createDeviceLocationMapping: async (input: MapDeviceLocationCommand): Promise<RepositoryResult<DeviceLocationMapping>> => {
    try {
      const mapping = deviceRegistryService.mapLocation(defaultActor, input);
      return ok(mapping);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to create location mapping';
      return fail(msg);
    }
  },

  updateDeviceLocationMapping: async (id: string, input: Partial<DeviceLocationMapping>): Promise<RepositoryResult<DeviceLocationMapping>> => {
    try {
      const existing = deviceRegistryService.listLocationMappings().find(m => m.id === id);
      if (!existing) {
        return fail('Location mapping not found', 'NOT_FOUND');
      }
      if (input.location) existing.location = input.location;
      if (input.accessZone) existing.accessZone = input.accessZone;
      if (input.responsibleRole) existing.responsibleRole = input.responsibleRole;
      if (input.visibilityRules) existing.visibilityRules = input.visibilityRules;
      return ok(existing);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update location mapping';
      return fail(msg);
    }
  },

  getGateHardwareDashboard: async (): Promise<RepositoryResult<GateHardwareDashboardData>> => {
    try {
      const devices = deviceRegistryService.listDevices(defaultActor);
      const rfidCount = devices.filter(d => d.type === 'RFID_READER').length;
      const anprCount = devices.filter(d => d.type === 'ANPR_CAMERA').length;
      const barrierCount = boomBarrierService.listBarriers().length;
      const rfidEvents = rfidIntegrationService.listEvents().length;
      const anprEvents = anprIntegrationService.listEvents();
      const unmatchedAnpr = anprEvents.filter(e => e.status === 'UNMATCHED' || e.status === 'LOW_CONFIDENCE').length;

      return ok({
        gateDevicesCount: rfidCount + anprCount + barrierCount,
        rfidReadersCount: rfidCount,
        anprCamerasCount: anprCount,
        boomBarriersCount: barrierCount,
        totalGateEventsToday: rfidEvents + anprEvents.length,
        unmatchedVehicleEventsToday: unmatchedAnpr,
        deviceHealthScore: hardwareHealthObservabilityService.computeReadinessScore(defaultActor),
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get gate dashboard';
      return fail(msg);
    }
  },

  getRfidReadiness: async (): Promise<RepositoryResult<RfidEvent[]>> => {
    try {
      return ok(rfidIntegrationService.listEvents());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list RFID events';
      return fail(msg);
    }
  },

  getRfidIntegrationReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
    return ok([
      {
        id: 'rfid-ready-01',
        title: 'RFID tag mapping readiness',
        readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED',
        summary: 'Effective-dated tag assignment, masked tag display, and audit trail are ready.',
        nextStep: 'Connect hardware controller webhook or API gateway.',
      },
    ]);
  },

  getRfidTagMappings: async (): Promise<RepositoryResult<RfidTagMapping[]>> => {
    try {
      return ok(rfidIntegrationService.listMappings());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list RFID mappings';
      return fail(msg);
    }
  },

  createRfidTagMapping: async (input: CreateRfidTagMappingCommand): Promise<RepositoryResult<RfidTagMapping>> => {
    try {
      const mapping = rfidIntegrationService.createTagMapping(defaultActor, input);
      return ok(mapping);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to create RFID tag mapping';
      return fail(msg);
    }
  },

  updateRfidTagMapping: async (id: string, input: UpdateRfidTagMappingCommand): Promise<RepositoryResult<RfidTagMapping>> => {
    try {
      const mapping = rfidIntegrationService.updateTagMapping(defaultActor, id, input);
      return ok(mapping);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update RFID tag mapping';
      return fail(msg);
    }
  },

  getAnprReadiness: async (): Promise<RepositoryResult<AnprEvent[]>> => {
    try {
      return ok(anprIntegrationService.listEvents());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get ANPR events';
      return fail(msg);
    }
  },

  getAnprIntegrationReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
    return ok([
      {
        id: 'anpr-ready-01',
        title: 'ANPR vehicle recognition readiness',
        readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED',
        summary: 'Confidence evaluation, review workflow, and vehicle resolution are operational.',
        nextStep: 'Connect physical camera video/OCR stream.',
      },
    ]);
  },

  getAnprEvents: async (): Promise<RepositoryResult<AnprEvent[]>> => {
    try {
      return ok(anprIntegrationService.listEvents());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get ANPR events';
      return fail(msg);
    }
  },

  reviewAnprVehicleMatch: async (id: string, input: ReviewAnprMatchCommand): Promise<RepositoryResult<AnprVehicleMatchReview>> => {
    try {
      const review = anprIntegrationService.reviewMatch(defaultActor, input);
      return ok(review);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to review ANPR match';
      return fail(msg);
    }
  },

  getBoomBarriers: async (): Promise<RepositoryResult<BoomBarrierDevice[]>> => {
    try {
      return ok(boomBarrierService.listBarriers());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list boom barriers';
      return fail(msg);
    }
  },

  getBoomBarrierReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
    return ok([
      {
        id: 'barrier-ready-01',
        title: 'Boom barrier automation readiness',
        readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED',
        summary: 'Idempotent actuator commands, timeout handling, and manual overrides are ready.',
        nextStep: 'Connect barrier relay or serial controller.',
      },
    ]);
  },

  getBoomBarrierDetail: async (id: string): Promise<RepositoryResult<BoomBarrierDevice>> => {
    try {
      const barrier = boomBarrierService.getBarrier(id);
      if (!barrier) return fail('Barrier not found', 'NOT_FOUND');
      return ok(barrier);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get barrier detail';
      return fail(msg);
    }
  },

  issueBarrierCommand: async (input: {
    barrierId: string;
    commandType: 'OPEN' | 'CLOSE';
    idempotencyKey: string;
    reason?: string;
    emergencyIncidentId?: string;
  }): Promise<RepositoryResult<{ commandId: string; state: string }>> => {
    try {
      const guardActor: HardwareActorContext = {
        userId: 'guard-01',
        userName: 'Gate Guard',
        userRole: 'SECURITY_GUARD',
        societyId: 'soc-canonical-01',
      };
      const record = boomBarrierService.issueCommand(guardActor, input);
      return ok({ commandId: record.commandId, state: record.state });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to issue barrier command';
      return fail(msg);
    }
  },

  requestBoomBarrierManualOverride: async (input: RequestBarrierOverrideCommand): Promise<RepositoryResult<{ commandId: string; state: string }>> => {
    try {
      const guardActor: HardwareActorContext = {
        userId: 'guard-01',
        userName: 'Gate Guard',
        userRole: 'SECURITY_GUARD',
        societyId: 'soc-canonical-01',
      };
      const record = boomBarrierService.manualOverride(guardActor, input);
      return ok({ commandId: record.commandId, state: record.state });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to execute barrier manual override';
      return fail(msg);
    }
  },

  reconcileBarrierState: async (barrierId: string, controllerState: string, positionSensorState: string): Promise<RepositoryResult<BoomBarrierDevice>> => {
    try {
      const barrier = boomBarrierService.reconcilePhysicalState(
        barrierId,
        controllerState as any,
        positionSensorState as any
      );
      return ok(barrier);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to reconcile barrier state';
      return fail(msg);
    }
  },

  getCctvAccessRequests: async (): Promise<RepositoryResult<CctvAccessRequest[]>> => {
    try {
      return ok(cctvIntegrationService.listRequests());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list CCTV access requests';
      return fail(msg);
    }
  },

  getCctvAccessReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
    return ok([
      {
        id: 'cctv-ready-01',
        title: 'Restricted CCTV access readiness',
        readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED',
        summary: 'Purpose-scoped access approval, time-bound tokens, and evidence security are active.',
        nextStep: 'Connect NVR/VMS streaming gateway.',
      },
    ]);
  },

  getCctvCameras: async (): Promise<RepositoryResult<CctvCamera[]>> => {
    try {
      return ok(cctvIntegrationService.listCameras());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list CCTV cameras';
      return fail(msg);
    }
  },

  getCctvCameraDetail: async (id: string): Promise<RepositoryResult<CctvCamera>> => {
    try {
      const camera = cctvIntegrationService.listCameras().find(c => c.id === id);
      if (!camera) return fail('Camera not found', 'NOT_FOUND');
      return ok(camera);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get camera detail';
      return fail(msg);
    }
  },

  createCctvAccessRequest: async (input: RequestCctvAccessCommand): Promise<RepositoryResult<CctvAccessRequest>> => {
    try {
      const request = cctvIntegrationService.requestAccess(defaultActor, input);
      return ok(request);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to create CCTV access request';
      return fail(msg);
    }
  },

  approveCctvAccess: async (requestId: string): Promise<RepositoryResult<CctvAccessRequest>> => {
    try {
      const request = cctvIntegrationService.approveAccess(defaultActor, requestId);
      return ok(request);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to approve CCTV access';
      return fail(msg);
    }
  },

  rejectCctvAccess: async (requestId: string, reason: string): Promise<RepositoryResult<CctvAccessRequest>> => {
    try {
      const request = cctvIntegrationService.rejectAccess(defaultActor, requestId, reason);
      return ok(request);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to reject CCTV access';
      return fail(msg);
    }
  },

  verifyCctvAccessToken: async (requestId: string, token: string): Promise<RepositoryResult<{ valid: boolean; evidenceReference?: string }>> => {
    try {
      const result = cctvIntegrationService.verifyAccessToken(defaultActor, requestId, token);
      return ok(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to verify CCTV access token';
      return fail(msg);
    }
  },

  getSmartMeterDashboard: async (): Promise<RepositoryResult<SmartMeterDashboardData>> => {
    try {
      return ok(smartMeterConnectorService.getDashboardData());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get smart meter dashboard';
      return fail(msg);
    }
  },

  getSmartMeterReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
    return ok([
      {
        id: 'meter-ready-01',
        title: 'Smart meter reading readiness',
        readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED',
        summary: 'Source provenance, negative consumption detection, and outlier checks are ready.',
        nextStep: 'Connect automated smart meter reading ingestion broker.',
      },
    ]);
  },

  getSmartMeters: async (): Promise<RepositoryResult<SmartMeter[]>> => {
    try {
      return ok(smartMeterConnectorService.listMeters());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list smart meters';
      return fail(msg);
    }
  },

  getSmartMeterDetail: async (id: string): Promise<RepositoryResult<SmartMeter>> => {
    try {
      const meter = smartMeterConnectorService.listMeters().find(m => m.id === id);
      if (!meter) return fail('Meter not found', 'NOT_FOUND');
      return ok(meter);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get meter detail';
      return fail(msg);
    }
  },

  getSmartMeterReadings: async (id: string): Promise<RepositoryResult<SmartMeterReading[]>> => {
    try {
      return ok(smartMeterConnectorService.listReadingsForMeter(id));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list meter readings';
      return fail(msg);
    }
  },

  ingestMeterReading: async (input: {
    meterId: string;
    currentValue: number;
    readingDate: string;
    source: 'AUTOMATIC' | 'MANUAL' | 'IMPORT' | 'ESTIMATED';
    unitNumber?: string;
  }): Promise<RepositoryResult<SmartMeterReading>> => {
    try {
      const deviceActor: HardwareActorContext = {
        userId: 'meter-connector-01',
        userName: 'Smart Meter Connector',
        userRole: 'HARDWARE_CONNECTOR',
        societyId: 'soc-canonical-01',
        isDeviceCredential: true,
      };
      const reading = smartMeterConnectorService.ingestReading(deviceActor, input);
      return ok(reading);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to ingest meter reading';
      return fail(msg);
    }
  },

  importMeterReadings: async (input: ImportMeterReadingsCommand): Promise<RepositoryResult<{ imported: number; failed: number }>> => {
    try {
      const result = smartMeterConnectorService.importReadings(defaultActor, input);
      return ok(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to import meter readings';
      return fail(msg);
    }
  },

  getEvChargingDashboard: async (): Promise<RepositoryResult<EvChargingDashboardData>> => {
    try {
      return ok(evChargingConnectorService.getDashboardData());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get EV dashboard';
      return fail(msg);
    }
  },

  getEvChargingReadiness: async (): Promise<RepositoryResult<HardwareReadinessRecord[]>> => {
    return ok([
      {
        id: 'ev-ready-01',
        title: 'EV charging readiness',
        readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED',
        summary: 'Session lifecycle, out-of-order event ordering, and energy tracking are active.',
        nextStep: 'Connect OCPP 1.6/2.0.1 charger cloud integration.',
      },
    ]);
  },

  getEvChargers: async (): Promise<RepositoryResult<EvCharger[]>> => {
    try {
      return ok(evChargingConnectorService.listChargers());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list EV chargers';
      return fail(msg);
    }
  },

  getEvChargerDetail: async (id: string): Promise<RepositoryResult<EvCharger>> => {
    try {
      const charger = evChargingConnectorService.listChargers().find(c => c.id === id);
      if (!charger) return fail('Charger not found', 'NOT_FOUND');
      return ok(charger);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get charger detail';
      return fail(msg);
    }
  },

  getEvChargingSessions: async (): Promise<RepositoryResult<EvChargingSession[]>> => {
    try {
      return ok(evChargingConnectorService.listSessions());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list EV charging sessions';
      return fail(msg);
    }
  },

  getEvChargingSessionDetail: async (id: string): Promise<RepositoryResult<EvChargingSession>> => {
    try {
      const session = evChargingConnectorService.listSessions().find(s => s.id === id);
      if (!session) return fail('Session not found', 'NOT_FOUND');
      return ok(session);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get session detail';
      return fail(msg);
    }
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
    try {
      const deviceActor: HardwareActorContext = {
        userId: 'ev-connector-01',
        userName: 'EV Charger Connector',
        userRole: 'HARDWARE_CONNECTOR',
        societyId: 'soc-canonical-01',
        isDeviceCredential: true,
      };
      const session = evChargingConnectorService.processSessionEvent(deviceActor, input);
      return ok(session);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to process EV session event';
      return fail(msg);
    }
  },

  getBiometricConnectorAlignment: async (): Promise<RepositoryResult<{ syncHealth: string; lastSync: string }>> => {
    return ok({
      syncHealth: 'HEALTHY',
      lastSync: new Date().toISOString(),
    });
  },

  getHardwareSyncJobs: async (): Promise<RepositoryResult<HardwareSyncJob[]>> => {
    return ok([
      {
        id: 'job-hw-01',
        deviceId: 'dev-rfid-01',
        deviceName: 'Main Gate RFID Reader',
        deviceType: 'RFID_READER',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date().toISOString(),
        status: 'COMPLETED',
        totalRecords: 120,
        importedRecords: 118,
        failedRecords: 0,
        duplicateRecords: 2,
        triggeredBy: 'SCHEDULED_CONNECTOR_CRON',
      },
    ]);
  },

  getHardwareSyncJobDetail: async (id: string): Promise<RepositoryResult<HardwareSyncJob>> => {
    return ok({
      id,
      deviceId: 'dev-rfid-01',
      deviceName: 'Main Gate RFID Reader',
      deviceType: 'RFID_READER',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date().toISOString(),
      status: 'COMPLETED',
      totalRecords: 120,
      importedRecords: 118,
      failedRecords: 0,
      duplicateRecords: 2,
      triggeredBy: 'SCHEDULED_CONNECTOR_CRON',
    });
  },

  getHardwareEvents: async (): Promise<RepositoryResult<HardwareEvent[]>> => {
    const rfid = rfidIntegrationService.listEvents();
    const anpr = anprIntegrationService.listEvents();
    const combined: HardwareEvent[] = [
      ...rfid.map(r => ({
        id: r.id,
        deviceId: r.deviceId,
        deviceName: r.deviceName,
        eventType: 'RFID_SCAN' as const,
        moduleLinked: 'GATE' as const,
        timestamp: r.timestamp,
        status: r.accessResult === 'ALLOWED' ? ('MATCHED' as const) : ('UNMATCHED' as const),
        matchedEntityReference: r.matchedVehicleNumber || r.tagCodeMasked,
        riskLevel: r.accessResult === 'ALLOWED' ? ('LOW' as const) : ('HIGH' as const),
        safeMetadata: { location: r.gateLocation },
      })),
      ...anpr.map(a => ({
        id: a.id,
        deviceId: a.deviceId,
        deviceName: a.deviceName,
        eventType: 'ANPR_CAPTURE' as const,
        moduleLinked: 'PARKING' as const,
        timestamp: a.timestamp,
        status: a.status === 'MATCHED' ? ('MATCHED' as const) : ('REVIEW_REQUIRED' as const),
        matchedEntityReference: a.matchedVehicleNumber || a.plateNumberMasked,
        riskLevel: a.status === 'MATCHED' ? ('LOW' as const) : ('MEDIUM' as const),
        safeMetadata: { location: a.gateLocation },
      })),
    ];
    return ok(combined);
  },

  getHardwareEventDetail: async (id: string): Promise<RepositoryResult<HardwareEvent>> => {
    const res = await hardwareIntegrationApiSource.getHardwareEvents();
    const all = res.ok ? res.data : [];
    const event = all.find(e => e.id === id);
    if (!event) return fail('Event not found', 'NOT_FOUND');
    return ok(event);
  },

  getHardwareErrors: async (): Promise<RepositoryResult<HardwareErrorRecord[]>> => {
    try {
      return ok(hardwareHealthObservabilityService.listErrors());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to list hardware errors';
      return fail(msg);
    }
  },

  resolveHardwareError: async (input: ResolveHardwareErrorCommand): Promise<RepositoryResult<HardwareErrorRecord>> => {
    try {
      const error = hardwareHealthObservabilityService.resolveError(defaultActor, input);
      return ok(error);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to resolve hardware error';
      return fail(msg);
    }
  },

  ignoreHardwareError: async (input: IgnoreHardwareErrorCommand): Promise<RepositoryResult<HardwareErrorRecord>> => {
    try {
      const error = hardwareHealthObservabilityService.ignoreError(defaultActor, input);
      return ok(error);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to ignore hardware error';
      return fail(msg);
    }
  },

  escalateHardwareError: async (input: EscalateHardwareErrorCommand): Promise<RepositoryResult<HardwareErrorRecord>> => {
    try {
      const error = hardwareHealthObservabilityService.escalateError(defaultActor, input);
      return ok(error);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to escalate hardware error';
      return fail(msg);
    }
  },

  getIntegrationHealth: async (): Promise<RepositoryResult<IntegrationHealthRow[]>> => {
    try {
      return ok(hardwareHealthObservabilityService.getIntegrationHealth());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get integration health';
      return fail(msg);
    }
  },

  listIntegrationHealthLogs: async (): Promise<RepositoryResult<IntegrationHealthLogRecord[]>> => {
    return ok([
      {
        id: 'log-health-01',
        integrationName: 'RFID Gateway',
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        detail: 'Heartbeat acknowledged in 42ms.',
      },
      {
        id: 'log-health-02',
        integrationName: 'Boom Barrier Relay',
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        detail: 'Open/close circuit verified.',
      },
    ]);
  },

  getDevicePermissionMatrix: async (): Promise<RepositoryResult<DevicePermissionRow[]>> => {
    return ok([
      { functionName: 'HARDWARE_VIEW', roles: ['SUPER_ADMIN', 'FACILITY_MANAGER', 'SECURITY_GUARD', 'RESIDENT'] },
      { functionName: 'HARDWARE_REGISTER', roles: ['SUPER_ADMIN', 'INTEGRATION_ADMIN'] },
      { functionName: 'HARDWARE_CONFIGURE', roles: ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'FACILITY_MANAGER'] },
      { functionName: 'HARDWARE_COMMAND_BARRIER', roles: ['SUPER_ADMIN', 'SECURITY_GUARD', 'FACILITY_MANAGER'] },
      { functionName: 'HARDWARE_REVIEW_ANPR', roles: ['SUPER_ADMIN', 'SECURITY_GUARD', 'FACILITY_MANAGER'] },
      { functionName: 'HARDWARE_MANAGE_RFID', roles: ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'SECURITY_GUARD', 'FACILITY_MANAGER'] },
      { functionName: 'CCTV_REQUEST_ACCESS', roles: ['SUPER_ADMIN', 'FACILITY_MANAGER', 'SECURITY_SUPERVISOR'] },
      { functionName: 'CCTV_APPROVE_ACCESS', roles: ['SUPER_ADMIN', 'FACILITY_MANAGER', 'SECURITY_SUPERVISOR'] },
      { functionName: 'CCTV_VIEW_EVIDENCE', roles: ['SUPER_ADMIN', 'SECURITY_SUPERVISOR'] },
      { functionName: 'HARDWARE_ERROR_RESOLVE', roles: ['SUPER_ADMIN', 'FACILITY_MANAGER'] },
      { functionName: 'HARDWARE_ERROR_ESCALATE', roles: ['SUPER_ADMIN', 'FACILITY_MANAGER', 'SECURITY_SUPERVISOR'] },
    ]);
  },

  getHardwarePrivacyRules: async (): Promise<RepositoryResult<HardwarePrivacyRule[]>> => {
    return ok([
      { section: 'RFID Data', ruleDescription: 'Raw RFID hex tags are masked in operational views and logs.' },
      { section: 'ANPR Captures', ruleDescription: 'Vehicle plate imagery is stored in secure vault with strict retention.' },
      { section: 'CCTV Access', ruleDescription: 'Footage requests require documented operational/safety purpose and supervisor approval.' },
      { section: 'Utility Consumption', ruleDescription: 'Individual flat consumption data is isolated and visible only to unit occupants.' },
    ]);
  },

  getHardwareAuditLogs: async (): Promise<RepositoryResult<HardwareAuditLogEntry[]>> => {
    return ok([
      {
        id: 'aud-hw-01',
        timestamp: new Date().toISOString(),
        actorName: 'Integration Admin',
        actorRole: 'SUPER_ADMIN',
        event: 'DEVICE_REGISTERED',
        entityReference: 'HW-BB-01',
        correlationId: 'corr-init-01',
        safeMetadata: { location: 'Main Gate' },
      },
    ]);
  },

  getHardwareSettings: async (): Promise<RepositoryResult<HardwareSettingGroup[]>> => {
    return ok([
      {
        groupName: 'Gate Automation Thresholds',
        settings: [
          { key: 'anpr_confidence_threshold', label: 'ANPR Min Confidence', value: '0.85', type: 'NUMBER', description: 'Minimum confidence score for automatic match.' },
          { key: 'barrier_timeout_seconds', label: 'Barrier Command Timeout', value: '10', type: 'NUMBER', description: 'Seconds to wait for barrier physical sensor confirmation.' },
        ],
      },
    ]);
  },

  updateHardwareSettings: async (input: UpdateHardwareSettingsCommand): Promise<RepositoryResult<{ success: boolean }>> => {
    return ok({ success: true });
  },
};