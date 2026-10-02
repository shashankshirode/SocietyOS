import type { DocumentCategory, DocumentStatus, DocumentSensitivity, DocumentEntityType } from '../types/documentVault.types';
import { format } from 'date-fns';

export function getDocumentCategoryLabel(category: DocumentCategory): string {
  const labels: Record<DocumentCategory, string> = {
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
  return labels[category] || category;
}

export function getDocumentStatusLabel(status: DocumentStatus): string {
  const labels: Record<DocumentStatus, string> = {
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
  return labels[status] || status;
}

export function getDocumentSensitivityLabel(sensitivity: DocumentSensitivity): string {
  const labels: Record<DocumentSensitivity, string> = {
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
  return labels[sensitivity] || sensitivity;
}

export function getDocumentEntityTypeLabel(entityType: DocumentEntityType): string {
  const labels: Record<DocumentEntityType, string> = {
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
  return labels[entityType] || entityType;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  } catch {
    return dateString;
  }
}

export function formatDateShort(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    VERIFIED: 'success',
    PENDING_VERIFICATION: 'warning',
    REJECTED: 'danger',
    EXPIRED: 'danger',
    ARCHIVED: 'muted',
    REVOKED: 'danger',
    SUPERSEDED: 'muted',
    UPLOADED: 'info',
    UPLOADING: 'info',
    DRAFT: 'muted',
  };
  return colors[status] || 'info';
}

export function isExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

export function isExpiringSoon(expiryDate?: string, daysThreshold = 30): boolean {
  if (!expiryDate) return false;
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  return new Date(expiryDate) <= thresholdDate;
}

export function getExpiryStatus(expiryDate?: string): { isExpired: boolean; isExpiringSoon: boolean; daysRemaining?: number } {
  if (!expiryDate) return { isExpired: false, isExpiringSoon: false };
  const now = new Date();
  const expiry = new Date(expiryDate);
  const timeDiff = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return {
    isExpired: expiry < now,
    isExpiringSoon: daysRemaining <= 30 && daysRemaining > 0,
    daysRemaining: daysRemaining > 0 ? daysRemaining : undefined,
  };
}