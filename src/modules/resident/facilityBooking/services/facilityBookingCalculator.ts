import type {
  Facility,
  FacilityBookingPriceBreakdown,
  FacilityBookingSetupSelection,
  FacilitySlot,
} from '../models/facilityBooking.models';

export interface CalculateFacilityBookingPriceInput {
  readonly facility: Facility;
  readonly slot: FacilitySlot;
  readonly guestCount: number;
  readonly setupSelections: readonly FacilityBookingSetupSelection[];
  readonly discountInMinorUnits: number;
}

function calculatePercentage(amountInMinorUnits: number, rateBasisPoints: number): number {
  return Math.round((amountInMinorUnits * rateBasisPoints) / 10_000);
}

export function calculateFacilityBookingPrice({
  facility,
  slot,
  guestCount,
  setupSelections,
  discountInMinorUnits,
}: CalculateFacilityBookingPriceInput): FacilityBookingPriceBreakdown {
  const equipmentFeeInMinorUnits = setupSelections.reduce(
    (total, selection) => total + selection.feeInMinorUnits * selection.quantity,
    0,
  );
  const chargeableGuests = Math.max(0, guestCount - facility.includedGuestCount);
  const guestSurchargeInMinorUnits = chargeableGuests * facility.guestSurchargeInMinorUnits;
  const taxableSubtotal = facility.baseFeeInMinorUnits
    + slot.slotFeeInMinorUnits
    + equipmentFeeInMinorUnits
    + guestSurchargeInMinorUnits;
  const taxInMinorUnits = calculatePercentage(taxableSubtotal, facility.taxRateBasisPoints);
  const refundableDepositInMinorUnits = facility.refundableDepositInMinorUnits;
  const normalizedDiscount = Math.min(Math.max(0, discountInMinorUnits), taxableSubtotal + taxInMinorUnits);
  const totalPayableInMinorUnits = Math.max(
    0,
    taxableSubtotal
      + taxInMinorUnits
      + facility.convenienceFeeInMinorUnits
      - normalizedDiscount
      + refundableDepositInMinorUnits,
  );

  return {
    facilityFeeInMinorUnits: facility.baseFeeInMinorUnits,
    slotFeeInMinorUnits: slot.slotFeeInMinorUnits,
    equipmentFeeInMinorUnits,
    guestSurchargeInMinorUnits,
    taxInMinorUnits,
    convenienceFeeInMinorUnits: facility.convenienceFeeInMinorUnits,
    discountInMinorUnits: normalizedDiscount,
    refundableDepositInMinorUnits,
    totalPayableInMinorUnits,
  };
}

export function calculateQuoteDifferenceInMinorUnits(
  current: FacilityBookingPriceBreakdown,
  next: FacilityBookingPriceBreakdown,
): number {
  return next.totalPayableInMinorUnits - current.totalPayableInMinorUnits;
}
