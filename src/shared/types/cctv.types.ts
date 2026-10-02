

import type { HardwareDeviceStatus } from './hardware.types';

export type CctvAccessLevel =
  | 'SECURITY_ONLY'
  | 'FACILITY_AND_SECURITY'
  | 'ADMIN_APPROVAL_REQUIRED'
  | 'EMERGENCY_ONLY'
  | 'DISABLED';

export type CctvPurpose =
  | 'SECURITY_INCIDENT'
  | 'SAFETY_INVESTIGATION'
  | 'GATE_INCIDENT'
  | 'COMPLAINT_VERIFICATION';

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
  societyId?: string;
  rtspUrlMasked?: string;
}

export interface CctvAccessRequest {
  id: string;
  cameraId: string;
  cameraName: string;
  requesterName: string;
  requesterRole: string;
  requesterId?: string;
  reason: string;
  purpose?: CctvPurpose;
  durationMinutes: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  expiresAt?: string;
  incidentReferenceId?: string;
  evidenceReference?: string;
  evidenceChecksum?: string;
  accessToken?: string;
}
