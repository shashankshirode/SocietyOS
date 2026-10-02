import type {
  DocumentCategoryGroup,
  DocumentOwningEntityType,
  DocumentSensitivity,
  StorageLifecycleState,
  VerificationLifecycleState,
  SignatureLifecycleState,
  VersionLifecycleState,
  ExpiryLifecycleState,
  RetentionLifecycleState,
  IntegrityAlgorithm,
  DocumentRecord,
  DocumentVersionRecord,
  VerificationCase,
  AccessLogEntry,
  RetrievalTicket,
  AccessGrant,
  LegalHold,
  RetentionAssessment,
  TraceableRetentionRecord,
  DocumentAction,
  SignatureMethod,
  VerificationChecklist,
  VerificationChecklistItem,
  TraceContext,
} from './vault/domain/types';

export {
  type DocumentCategoryGroup,
  type DocumentOwningEntityType,
  type DocumentSensitivity,
  type StorageLifecycleState,
  type VerificationLifecycleState,
  type SignatureLifecycleState,
  type VersionLifecycleState,
  type ExpiryLifecycleState,
  type RetentionLifecycleState,
  type IntegrityAlgorithm,
  type DocumentRecord,
  type DocumentVersionRecord,
  type VerificationCase,
  type AccessLogEntry,
  type RetrievalTicket,
  type AccessGrant,
  type LegalHold,
  type RetentionAssessment,
  type TraceableRetentionRecord,
  type DocumentAction,
  type SignatureMethod,
  type VerificationChecklist,
  type VerificationChecklistItem,
  type TraceContext,
};

export const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
  SOCIETY: 'Society Documents',
  OWNER: 'Owner Documents',
  TENANT: 'Tenant Documents',
  MOVE_IN: 'Move-In Documents',
  MOVE_OUT: 'Move-Out Documents',
  STAFF_VENDOR: 'Staff & Vendor Documents',
  COMPLIANCE: 'Compliance Documents',
};

export const DOCUMENT_SENSITIVITY_LABELS: Record<DocumentSensitivity, string> = {
  PUBLIC: 'Public',
  INTERNAL: 'Internal',
  RESIDENT: 'Resident',
  CONFIDENTIAL: 'Confidential',
  SENSITIVE: 'Sensitive',
  HIGHLY_SENSITIVE: 'Highly Sensitive',
  RESTRICTED: 'Restricted',
};

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  NOT_REQUIRED: 'Not Required',
  NOT_SUBMITTED: 'Not Submitted',
  PENDING_REVIEW: 'Pending Review',
  IN_REVIEW: 'In Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  RESUBMISSION_REQUIRED: 'Resubmission Required',
  EXPIRED: 'Expired',
  REVOKED: 'Revoked',
  CLOSED: 'Closed',
};

export const STORAGE_LIFECYCLE_LABELS: Record<StorageLifecycleState, string> = {
  NO_OBJECT: 'No Object',
  UPLOAD_IN_PROGRESS: 'Uploading',
  QUARANTINED: 'Quarantined',
  SCANNING: 'Scanning',
  AVAILABLE: 'Available',
  CORRUPT: 'Corrupt',
  PURGED: 'Purged',
  LEGAL_HOLD: 'Legal Hold',
};

export const VERSION_LIFECYCLE_LABELS: Record<VersionLifecycleState, string> = {
  ACTIVE: 'Active',
  SUPERSEDED: 'Superseded',
  ARCHIVED: 'Archived',
};

export const EXPIRY_LIFECYCLE_LABELS: Record<ExpiryLifecycleState, string> = {
  NOT_APPLICABLE: 'Not Applicable',
  NOT_EXPIRED: 'Not Expired',
  EXPIRING_SOON: 'Expiring Soon',
  EXPIRED: 'Expired',
  REVOCATION_PENDING: 'Revocation Pending',
};

export const RETENTION_LIFECYCLE_LABELS: Record<RetentionLifecycleState, string> = {
  ACTIVE: 'Active',
  UNDER_HOLD: 'Under Hold',
  RETENTION_DUE: 'Retention Due',
  ANONYMISATION_DUE: 'Anonymisation Due',
  ANONYMISED: 'Anonymised',
  ARCHIVED: 'Archived',
  DISPOSED: 'Disposed',
  DISPOSITION_DEFERRED: 'Disposition Deferred',
};

