import type { FacilitySlot } from '../types/facility.types';
import { mockFacilities } from './facilities.mock';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
const ranges = ['06:00 AM - 07:00 AM', '07:00 AM - 08:00 AM', '10:00 AM - 12:00 PM', '06:00 PM - 10:00 PM', '08:00 PM - 10:00 PM'];
export const mockFacilitySlots: FacilitySlot[] = Array.from({ length: 30 }, (_, index) => {
    const facility = getRequiredItem(mockFacilities, index % mockFacilities.length, "facilitySlots.mock.ts");
    const status = index % 9 === 0 ? 'MAINTENANCE' : index % 7 === 0 ? 'BOOKED' : index % 11 === 0 ? 'BLOCKED' : 'AVAILABLE';
    return {
        id: `facility-slot-${index + 1}`,
        facilityId: facility.id,
        facilityName: facility.name,
        date: `2026-07-${String((index % 5) + 1).padStart(2, '0')}`,
        timeRange: getRequiredItem(ranges, index % ranges.length, "facilitySlots.mock.ts"),
        status,
        price: facility.chargeAmount,
        depositRequired: facility.depositAmount,
        capacityAvailable: facility.capacity,
        ...includeWhenPresent("conflictWarning", index === 2 ? 'You already have a booking during this time.' : undefined)
    };
});

