import type {
  FacilityBooking,
  FacilityBookingRefund,
  FacilityCancellationPolicy,
} from '../models/facilityBooking.models';
import { FacilityRefundStatus } from '../models/facilityBooking.enums';

export interface CalculateFacilityRefundInput {
  readonly booking: FacilityBooking;
  readonly cancellationPolicy: FacilityCancellationPolicy;
  readonly cancelledAt: string;
  readonly cancelledBySociety: boolean;
}

function refundableServiceAmount(booking: FacilityBooking): number {
  const breakdown = booking.quote.breakdown;
  return Math.max(
    0,
    breakdown.facilityFeeInMinorUnits
      + breakdown.slotFeeInMinorUnits
      + breakdown.equipmentFeeInMinorUnits
      + breakdown.guestSurchargeInMinorUnits
      + breakdown.taxInMinorUnits
      - breakdown.discountInMinorUnits,
  );
}

export function calculateFacilityRefund({
  booking,
  cancellationPolicy,
  cancelledAt,
  cancelledBySociety,
}: CalculateFacilityRefundInput): FacilityBookingRefund {
  if (booking.payment.amountPaidInMinorUnits <= 0) {
    return {
      status: FacilityRefundStatus.NotApplicable,
      amountInMinorUnits: 0,
      requestedAt: null,
      processedAt: null,
      referenceNumber: null,
      explanation: 'No captured payment requires a refund.',
    };
  }

  const minutesBeforeStart = Math.floor(
    (Date.parse(booking.startsAt) - Date.parse(cancelledAt)) / 60_000,
  );
  const serviceAmount = refundableServiceAmount(booking);
  const depositAmount = cancellationPolicy.depositRefundable
    ? booking.quote.breakdown.refundableDepositInMinorUnits
    : 0;
  const convenienceAmount = cancellationPolicy.convenienceFeeRefundable
    ? booking.quote.breakdown.convenienceFeeInMinorUnits
    : 0;

  let refundableFee = 0;
  let explanation = 'The booking falls outside the refundable cancellation window.';
  if (cancelledBySociety || minutesBeforeStart >= cancellationPolicy.fullRefundCutoffMinutes) {
    refundableFee = serviceAmount;
    explanation = cancelledBySociety
      ? 'The society cancelled this reservation, so all eligible charges will be returned.'
      : 'This cancellation is within the full-refund window.';
  } else if (minutesBeforeStart >= cancellationPolicy.partialRefundCutoffMinutes) {
    refundableFee = Math.round(
      (serviceAmount * cancellationPolicy.partialRefundPercentage) / 100,
    );
    explanation = `This cancellation qualifies for ${cancellationPolicy.partialRefundPercentage}% of eligible service charges.`;
  }

  const amountInMinorUnits = Math.min(
    booking.payment.amountPaidInMinorUnits,
    refundableFee + depositAmount + convenienceAmount,
  );
  return {
    status: amountInMinorUnits > 0 ? FacilityRefundStatus.Pending : FacilityRefundStatus.NotRefundable,
    amountInMinorUnits,
    requestedAt: amountInMinorUnits > 0 ? cancelledAt : null,
    processedAt: null,
    referenceNumber: null,
    explanation,
  };
}
