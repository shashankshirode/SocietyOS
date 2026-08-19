import { useCallback } from 'react';
import { facilityBookingRepository } from '../data/facilityBooking.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingResource } from './useFacilityBookingResource';

export function useFacilityDetails(facilityId: string) {
  const { activeContext } = useActiveResidentHome();
  const loader = useCallback(
    () => facilityBookingRepository.getFacilityById(activeContext.homeContextId, facilityId),
    [activeContext.homeContextId, facilityId],
  );
  return useFacilityBookingResource(loader, facilityBookingRepository.subscribe);
}
