

import type { HardwareDeviceStatus } from './hardware.types';

export type CctvAccessLevel =
  | 'SECURITY_ONLY'
  | 'FACILITY_AND_SECURITY'
  | 'ADMIN_APPROVAL_REQUIRED'
  | 'EMERGENCY_ONLY'
  | 'DISABLED';

export interface CctvCamera {
  id: string;
  name: string;
  deviceCode: string;
  location: string;
  coverageArea: string;
  status: HardwareDeviceStatus;
  recordingEnabled: boolean;
  accessLevel: CctvAccessLevel;
  lastHealthCheck: string;
}

export interface CctvAccessRequest {
  id: string;
  cameraId: string;
  cameraName: string;
  requesterName: string;
  requesterRole: string;
  reason: string;
  durationMinutes: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  requestedAt: string;
  approvedAt?: string;
}
