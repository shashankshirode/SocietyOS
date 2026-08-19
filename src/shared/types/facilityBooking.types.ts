import type { FacilityBookingType, FacilitySlot } from './facility.types';

export enum FacilityBookingStatusCode {
  Draft = 'DRAFT',
  PendingApproval = 'PENDING_APPROVAL',
  Approved = 'APPROVED',
  Confirmed = 'CONFIRMED',
  CheckedIn = 'CHECKED_IN',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Rejected = 'REJECTED',
  Expired = 'EXPIRED',
  NoShow = 'NO_SHOW',
}

export type FacilityBookingStatus = `${FacilityBookingStatusCode}`;

export type FacilityPaymentStatus =
  | 'NOT_REQUIRED'
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type FacilityRefundStatus =
  | 'NOT_APPLICABLE'
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSED'
  | 'REJECTED'
  | 'ADJUSTED_FOR_DAMAGE';

export type DamageInspectionStatus =
  | 'NOT_REQUIRED'
  | 'PENDING'
  | 'CLEARED'
  | 'DAMAGE_REPORTED'
  | 'CHARGES_APPLIED';

export type FacilityCheckInStatus =
  | 'NOT_OPEN'
  | 'READY'
  | 'CHECKED_IN'
  | 'EXPIRED'
  | 'CANCELLED';

export type FacilityResidentContext = {
  id: string;
  name: string;
  role: 'OWNER' | 'TENANT' | 'FAMILY_MEMBER';
  societyId: string;
  societyName: string;
  unitId: string;
  tower: string;
  flatNumber: string;
  city: string;
};

export type FacilityUnitContext = {
  id: string;
  societyId: string;
  tower: string;
  flatNumber: string;
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT';
};

export type FacilityBookingTimelineItem = {
  id: string;
  title: string;
  note: string;
  createdAt: string;
};

export type FacilityBooking = {
  id: string;
  unitId: string;
  bookingNumber: string;
  facilityId: string;
  facilityName: string;
  bookingType: FacilityBookingType;
  date: string;
  slot: string;
  status: FacilityBookingStatus;
  residentName: string;
  flatNumber: string;
  guestCount: number;
  purpose: string;
  chargeAmount: number;
  depositAmount: number;
  paymentStatus: FacilityPaymentStatus;
  approvalStatus: 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  checkInStatus: FacilityCheckInStatus;
  rulesAccepted: boolean;
  damageConsentAccepted: boolean;
  cancellationEligibility: string;
  refundEligibility: string;
  notes?: string;
  timeline: FacilityBookingTimelineItem[];
};

export type CreateFacilityBookingInput = {
  unitId: string;
  facilityId: string;
  facilityName: string;
  bookingType: FacilityBookingType;
  date: string;
  slot: string;
  purpose: string;
  guestCount: number;
  contactNumber: string;
  specialRequirements?: string;
  setupRequired: boolean;
  equipmentRequired?: string;
  rulesAccepted: boolean;
  damageConsentAccepted: boolean;
  chargeAmount: number;
  depositAmount: number;
  approvalRequired: boolean;
};

export type CancelFacilityBookingInput = {
  reason: string;
  consentAccepted: boolean;
};

export type RescheduleFacilityBookingInput = {
  newDate: string;
  newSlot: string;
  reason: string;
};

export type FacilityDepositRefund = {
  bookingId: string;
  bookingNumber: string;
  facilityName: string;
  depositAmount: number;
  facilityCharge: number;
  paymentStatus: FacilityPaymentStatus;
  refundEligibility: string;
  refundAmount: number;
  refundStatus: FacilityRefundStatus;
  damageInspectionStatus: DamageInspectionStatus;
  unitId?: string;
  notes: string;
};

export type FacilityCheckInPass = {
  bookingId: string;
  bookingNumber: string;
  facilityName: string;
  date: string;
  slot: string;
  residentFlat: string;
  checkInCode: string;
  validityWindow: string;
  checkInStatus: FacilityCheckInStatus;
  instructions: string[];
};

export type GuestRoomBookingInput = {
  guestName: string;
  guestMobile: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  purpose: string;
  idProofLabel?: string;
  specialRequirements?: string;
  rulesAccepted: boolean;
};

export type FacilityUsageHistory = {
  id: string;
  facilityId: string;
  facilityName: string;
  bookingDate: string;
  slot: string;
  status: FacilityBookingStatus;
  checkInStatus: FacilityCheckInStatus;
  depositRefundResult: string;
  damageInspectionResult: DamageInspectionStatus;
  feedbackPlaceholder: string;
};

export type FacilityHome = {
  resident: FacilityResidentContext;
  unit: FacilityUnitContext;
  availableTodayCount: number;
  upcomingBookingCount: number;
  pendingApprovalCount: number;
  depositRefundPendingCount: number;
  popularFacilities: string[];
  upcomingBookings: FacilityBooking[];
  slots: FacilitySlot[];
};
