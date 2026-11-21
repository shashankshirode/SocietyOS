import { useFacilityBookingDetail } from './useFacilityBookingDetail';

export function useFacilityBookingReview(bookingId: string) {
  return useFacilityBookingDetail(bookingId);
}
