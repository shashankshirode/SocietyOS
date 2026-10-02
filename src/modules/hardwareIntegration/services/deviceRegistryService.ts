import type {
  HardwareDevice,
  DeviceLocationMapping,
  RegisterHardwareDeviceCommand,
  UpdateHardwareDeviceCommand,
  MapDeviceLocationCommand,
} from '../../../shared/types/hardware.types';
import {
  assertSocietyAccess,
  assertHumanPrivilege,
  type HardwareActorContext,
} from './hardwareActor';

export class DeviceRegistryService {
  private readonly devices = new Map<string, HardwareDevice>();
  private readonly locationMappings = new Map<string, DeviceLocationMapping>();

  registerDevice(actor: HardwareActorContext, command: RegisterHardwareDeviceCommand): HardwareDevice {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'FACILITY_MANAGER']);

    for (const d of this.devices.values()) {
      if (d.societyId === actor.societyId && d.deviceCode === command.deviceCode) {
        throw new Error(`DEVICE_ALREADY_EXISTS: Device code ${command.deviceCode} is already registered in this society.`);
      }
      if (command.serialNumber && d.serialNumber === command.serialNumber && d.societyId === actor.societyId) {
        throw new Error(`SERIAL_CONFLICT: Device with serial number ${command.serialNumber} is already registered.`);
      }
    }

    const id = `dev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const device: HardwareDevice = {
      id,
      name: command.name,
      type: command.type,
      deviceCode: command.deviceCode,
      vendor: command.vendor,
      location: command.location,
      status: 'NOT_CONFIGURED',
      linkedModule: command.linkedModule,
      connectionType: command.connectionType || 'API_CONNECTOR',
      societyId: actor.societyId,
      lifecycleState: 'REGISTERED',
      healthState: 'UNKNOWN',
      capabilities: command.capabilities || [],
      configurationVersion: command.configurationVersion || '1.0.0',
      serialNumber: command.serialNumber,
      credentialReference: command.credentialReference,
      locationId: command.locationId,
      createdAt: now,
      updatedAt: now,
    };

    this.devices.set(id, device);
    return device;
  }

  updateDevice(actor: HardwareActorContext, deviceId: string, command: UpdateHardwareDeviceCommand): HardwareDevice {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'FACILITY_MANAGER']);
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`DEVICE_NOT_FOUND: Device ${deviceId} does not exist.`);
    }
    assertSocietyAccess(actor, device.societyId);

    if (device.lifecycleState === 'DECOMMISSIONED') {
      throw new Error('DEVICE_DECOMMISSIONED: Cannot update a decommissioned device.');
    }

    if (command.name !== undefined) device.name = command.name;
    if (command.location !== undefined) device.location = command.location;
    if (command.locationId !== undefined) device.locationId = command.locationId;
    if (command.status !== undefined) device.status = command.status;
    if (command.connectionType !== undefined) device.connectionType = command.connectionType;
    if (command.configurationVersion !== undefined) device.configurationVersion = command.configurationVersion;
    device.updatedAt = new Date().toISOString();

    return device;
  }

  activateDevice(actor: HardwareActorContext, deviceId: string): HardwareDevice {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'FACILITY_MANAGER']);
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`DEVICE_NOT_FOUND: Device ${deviceId} does not exist.`);
    }
    assertSocietyAccess(actor, device.societyId);

    if (device.lifecycleState === 'DECOMMISSIONED') {
      throw new Error('DEVICE_DECOMMISSIONED: Cannot activate a decommissioned device.');
    }

    device.lifecycleState = 'ACTIVE';
    device.status = 'ONLINE';
    device.healthState = 'ONLINE';
    device.updatedAt = new Date().toISOString();
    return device;
  }

  suspendDevice(actor: HardwareActorContext, deviceId: string, _reason: string): HardwareDevice {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'FACILITY_MANAGER', 'SECURITY_GUARD']);
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`DEVICE_NOT_FOUND: Device ${deviceId} does not exist.`);
    }
    assertSocietyAccess(actor, device.societyId);

    device.lifecycleState = 'SUSPENDED';
    device.status = 'DISABLED';
    device.updatedAt = new Date().toISOString();
    return device;
  }

  decommissionDevice(actor: HardwareActorContext, deviceId: string, _reason: string): HardwareDevice {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN']);
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`DEVICE_NOT_FOUND: Device ${deviceId} does not exist.`);
    }
    assertSocietyAccess(actor, device.societyId);

    device.lifecycleState = 'DECOMMISSIONED';
    device.status = 'DISABLED';
    device.healthState = 'OFFLINE';
    device.decommissionedAt = new Date().toISOString();
    device.credentialReference = undefined;
    device.updatedAt = new Date().toISOString();
    return device;
  }

  replaceDevice(actor: HardwareActorContext, oldDeviceId: string, newDeviceCommand: RegisterHardwareDeviceCommand): { oldDevice: HardwareDevice; newDevice: HardwareDevice } {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN']);
    const oldDevice = this.devices.get(oldDeviceId);
    if (!oldDevice) {
      throw new Error(`DEVICE_NOT_FOUND: Old device ${oldDeviceId} does not exist.`);
    }
    assertSocietyAccess(actor, oldDevice.societyId);

    this.decommissionDevice(actor, oldDeviceId, 'Replaced by new device');
    const newDevice = this.registerDevice(actor, newDeviceCommand);
    newDevice.replacedDeviceId = oldDeviceId;
    return { oldDevice, newDevice };
  }

  rotateCredential(actor: HardwareActorContext, deviceId: string, newCredentialRef: string): HardwareDevice {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN']);
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`DEVICE_NOT_FOUND: Device ${deviceId} does not exist.`);
    }
    assertSocietyAccess(actor, device.societyId);

    if (device.lifecycleState === 'DECOMMISSIONED') {
      throw new Error('DEVICE_DECOMMISSIONED: Cannot rotate credentials on decommissioned device.');
    }

    device.credentialReference = newCredentialRef;
    device.updatedAt = new Date().toISOString();
    return device;
  }

  mapLocation(actor: HardwareActorContext, command: MapDeviceLocationCommand): DeviceLocationMapping {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'FACILITY_MANAGER']);
    const device = this.devices.get(command.deviceId);
    if (!device) {
      throw new Error(`DEVICE_NOT_FOUND: Device ${command.deviceId} does not exist.`);
    }
    assertSocietyAccess(actor, device.societyId);

    const id = `dlm-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const mapping: DeviceLocationMapping = {
      id,
      deviceId: command.deviceId,
      deviceName: command.deviceName,
      location: command.location,
      accessZone: command.accessZone,
      responsibleRole: command.responsibleRole,
      visibilityRules: command.visibilityRules,
    };
    this.locationMappings.set(id, mapping);
    return mapping;
  }

  getDevice(actor: HardwareActorContext, deviceId: string): HardwareDevice | undefined {
    const device = this.devices.get(deviceId);
    if (device) {
      assertSocietyAccess(actor, device.societyId);
    }
    return device;
  }

  listDevices(actor: HardwareActorContext): HardwareDevice[] {
    return Array.from(this.devices.values()).filter(d => !actor.societyId || !d.societyId || d.societyId === actor.societyId);
  }


  listLocationMappings(): DeviceLocationMapping[] {
    return Array.from(this.locationMappings.values());
  }

  seedInitialDevices(devices: HardwareDevice[]): void {
    for (const d of devices) {
      this.devices.set(d.id, d);
    }
  }

  seedInitialMappings(mappings: DeviceLocationMapping[]): void {
    for (const m of mappings) {
      this.locationMappings.set(m.id, m);
    }
  }
}

export const deviceRegistryService = new DeviceRegistryService();
