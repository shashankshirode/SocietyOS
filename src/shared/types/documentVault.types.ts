import type { ResidentScopedEntity } from './residentScope.types';

export type DocumentEntityType =
  | 'USER'
  | 'RESIDENT'
  | 'OWNER'
  | 'TENANT'
  | 'UNIT'
  | 'SOCIETY'
  | 'MOVE_IN_REQUEST'
  | 'MOVE_OUT_REQUEST'
  | 'NOC'
  | 'VEHICLE'
  | 'PARKING'
  | 'VENDOR'
  | 'COMPLIANCE_RECORD'
  | 'STAFF'
  | 'ASSET';

export type DocumentCategory =
  | 'IDENTITY'
  | 'ADDRESS_PROOF'
  | 'KYC'
  | 'OWNERSHIP_PROOF'
  | 'RENTAL_AGREEMENT'
  | 'TENANCY_DOCUMENT'
  | 'MOVE_IN_DOCUMENT'
  | 'MOVE_OUT_DOCUMENT'
  | 'NOC'
  | 'PARKING_DOCUMENT'
  | 'VEHICLE_DOCUMENT'
  | 'SOCIETY_DOCUMENT'
  | 'INSURANCE'
  | 'MAINTENANCE_DOCUMENT'
  | 'VENDOR_DOCUMENT'
  | 'COMPLIANCE_DOCUMENT'
  | 'FINANCIAL_DOCUMENT'
  | 'LEGAL_DOCUMENT'
  | 'STAFF_CONTRACT'
  | 'AMC'
  | 'PET_REGISTRATION'
  | 'OTHER';

export type DocumentStatus =
  | 'DRAFT'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'ARCHIVED'
  | 'REVOKED'
  | 'SUPERSEDED';

export type DocumentSensitivity =
  | 'PUBLIC'
  | 'INTERNAL'
  | 'CONFIDENTIAL'
  | 'SENSITIVE'
  | 'HIGHLY_SENSITIVE'
  | 'RESIDENT_ONLY'
  | 'OWNER_ONLY'
  | 'TENANT_ONLY'
  | 'COMMITTEE_ONLY'
  | 'ADMIN_ONLY'
  | 'RESTRICTED';

export type DocumentAccessAction =
  | 'VIEW'
  | 'DOWNLOAD'
  | 'UPLOAD'
  | 'REPLACE'
  | 'VERIFY'
  | 'REJECT'
  | 'ARCHIVE'
  | 'RESTORE'
  | 'SHARE'
  | 'ACCESS_DENIED'
  | 'VERSION_CREATE'
  | 'DELETE';

