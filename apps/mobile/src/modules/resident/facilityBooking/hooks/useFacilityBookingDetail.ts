import { useCallback } from 'react';
import { facilityBookingRepository } from '../data/facilityBooking.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingResource } from './useFacilityBookingResource';

export function useFacilityBookingDetail(bookingId: string) {
  const { activeContext } = useActiveResidentHome();
  const loader = useCallback(
    () => facilityBookingRepository.getBookingById(activeContext.homeContextId, bookingId),
    [activeContext.homeContextId, bookingId],
  );
  return useFacilityBookingResource(loader, facilityBookingRepository.subscribe);
}
