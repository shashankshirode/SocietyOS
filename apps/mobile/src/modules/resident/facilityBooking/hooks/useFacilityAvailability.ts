import { useCallback } from 'react';
import { facilityBookingRepository } from '../data/facilityBooking.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingResource } from './useFacilityBookingResource';

export function useFacilityAvailability(
  facilityId: string,
  startDate: string,
  endDate: string,
) {
  const { activeContext } = useActiveResidentHome();
  const loader = useCallback(() => facilityBookingRepository.getAvailability({
    societyId: activeContext.societyId,
    residenceId: activeContext.homeContextId,
    facilityId,
    startDate,
    endDate,
  }), [activeContext.homeContextId, activeContext.societyId, endDate, facilityId, startDate]);
  return useFacilityBookingResource(loader, facilityBookingRepository.subscribe);
}
