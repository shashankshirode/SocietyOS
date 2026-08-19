import type { ResidentScopedEntity } from './residentScope.types';



export type NocType =
  | 'NO_DUES'
  | 'MOVE_OUT'
  | 'TENANT_NOC'
  | 'PARKING_NOC'
  | 'RENOVATION_NOC'
  | 'RESIDENCE_CERTIFICATE'
  | 'VEHICLE_NOC';

export type NocStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'PENDING_DUES_CLEARANCE'
  | 'PENDING_FACILITY_CLEARANCE'
  | 'PENDING_SECRETARY_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'GENERATED'
  | 'EXPIRED'
  | 'CANCELLED';

export type TimelineStepStatus =
  | 'COMPLETED'
  | 'CURRENT'
  | 'PENDING'
  | 'REJECTED';

export interface TimelineStep {
  title: string;
  description?: string;
  status: TimelineStepStatus;
  updatedAt?: string;
  actor?: string;
}

export interface NocRequest extends ResidentScopedEntity {
  id: string;
  requestNumber: string;
  nocType: NocType;
  flatNumber: string;
  residentName: string;
  submittedDate: string;
  requiredByDate: string;
  status: NocStatus;
  reason: string;
  notes?: string;
  timeline: TimelineStep[];
  rejectionReason?: string;
  certificateId?: string;
}

export interface NocCertificate {
  id: string;
  title: string;
  nocType: NocType;
  certificateNumber: string;
  societyName: string;
  flatNumber: string;
  residentName: string;
  issueDate: string;
  expiryDate?: string;
  issuedBy: string;
  clearanceSummary: string;
  verificationCode: string;
  disclaimer: string;
}
