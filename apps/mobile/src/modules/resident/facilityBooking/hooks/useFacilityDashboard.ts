import { useCallback } from 'react';
import { facilityBookingRepository } from '../data/facilityBooking.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingResource } from './useFacilityBookingResource';

export function useFacilityDashboard() {
  const { activeContext } = useActiveResidentHome();
  const loader = useCallback(
    () => facilityBookingRepository.getDashboardSummary(activeContext.homeContextId),
    [activeContext.homeContextId],
  );
  return useFacilityBookingResource(loader, facilityBookingRepository.subscribe);
}
