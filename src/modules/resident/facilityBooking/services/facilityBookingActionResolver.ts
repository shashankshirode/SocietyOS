import {
  FacilityBookingStatus,
  FacilityPaymentStatus,
} from '../models/facilityBooking.enums';
import type {
  Facility,
  FacilityBooking,
  FacilityBookingAvailableActions,
} from '../models/facilityBooking.models';

export function resolveFacilityBookingActions(
  booking: FacilityBooking,
  facility: Facility,
  nowIso: string,
): FacilityBookingAvailableActions {
  const beforeStart = Date.parse(nowIso) < Date.parse(booking.startsAt);
  const beforeCutoff = Date.parse(nowIso)
    < Date.parse(booking.startsAt) - facility.cancellationCutoffMinutes * 60_000;
  const confirmed = booking.status === FacilityBookingStatus.Confirmed;
  const waitlisted = booking.status === FacilityBookingStatus.Waitlisted;
  const paymentPending = booking.status === FacilityBookingStatus.PaymentPending;
  const terminal = [
    FacilityBookingStatus.Completed,
    FacilityBookingStatus.CancelledByResident,
    FacilityBookingStatus.CancelledBySociety,
    FacilityBookingStatus.Rejected,
    FacilityBookingStatus.NoShow,
    FacilityBookingStatus.Expired,
    FacilityBookingStatus.Refunded,
    FacilityBookingStatus.PartiallyRefunded,
  ].includes(booking.status);
  const qrActive = booking.qrPass?.active === true;
  const checkInOpensAt = Date.parse(booking.qrPass?.validFrom ?? booking.startsAt);
  const checkInClosesAt = Date.parse(booking.qrPass?.validUntil ?? booking.endsAt);
  const now = Date.parse(nowIso);

  return {
    canContinue: booking.status === FacilityBookingStatus.Draft
      || booking.status === FacilityBookingStatus.SlotHeld,
    canPay: paymentPending
      && booking.payment.status !== FacilityPaymentStatus.Paid,
    canCancel: (confirmed || paymentPending) && beforeStart && beforeCutoff,
    canReschedule: confirmed && facility.rescheduleEnabled && beforeStart && beforeCutoff,
    canCheckIn: confirmed && qrActive && now >= checkInOpensAt && now <= checkInClosesAt,
    canViewQr: confirmed && qrActive,
    canJoinWaitlist: false,
    canLeaveWaitlist: waitlisted,
    canBookAgain: terminal,
    canAddToCalendar: confirmed && beforeStart,
  };
}
