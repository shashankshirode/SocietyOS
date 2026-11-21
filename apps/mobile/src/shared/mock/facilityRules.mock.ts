import type { FacilityRules } from '../types/facility.types';

export const mockFacilityRules: FacilityRules = {
  generalRules: ['Bookings are valid only for the approved slot.', 'Residents are responsible for guest conduct.'],
  cancellationRules: ['Cancellation within 24 hours may affect refund eligibility.', 'No-show bookings may be marked expired.'],
  refundDepositRules: ['Refund processing will be connected later.', 'Damage charges may be adjusted from deposit.'],
  guestLimitRules: ['Guest count must not exceed facility capacity.', 'Guest room visitors must carry valid ID proof.'],
  damagePolicy: ['Damage inspection may be performed after use.', 'Resident accepts damage responsibility before booking.'],
  noiseTimingRules: ['No amplified music after 10 PM.', 'Society quiet hours apply to terrace and event spaces.'],
  foodCateringRules: ['Catering setup must be declared in advance.', 'Kitchen access is allowed only where listed.'],
  cleaningRules: ['Facility must be returned clean.', 'Extra cleaning charges may apply after inspection.'],
  sportsEquipmentRules: ['Sports equipment must be returned to the facility desk.', 'Court shoes required for indoor courts.'],
  guestRoomRules: ['Check-in is subject to society approval.', 'Guest mobile is masked in booking records.'],
};
