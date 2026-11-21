import { useCallback } from 'react';
import { facilityBookingRepository } from '../data/facilityBooking.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingResource } from './useFacilityBookingResource';

export interface UseBookingEligibilityOptions {
  readonly facilityId: string;
  readonly slotId: string | null;
  readonly guestCount: number;
  readonly consentAccepted: boolean;
  readonly paymentMethodAvailable: boolean;
}

export function useBookingEligibility(options: UseBookingEligibilityOptions) {
  const { activeContext } = useActiveResidentHome();
  const loader = useCallback(() => facilityBookingRepository.checkEligibility({
    societyId: activeContext.societyId,
    residenceId: activeContext.homeContextId,
    unitId: activeContext.unitId,
    facilityId: options.facilityId,
    slotId: options.slotId,
    guestCount: options.guestCount,
    consentAccepted: options.consentAccepted,
    paymentMethodAvailable: options.paymentMethodAvailable,
  }), [
    activeContext.homeContextId,
    activeContext.societyId,
    activeContext.unitId,
    options.consentAccepted,
    options.facilityId,
    options.guestCount,
    options.paymentMethodAvailable,
    options.slotId,
  ]);
  return useFacilityBookingResource(loader, facilityBookingRepository.subscribe);
}
