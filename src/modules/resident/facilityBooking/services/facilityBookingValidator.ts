import {
  FacilityAvailabilityStatus,
  FacilityBookingStatus,
  FacilityEligibilityCode,
  FacilityEligibilityWarningCode,
  FacilitySlotStatus,
} from '../models/facilityBooking.enums';
import type {
  Facility,
  FacilityBooking,
  FacilityBookingBlockingReason,
  FacilityBookingEligibilityResult,
  FacilityBookingResidentScope,
  FacilityBookingWarning,
  FacilitySlot,
} from '../models/facilityBooking.models';

export interface ValidateFacilityBookingEligibilityInput {
  readonly scope: FacilityBookingResidentScope;
  readonly facility: Facility;
  readonly slot: FacilitySlot | null;
  readonly existingBookings: readonly FacilityBooking[];
  readonly guestCount: number;
  readonly consentAccepted: boolean;
  readonly paymentMethodAvailable: boolean;
  readonly nowIso: string;
}

function overlaps(leftStart: string, leftEnd: string, rightStart: string, rightEnd: string): boolean {
  return Date.parse(leftStart) < Date.parse(rightEnd) && Date.parse(rightStart) < Date.parse(leftEnd);
}

export function validateFacilityBookingEligibility({
  scope,
  facility,
  slot,
  existingBookings,
  guestCount,
  consentAccepted,
  paymentMethodAvailable,
  nowIso,
}: ValidateFacilityBookingEligibilityInput): FacilityBookingEligibilityResult {
  const blockingReasons: FacilityBookingBlockingReason[] = [];
  const warnings: FacilityBookingWarning[] = [];
  const block = (code: FacilityEligibilityCode, message: string) => {
    blockingReasons.push({ code, message });
  };

  if (!scope.residenceId) block(FacilityEligibilityCode.ActiveResidenceRequired, 'Select an active residence to continue.');
  if (!scope.hasResidenceAccess) block(FacilityEligibilityCode.ResidenceAccessRequired, 'This residence is not available to your account.');
  if (scope.societyId !== facility.societyId) block(FacilityEligibilityCode.WrongSociety, 'This facility belongs to a different residence.');
  if (!scope.featureEnabled) block(FacilityEligibilityCode.FeatureDisabled, 'Facility booking is disabled for this residence.');
  if (!facility.eligibilityPolicy.allowedRoles.includes(scope.role)) {
    block(
      FacilityEligibilityCode.RoleRestricted,
      scope.role === 'tenant'
        ? 'Booking this space is restricted for tenant profiles under society rules.'
        : 'Your current resident role cannot book this space.'
    );
  }
  if (facility.eligibilityPolicy.blockedUnitIds?.includes(scope.unitId)) {
    block(FacilityEligibilityCode.UnitBlockedByAdmin, 'Booking privileges for this unit have been restricted by Society Administration.');
  }
  if (facility.eligibilityPolicy.blockedTowersOrWings?.some((tower) => scope.unitLabel.toLowerCase().includes(tower.toLowerCase()))) {
    block(FacilityEligibilityCode.TowerBlockedByAdmin, 'Facility access is temporarily suspended for your building/tower by Society Administration.');
  }
  if (!facility.bookingEnabled || facility.availabilityStatus === FacilityAvailabilityStatus.UnderMaintenance || facility.availabilityStatus === FacilityAvailabilityStatus.TemporarilyClosed) {
    block(FacilityEligibilityCode.FacilityUnavailable, 'This facility is not open for booking right now.');
  }
  if (scope.residenceStatus !== 'active') block(FacilityEligibilityCode.ResidenceSuspended, 'Your active residence must be in good standing to book facilities.');
  if (facility.eligibilityPolicy.requiresVerifiedResidence && !scope.isVerified) block(FacilityEligibilityCode.VerificationPending, 'Complete residence verification before booking.');
  if (facility.eligibilityPolicy.requiresCompletedDocuments && !scope.hasCompletedDocuments) block(FacilityEligibilityCode.DocumentsPending, 'Required residence documents are still pending.');
  if (facility.eligibilityPolicy.blockWhenDuesOutstanding && scope.hasOutstandingDues) block(FacilityEligibilityCode.OutstandingDues, 'Clear outstanding society dues before booking this facility.');
  if (guestCount < facility.minimumGuests || guestCount > facility.maximumGuests) block(FacilityEligibilityCode.GuestCapacityExceeded, `Guest count must be between ${facility.minimumGuests} and ${facility.maximumGuests}.`);
  if (facility.requiresConsent && !consentAccepted) block(FacilityEligibilityCode.ConsentRequired, 'Accept the facility rules and cancellation policy to continue.');
  if (facility.requiresPayment && !paymentMethodAvailable) block(FacilityEligibilityCode.PaymentMethodRequired, 'A supported payment method is required for this booking.');

  const activeStatuses = [
    FacilityBookingStatus.PaymentPending,
    FacilityBookingStatus.Confirmed,
    FacilityBookingStatus.CheckedIn,
    FacilityBookingStatus.InUse,
  ];
  const scopedBookings = existingBookings.filter((booking) =>
    booking.residenceId === scope.residenceId && activeStatuses.includes(booking.status));
  if (scopedBookings.length >= facility.eligibilityPolicy.monthlyLimitPerUnit) {
    block(FacilityEligibilityCode.BookingLimitReached, 'The monthly booking limit for this unit has been reached.');
  }

  if (slot) {
    if (![FacilitySlotStatus.Available, FacilitySlotStatus.Limited].includes(slot.status)) block(FacilityEligibilityCode.SlotUnavailable, 'This time slot is no longer available.');
    if (Date.parse(slot.startsAt) <= Date.parse(nowIso)) block(FacilityEligibilityCode.PastSlot, 'Choose a future time slot.');
    const durationMinutes = (Date.parse(slot.endsAt) - Date.parse(slot.startsAt)) / 60_000;
    if (durationMinutes < facility.minimumBookingDurationMinutes || durationMinutes > facility.maximumBookingDurationMinutes) block(FacilityEligibilityCode.DurationInvalid, 'The selected duration is outside the permitted range.');
    if (slot.status === FacilitySlotStatus.Blackout) block(FacilityEligibilityCode.BlackoutPeriod, 'This date is unavailable under the society calendar.');
    if (scopedBookings.some((booking) => overlaps(booking.startsAt, booking.endsAt, slot.startsAt, slot.endsAt))) block(FacilityEligibilityCode.OverlappingBooking, 'This booking overlaps another active facility reservation.');
    const advanceMinutes = (Date.parse(slot.startsAt) - Date.parse(nowIso)) / 60_000;
    if (advanceMinutes < facility.minimumAdvanceBookingMinutes || advanceMinutes > facility.maximumAdvanceBookingDays * 1_440) block(FacilityEligibilityCode.AdvanceWindowInvalid, 'The selected slot is outside the permitted booking window.');
    if (slot.remainingCapacity <= Math.max(2, Math.ceil(facility.capacity * 0.15))) {
      warnings.push({ code: FacilityEligibilityWarningCode.LimitedAvailability, message: 'Only limited capacity remains for this slot.' });
    }
  }

  if (facility.cancellationCutoffMinutes >= 1_440) {
    warnings.push({ code: FacilityEligibilityWarningCode.RefundRestriction, message: 'Review the cancellation cutoff before confirming.' });
  }

  return {
    eligible: blockingReasons.length === 0,
    blockingReasons,
    warnings,
  };
}

export function validateBookingPurpose(purpose: string): boolean {
  const normalized = purpose.trim().replace(/\s+/g, ' ');
  return normalized.length >= 5 && normalized.length <= 120 && /[A-Za-z\u0900-\u097F]/.test(normalized);
}

export function validateContactNumber(contactNumber: string): boolean {
  return /^\+?[0-9][0-9\s-]{7,14}$/.test(contactNumber.trim());
}
