import type {
  FacilityBookingCancellationReason,
  FacilityBookingFilter,
  FacilityDiscoveryFilter,
  FacilityPaymentMethod,
} from './facilityBooking.enums';
import type {
  FacilityBookingSetupSelection,
  FacilityGuestDetail,
} from './facilityBooking.models';

export interface GetFacilitiesRequest {
  readonly societyId: string;
  readonly residenceId: string;
  readonly query: string;
  readonly filter: FacilityDiscoveryFilter;
  readonly cursor: string | null;
  readonly pageSize: number;
}

export interface GetFacilityAvailabilityRequest {
  readonly societyId: string;
  readonly residenceId: string;
  readonly facilityId: string;
  readonly startDate: string;
  readonly endDate: string;
}

export interface CheckFacilityBookingEligibilityRequest {
  readonly societyId: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly facilityId: string;
  readonly slotId: string | null;
  readonly guestCount: number;
  readonly consentAccepted: boolean;
  readonly paymentMethodAvailable: boolean;
}

export interface HoldFacilitySlotRequest {
  readonly societyId: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly facilityId: string;
  readonly slotId: string;
}

export interface ReleaseFacilitySlotRequest {
  readonly residenceId: string;
  readonly holdId: string;
}

export interface CreateFacilityBookingQuoteRequest {
  readonly residenceId: string;
  readonly facilityId: string;
  readonly slotId: string;
  readonly holdId: string;
  readonly guestCount: number;
  readonly setupSelections: readonly FacilityBookingSetupSelection[];
  readonly discountInMinorUnits: number;
}

export interface CreateFacilityBookingRequest {
  readonly idempotencyKey: string;
  readonly userId: string;
  readonly societyId: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly facilityId: string;
  readonly slotId: string;
  readonly holdId: string;
  readonly quoteId: string;
  readonly purpose: string;
  readonly guestCount: number;
  readonly contactNumber: string;
  readonly additionalInstructions: string;
  readonly guestDetails: readonly FacilityGuestDetail[];
  readonly setupSelections: readonly FacilityBookingSetupSelection[];
  readonly consentAccepted: boolean;
  readonly acceptedRuleIds: readonly string[];
}

export interface GetFacilityBookingsRequest {
  readonly societyId: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly filter: FacilityBookingFilter;
  readonly cursor: string | null;
  readonly pageSize: number;
}

export interface PayFacilityBookingRequest {
  readonly idempotencyKey: string;
  readonly residenceId: string;
  readonly bookingId: string;
  readonly paymentMethod: FacilityPaymentMethod;
  readonly simulateFailure: boolean;
}

export interface CancelFacilityBookingRequest {
  readonly idempotencyKey: string;
  readonly residenceId: string;
  readonly bookingId: string;
  readonly reason: FacilityBookingCancellationReason;
  readonly notes: string;
}

export interface RescheduleFacilityBookingRequest {
  readonly idempotencyKey: string;
  readonly residenceId: string;
  readonly bookingId: string;
  readonly newSlotId: string;
  readonly newHoldId: string;
}

export interface JoinFacilityWaitlistRequest {
  readonly residenceId: string;
  readonly unitId: string;
  readonly facilityId: string;
  readonly slotId: string;
}

export interface LeaveFacilityWaitlistRequest {
  readonly residenceId: string;
  readonly waitlistId: string;
}

export interface FacilityCheckInRequest {
  readonly idempotencyKey: string;
  readonly residenceId: string;
  readonly bookingId: string;
  readonly token: string;
}

export interface UpdateFacilityCalendarLinkRequest {
  readonly residenceId: string;
  readonly bookingId: string;
  readonly calendarEventId: string;
}
