import type { Facility } from '../../types/facility.types';

export function createFacility(overrides: Partial<Facility> = {}): Facility {
  return {
    id: 'amenity-101',
    societyId: 'soc-001',
    name: 'Clubhouse Banquet Hall',
    category: 'CLUBHOUSE',
    location: 'Tower C Ground Floor',
    capacity: 100,
    availabilityToday: '10 AM – 10 PM',
    bookingType: 'HALF_DAY',
    chargeAmount: 1500,
    depositAmount: 3000,
    approvalRequired: true,
    operatingHours: '10:00 - 22:00',
    status: 'AVAILABLE',
    durationOptions: ['Slot 1 (10 AM - 3 PM)', 'Slot 2 (4 PM - 9 PM)'],
    cancellationPolicySummary: 'Free cancellation up to 48 hours prior to the slot.',
    rulesSummary: 'No loud music after 10 PM. Catering waste disposal is responsibility of the booking member.',
    amenitiesIncluded: ['Central AC', 'Sound System', '50 chairs', '10 tables', 'Basic kitchen setup'],
    allowedUserRoles: ['OWNER', 'TENANT'],
    todayAvailabilityPreview: 'Available',
    ...overrides,
  };
}
