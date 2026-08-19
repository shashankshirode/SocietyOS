import type { Facility, FacilityBlockedSlot, FacilityCalendarDay } from '../types/facility.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
const facilityNames = [
    ['Clubhouse', 'CLUBHOUSE', 'Clubhouse Level 1', 80, 2500, 5000],
    ['Party Hall', 'EVENT_SPACE', 'Clubhouse Level 2', 120, 8000, 15000],
    ['Badminton Court', 'SPORTS', 'Sports Block', 8, 300, 0],
    ['Gym', 'FITNESS', 'Clubhouse Ground', 25, 0, 0],
    ['Swimming Pool', 'FITNESS', 'Pool Deck', 40, 0, 0],
    ['Guest Room A', 'GUEST_ROOM', 'A Wing Guest Floor', 3, 2500, 5000],
    ['Terrace Area', 'EVENT_SPACE', 'Tower A Terrace', 60, 3500, 8000],
    ['Yoga Room', 'FITNESS', 'Clubhouse Level 1', 20, 200, 0],
    ['Kids Play Area', 'KIDS', 'Garden Zone', 30, 0, 0],
    ['Conference Room', 'COMMUNITY', 'Admin Block', 20, 1000, 2000],
    ['Cricket Turf', 'SPORTS', 'Sports Block', 16, 1200, 2000],
    ['Barbecue Area', 'OTHER', 'Terrace Utility Zone', 25, 1800, 3000],
] as const;
export const mockFacilities: Facility[] = facilityNames.map((item, index) => ({
    id: `facility-${index + 1}`,
    societyId: 'society-001',
    name: item[0],
    category: item[1],
    location: item[2],
    capacity: item[3],
    availabilityToday: index % 4 === 0 ? 'Limited evening slots' : 'Available today',
    bookingType: item[1] === 'GUEST_ROOM' ? 'OVERNIGHT' : item[1] === 'EVENT_SPACE' ? 'HALF_DAY' : 'HOURLY',
    chargeAmount: item[4],
    depositAmount: item[5],
    approvalRequired: item[1] === 'EVENT_SPACE' || item[1] === 'GUEST_ROOM',
    operatingHours: item[1] === 'GUEST_ROOM' ? '24 hours check-in by approval' : '06:00 AM - 10:00 PM',
    status: index === 4 ? 'UNDER_MAINTENANCE' : index === 1 ? 'PARTIALLY_AVAILABLE' : 'AVAILABLE',
    durationOptions: item[1] === 'GUEST_ROOM' ? ['1 night', '2 nights', '3 nights'] : ['1 hour', '2 hours', 'Half day'],
    cancellationPolicySummary: 'Free cancellation until 24 hours before slot. Refund processing will be connected later.',
    rulesSummary: 'Use only within booked time. Resident is responsible for guests, cleanliness, and damages.',
    amenitiesIncluded: ['AC', 'Drinking water', 'Washroom', 'Parking nearby'],
    allowedUserRoles: ['OWNER', 'TENANT'],
    todayAvailabilityPreview: index % 3 === 0 ? 'Morning slots open' : 'Evening slots open',
    ...includeWhenPresent("maintenanceNotice", index === 4 ? 'Pool filtration maintenance until 6 PM.' : undefined)
}));
export const mockFacilityBlockedSlots: FacilityBlockedSlot[] = Array.from({ length: 6 }, (_, index) => ({
    id: `blocked-slot-${index + 1}`,
    facilityId: getRequiredItem(mockFacilities, index % mockFacilities.length, "facilities.mock.ts").id,
    facilityName: getRequiredItem(mockFacilities, index % mockFacilities.length, "facilities.mock.ts").name,
    blockedDate: `2026-07-${String(index + 1).padStart(2, '0')}`,
    blockedTime: index % 2 === 0 ? '10:00 AM - 12:00 PM' : '06:00 PM - 08:00 PM',
    reason: index % 2 === 0 ? 'Preventive maintenance' : 'Deep cleaning block',
    responsibleTeam: 'Facility Team',
    expectedReopening: 'Same day after inspection',
    status: index === 1 ? 'IN_PROGRESS' : 'SCHEDULED'
}));
export const mockFacilityCalendar: FacilityCalendarDay[] = mockFacilities.slice(0, 8).map((facility, index) => ({
    date: '2026-07-01',
    facilityName: facility.name,
    bookingCount: index + 1,
    availableSlotCount: Math.max(0, 5 - index),
    userBookingCount: index === 0 ? 1 : 0,
    isFullyBooked: index === 5,
    hasMaintenanceBlock: index === 4
}));

