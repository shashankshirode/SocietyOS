import type { ParkingHardwareReadiness } from '../types/parking.types';

export const mockParkingHardwareReadiness: ParkingHardwareReadiness = {
  societyId: 'society-001',
  rfidReadiness: 'PLANNED',
  anprReadiness: 'NOT_CONFIGURED',
  boomBarrierReadiness: 'MANUAL',
  evChargingReadiness: 'PLANNED',
  smartSensorReadiness: 'NOT_CONFIGURED',
  notes:
    'Hardware integrations will be connected later through society-approved devices and backend integration APIs.',
};
