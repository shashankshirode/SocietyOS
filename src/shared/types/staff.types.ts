



import type { StaffDocument, StaffAssignment, StaffVerificationRecord } from './workforcePhase11.types';
import type { ResidentScopedEntity } from './residentScope.types';

export type StaffWorkforceCategory =
  | 'SECURITY_GUARD'
  | 'SECURITY_SUPERVISOR'
  | 'HOUSEKEEPING'
  | 'FACILITY_STAFF'
  | 'GARDENER'
  | 'PLUMBER'
  | 'ELECTRICIAN'
  | 'LIFT_OPERATOR'
  | 'CLUBHOUSE_STAFF'
  | 'OFFICE_STAFF'
  | 'ACCOUNTS_STAFF'
  | 'SOCIETY_MANAGER'
  | 'VENDOR_WORKER'
  | 'OTHER';

export type GovernanceRole =
  | 'TREASURER'
  | 'COMMITTEE_MEMBER'
  | 'SECRETARY'
  | 'CHAIRPERSON';

export type StaffCategory = StaffWorkforceCategory | GovernanceRole;

export type StaffEngagementType = 'DIRECT_SOCIETY_STAFF' | 'VENDOR_WORKER';

export type StaffEmploymentStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'ON_LEAVE'
  | 'SUSPENDED'
  | 'EXITED'
  | 'BLOCKED'
  | 'DRAFT'
  | 'INVITED'
  | 'VERIFICATION_PENDING'
  | 'EXIT_REQUESTED'
  | 'REJECTED';

export type StaffVerificationStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export type PoliceVerificationStatus =
  | 'NOT_SUBMITTED'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export type IdDocumentStatus =
  | 'NOT_COLLECTED'
  | 'COLLECTED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export type ShiftStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DRAFT'
  | 'ARCHIVED';

export interface StaffEngagement {
  id: string;
  staffId: string;
  societyId: string;
  engagementType: StaffEngagementType;
  vendorId?: string;
  vendorName?: string;
  roleCategory: StaffWorkforceCategory;
  effectiveFrom: string;
  effectiveTo?: string;
  status: StaffEmploymentStatus;
  assignedLocation: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffAccessCredential {
  credentialId: string;
  staffId: string;
  societyId: string;
  type: 'PHYSICAL_CARD' | 'DIGITAL_QR' | 'NFC_BADGE';
  signedQrToken?: string;
  validFrom: string;
  validTo?: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'SUSPENDED';
  allowedGates: string[];
  revocationReason?: string;
  revokedAt?: string;
  createdAt: string;
}

export interface StaffProfile {
  id: string;
  staffCode: string;
  name: string;
  category: StaffCategory;
  employmentStatus: StaffEmploymentStatus;
  verificationStatus: StaffVerificationStatus;
  policeVerificationStatus: PoliceVerificationStatus;
  idDocumentStatus: IdDocumentStatus;

  vendorId?: string;
  vendorName?: string;
  isVendorWorker: boolean;

  assignedLocation: string;
  assignedAreas: string[];
  shiftId?: string;
  shiftName?: string;

  mobileMasked: string;
  emergencyContactMasked?: string;

  biometricEmployeeCode?: string;
  biometricDeviceId?: string;

  joiningDate: string;
  exitDate?: string;
  verificationExpiryDate?: string;

  todayStatus?: string;
  lastPunchTime?: string;
  lastPunchType?: string;

  photoPlaceholder?: string;
  photoDocumentVaultId?: string;
  accessCredentialId?: string;
  signedQrToken?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftDefinition {
  id: string;
  shiftName: string;
  startTime: string;       
  endTime: string;         
  gracePeriodMinutes: number;
  location: string;
  assignedStaffCount: number;
  weeklyOffDays: string[]; 
  status: ShiftStatus;
  notes?: string;
  createdAt: string;
}

export interface ShiftAssignment {
  id: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  shiftId: string;
  shiftName: string;
  location: string;
  effectiveFrom: string;
  effectiveTo?: string;
  weeklyOffDays: string[];
  notes?: string;
  createdAt: string;
  isActive: boolean;
}

export interface StaffAttendanceHomeSummary {
  societyName: string;
  date: string;
  totalStaff: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  missingCheckout: number;
  pendingCorrections: number;
  biometricSyncStatus: 'OK' | 'WARNING' | 'ERROR' | 'NOT_CONFIGURED';
  lastSyncTime?: string;
  vendorSummary: {
    vendorName: string;
    totalStaff: number;
    present: number;
    absent: number;
  }[];
  recentPunches: {
    staffName: string;
    staffCode: string;
    punchTime: string;
    punchType: string;
    location: string;
  }[];
}

export interface StaffIdCard {
  staffId: string;
  staffCode: string;
  name: string;
  category: StaffCategory;
  vendorName?: string;
  assignedLocation: string;
  verificationStatus: StaffVerificationStatus;
  validFrom: string;
  validTo?: string;
  emergencyContactMasked?: string;
  photoPlaceholder?: string;
  photoDocumentVaultId?: string;
  qrPlaceholder?: string;
  accessCredentialId?: string;
  signedQrToken?: string;
  isActive: boolean;
}

export interface RegisterStaffInput {
  name: string;
  category: StaffCategory;
  staffCode: string;
  engagementType?: StaffEngagementType;
  vendorId?: string;
  mobile: string;
  emergencyContact?: string;
  assignedLocation: string;
  shiftId?: string;
  joiningDate: string;
  verificationStatus: StaffVerificationStatus;
  notes?: string;
}

export interface ShiftAssignmentInput {
  staffId: string;
  shiftId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  location: string;
  weeklyOffDays: string[];
  notes?: string;
}



export type StaffType =
  | 'MAID'
  | 'DRIVER'
  | 'COOK'
  | 'HOUSEKEEPING'
  | 'SECURITY'
  | 'GARDENER'
  | 'PLUMBER'
  | 'ELECTRICIAN'
  | 'OTHER';

export type StaffVerificationStatusCompat =
  | 'VERIFIED'
  | 'PENDING'
  | 'EXPIRED'
  | 'BLOCKED';

export type StaffAttendanceStatusCompat =
  | 'NOT_CHECKED_IN'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'ABSENT';

export interface StaffMember extends ResidentScopedEntity {
  id: string;
  name: string;
  staffType?: StaffType;
  linkedFlats?: string[];
  verificationStatus?: StaffVerificationStatusCompat | StaffVerificationStatus;
  attendanceStatus?: StaffAttendanceStatusCompat;
  lastCheckIn?: string;
  idBadgeNumber?: string;
  phone?: string;
  photoUrl?: string;
  expiryDate?: string;
  societyId?: string;
  staffCode?: string;
  biometricEmployeeCode?: string;
  biometricDeviceId?: string;
  category?: StaffCategory;
  employmentStatus?: StaffEmploymentStatus;
  employmentType?: string;
  assignedLocation?: string;
  assignedAreas?: string[];
  shiftId?: string;
  shiftName?: string;
  notes?: string;
  documents?: StaffDocument[];
  assignments?: StaffAssignment[];
  verificationRecord?: StaffVerificationRecord;
  joiningDate?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  exitDate?: string;
  verificationExpiryDate?: string;
  isVendorWorker?: boolean;
  vendorId?: string;
  vendorName?: string;
  mobile?: string;
  mobileMasked?: string;
  emergencyContact?: string;
  emergencyContactMasked?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

