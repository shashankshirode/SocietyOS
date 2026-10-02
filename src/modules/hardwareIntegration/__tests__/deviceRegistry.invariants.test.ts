import {
  DeviceRegistryService,
} from '../services/deviceRegistryService';
import type { HardwareActorContext } from '../services/hardwareActor';
import type { RegisterHardwareDeviceCommand } from '../../../shared/types/hardware.types';

describe('Device Registry Invariants', () => {
  let service: DeviceRegistryService;
  const adminActor: HardwareActorContext = {
    userId: 'admin-01',
    userName: 'Estate Admin',
    userRole: 'SUPER_ADMIN',
    societyId: 'soc-alpha',
  };
  const outsiderActor: HardwareActorContext = {
    userId: 'admin-02',
    userName: 'Rival Admin',
    userRole: 'SUPER_ADMIN',
    societyId: 'soc-beta',
  };
  const deviceCredentialActor: HardwareActorContext = {
    userId: 'dev-cred',
    userName: 'Device Agent',
    userRole: 'DEVICE_CONNECTOR',
    societyId: 'soc-alpha',
    isDeviceCredential: true,
  };

  beforeEach(() => {
    service = new DeviceRegistryService();
  });

  test('registers device and enforces duplicate deviceCode within society', () => {
    const cmd: RegisterHardwareDeviceCommand = {
      name: 'Main Boom Barrier',
      type: 'BOOM_BARRIER',
      deviceCode: 'BB-01',
      vendor: 'FAAC',
      location: 'Gate 1',
      linkedModule: 'GATE',
      serialNumber: 'SN-FAAC-991',
    };

    const device = service.registerDevice(adminActor, cmd);
    expect(device.id).toBeDefined();
    expect(device.lifecycleState).toBe('REGISTERED');
    expect(device.status).toBe('NOT_CONFIGURED');
    expect(device.societyId).toBe('soc-alpha');

    expect(() => service.registerDevice(adminActor, cmd)).toThrow('DEVICE_ALREADY_EXISTS');
  });

  test('prevents device credentials from performing administrative registration', () => {
    const cmd: RegisterHardwareDeviceCommand = {
      name: 'Rogue RFID',
      type: 'RFID_READER',
      deviceCode: 'RFID-ROGUE',
      vendor: 'HID',
      location: 'Gate 2',
      linkedModule: 'GATE',
    };
    expect(() => service.registerDevice(deviceCredentialActor, cmd)).toThrow('DEVICE_NOT_AUTHORIZED_FOR_ADMIN');
  });

  test('enforces cross-society tenant isolation', () => {
    const cmd: RegisterHardwareDeviceCommand = {
      name: 'Tower A Camera',
      type: 'CCTV_CAMERA',
      deviceCode: 'CAM-A1',
      vendor: 'Hikvision',
      location: 'Tower A Lobby',
      linkedModule: 'CCTV',
    };
    const device = service.registerDevice(adminActor, cmd);

    expect(() => service.updateDevice(outsiderActor, device.id, { name: 'Hacked Camera' })).toThrow('CROSS_SOCIETY_ACCESS_DENIED');
  });

  test('handles lifecycle state transitions and decommission history preservation', () => {
    const cmd: RegisterHardwareDeviceCommand = {
      name: 'Exit Barrier',
      type: 'BOOM_BARRIER',
      deviceCode: 'BB-EXIT',
      vendor: 'Nice',
      location: 'Gate 2 Exit',
      linkedModule: 'GATE',
    };
    const device = service.registerDevice(adminActor, cmd);

    const activated = service.activateDevice(adminActor, device.id);
    expect(activated.lifecycleState).toBe('ACTIVE');
    expect(activated.status).toBe('ONLINE');

    const suspended = service.suspendDevice(adminActor, device.id, 'Cable fault');
    expect(suspended.lifecycleState).toBe('SUSPENDED');
    expect(suspended.status).toBe('DISABLED');

    const decommissioned = service.decommissionDevice(adminActor, device.id, 'End of life');
    expect(decommissioned.lifecycleState).toBe('DECOMMISSIONED');
    expect(decommissioned.decommissionedAt).toBeDefined();

    expect(() => service.activateDevice(adminActor, device.id)).toThrow('DEVICE_DECOMMISSIONED');
  });

  test('supports device replacement while preserving old device history', () => {
    const oldCmd: RegisterHardwareDeviceCommand = {
      name: 'Old ANPR',
      type: 'ANPR_CAMERA',
      deviceCode: 'ANPR-OLD',
      vendor: 'Dahua',
      location: 'Entry Lane',
      linkedModule: 'PARKING',
    };
    const oldDev = service.registerDevice(adminActor, oldCmd);
    service.activateDevice(adminActor, oldDev.id);

    const newCmd: RegisterHardwareDeviceCommand = {
      name: 'New 4K ANPR',
      type: 'ANPR_CAMERA',
      deviceCode: 'ANPR-NEW',
      vendor: 'Axis',
      location: 'Entry Lane',
      linkedModule: 'PARKING',
    };

    const { oldDevice, newDevice } = service.replaceDevice(adminActor, oldDev.id, newCmd);
    expect(oldDevice.lifecycleState).toBe('DECOMMISSIONED');
    expect(newDevice.replacedDeviceId).toBe(oldDev.id);
    expect(newDevice.deviceCode).toBe('ANPR-NEW');
  });

  test('rotates device credentials securely', () => {
    const cmd: RegisterHardwareDeviceCommand = {
      name: 'North RFID',
      type: 'RFID_READER',
      deviceCode: 'RFID-NORTH',
      vendor: 'HID',
      location: 'North Gate',
      linkedModule: 'GATE',
      credentialReference: 'vault://cred-01',
    };
    const dev = service.registerDevice(adminActor, cmd);
    const updated = service.rotateCredential(adminActor, dev.id, 'vault://cred-02');
    expect(updated.credentialReference).toBe('vault://cred-02');
  });
});