export type VersionStatus =
  | 'CURRENT'
  | 'PREVIOUS'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export interface DocumentVersion extends ResidentScopedEntity {
  id: string;
  documentId: string;
  versionNumber: number;
  storageReference: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
  checksumAlgorithm: 'SHA-256' | 'SHA-512' | 'MD5';
  uploadedBy: string;
  uploadedAt: string;
  status: VersionStatus;
  changeReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Document extends ResidentScopedEntity {
  id: string;
  title: string;
  category: DocumentCategory;
  entityType: DocumentEntityType;
  entityId: string;
  ownerUserId: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_REQUIRED';
  sensitivity: DocumentSensitivity;
  issueDate?: string;
  expiryDate?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
  checksumAlgorithm: 'SHA-256' | 'SHA-512' | 'MD5';
  currentVersionId: string;
  currentVersionNumber: number;
  description?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  retentionPolicy?: {
    retainUntil: string;
    autoDelete: boolean;
    autoArchive: boolean;
  };
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface DocumentAccessLog extends ResidentScopedEntity {
  id: string;
  documentId: string;
  versionId?: string;
  actorUserId: string;
  actorName: string;
  actorRole: string;
  action: DocumentAccessAction;
  timestamp: string;
  result: 'SUCCESS' | 'DENIED' | 'ERROR';
  reason?: string;
  ipAddress?: string;
  deviceInfo?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

export interface DocumentUploadInput {
  title: string;
  category: DocumentCategory;
  entityType: DocumentEntityType;
  entityId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
  checksumAlgorithm: 'SHA-256' | 'SHA-512' | 'MD5';
  sensitivity: DocumentSensitivity;
  issueDate?: string;
  expiryDate?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  retentionPolicy?: {
    retainUntil: string;
    autoDelete: boolean;
    autoArchive: boolean;
  };
}

export interface DocumentReplaceInput {
  documentId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
  checksumAlgorithm: 'SHA-256' | 'SHA-512' | 'MD5';
  changeReason: string;
}

export interface DocumentVerificationInput {
  documentId: string;
  action: 'APPROVE' | 'REJECT';
  reason?: string;
}

export interface DocumentAccessCheckResult {
  canView: boolean;
  canDownload: boolean;
  canUpload: boolean;
  canReplace: boolean;
  canVerify: boolean;
  canArchive: boolean;
  canViewVersions: boolean;
  denialReason?: string;
}

export interface DocumentListFilters {
  societyId: string;
  entityType?: DocumentEntityType;
  entityId?: string;
  category?: DocumentCategory;
  status?: DocumentStatus;
  sensitivity?: DocumentSensitivity;
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  includeArchived?: boolean;
  includeExpired?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'uploadedAt' | 'title' | 'category' | 'status' | 'expiryDate';
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentListResult {
  items: Document[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DocumentVersionListResult {
  items: DocumentVersion[];
  total: number;
}

export interface SecureDownloadUrl {
  url: string;
  expiresAt: string;
  documentId: string;
  versionId: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingDocumentId?: string;
  existingVersionId?: string;
}

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  IDENTITY: 'Identity Document',
  ADDRESS_PROOF: 'Address Proof',
  KYC: 'KYC',
  OWNERSHIP_PROOF: 'Ownership Proof',
  RENTAL_AGREEMENT: 'Rental Agreement',
  TENANCY_DOCUMENT: 'Tenancy Document',
  MOVE_IN_DOCUMENT: 'Move-In Document',
  MOVE_OUT_DOCUMENT: 'Move-Out Document',
  NOC: 'NOC',
  PARKING_DOCUMENT: 'Parking Document',
  VEHICLE_DOCUMENT: 'Vehicle Document',
  SOCIETY_DOCUMENT: 'Society Document',
  INSURANCE: 'Insurance',
  MAINTENANCE_DOCUMENT: 'Maintenance Document',
  VENDOR_DOCUMENT: 'Vendor Document',
  COMPLIANCE_DOCUMENT: 'Compliance Document',
  FINANCIAL_DOCUMENT: 'Financial Document',
  LEGAL_DOCUMENT: 'Legal Document',
  STAFF_CONTRACT: 'Staff Contract',
  AMC: 'AMC',
  PET_REGISTRATION: 'Pet Registration',
  OTHER: 'Other',
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  DRAFT: 'Draft',
  UPLOADING: 'Uploading',
  UPLOADED: 'Uploaded',
  PENDING_VERIFICATION: 'Pending Verification',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
  ARCHIVED: 'Archived',
  REVOKED: 'Revoked',
  SUPERSEDED: 'Superseded',
};

export const DOCUMENT_SENSITIVITY_LABELS: Record<DocumentSensitivity, string> = {
  PUBLIC: 'Public',
  INTERNAL: 'Internal',
  CONFIDENTIAL: 'Confidential',
  SENSITIVE: 'Sensitive',
  HIGHLY_SENSITIVE: 'Highly Sensitive',
  RESIDENT_ONLY: 'Resident Only',
  OWNER_ONLY: 'Owner Only',
  TENANT_ONLY: 'Tenant Only',
  COMMITTEE_ONLY: 'Committee Only',
  ADMIN_ONLY: 'Admin Only',
  RESTRICTED: 'Restricted',
};

export const DOCUMENT_ENTITY_TYPE_LABELS: Record<DocumentEntityType, string> = {
  USER: 'User',
  RESIDENT: 'Resident',
  OWNER: 'Owner',
  TENANT: 'Tenant',
  UNIT: 'Unit',
  SOCIETY: 'Society',
  MOVE_IN_REQUEST: 'Move-In Request',
  MOVE_OUT_REQUEST: 'Move-Out Request',
  NOC: 'NOC',
  VEHICLE: 'Vehicle',
  PARKING: 'Parking',
  VENDOR: 'Vendor',
  COMPLIANCE_RECORD: 'Compliance Record',
  STAFF: 'Staff',
  ASSET: 'Asset',
};

export const VERSION_STATUS_LABELS: Record<VersionStatus, string> = {
  CURRENT: 'Current',
  PREVIOUS: 'Previous',
  SUPERSEDED: 'Superseded',
  ARCHIVED: 'Archived',
};

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
] as const;

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function isDocumentExpired(document: Document): boolean {
  if (!document.expiryDate) return false;
  return new Date(document.expiryDate) < new Date();
}

export function isDocumentExpiringSoon(document: Document, daysThreshold = 30): boolean {
  if (!document.expiryDate) return false;
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  return new Date(document.expiryDate) <= thresholdDate;
}

export function canTransitionDocumentStatus(from: DocumentStatus, to: DocumentStatus): boolean {
  const transitions: Record<DocumentStatus, DocumentStatus[]> = {
    DRAFT: ['UPLOADING', 'ARCHIVED'],
    UPLOADING: ['UPLOADED', 'DRAFT'],
    UPLOADED: ['PENDING_VERIFICATION', 'DRAFT', 'ARCHIVED'],
    PENDING_VERIFICATION: ['VERIFIED', 'REJECTED', 'UPLOADED', 'ARCHIVED'],
    VERIFIED: ['SUPERSEDED', 'EXPIRED', 'ARCHIVED', 'REVOKED'],
    REJECTED: ['UPLOADED', 'ARCHIVED'],
    EXPIRED: ['ARCHIVED', 'VERIFIED'],
    ARCHIVED: ['VERIFIED', 'SUPERSEDED'],
    REVOKED: ['ARCHIVED'],
    SUPERSEDED: ['ARCHIVED'],
  };
  return transitions[from]?.includes(to) ?? false;
}

export function getDocumentCategoryConfig(category: DocumentCategory): {
  requiresVerification: boolean;
  allowedEntityTypes: DocumentEntityType[];
  maxFileSizeMB: number;
  allowedMimeTypes: string[];
  defaultSensitivity: DocumentSensitivity;
  expiryApplicable: boolean;
  retentionYears?: number;
} {
  const configs: Record<DocumentCategory, {
    requiresVerification: boolean;
    allowedEntityTypes: DocumentEntityType[];
    maxFileSizeMB: number;
    allowedMimeTypes: string[];
    defaultSensitivity: DocumentSensitivity;
    expiryApplicable: boolean;
    retentionYears?: number;
  }> = {
    IDENTITY: {
      requiresVerification: true,
      allowedEntityTypes: ['USER', 'RESIDENT', 'OWNER', 'TENANT', 'STAFF'],
      maxFileSizeMB: 10,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
      defaultSensitivity: 'SENSITIVE',
      expiryApplicable: true,
      retentionYears: 10,
    },
    ADDRESS_PROOF: {
      requiresVerification: true,
      allowedEntityTypes: ['USER', 'RESIDENT', 'OWNER', 'TENANT'],
      maxFileSizeMB: 10,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
      defaultSensitivity: 'SENSITIVE',
      expiryApplicable: true,
      retentionYears: 7,
    },
    KYC: {
      requiresVerification: true,
      allowedEntityTypes: ['USER', 'RESIDENT', 'OWNER', 'TENANT'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
      defaultSensitivity: 'HIGHLY_SENSITIVE',
      expiryApplicable: true,
      retentionYears: 10,
    },
    OWNERSHIP_PROOF: {
      requiresVerification: true,
      allowedEntityTypes: ['OWNER', 'UNIT', 'SOCIETY'],
      maxFileSizeMB: 50,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
      defaultSensitivity: 'CONFIDENTIAL',
      expiryApplicable: false,
      retentionYears: 30,
    },
    RENTAL_AGREEMENT: {
      requiresVerification: true,
      allowedEntityTypes: ['TENANT', 'UNIT', 'MOVE_IN_REQUEST'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf'],
      defaultSensitivity: 'TENANT_ONLY',
      expiryApplicable: true,
      retentionYears: 7,
    },
    TENANCY_DOCUMENT: {
      requiresVerification: true,
      allowedEntityTypes: ['TENANT', 'UNIT', 'MOVE_IN_REQUEST', 'MOVE_OUT_REQUEST'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf'],
      defaultSensitivity: 'TENANT_ONLY',
      expiryApplicable: true,
      retentionYears: 7,
    },
    MOVE_IN_DOCUMENT: {
      requiresVerification: true,
      allowedEntityTypes: ['MOVE_IN_REQUEST', 'RESIDENT', 'UNIT'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      defaultSensitivity: 'SENSITIVE',
      expiryApplicable: false,
      retentionYears: 10,
    },
    MOVE_OUT_DOCUMENT: {
      requiresVerification: true,
      allowedEntityTypes: ['MOVE_OUT_REQUEST', 'RESIDENT', 'UNIT'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      defaultSensitivity: 'SENSITIVE',
      expiryApplicable: false,
      retentionYears: 10,
    },
    NOC: {
      requiresVerification: true,
      allowedEntityTypes: ['NOC', 'UNIT', 'RESIDENT'],
      maxFileSizeMB: 10,
      allowedMimeTypes: ['application/pdf'],
      defaultSensitivity: 'CONFIDENTIAL',
      expiryApplicable: true,
      retentionYears: 10,
    },
    PARKING_DOCUMENT: {
      requiresVerification: false,
      allowedEntityTypes: ['PARKING', 'VEHICLE', 'RESIDENT'],
      maxFileSizeMB: 10,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      defaultSensitivity: 'INTERNAL',
      expiryApplicable: true,
      retentionYears: 5,
    },
    VEHICLE_DOCUMENT: {
      requiresVerification: false,
      allowedEntityTypes: ['VEHICLE', 'RESIDENT'],
      maxFileSizeMB: 10,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      defaultSensitivity: 'INTERNAL',
      expiryApplicable: true,
      retentionYears: 5,
    },
    SOCIETY_DOCUMENT: {
      requiresVerification: false,
      allowedEntityTypes: ['SOCIETY'],
      maxFileSizeMB: 50,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      defaultSensitivity: 'INTERNAL',
      expiryApplicable: true,
      retentionYears: 10,
    },
    INSURANCE: {
      requiresVerification: false,
      allowedEntityTypes: ['SOCIETY', 'UNIT', 'RESIDENT'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf'],
      defaultSensitivity: 'CONFIDENTIAL',
      expiryApplicable: true,
      retentionYears: 10,
    },
    MAINTENANCE_DOCUMENT: {
      requiresVerification: false,
      allowedEntityTypes: ['SOCIETY', 'ASSET', 'VENDOR'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      defaultSensitivity: 'INTERNAL',
      expiryApplicable: true,
      retentionYears: 7,
    },
    VENDOR_DOCUMENT: {
      requiresVerification: false,
      allowedEntityTypes: ['VENDOR', 'SOCIETY'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      defaultSensitivity: 'CONFIDENTIAL',
      expiryApplicable: true,
      retentionYears: 7,
    },
    COMPLIANCE_DOCUMENT: {
      requiresVerification: true,
      allowedEntityTypes: ['SOCIETY', 'COMPLIANCE_RECORD'],
      maxFileSizeMB: 50,
      allowedMimeTypes: ['application/pdf'],
      defaultSensitivity: 'COMMITTEE_ONLY',
      expiryApplicable: true,
      retentionYears: 10,
    },
    FINANCIAL_DOCUMENT: {
      requiresVerification: false,
      allowedEntityTypes: ['SOCIETY', 'UNIT', 'RESIDENT'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      defaultSensitivity: 'OWNER_ONLY',
      expiryApplicable: true,
      retentionYears: 10,
    },
    LEGAL_DOCUMENT: {
      requiresVerification: true,
      allowedEntityTypes: ['SOCIETY', 'UNIT', 'RESIDENT'],
      maxFileSizeMB: 50,
      allowedMimeTypes: ['application/pdf'],
      defaultSensitivity: 'RESTRICTED',
      expiryApplicable: true,
      retentionYears: 30,
    },
    STAFF_CONTRACT: {
      requiresVerification: false,
      allowedEntityTypes: ['STAFF', 'SOCIETY'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf'],
      defaultSensitivity: 'ADMIN_ONLY',
      expiryApplicable: true,
      retentionYears: 10,
    },
    AMC: {
      requiresVerification: false,
      allowedEntityTypes: ['SOCIETY', 'ASSET', 'VENDOR'],
      maxFileSizeMB: 20,
      allowedMimeTypes: ['application/pdf'],
      defaultSensitivity: 'INTERNAL',
      expiryApplicable: true,
      retentionYears: 7,
    },
    PET_REGISTRATION: {
      requiresVerification: false,
      allowedEntityTypes: ['RESIDENT', 'UNIT'],
      maxFileSizeMB: 10,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      defaultSensitivity: 'SENSITIVE',
      expiryApplicable: true,
      retentionYears: 5,
    },
    OTHER: {
      requiresVerification: false,
      allowedEntityTypes: ['USER', 'RESIDENT', 'OWNER', 'TENANT', 'UNIT', 'SOCIETY', 'STAFF', 'VENDOR'],
      maxFileSizeMB: MAX_FILE_SIZE_MB,
      allowedMimeTypes: [...ALLOWED_MIME_TYPES],
      defaultSensitivity: 'INTERNAL',
      expiryApplicable: false,
      retentionYears: 5,
    },
  };
  return configs[category] ?? configs.OTHER;
}