export function getDocumentCategoryLabel(categoryCode: string): string {
  const categoryMap: Record<string, string> = {
    OWNER_KYC: 'Owner KYC',
    TENANT_KYC: 'Tenant KYC',
    SALE_DEED: 'Sale Deed',
    SHARE_CERTIFICATE: 'Share Certificate',
    RENTAL_AGREEMENT: 'Rental Agreement',
    POLICE_VERIFICATION: 'Police Verification',
    MOVE_IN_FORM: 'Move-In Form',
    RULE_ACKNOWLEDGEMENT: 'Rule Acknowledgement',
    NOC: 'NOC',
    PARKING_ALLOCATION: 'Parking Allocation',
    VEHICLE_REGISTRATION: 'Vehicle Registration',
    FIRE_NOC: 'Fire NOC',
    LIFT_CERTIFICATE: 'Lift Certificate',
    INSURANCE: 'Insurance',
    AUDIT_REPORT: 'Audit Report',
    BYLAWS: 'Bylaws',
    AGM_MINUTES: 'AGM Minutes',
    CIRCULAR: 'Circular',
    STAFF_CONTRACT: 'Staff Contract',
    VENDOR_CONTRACT: 'Vendor Contract',
    AMC: 'AMC',
    MAINTENANCE_RECORD: 'Maintenance Record',
    COMPLIANCE_CERTIFICATE: 'Compliance Certificate',
    FINANCIAL_STATEMENT: 'Financial Statement',
    LEGAL_NOTICE: 'Legal Notice',
    OTHER: 'Other',
  };
  return categoryMap[categoryCode] ?? categoryCode.replace(/_/g, ' ');
}

export function getDocumentStatusLabel(status: string): string {
  return DOCUMENT_STATUS_LABELS[status] ?? status.replace(/_/g, ' ');
}

export function getDocumentSensitivityLabel(sensitivity: DocumentSensitivity): string {
  return DOCUMENT_SENSITIVITY_LABELS[sensitivity] ?? sensitivity;
}

export function getStorageLifecycleLabel(state: StorageLifecycleState): string {
  return STORAGE_LIFECYCLE_LABELS[state] ?? state;
}

export function getVersionLifecycleLabel(state: VersionLifecycleState): string {
  return VERSION_LIFECYCLE_LABELS[state] ?? state;
}

export function getExpiryLifecycleLabel(state: ExpiryLifecycleState): string {
  return EXPIRY_LIFECYCLE_LABELS[state] ?? state;
}

export function getRetentionLifecycleLabel(state: RetentionLifecycleState): string {
  return RETENTION_LIFECYCLE_LABELS[state] ?? state;
}

export function getEntityTypeLabel(entityType: string): string {
  const map: Record<string, string> = {
    USER: 'User',
    RESIDENT: 'Resident',
    OWNER: 'Owner',
    TENANT: 'Tenant',
    UNIT: 'Unit',
    HOUSEHOLD: 'Household',
    SOCIETY: 'Society',
    MOVE_IN_REQUEST: 'Move-In Request',
    MOVE_OUT_REQUEST: 'Move-Out Request',
    NOC: 'NOC',
    VEHICLE: 'Vehicle',
    PARKING: 'Parking',
    VENDOR: 'Vendor',
    STAFF: 'Staff',
    ASSET: 'Asset',
    COMPLIANCE_RECORD: 'Compliance Record',
  };
  return map[entityType] ?? entityType;
}

export function getDocumentActionLabel(action: DocumentAction): string {
  const map: Record<DocumentAction, string> = {
    VIEW_METADATA: 'View Metadata',
    VIEW_CONTENT: 'View Content',
    DOWNLOAD: 'Download',
    UPLOAD: 'Upload',
    REPLACE_VERSION: 'Replace Version',
    SUBMIT_FOR_VERIFICATION: 'Submit for Verification',
    REVIEW_VERIFICATION: 'Review Verification',
    REQUEST_RESUBMISSION: 'Request Resubmission',
    SIGN: 'Sign',
    ARCHIVE: 'Archive',
    VIEW_ACCESS_LOG: 'View Access Log',
    REQUEST_ACCESS: 'Request Access',
    APPLY_RETENTION: 'Apply Retention',
    PLACE_LEGAL_HOLD: 'Place Legal Hold',
    RELEASE_LEGAL_HOLD: 'Release Legal Hold',
  };
  return map[action] ?? action;
}

export function getSignatureMethodLabel(method: SignatureMethod): string {
  const map: Record<SignatureMethod, string> = {
    ADMIN_DIGITAL: 'Admin Digital Signature',
    E_SIGN_PROVIDER: 'E-Sign Provider',
    DSC_PROVIDER: 'DSC Provider',
    AADHAAR_ESIGN: 'Aadhaar eSign',
    WET_INK_OFFLINE: 'Wet Ink (Offline)',
  };
  return map[method] ?? method;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function getVerificationLifecycleLabel(state: string): string {
  const labels: Record<string, string> = {
    NOT_REQUIRED: 'Not Required',
    NOT_SUBMITTED: 'Not Submitted',
    PENDING_REVIEW: 'Pending Review',
    IN_REVIEW: 'In Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    RESUBMISSION_REQUIRED: 'Resubmission Required',
    EXPIRED: 'Expired',
    REVOKED: 'Revoked',
    CLOSED: 'Closed',
  };
  return labels[state] ?? state;
}