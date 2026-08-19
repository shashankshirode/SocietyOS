export interface HardwareDevice {
  id: string;
  name: string;
  type: 'GATE_CONTROLLER' | 'BOOM_BARRIER' | 'ANPR_CAMERA' | 'BIOMETRIC_READER';
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  ipAddress: string;
  lastSyncTime: string;
}
