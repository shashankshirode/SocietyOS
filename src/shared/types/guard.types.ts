

export type GuardRole = 'SECURITY_GUARD' | 'SECURITY_SUPERVISOR';

export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING';

export interface GuardProfile {
  id: string;
  name: string;
  role: GuardRole;
  societyName: string;
  gateName: string;
  shiftName: string;
  shiftTime: string;
  supervisorName: string;
  deviceStatus: DeviceStatus;
}

export interface ShiftSummary {
  guardName: string;
  gateName: string;
  shiftTime: string;
  totalVisitorEntries: number;
  deliveries: number;
  cabs: number;
  vendors: number;
  staffCheckIns: number;
  rejectedEntries: number;
  pendingOfflineSync: number;
  openIssues: number;
  emergencyIncidents: number;
}
