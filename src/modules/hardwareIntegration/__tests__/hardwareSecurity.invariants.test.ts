import {
  assertSocietyAccess,
  assertHumanPrivilege,
  assertDeviceIngestionPrivilege,
  type HardwareActorContext,
} from '../services/hardwareActor';

describe('Hardware Security & IDOR Invariants', () => {
  const adminActor: HardwareActorContext = {
    userId: 'admin-01',
    userName: 'Alpha Admin',
    userRole: 'SUPER_ADMIN',
    societyId: 'soc-alpha',
  };

  const deviceActor: HardwareActorContext = {
    userId: 'dev-01',
    userName: 'RFID Connector',
    userRole: 'HARDWARE_CONNECTOR',
    societyId: 'soc-alpha',
    isDeviceCredential: true,
  };

  const residentActor: HardwareActorContext = {
    userId: 'res-01',
    userName: 'Resident Bob',
    userRole: 'RESIDENT',
    societyId: 'soc-alpha',
  };

  test('blocks cross-society IDOR access when target device belongs to another society', () => {
    expect(() => assertSocietyAccess(adminActor, 'soc-beta')).toThrow('CROSS_SOCIETY_ACCESS_DENIED');
    expect(() => assertSocietyAccess(adminActor, 'soc-alpha')).not.toThrow();
  });

  test('prevents device credentials from invoking administrative operations', () => {
    expect(() => assertHumanPrivilege(deviceActor)).toThrow('DEVICE_NOT_AUTHORIZED_FOR_ADMIN');
    expect(() => assertHumanPrivilege(adminActor)).not.toThrow();
  });

  test('prevents human resident tokens from injecting raw device hardware events', () => {
    expect(() => assertDeviceIngestionPrivilege(residentActor)).toThrow('HUMAN_TOKEN_CANNOT_INJECT_DEVICE_EVENTS');
    expect(() => assertDeviceIngestionPrivilege(deviceActor)).not.toThrow();
  });

  test('enforces role privilege boundaries for sensitive operations', () => {
    expect(() => assertHumanPrivilege(residentActor, ['SUPER_ADMIN', 'FACILITY_MANAGER'])).toThrow('ACCESS_DENIED');
  });
});
