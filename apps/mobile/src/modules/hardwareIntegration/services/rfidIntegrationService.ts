import type {
  RfidEvent,
  RfidTagMapping,
  RfidAccessResult,
} from '../../../shared/types/gateHardware.types';
import type {
  CreateRfidTagMappingCommand,
  UpdateRfidTagMappingCommand,
} from '../../../shared/types/hardware.types';
import {
  assertSocietyAccess,
  assertHumanPrivilege,
  type HardwareActorContext,
} from './hardwareActor';
import { connectorFrameworkService } from './connectorFrameworkService';

export class RfidIntegrationService {
  private readonly mappings = new Map<string, RfidTagMapping>();
  private readonly events: RfidEvent[] = [];
  private readonly offlineCachedRevocations = new Set<string>();

  createTagMapping(actor: HardwareActorContext, command: CreateRfidTagMappingCommand): RfidTagMapping {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'SECURITY_GUARD', 'FACILITY_MANAGER']);

    for (const m of this.mappings.values()) {
      if (m.tagCode === command.tagCode && m.status === 'ACTIVE') {
        const overlap = !(command.validUntil < m.validFrom || command.validFrom > m.validUntil);
        if (overlap) {
          throw new Error(`RFID_MAPPING_CONFLICT: Tag ${command.tagCode} is already actively mapped in this time window.`);
        }
      }
    }

    const id = `rtm-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const mapping: RfidTagMapping = {
      id,
      tagCode: command.tagCode,
      vehicleId: command.vehicleId,
      vehicleNumber: command.vehicleNumber,
      unitId: command.unitId,
      unitNumber: command.unitNumber,
      residentName: command.residentName,
      staffCredentialId: command.staffCredentialId,
      validFrom: command.validFrom,
      validUntil: command.validUntil,
      accessZone: command.accessZone,
      status: command.status,
      notes: command.notes,
      societyId: actor.societyId,
    };

    this.mappings.set(id, mapping);
    return mapping;
  }

  updateTagMapping(actor: HardwareActorContext, mappingId: string, command: UpdateRfidTagMappingCommand): RfidTagMapping {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'SECURITY_GUARD', 'FACILITY_MANAGER']);
    const mapping = this.mappings.get(mappingId);
    if (!mapping) {
      throw new Error(`RFID_TAG_NOT_FOUND: Tag mapping ${mappingId} does not exist.`);
    }
    assertSocietyAccess(actor, mapping.societyId);

    if (command.status !== undefined) {
      mapping.status = command.status;
      if (command.status === 'LOST' || command.status === 'BLOCKED' || command.status === 'INACTIVE') {
        this.offlineCachedRevocations.add(mapping.tagCode);
      }
    }
    if (command.validUntil !== undefined) mapping.validUntil = command.validUntil;
    if (command.notes !== undefined) mapping.notes = command.notes;
    if (command.accessZone !== undefined) mapping.accessZone = command.accessZone;

    return mapping;
  }

  findTagMapping(tagCode: string): RfidTagMapping | undefined {
    for (const m of this.mappings.values()) {
      if (m.tagCode === tagCode) {
        return m;
      }
    }
    return undefined;
  }

  processScanEvent(
    actor: HardwareActorContext,
    input: {
      deviceId: string;
      deviceName: string;
      tagCode: string;
      timestamp: string;
      gateLocation: string;
      isOfflineReplay?: boolean;
      controllerAllowlistTimestamp?: string;
    }
  ): { event: RfidEvent; accessGranted: boolean } {
    assertSocietyAccess(actor);

    const dedupeKey = connectorFrameworkService.computeDeterministicDedupeKey(
      'RFID',
      input.deviceId,
      input.tagCode,
      input.timestamp
    );

    if (connectorFrameworkService.isDuplicateEvent(dedupeKey)) {
      const existing = this.events.find(e => e.deduplicationKey === dedupeKey);
      if (existing) {
        return { event: existing, accessGranted: existing.accessResult === 'ALLOWED' };
      }
    }

    const mapping = this.findTagMapping(input.tagCode);
    let result: RfidAccessResult = 'UNKNOWN_TAG';
    let isStaleOffline = false;

    if (!mapping) {
      result = 'UNKNOWN_TAG';
    } else if (mapping.status === 'LOST' || mapping.status === 'BLOCKED') {
      result = 'BLOCKED_VEHICLE';
    } else if (mapping.status === 'EXPIRED' || input.timestamp > mapping.validUntil) {
      result = 'EXPIRED_TAG';
    } else if (input.timestamp < mapping.validFrom || mapping.status === 'INACTIVE') {
      result = 'DENIED';
    } else {
      result = 'ALLOWED';
    }


    if (input.isOfflineReplay && input.controllerAllowlistTimestamp && mapping) {
      if (this.offlineCachedRevocations.has(input.tagCode)) {
        isStaleOffline = true;
      }
    }

    const masked = input.tagCode.length > 4
      ? `RF-***-${input.tagCode.slice(-4)}`
      : 'RF-****';

    const event: RfidEvent = {
      id: `evt-rfid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      deviceId: input.deviceId,
      deviceName: input.deviceName,
      tagCodeMasked: masked,
      matchedVehicleNumber: mapping?.vehicleNumber,
      matchedUnitNumber: mapping?.unitNumber,
      timestamp: input.timestamp,
      accessResult: result,
      gateLocation: input.gateLocation,
      receivedAt: new Date().toISOString(),
      stalePolicyDetected: isStaleOffline,
      deduplicationKey: dedupeKey,
    };

    this.events.push(event);
    return { event, accessGranted: result === 'ALLOWED' && !isStaleOffline };
  }

  listMappings(): RfidTagMapping[] {
    return Array.from(this.mappings.values());
  }

  listEvents(): RfidEvent[] {
    return [...this.events];
  }

  seedInitialMappings(mappings: RfidTagMapping[]): void {
    for (const m of mappings) {
      this.mappings.set(m.id, m);
    }
  }

  seedInitialEvents(events: RfidEvent[]): void {
    for (const e of events) {
      this.events.push(e);
    }
  }
}

export const rfidIntegrationService = new RfidIntegrationService();
