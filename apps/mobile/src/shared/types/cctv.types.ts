

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
  requesterId?: string | undefined;
  reason: string;
  purpose?: CctvPurpose | undefined;
  durationMinutes: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  requestedAt: string;
  approvedAt?: string | undefined;
  approvedBy?: string | undefined;
  expiresAt?: string | undefined;
  incidentReferenceId?: string | undefined;
  evidenceReference?: string | undefined;
  evidenceChecksum?: string | undefined;
  accessToken?: string | undefined;
}
