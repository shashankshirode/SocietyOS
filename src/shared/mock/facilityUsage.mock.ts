import type { FacilityUsageHistory } from '../types/facilityBooking.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockFacilityUsageHistory: FacilityUsageHistory[] = Array.from({ length: 10 }, (_, index) => ({
    id: `facility-usage-${index + 1}`,
    facilityId: getRequiredItem(['facility-clubhouse', 'facility-badminton', 'facility-gym', 'facility-guest-room'], index % 4, "facilityUsage.mock.ts"),
    facilityName: getRequiredItem(['Clubhouse', 'Badminton Court', 'Gym', 'Guest Room A'], index % 4, "facilityUsage.mock.ts"),
    bookingDate: `2026-06-${String(index + 10).padStart(2, '0')}`,
    slot: index % 2 === 0 ? '06:00 PM - 10:00 PM' : '07:00 AM - 08:00 AM',
    status: index % 3 === 0 ? 'COMPLETED' : 'CHECKED_IN',
    checkInStatus: 'CHECKED_IN',
    depositRefundResult: index % 4 === 0 ? 'Refund adjusted for cleaning' : 'No refund issue',
    damageInspectionResult: index % 4 === 0 ? 'CHARGES_APPLIED' : 'CLEARED',
    feedbackPlaceholder: 'Feedback collection placeholder.',
}));

