import type { HardwareDevice } from './hardware.types';

export const mockHardwareDevices: HardwareDevice[] = [
  {
    id: 'dev-1',
    name: 'Main Gate Controller',
    type: 'GATE_CONTROLLER',
    status: 'ONLINE',
    ipAddress: '192.168.1.100',
    lastSyncTime: '2026-07-05 18:00',
  },
  {
    id: 'dev-2',
    name: 'North Exit Barrier',
    type: 'BOOM_BARRIER',
    status: 'MAINTENANCE',
    ipAddress: '192.168.1.101',
    lastSyncTime: '2026-07-05 17:45',
  },
];
