export type VendorCategory =
  | 'SECURITY' | 'HOUSEKEEPING' | 'LIFT_MAINTENANCE' | 'FIRE_SAFETY' | 'ELECTRICAL' | 'PLUMBING'
  | 'PEST_CONTROL' | 'GARDENING' | 'WASTE_MANAGEMENT' | 'CCTV' | 'INTERCOM'
  | 'WATER_TANK_CLEANING' | 'GENERATOR' | 'CIVIL_WORK' | 'OTHER';

export type VendorStatus = 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED' | 'PENDING_APPROVAL' | 'CONTRACT_EXPIRED';
export type ComplianceStatus = 'COMPLIANT' | 'PENDING' | 'EXPIRING_SOON' | 'EXPIRED' | 'NOT_AVAILABLE' | 'REJECTED';

export type Vendor = {
  id: string;
  name: string;
  category: VendorCategory;
  contactPerson: string;
  maskedPhone: string;
  maskedEmail: string;
  officeAddress: string;
  gstMasked?: string;
  panMasked?: string;
  contractStatus: VendorStatus;
  complianceStatus: ComplianceStatus;
  activeAmcCount: number;
  openWorkOrders: number;
  rating: number;
  lastServiceDate: string;
  servicesOffered: string[];
  assignedAssets: string[];
  completedWorkOrders: number;
  slaScore: number;
  residentFeedbackScore?: number;
  notes: string;
};

export type VendorDocument = {
  id: string;
  vendorId: string;
  documentName: string;
  documentType: string;
  status: 'REQUIRED' | 'UPLOADED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  expiryDate?: string;
  uploadedDate?: string;
  verifiedBy?: string;
  sensitivity: string;
};

export type RegisterVendorInput = {
  vendorName: string;
  category: VendorCategory;
  contactPerson: string;
  mobileNumber: string;
  email?: string;
  officeAddress: string;
  gstNumber?: string;
  pan?: string;
  servicesOffered: string;
  emergencySupportAvailable: boolean;
  notes?: string;
  complianceDocumentLabel?: string;
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
};
