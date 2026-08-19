import type { ResidentScopedEntity } from './residentScope.types';



export type DocumentCategory =
  | 'OWNER_KYC'
  | 'TENANT_KYC'
  | 'SALE_DEED'
  | 'SHARE_CERTIFICATE'
  | 'RENT_AGREEMENT'
  | 'POLICE_VERIFICATION'
  | 'VEHICLE_DOCUMENT'
  | 'PARKING_ALLOTMENT'
  | 'MOVE_IN_FORM'
  | 'RULE_ACKNOWLEDGEMENT'
  | 'SOCIETY_REGISTRATION'
  | 'BYLAWS'
  | 'AGM_MINUTES'
  | 'FIRE_NOC'
  | 'LIFT_CERTIFICATE'
  | 'INSURANCE'
  | 'AUDIT_REPORT'
  | 'CIRCULAR'
  | 'OTHER';

export type DocumentStatus =
  | 'REQUIRED'
  | 'UPLOADED'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'NOT_REQUIRED';

export type DocumentSensitivity =
  | 'PUBLIC'
  | 'RESIDENT_ONLY'
  | 'OWNER_ONLY'
  | 'TENANT_ONLY'
  | 'COMMITTEE_ONLY'
  | 'ADMIN_ONLY'
  | 'RESTRICTED';

export interface DocumentInfo extends ResidentScopedEntity {
  id: string;
  title: string;
  category: DocumentCategory;
  flatNumber?: string;
  status: DocumentStatus;
  uploadedDate?: string;
  uploadedBy?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  expiryDate?: string;
  fileType: string;
  fileSize: string;
  sensitivity: DocumentSensitivity;
  description?: string;
  rejectionReason?: string;
  isSocietyDoc?: boolean;
}

export type DocumentAccessAction = 'VIEWED' | 'DOWNLOADED' | 'SHARED' | 'UPDATED' | 'VERIFIED' | 'REJECTED';

export interface DocumentAccessLog {
  id: string;
  documentId: string;
  documentTitle: string;
  actorName: string;
  actorRole: string;
  action: DocumentAccessAction;
  timestamp: string;
  deviceInfo: string;
  reason?: string;
}
