import type { DocumentCategory, DocumentStatus } from './document.types';

export type UnitDocumentSummary = {
  id: string;
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  expiry: string;
};

export type KycStatus =
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

export type ResidentAccessStatus =
  | 'PENDING_ACTIVATION'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REVOKED';

export type OwnershipTransferReason =
  | 'SALE'
  | 'INHERITANCE'
  | 'GIFT_DEED'
  | 'TRANSFER'
  | 'OTHER';

export type MoveOutNocStatus =
  | 'NOT_REQUIRED'
  | 'PENDING'
  | 'APPROVED'
  | 'GENERATED'
  | 'REJECTED'
  | 'WAIVED_WITH_REASON';

export type DuesClearanceStatus =
  | 'CLEAR'
  | 'PENDING'
  | 'PARTIALLY_PENDING'
  | 'WAIVED'
  | 'DISPUTED';

export type AppAccessCapability =
  | 'APP_LOGIN'
  | 'VISITOR_APPROVAL'
  | 'GATE_PASS'
  | 'VEHICLE_ACCESS'
  | 'FACILITY_BOOKING'
  | 'DOCUMENT_ACCESS'
  | 'RESIDENT_CONNECT';

export type ResidentUnitRole =
  | 'PRIMARY_OWNER'
  | 'CO_OWNER'
  | 'TENANT'
  | 'OWNER_FAMILY'
  | 'TENANT_FAMILY';

export type AgeGroup = 'ADULT' | 'CHILD' | 'SENIOR';

export interface OwnerInfo {
  id: string;
  name: string;
  ownerType: 'PRIMARY' | 'CO_OWNER';
  mobile: string;
  email: string;
  kycStatus: KycStatus;
  ownershipStartDate: string;
  ownershipType: string;
  shareCertificateNumber?: string;
  saleDeedRegistrationNumber?: string;
  parkingSlots: string[];
  emergencyContact: string;
  communicationPreference: 'SMS' | 'EMAIL' | 'PUSH';
  documentsCount: number;
}

export interface TenantInfo {
  id: string;
  name: string;
  mobile: string;
  email: string;
  agreementStartDate: string;
  agreementEndDate: string;
  moveInDate: string;
  policeVerificationStatus: PoliceVerificationStatus;
  ownerApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  kycStatus: KycStatus;
  rentAgreementStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  accessStatus: ResidentAccessStatus;
  nocStatus?: MoveOutNocStatus;
  documentsCount: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  residentType: 'OWNER_FAMILY' | 'TENANT_FAMILY';
  mobile?: string;
  ageGroup: AgeGroup;
  appAccessStatus: 'INVITED' | 'ACTIVE' | 'DISABLED' | 'REVOKED';
  isEmergencyContact: boolean;
  moveInDate: string;
  verificationStatus: KycStatus;
}

export interface Vehicle {
  id: string;
  type: 'TWO_WHEELER' | 'CAR' | 'EV' | 'COMMERCIAL' | 'OTHER';
  vehicleNumber: string;
  ownerDriverName: string;
  linkedResidentName: string;
  parkingSlot: string;
  rfidReadinessStatus: 'PENDING' | 'READY' | 'SUSPENDED';
  stickerStatus: 'NOT_ISSUED' | 'ISSUED' | 'LOST' | 'RETURNED' | 'EXPIRED';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  lastGateEntry?: string;
}

export interface MoveInRequest {
  id: string;
  residentType: 'OWNER' | 'TENANT' | 'FAMILY_MEMBER';
  unitId: string;
  moveInDate: string;
  residentName: string;
  mobile: string;
  email?: string;
  vehicleCount: number;
  familyMemberCount: number;
  liftSlotRequired: boolean;
  truckEntryRequired: boolean;
  notes?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approvalSteps: {
    stepName: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    completedAt?: string;
    actor?: string;
  }[];
}

export interface ResidentHistoryRecord {
  id: string;
  name: string;
  residentType: 'OWNER' | 'TENANT';
  occupancyStartDate: string;
  occupancyEndDate: string;
  transferReason?: OwnershipTransferReason;
  transferReferenceMasked?: string;
  agreementPeriod?: string;
  policeVerificationStatus: PoliceVerificationStatus;
  moveOutNocStatus: MoveOutNocStatus;
  duesClearanceStatus: DuesClearanceStatus;
  documentsCount: number;
  accessStatus: ResidentAccessStatus;
  notes?: string;
}
