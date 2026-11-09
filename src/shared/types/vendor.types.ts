import type { Absent } from './absence.types';

export type VendorCategory =
  | 'SECURITY' | 'HOUSEKEEPING' | 'LIFT_MAINTENANCE' | 'FIRE_SAFETY' | 'ELECTRICAL' | 'PLUMBING'
  | 'PEST_CONTROL' | 'GARDENING' | 'WASTE_MANAGEMENT' | 'CCTV' | 'INTERCOM'
  | 'WATER_TANK_CLEANING' | 'GENERATOR' | 'CIVIL_WORK' | 'OTHER';

export type VendorStatus = 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED' | 'PENDING_APPROVAL' | 'CONTRACT_EXPIRED' | 'VERIFICATION_PENDING' | 'SUSPENDED';
export type ComplianceStatus = 'COMPLIANT' | 'PENDING' | 'EXPIRING_SOON' | 'EXPIRED' | 'NOT_AVAILABLE' | 'REJECTED';
export type VendorDocumentCategory = 'GST' | 'PAN' | 'INSURANCE' | 'LICENSE' | 'CERTIFICATE' | 'CONTRACT' | 'OTHER';

export type VendorDocument = {
  id: string;
  vendorId: string;
  documentName: string;
  documentType: string;
  documentCategory?: VendorDocumentCategory | Absent;
  documentVaultId?: string | Absent;
  status: 'REQUIRED' | 'UPLOADED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  expiryDate?: string | Absent;
  uploadedDate?: string | Absent;
  verifiedBy?: string | Absent;
  verifiedAt?: string | Absent;
  sensitivity: string;
  version?: number | Absent;
};

export type VendorContact = {
  id?: string | Absent;
  vendorId?: string | Absent;
  name?: string | Absent;
  phone?: string | Absent;
  email?: string | Absent;
  role?: string | Absent;
};

export type VendorBankAccount = {
  id?: string | Absent;
  vendorId?: string | Absent;
  bankName?: string | Absent;
  accountNumber?: string | Absent;
  accountNumberMasked?: string | Absent;
  ifscCode?: string | Absent;
  accountType?: string | Absent;
  verified?: boolean | Absent;
  createdAt?: string | Absent;
};

export type Vendor = {
  id: string;
  name: string;
  vendorName?: string | Absent;
  category: VendorCategory;
  contactPerson: string;
  maskedPhone: string;
  maskedEmail: string;
  officeAddress: string;
  gstMasked?: string | Absent;
  panMasked?: string | Absent;
  cinMasked?: string | Absent;
  contractStatus: VendorStatus;
  status?: VendorStatus | Absent;
  verificationStatus?: 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED' | Absent;
  complianceStatus: ComplianceStatus;
  activeAmcCount: number;
  openWorkOrders: number;
  rating: number;
  overallRating?: number | Absent;
  lastServiceDate: string;
  servicesOffered: (string | { category: VendorCategory; description: string; emergencySupport: boolean })[];
  assignedAssets: string[];
  completedWorkOrders: number;
  slaScore: number;
  residentFeedbackScore?: number | Absent;
  notes: string;
  emergencySupportAvailable?: boolean | Absent;
  contacts?: VendorContact[] | Absent;
  documents?: VendorDocument[] | Absent;
  bankAccounts?: VendorBankAccount[] | Absent;
  version?: number | Absent;
  createdAt?: string | Absent;
  createdBy?: string | Absent;
  updatedAt?: string | Absent;
  legalName?: string | Absent;
};

export type RegisterVendorInput = {
  vendorName: string;
  category: VendorCategory;
  contactPerson: string;
  mobileNumber: string;
  email?: string | Absent;
  officeAddress: string;
  gstNumber?: string | Absent;
  pan?: string | Absent;
  panNumber?: string | Absent;
  cinNumber?: string | Absent;
  legalName?: string | Absent;
  servicesOffered?: string | string[] | Absent;
  emergencySupportAvailable?: boolean | Absent;
  notes?: string | Absent;
  complianceDocumentLabel?: string | Absent;
  contacts?: VendorContact[] | Absent;
  bankAccounts?: VendorBankAccount[] | Absent;
  requiredDocuments?: VendorDocument[] | Absent;
};

export type VendorVerification = {
  vendorId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string | Absent;
  verifiedAt?: string | Absent;
  checks: {
    gstValid: boolean;
    panValid: boolean;
    insuranceValid: boolean;
    licensesValid: boolean;
    bankVerified: boolean;
    addressVerified: boolean;
  };
};

export type EmergencyVendorOverride = {
  id: string;
  vendorId: string;
  workOrderId: string;
  expiredRequirements: string[];
  overrideReason: string;
  authorizedByActorId: string;
  authorizedByActorName: string;
  authorizedAt: string;
};

export type VendorScorecard = {
  vendorId: string;
  vendorName: string;
  category: VendorCategory;
  overallRating: number;
  slaCompliance: number;
  averageResponseTime: string;
  completionRate: number;
  reopenRate: number;
  complaintLinkedPerformance: number;
  residentFeedbackAverage: number;
  amcRenewalDiscipline: number;
  complianceValidity: number;
  safetyIncidents: number;
  strengths: string[];
  improvementAreas: string[];
  recentWorkOrders: string[];
  scoreVersion?: string | Absent;
  calculatedAt?: string | Absent;
  calculatedBy?: string | Absent;
  timeWindow?: string | Absent;
  sampleSize?: number | Absent;
  isLowDataVolume?: boolean | Absent;
  formulaVersion?: string | Absent;
};
